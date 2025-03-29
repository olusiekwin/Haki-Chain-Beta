import {
  Client,
  AccountId,
  PrivateKey,
  ContractExecuteTransaction,
  ContractCallQuery,
  ContractFunctionParameters,
  TokenAssociateTransaction,
  TokenTransferTransaction,
  Hbar,
} from "@hashgraph/sdk"
import { HashConnect, type HashConnectTypes } from "hashconnect"

// Add ABI service import at the top of the file
import { abiService } from "./abi-service"

/**
 * Web3Service - Handles all interactions with Hedera blockchain
 *
 * This service consolidates all Hedera-related functionality including:
 * - Client initialization
 * - Wallet connection
 * - Contract interactions
 * - Token operations
 */
class Web3Service {
  private client: Client | null = null
  private hashConnect: HashConnect | null = null
  private accountId: string | null = null
  private privateKey: PrivateKey | null = null
  private topic: string | null = null
  private pairingData: HashConnectTypes.PairingData | null = null

  // Contract IDs
  private tokenContractId: string
  private escrowContractId: string
  private bountyContractId: string
  private reputationContractId: string
  private multiSigContractId: string

  constructor() {
    // Initialize contract IDs from environment variables
    this.tokenContractId = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || ""
    this.escrowContractId = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS || ""
    this.bountyContractId = process.env.REACT_APP_BOUNTY_CONTRACT_ADDRESS || ""
    this.reputationContractId = process.env.REACT_APP_REPUTATION_CONTRACT_ADDRESS || ""
    this.multiSigContractId = process.env.REACT_APP_MULTISIG_CONTRACT_ADDRESS || ""

    // Initialize Hedera client
    this.initClient()

    // Initialize HashConnect for wallet connection
    this.initHashConnect()
  }

  /**
   * Initialize Hedera client with account ID and private key
   */
  private initClient(): void {
    try {
      const network = process.env.HEDERA_NETWORK || "testnet"

      // Create client based on network
      if (network === "mainnet") {
        this.client = Client.forMainnet()
      } else {
        this.client = Client.forTestnet()
      }

      // Set operator if account ID and private key are available
      const accountId = process.env.HEDERA_ACCOUNT_ID
      const privateKey = process.env.HEDERA_PRIVATE_KEY

      if (accountId && privateKey) {
        this.accountId = accountId
        this.privateKey = PrivateKey.fromString(privateKey)
        this.client.setOperator(AccountId.fromString(accountId), this.privateKey)

        // Set default max transaction fee
        this.client.setDefaultMaxTransactionFee(new Hbar(10))

        console.log("Hedera client initialized with operator account")
      } else {
        console.log("Hedera client initialized without operator account")
      }
    } catch (error) {
      console.error("Error initializing Hedera client:", error)
    }
  }

  /**
   * Initialize HashConnect for wallet connection
   */
  private initHashConnect(): void {
    try {
      this.hashConnect = new HashConnect()

      // Initialize HashConnect
      this.hashConnect.init({
        name: "Haki Platform",
        description: "Legal services platform on Hedera",
        icon: "https://hakichain.com/logo.png",
      })

      // Setup connection event handlers
      this.hashConnect.connectionStatusChange.on((status) => {
        console.log("HashConnect connection status:", status)
      })

      this.hashConnect.pairingEvent.on((data) => {
        console.log("HashConnect pairing event:", data)
        this.pairingData = data

        // Update account ID if available
        if (data.accountIds && data.accountIds.length > 0) {
          this.accountId = data.accountIds[0]
        }
      })

      console.log("HashConnect initialized")
    } catch (error) {
      console.error("Error initializing HashConnect:", error)
    }
  }

