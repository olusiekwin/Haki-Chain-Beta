import {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  TokenAssociateTransaction,
  TokenId,
  Hbar,
} from "@hashgraph/sdk"
import config from "../config"

// Initialize Hedera client based on network
const getClient = () => {
  const network = config.hederaNetwork || "testnet"

  if (network === "mainnet") {
    return Client.forMainnet()
  } else {
    return Client.forTestnet()
  }
}

// Get operator from environment variables or config
const getOperator = () => {
  const accountId = config.hedera.accountId
  // Remove '0x' prefix if present in the private key
  const privateKey = config.hedera.privateKey.startsWith("0x")
    ? config.hedera.privateKey.substring(2)
    : config.hedera.privateKey

  if (!accountId || !privateKey) {
    throw new Error("Hedera account ID and private key must be present")
  }

  return {
    accountId: AccountId.fromString(accountId),
    privateKey: PrivateKey.fromStringED25519(privateKey),
  }
}

// Initialize client with operator credentials
export const initializeClient = () => {
  try {
    const client = getClient()
    const { accountId, privateKey } = getOperator()

    // Set the operator account ID and private key
    client.setOperator(accountId, privateKey)

    return client
  } catch (error) {
    console.error("Failed to initialize Hedera client:", error)
    throw error
  }
}

// Transfer HBAR between accounts
export const transferHbar = async (recipientId: string, amount: number) => {
  try {
    const client = initializeClient()
    const { accountId } = getOperator()

    // Create the transfer transaction
    const transaction = new TransferTransaction()
      .addHbarTransfer(accountId, new Hbar(-amount))
      .addHbarTransfer(AccountId.fromString(recipientId), new Hbar(amount))
      .setTransactionMemo("Haki Platform Transfer")
      .freezeWith(client)

    // Sign the transaction with the operator key
    const signedTx = await transaction.sign(getOperator().privateKey)

    // Submit the transaction to the Hedera network
    const txResponse = await signedTx.execute(client)

    // Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client)

    // Get the transaction status
    const transactionStatus = receipt.status.toString()

    return {
      transactionId: txResponse.transactionId.toString(),
      status: transactionStatus,
    }
  } catch (error) {
    console.error("Error transferring HBAR:", error)
    throw error
  }
}

// Associate a token with an account
export const associateToken = async (accountId: string, tokenId: string, privateKey: string) => {
  try {
    const client = initializeClient()

    // Create the token associate transaction
    const transaction = await new TokenAssociateTransaction()
      .setAccountId(AccountId.fromString(accountId))
      .setTokenIds([TokenId.fromString(tokenId)])
      .freezeWith(client)
      .sign(PrivateKey.fromString(privateKey))

    // Submit the transaction
    const txResponse = await transaction.execute(client)

    // Get the receipt
    const receipt = await txResponse.getReceipt(client)

    return {
      transactionId: txResponse.transactionId.toString(),
      status: receipt.status.toString(),
    }
  } catch (error) {
    console.error("Error associating token:", error)
    throw error
  }
}

// Connect to wallet using HashConnect or similar wallet connector
export const connectWallet = async () => {
  // This is a placeholder for wallet connection logic
  // In a real implementation, you would use HashConnect or similar library

  return {
    pairingString: "example-pairing-string",
    topic: "example-topic",
  }
}

// Get account info from connected wallet
export const getAccountInfo = async (topic: string) => {
  // This is a placeholder for getting account info from connected wallet
  // In a real implementation, you would use the topic to get account info

  return {
    accountId: config.hedera.accountId || "0.0.5785491",
  }
}

// Check if blockchain features are enabled
export const isBlockchainEnabled = () => {
  return config.features.blockchain
}

