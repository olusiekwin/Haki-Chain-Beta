import {
  Client,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenInfoQuery,
  TokenMintTransaction,
  TransferTransaction,
  TokenBurnTransaction,
  TokenAssociateTransaction,
  AccountId,
  TokenId,
} from "@hashgraph/sdk"

// Initialize Hedera client
const initializeHederaClient = () => {
  // Get environment variables
  const myAccountId = process.env.HEDERA_ACCOUNT_ID
  const myPrivateKey = process.env.HEDERA_PRIVATE_KEY
  const network = process.env.HEDERA_NETWORK || "testnet"

  if (!myAccountId || !myPrivateKey) {
    throw new Error("Environment variables HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be present")
  }

  // Create Hedera client
  let client
  if (network === "mainnet") {
    client = Client.forMainnet()
  } else {
    client = Client.forTestnet()
  }

  // Set operator with account ID and private key
  client.setOperator(myAccountId, myPrivateKey)
  return client
}

/**
 * Create a new fungible token on Hedera
 * @param name Token name
 * @param symbol Token symbol
 * @param decimals Number of decimals
 * @param initialSupply Initial supply of tokens
 * @param adminKey Admin key for the token (can be omitted for immutable tokens)
 * @returns Token ID
 */
export async function createFungibleToken(
  name: string,
  symbol: string,
  decimals = 2,
  initialSupply = 0,
  adminKey = "",
): Promise<string> {
  const client = initializeHederaClient()

  try {
    // Create a token creation transaction
    let transaction = new TokenCreateTransaction()
      .setTokenName(name)
      .setTokenSymbol(symbol)
      .setDecimals(decimals)
      .setInitialSupply(initialSupply * 10 ** decimals)
      .setTokenType(TokenType.FungibleCommon)
      .setTreasuryAccountId(AccountId.fromString(process.env.HEDERA_ACCOUNT_ID!))

    // If admin key is provided, use it
    if (adminKey) {
      const privateKey = PrivateKey.fromString(adminKey)
      transaction = transaction
        .setAdminKey(privateKey.publicKey)
        .setSupplyKey(privateKey.publicKey)
        .setFreezeKey(privateKey.publicKey)
        .setWipeKey(privateKey.publicKey)
    }

    // Execute the transaction and get the receipt
    const txResponse = await transaction.execute(client)
    const receipt = await txResponse.getReceipt(client)

    // Get the token ID
    const tokenId = receipt.tokenId!.toString()
    console.log(`Created token: ${tokenId}`)

    return tokenId
  } catch (error) {
    console.error("Error creating token:", error)
    throw error
  }
}

/**
 * Get token information
 * @param tokenId Hedera token ID
 * @returns Token information
 */
export async function getTokenInfo(tokenId: string): Promise<any> {
  const client = initializeHederaClient()

  try {
    // Create a token info query
    const query = new TokenInfoQuery().setTokenId(TokenId.fromString(tokenId))

    // Execute the query
    const tokenInfo = await query.execute(client)

    return {
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      totalSupply: tokenInfo.totalSupply.toNumber() / 10 ** tokenInfo.decimals,
      decimals: tokenInfo.decimals,
      treasury: tokenInfo.treasuryAccountId.toString(),
    }
  } catch (error) {
    console.error("Error getting token info:", error)
    throw error
  }
}

/**
 * Mint additional tokens
 * @param tokenId Hedera token ID
 * @param amount Amount to mint
 * @param supplyKey Supply key for the token
 * @returns Transaction ID
 */
export async function mintTokens(tokenId: string, amount: number, supplyKey: string): Promise<string> {
  const client = initializeHederaClient()

  try {
    // Get token info to get decimals
    const tokenInfo = await getTokenInfo(tokenId)
    const decimals = tokenInfo.decimals

    // Create a token mint transaction
    const transaction = await new TokenMintTransaction()
      .setTokenId(TokenId.fromString(tokenId))
      .setAmount(amount * 10 ** decimals)
      .freezeWith(client)
      .sign(PrivateKey.fromString(supplyKey))

    // Execute the transaction and get the receipt
    const txResponse = await transaction.execute(client)
    const receipt = await txResponse.getReceipt(client)

    console.log(`Minted ${amount} tokens to token ${tokenId}`)
    return txResponse.transactionId.toString()
  } catch (error) {
    console.error("Error minting tokens:", error)
    throw error
  }
}

/**
 * Associate a token with an account
 * @param accountId Account ID to associate the token with
 * @param tokenId Hedera token ID
 * @param privateKey Private key of the account
 * @returns Transaction ID
 */
export async function associateTokenWithAccount(
  accountId: string,
  tokenId: string,
  privateKey: string,
): Promise<string> {
  const client = initializeHederaClient()

  try {
    // Create a token associate transaction
    const transaction = await new TokenAssociateTransaction()
      .setAccountId(AccountId.fromString(accountId))
      .setTokenIds([TokenId.fromString(tokenId)])
      .freezeWith(client)
      .sign(PrivateKey.fromString(privateKey))

    // Execute the transaction and get the receipt
    const txResponse = await transaction.execute(client)
    const receipt = await txResponse.getReceipt(client)

    console.log(`Associated token ${tokenId} with account ${accountId}`)
    return txResponse.transactionId.toString()
  } catch (error) {
    console.error("Error associating token:", error)
    throw error
  }
}

/**
 * Transfer tokens from one account to another
 * @param tokenId Hedera token ID
 * @param fromAccountId Sender account ID
 * @param toAccountId Recipient account ID
 * @param amount Amount to transfer
 * @param senderPrivateKey Private key of the sender
 * @returns Transaction ID
 */
export async function transferTokens(
  tokenId: string,
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  senderPrivateKey: string,
): Promise<string> {
  const client = initializeHederaClient()

  try {
    // Get token info to get decimals
    const tokenInfo = await getTokenInfo(tokenId)
    const decimals = tokenInfo.decimals

    // Create a token transfer transaction
    const transaction = await new TransferTransaction()
      .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(fromAccountId), -amount * 10 ** decimals)
      .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(toAccountId), amount * 10 ** decimals)
      .freezeWith(client)
      .sign(PrivateKey.fromString(senderPrivateKey))

    // Execute the transaction and get the receipt
    const txResponse = await transaction.execute(client)
    const receipt = await txResponse.getReceipt(client)

    console.log(`Transferred ${amount} tokens from ${fromAccountId} to ${toAccountId}`)
    return txResponse.transactionId.toString()
  } catch (error) {
    console.error("Error transferring tokens:", error)
    throw error
  }
}

/**
 * Burn tokens
 * @param tokenId Hedera token ID
 * @param amount Amount to burn
 * @param supplyKey Supply key for the token
 * @returns Transaction ID
 */
export async function burnTokens(tokenId: string, amount: number, supplyKey: string): Promise<string> {
  const client = initializeHederaClient()

  try {
    // Get token info to get decimals
    const tokenInfo = await getTokenInfo(tokenId)
    const decimals = tokenInfo.decimals

    // Create a token burn transaction
    const transaction = await new TokenBurnTransaction()
      .setTokenId(TokenId.fromString(tokenId))
      .setAmount(amount * 10 ** decimals)
      .freezeWith(client)
      .sign(PrivateKey.fromString(supplyKey))

    // Execute the transaction and get the receipt
    const txResponse = await transaction.execute(client)
    const receipt = await txResponse.getReceipt(client)

    console.log(`Burned ${amount} tokens from token ${tokenId}`)
    return txResponse.transactionId.toString()
  } catch (error) {
    console.error("Error burning tokens:", error)
    throw error
  }
}