  /**
   * Connect wallet using HashConnect
   */
  async connectWallet(): Promise<{ success: boolean; accountId?: string; error?: string }> {
    try {
      if (!this.hashConnect) {
        return { success: false, error: "HashConnect not initialized" }
      }

      // Generate connection data
      const state = await this.hashConnect.connect()
      this.topic = state.topic

      // Generate pairing string
      const pairingString = this.hashConnect.generatePairingString(state, "testnet", false)

      // Open HashPack wallet for connection
      this.hashConnect.connectToLocalWallet(pairingString)

      // Wait for pairing event (handled in initHashConnect)
      // Return success if account ID is available
      if (this.accountId) {
        return { success: true, accountId: this.accountId }
      }

      return { success: false, error: "Wallet connection pending" }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Disconnect wallet
   */
  disconnectWallet(): void {
    if (this.hashConnect && this.topic) {
      this.hashConnect.disconnect(this.topic)
      this.topic = null
      this.pairingData = null
      this.accountId = null
    }
  }

  /**
   * Check if wallet is connected
   */
  isWalletConnected(): boolean {
    return !!this.accountId
  }

  /**
   * Get connected account ID
   */
  getAccountId(): string | null {
    return this.accountId
  }

  /**
   * Execute contract function
   */
  async executeContract(
    contractId: string,
    contractType: "token" | "escrow" | "bounty" | "reputation" | "multisig",
    functionName: string,
    params: any[],
    gasLimit = 100000,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      if (!this.client) {
        return { success: false, error: "Hedera client not initialized" }
      }

      if (!this.accountId) {
        return { success: false, error: "Wallet not connected" }
      }

      // Get function signature from ABI
      const functionSignature = abiService.getFunctionSignature(contractType, functionName)

      // Create contract parameters
      const contractParams = new ContractFunctionParameters()

      // Add parameters based on their type
      params.forEach((param, index) => {
        if (typeof param === "string") {
          contractParams.addString(param)
        } else if (typeof param === "number") {
          if (Number.isInteger(param)) {
            contractParams.addInt64(param)
          } else {
            contractParams.addInt64(Math.floor(param))
          }
        } else if (typeof param === "boolean") {
          contractParams.addBool(param)
        } else if (Array.isArray(param)) {
          if (typeof param[0] === "string") {
            contractParams.addStringArray(param)
          } else if (typeof param[0] === "number") {
            contractParams.addUint256Array(param)
          }
        }
      })

      // Create transaction
      const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(gasLimit)
        .setFunction(functionName, contractParams)

      // Execute transaction
      let txResponse

      if (this.hashConnect && this.topic && this.pairingData) {
        // Execute via HashConnect if wallet is connected
        const txBytes = await transaction.freezeWith(this.client).toBytes()

        const signedTx = await this.hashConnect.sendTransaction(this.topic, {
          topic: this.topic,
          byteArray: txBytes,
          metadata: {
            accountToSign: this.accountId,
            returnTransaction: false,
          },
        })

        txResponse = signedTx.receipt
      } else if (this.privateKey) {
        // Execute via private key if available
        const signedTx = await transaction.freezeWith(this.client).sign(this.privateKey)
        txResponse = await signedTx.execute(this.client)
      } else {
        return { success: false, error: "No signing method available" }
      }

      // Get receipt
      const receipt = await txResponse.getReceipt(this.client)

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
      }
    } catch (error) {
      console.error("Error executing contract:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Call contract function (query)
   */
  async callContract(
    contractId: string,
    contractType: "token" | "escrow" | "bounty" | "reputation" | "multisig",
    functionName: string,
    params: any[],
    gasLimit = 100000,
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      if (!this.client) {
        return { success: false, error: "Hedera client not initialized" }
      }

      // Get function signature from ABI
      const functionSignature = abiService.getFunctionSignature(contractType, functionName)

      // Create contract parameters
      const contractParams = new ContractFunctionParameters()

      // Add parameters based on their type
      params.forEach((param, index) => {
        if (typeof param === "string") {
          contractParams.addString(param)
        } else if (typeof param === "number") {
          if (Number.isInteger(param)) {
            contractParams.addInt64(param)
          } else {
            contractParams.addInt64(Math.floor(param))
          }
        } else if (typeof param === "boolean") {
          contractParams.addBool(param)
        } else if (Array.isArray(param)) {
          if (typeof param[0] === "string") {
            contractParams.addStringArray(param)
          } else if (typeof param[0] === "number") {
            contractParams.addUint256Array(param)
          }
        }
      })

      // Create query
      const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(gasLimit)
        .setFunction(functionName, contractParams)

      // Execute query
      const response = await query.execute(this.client)

      // Decode result using ABI
      const decodedResult = abiService.decodeFunctionResult(contractType, functionName, response.toString())

      return { success: true, result: response }
    } catch (error) {
      console.error("Error calling contract:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Associate token with account
   */
  async associateToken(
    tokenId: string,
    accountId: string = this.accountId!,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      if (!this.client) {
        return { success: false, error: "Hedera client not initialized" }
      }

      if (!accountId) {
        return { success: false, error: "Account ID not provided" }
      }

      // Create transaction
      const transaction = new TokenAssociateTransaction().setAccountId(accountId).setTokenIds([tokenId])

      // Execute transaction
      let txResponse

      if (this.hashConnect && this.topic && this.pairingData) {
        // Execute via HashConnect if wallet is connected
        const txBytes = await transaction.freezeWith(this.client).toBytes()

        const signedTx = await this.hashConnect.sendTransaction(this.topic, {
          topic: this.topic,
          byteArray: txBytes,
          metadata: {
            accountToSign: accountId,
            returnTransaction: false,
          },
        })

        txResponse = signedTx.receipt
      } else if (this.privateKey) {
        // Execute via private key if available
        const signedTx = await transaction.freezeWith(this.client).sign(this.privateKey)
        txResponse = await signedTx.execute(this.client)
      } else {
        return { success: false, error: "No signing method available" }
      }

      // Get receipt
      const receipt = await txResponse.getReceipt(this.client)

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
      }
    } catch (error) {
      console.error("Error associating token:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Transfer tokens
   */
  async transferTokens(
    tokenId: string,
    toAccountId: string,
    amount: number,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      if (!this.client) {
        return { success: false, error: "Hedera client not initialized" }
      }

      if (!this.accountId) {
        return { success: false, error: "Wallet not connected" }
      }

      // Create transaction
      const transaction = new TokenTransferTransaction()
        .addTokenTransfer(tokenId, this.accountId, -amount)
        .addTokenTransfer(tokenId, toAccountId, amount)

      // Execute transaction
      let txResponse

      if (this.hashConnect && this.topic && this.pairingData) {
        // Execute via HashConnect if wallet is connected
        const txBytes = await transaction.freezeWith(this.client).toBytes()

        const signedTx = await this.hashConnect.sendTransaction(this.topic, {
          topic: this.topic,
          byteArray: txBytes,
          metadata: {
            accountToSign: this.accountId,
            returnTransaction: false,
          },
        })

        txResponse = signedTx.receipt
      } else if (this.privateKey) {
        // Execute via private key if available
        const signedTx = await transaction.freezeWith(this.client).sign(this.privateKey)
        txResponse = await signedTx.execute(this.client)
      } else {
        return { success: false, error: "No signing method available" }
      }

      // Get receipt
      const receipt = await txResponse.getReceipt(this.client)

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
      }
    } catch (error) {
      console.error("Error transferring tokens:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Get token balance
   */
  async getTokenBalance(
    tokenId: string,
    accountId: string = this.accountId!,
  ): Promise<{ success: boolean; balance?: number; error?: string }> {
    try {
      if (!this.client) {
        return { success: false, error: "Hedera client not initialized" }
      }

      if (!accountId) {
        return { success: false, error: "Account ID not provided" }
      }

      // Call token contract to get balance
      const params = new ContractFunctionParameters().addString(accountId)

      const result = await this.callContract(this.tokenContractId, "token", "balanceOf", [accountId])

      if (!result.success) {
        return { success: false, error: result.error }
      }

      // Parse balance from result
      const balance = result.result.getUint256(0)

      return { success: true, balance: Number(balance) }
    } catch (error) {
      console.error("Error getting token balance:", error)
      return { success: false, error: String(error) }
    }
  }

  // HakiToken contract methods

  /**
   * Mint tokens (admin only)
   */
  async mintTokens(
    toAccountId: string,
    amount: number,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const params = new ContractFunctionParameters().addString(toAccountId).addUint256(amount)

      return await this.executeContract(this.tokenContractId, "token", "mint", [toAccountId, amount])
    } catch (error) {
      console.error("Error minting tokens:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Burn tokens
   */
  async burnTokens(amount: number): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      if (!this.accountId) {
        return { success: false, error: "Wallet not connected" }
      }

      const params = new ContractFunctionParameters().addUint256(amount)

      return await this.executeContract(this.tokenContractId, "token", "burn", [amount])
    } catch (error) {
      console.error("Error burning tokens:", error)
      return { success: false, error: String(error) }
    }
  }

  // HakiEscrow contract methods

  /**
   * Create escrow
   */
  async createEscrow(
    bountyId: string,
    amount: number,
    milestones: string[],
    milestoneAmounts: number[],
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const params = new ContractFunctionParameters()
        .addString(bountyId)
        .addUint256(amount)
        .addStringArray(milestones)
        .addUint256Array(milestoneAmounts)

      return await this.executeContract(this.escrowContractId, "escrow", "createEscrow", [
        bountyId,
        amount,
        milestones,
        milestoneAmounts,
      ])
    } catch (error) {
      console.error("Error creating escrow:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Release milestone payment
   */
  async releaseMilestonePayment(
    bountyId: string,
    milestoneId: string,
    recipientId: string,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const params = new ContractFunctionParameters().addString(bountyId).addString(milestoneId).addString(recipientId)

      return await this.executeContract(this.escrowContractId, "escrow", "releaseMilestonePayment", [
        bountyId,
        milestoneId,
        recipientId,
      ])
    } catch (error) {
      console.error("Error releasing milestone payment:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Get escrow details
   */
  async getEscrowDetails(bountyId: string): Promise<{
    success: boolean
    details?: {
      totalAmount: number
      remainingAmount: number
      milestones: string[]
      milestoneAmounts: number[]
      milestoneStatuses: number[]
    }
    error?: string
  }> {
    try {
      const params = new ContractFunctionParameters().addString(bountyId)

      const result = await this.callContract(this.escrowContractId, "escrow", "getEscrowDetails", [bountyId])

      if (!result.success) {
        return { success: false, error: result.error }
      }

      // Parse details from result
      const details = {
        totalAmount: result.result.getUint256(0),
        remainingAmount: result.result.getUint256(1),
        milestones: result.result.getStringArray(2),
        milestoneAmounts: result.result.getUint256Array(3),
        milestoneStatuses: result.result.getUint256Array(4),
      }

      return { success: true, details }
    } catch (error) {
      console.error("Error getting escrow details:", error)
      return { success: false, error: String(error) }
    }
  }

  // HakiBounty contract methods

  /**
   * Create bounty
   */
  async createBounty(
    bountyId: string,
    title: string,
    description: string,
    amount: number,
    milestones: { id: string; amount: number }[],
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      // Convert milestones to format expected by contract
      const milestoneIds = milestones.map((m) => m.id)
      const milestoneAmounts = milestones.map((m) => m.amount)

      const params = new ContractFunctionParameters()
        .addString(bountyId)
        .addString(title)
        .addString(description)
        .addUint256(amount)
        .addStringArray(milestoneIds)
        .addUint256Array(milestoneAmounts)

      return await this.executeContract(this.bountyContractId, "bounty", "createBounty", [
        bountyId,
        title,
        description,
        amount,
        milestoneIds,
        milestoneAmounts,
      ])
    } catch (error) {
      console.error("Error creating bounty:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Assign bounty
   */
  async assignBounty(
    bountyId: string,
    assigneeId: string,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const params = new ContractFunctionParameters().addString(bountyId).addString(assigneeId)

      return await this.executeContract(this.bountyContractId, "bounty", "assignBounty", [bountyId, assigneeId])
    } catch (error) {
      console.error("Error assigning bounty:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Complete bounty
   */
  async completeBounty(bountyId: string): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const params = new ContractFunctionParameters().addString(bountyId)

      return await this.executeContract(this.bountyContractId, "bounty", "completeBounty", [bountyId])
    } catch (error) {
      console.error("Error completing bounty:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Get bounty details
   */
  async getBountyDetails(bountyId: string): Promise<{
    success: boolean
    details?: {
      title: string
      description: string
      amount: number
      creator: string
      assignee: string
      status: number
      milestones: string[]
      milestoneAmounts: number[]
      milestoneStatuses: number[]
    }
    error?: string
  }> {
    try {
      const params = new ContractFunctionParameters().addString(bountyId)

      const result = await this.callContract(this.bountyContractId, "bounty", "getBountyDetails", [bountyId])

      if (!result.success) {
        return { success: false, error: result.error }
      }

      // Parse details from result
      const details = {
        title: result.result.getString(0),
        description: result.result.getString(1),
        amount: result.result.getUint256(2),
        creator: result.result.getString(3),
        assignee: result.result.getString(4),
        status: result.result.getUint256(5),
        milestones: result.result.getStringArray(6),
        milestoneAmounts: result.result.getUint256Array(7),
        milestoneStatuses: result.result.getUint256Array(8),
      }

      return { success: true, details }
    } catch (error) {
      console.error("Error getting bounty details:", error)
      return { success: false, error: String(error) }
    }
  }

  // HakiReputation contract methods

  /**
   * Add review
   */
  async addReview(
    reviewedId: string,
    rating: number,
    comment: string,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      if (!this.accountId) {
        return { success: false, error: "Wallet not connected" }
      }

      const params = new ContractFunctionParameters()
        .addString(reviewedId)
        .addString(this.accountId)
        .addUint256(rating)
        .addString(comment)

      return await this.executeContract(this.reputationContractId, "reputation", "addReview", [
        reviewedId,
        this.accountId,
        rating,
        comment,
      ])
    } catch (error) {
      console.error("Error adding review:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Get reputation
   */
  async getReputation(accountId: string): Promise<{
    success: boolean
    reputation?: {
      averageRating: number
      totalReviews: number
    }
    error?: string
  }> {
    try {
      const params = new ContractFunctionParameters().addString(accountId)

      const result = await this.callContract(this.reputationContractId, "reputation", "getReputation", [accountId])

      if (!result.success) {
        return { success: false, error: result.error }
      }

      // Parse reputation from result
      const reputation = {
        averageRating: result.result.getUint256(0) / 100, // Assuming rating is stored with 2 decimal places
        totalReviews: result.result.getUint256(1),
      }

      return { success: true, reputation }
    } catch (error) {
      console.error("Error getting reputation:", error)
      return { success: false, error: String(error) }
    }
  }

  // HakiMultiSig contract methods

  /**
   * Submit transaction for approval
   */
  async submitTransaction(
    to: string,
    functionSignature: string,
    data: Uint8Array,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const params = new ContractFunctionParameters().addString(to).addString(functionSignature).addBytes(data)

      return await this.executeContract(this.multiSigContractId, "multisig", "submitTransaction", [
        to,
        functionSignature,
        data,
      ])
    } catch (error) {
      console.error("Error submitting transaction:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Approve transaction
   */
  async approveTransaction(txIndex: number): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const params = new ContractFunctionParameters().addUint256(txIndex)

      return await this.executeContract(this.multiSigContractId, "multisig", "approveTransaction", [txIndex])
    } catch (error) {
      console.error("Error approving transaction:", error)
      return { success: false, error: String(error) }
    }
  }

  /**
   * Execute transaction
   */
  async executeTransaction(txIndex: number): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const params = new ContractFunctionParameters().addUint256(txIndex)

      return await this.executeContract(this.multiSigContractId, "multisig", "executeTransaction", [txIndex])
    } catch (error) {
      console.error("Error executing transaction:", error)
      return { success: false, error: String(error) }
    }
  }
}

// Export singleton instance
export const web3Service = new Web3Service()

