import { Client, Hbar, TransferTransaction, AccountId } from "@hashgraph/sdk"

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
 * Create a new escrow contract for a bounty
 * @param bountyId Bounty ID in the system
 * @param ngoId NGO account ID
 * @param lawyerId Lawyer account ID (optional, can be set later)
 * @param totalAmount Total amount in escrow
 * @param milestones Array of milestone objects with amounts
 * @returns Contract ID
 */
export async function createEscrowContract(
  bountyId: string,
  ngoId: string,
  lawyerId = "",
  totalAmount: number,
  milestones: { id: string; amount: number; description: string }[],
): Promise<string> {
  const client = initializeHederaClient()

  try {
    // For simplicity, we'll use a mock contract creation
    // In a real application, you would deploy a Solidity contract

    // First, initiate a transfer of funds to the treasury account to fund the escrow
    const transferTx = await new TransferTransaction()
      .addHbarTransfer(AccountId.fromString(ngoId), new Hbar(-totalAmount))
      .addHbarTransfer(AccountId.fromString(process.env.HEDERA_ACCOUNT_ID!), new Hbar(totalAmount))
      .execute(client)

    // Get the transaction receipt
    const transferReceipt = await transferTx.getReceipt(client)

    // Generate a mock contract ID
    // In a real app, this would be returned from the contract creation
    const contractId = `0.0.${3000000 + Number.parseInt(bountyId)}`

    console.log(`Created escrow contract ${contractId} for bounty ${bountyId}`)
    return contractId
  } catch (error) {
    console.error("Error creating escrow contract:", error)
    throw error
  }
}

/**
 * Release a milestone payment from escrow
 * @param contractId Hedera contract ID
 * @param milestoneId Milestone ID
 * @param lawyerId Lawyer account ID to receive the payment
 * @returns Transaction ID
 */
export async function releaseMilestonePayment(
  contractId: string,
  milestoneId: string,
  lawyerId: string,
): Promise<string> {
  const client = initializeHederaClient()

  try {
    // For simplicity, we'll use a mock transaction
    // In a real app, you would call a contract function

    // Mock milestone amount
    const milestoneAmount = 1000 // In a real app, this would come from the contract state

    // Transfer the milestone payment to the lawyer
    const transferTx = await new TransferTransaction()
      .addHbarTransfer(AccountId.fromString(process.env.HEDERA_ACCOUNT_ID!), new Hbar(-milestoneAmount))
      .addHbarTransfer(AccountId.fromString(lawyerId), new Hbar(milestoneAmount))
      .execute(client)

    // Get the transaction receipt
    const transferReceipt = await transferTx.getReceipt(client)

    console.log(`Released milestone ${milestoneId} payment to lawyer ${lawyerId}`)
    return transferTx.transactionId.toString()
  } catch (error) {
    console.error("Error releasing milestone payment:", error)
    throw error
  }
}

/**
 * Refund the remaining escrow funds
 * @param contractId Hedera contract ID
 * @param ngoId NGO account ID to refund to
 * @returns Transaction ID
 */
export async function refundEscrow(contractId: string, ngoId: string): Promise<string> {
  const client = initializeHederaClient()

  try {
    // For simplicity, we'll use a mock transaction
    // In a real app, you would call a contract function

    // Mock remaining amount
    const remainingAmount = 500 // In a real app, this would come from the contract state

    // Transfer the remaining funds back to the NGO
    const transferTx = await new TransferTransaction()
      .addHbarTransfer(AccountId.fromString(process.env.HEDERA_ACCOUNT_ID!), new Hbar(-remainingAmount))
      .addHbarTransfer(AccountId.fromString(ngoId), new Hbar(remainingAmount))
      .execute(client)

    // Get the transaction receipt
    const transferReceipt = await transferTx.getReceipt(client)

    console.log(`Refunded remaining escrow funds to NGO ${ngoId}`)
    return transferTx.transactionId.toString()
  } catch (error) {
    console.error("Error refunding escrow:", error)
    throw error
  }
}

/**
 * Get the status of an escrow contract
 * @param contractId Hedera contract ID
 * @returns Escrow status
 */
export async function getEscrowStatus(contractId: string): Promise<any> {
  const client = initializeHederaClient()

  try {
    // For simplicity, we'll return mock data
    // In a real app, you would query the contract state

    return {
      totalAmount: 5000,
      releasedAmount: 3000,
      remainingAmount: 2000,
      ngoId: "0.0.12345",
      lawyerId: "0.0.67890",
      bountyId: "123",
      status: "active",
      milestones: [
        {
          id: "1",
          amount: 1000,
          description: "Initial consultation",
          status: "released",
          releasedAt: "2023-06-15T10:30:00Z",
        },
        {
          id: "2",
          amount: 2000,
          description: "Documentation preparation",
          status: "released",
          releasedAt: "2023-07-20T14:45:00Z",
        },
        {
          id: "3",
          amount: 2000,
          description: "Court representation",
          status: "pending",
        },
      ],
    }
  } catch (error) {
    console.error("Error getting escrow status:", error)
    throw error
  }
}

