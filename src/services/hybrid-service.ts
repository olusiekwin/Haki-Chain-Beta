import api from "../utils/api"
import { BountyContractService } from "./web3/bounty-contract-service"
import { TokenContractService } from "./web3/token-contract-service"
import { useFeatures } from "../hooks/use-features"

/**
 * HybridService handles the integration between Web2 (Django) and Web3 (Blockchain)
 * It provides methods that coordinate actions between both systems
 */
export class HybridService {
  private features

  constructor() {
    this.features = useFeatures()
  }

  /**
   * Creates a bounty both on-chain and off-chain
   * @param bountyData The bounty data to create
   * @param walletAddress The user's wallet address
   */
  async createBounty(bountyData: any, walletAddress: string) {
    try {
      // Step 1: Create bounty in Django backend (off-chain)
      const offchainBounty = await api.post("/bounties/", bountyData)

      // Step 2: If blockchain is enabled, create the bounty on-chain
      if (this.features.isBlockchainEnabled && walletAddress) {
        // Create on-chain bounty
        const txHash = await BountyContractService.createBounty(
          walletAddress,
          bountyData.title,
          bountyData.description,
          bountyData.reward.toString(),
        )

        // Step 3: Update the off-chain bounty with blockchain reference
        await api.patch(`/bounties/${offchainBounty.data.id}/`, {
          blockchain_tx_hash: txHash,
          blockchain_id: offchainBounty.data.id, // Using same ID for simplicity
          is_on_chain: true,
        })

        return {
          ...offchainBounty.data,
          blockchain_tx_hash: txHash,
          is_on_chain: true,
        }
      }

      return offchainBounty.data
    } catch (error) {
      console.error("Error creating hybrid bounty:", error)
      throw error
    }
  }

  /**
   * Links a user's wallet address to their Django account
   * @param walletAddress The wallet address to link
   */
  async linkWalletToAccount(walletAddress: string) {
    try {
      const response = await api.post("/users/link-wallet/", {
        wallet_address: walletAddress,
      })

      return response.data
    } catch (error) {
      console.error("Error linking wallet to account:", error)
      throw error
    }
  }

  /**
   * Completes a bounty both on-chain and off-chain
   * @param bountyId The ID of the bounty
   * @param walletAddress The user's wallet address
   */
  async completeBounty(bountyId: string, walletAddress: string) {
    try {
      // Get bounty details from Django
      const bounty = await api.get(`/bounties/${bountyId}/`)

      // If bounty is on-chain and blockchain is enabled
      if (bounty.data.is_on_chain && this.features.isBlockchainEnabled && walletAddress) {
        // Complete bounty on-chain
        const txHash = await BountyContractService.completeBounty(walletAddress, bounty.data.blockchain_id || bountyId)

        // Update off-chain status
        const updatedBounty = await api.patch(`/bounties/${bountyId}/`, {
          status: "completed",
          completion_tx_hash: txHash,
        })

        return updatedBounty.data
      } else {
        // Just update off-chain status
        const updatedBounty = await api.patch(`/bounties/${bountyId}/`, {
          status: "completed",
        })

        return updatedBounty.data
      }
    } catch (error) {
      console.error("Error completing hybrid bounty:", error)
      throw error
    }
  }

  /**
   * Transfers tokens between users, updating both on-chain and off-chain records
   * @param toAddress Recipient wallet address
   * @param amount Amount of tokens to transfer
   * @param walletAddress Sender wallet address
   */
  async transferTokens(toAddress: string, amount: string, walletAddress: string) {
    try {
      if (this.features.isBlockchainEnabled && walletAddress) {
        // Transfer tokens on-chain
        const txHash = await TokenContractService.transfer(walletAddress, toAddress, amount)

        // Record transaction in Django backend
        const transaction = await api.post("/transactions/", {
          from_address: walletAddress,
          to_address: toAddress,
          amount: amount,
          tx_hash: txHash,
          type: "token_transfer",
        })

        return {
          ...transaction.data,
          tx_hash: txHash,
        }
      } else {
        throw new Error("Blockchain features are required for token transfers")
      }
    } catch (error) {
      console.error("Error transferring tokens:", error)
      throw error
    }
  }

  /**
   * Synchronizes on-chain data with off-chain database
   * @param walletAddress The user's wallet address
   */
  async syncBlockchainData(walletAddress: string) {
    try {
      if (!this.features.isBlockchainEnabled || !walletAddress) {
        return { success: false, message: "Blockchain features not enabled" }
      }

      // Get on-chain bounties
      const onChainBounties = await BountyContractService.getAllBounties()

      // Get on-chain token balance
      const tokenBalance = await TokenContractService.balanceOf(walletAddress)

      // Send data to Django for synchronization
      const syncResult = await api.post("/blockchain/sync/", {
        wallet_address: walletAddress,
        bounties: onChainBounties,
        token_balance: tokenBalance,
      })

      return syncResult.data
    } catch (error) {
      console.error("Error syncing blockchain data:", error)
      throw error
    }
  }
}

export default new HybridService()

