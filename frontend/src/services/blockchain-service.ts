import { isBlockchainEnabled } from "../utils/hedera-utils"
import { api } from "./api-service"

// Blockchain service for handling all blockchain operations
export const blockchainService = {
  // Check if blockchain features are enabled
  isEnabled: () => {
    return isBlockchainEnabled()
  },

  // Create a bounty on the blockchain
  createBounty: async (bountyId: string, amount: number) => {
    if (!isBlockchainEnabled()) {
      console.log("Blockchain features are disabled")
      return { success: true, simulated: true }
    }

    try {
      // Call backend to create bounty on blockchain
      const response = await api.post(`/blockchain/bounties/${bountyId}/create`, { amount })
      return response.data
    } catch (error) {
      console.error("Error creating bounty on blockchain:", error)
      throw error
    }
  },

  // Fund a bounty on the blockchain
  fundBounty: async (bountyId: string, amount: number) => {
    if (!isBlockchainEnabled()) {
      console.log("Blockchain features are disabled")
      return { success: true, simulated: true }
    }

    try {
      // Call backend to fund bounty on blockchain
      const response = await api.post(`/blockchain/bounties/${bountyId}/fund`, { amount })
      return response.data
    } catch (error) {
      console.error("Error funding bounty on blockchain:", error)
      throw error
    }
  },

  // Release milestone payment on the blockchain
  releaseMilestonePayment: async (bountyId: string, milestoneId: string, amount: number) => {
    if (!isBlockchainEnabled()) {
      console.log("Blockchain features are disabled")
      return { success: true, simulated: true }
    }

    try {
      // Call backend to release milestone payment on blockchain
      const response = await api.post(`/blockchain/bounties/${bountyId}/milestones/${milestoneId}/release`, { amount })
      return response.data
    } catch (error) {
      console.error("Error releasing milestone payment on blockchain:", error)
      throw error
    }
  },

  // Get transaction history for a bounty
  getBountyTransactions: async (bountyId: string) => {
    if (!isBlockchainEnabled()) {
      console.log("Blockchain features are disabled")
      return { transactions: [] }
    }

    try {
      // Call backend to get bounty transactions
      const response = await api.get(`/blockchain/bounties/${bountyId}/transactions`)
      return response.data
    } catch (error) {
      console.error("Error getting bounty transactions:", error)
      throw error
    }
  },

  // Get account balance
  getAccountBalance: async (accountId: string) => {
    if (!isBlockchainEnabled()) {
      console.log("Blockchain features are disabled")
      return { hbarBalance: 0, tokenBalance: 0 }
    }

    try {
      // Call backend to get account balance
      const response = await api.get(`/blockchain/accounts/${accountId}/balance`)
      return response.data
    } catch (error) {
      console.error("Error getting account balance:", error)
      throw error
    }
  },
}

