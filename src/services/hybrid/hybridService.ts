import apiService from "../api/apiService"
import tokenContractService from "../web3/tokenContractService"
import bountyContractService from "../web3/bountyContractService"
import marketplaceContractService from "../web3/marketplaceContractService"
import web3Provider from "../web3/web3Provider"
import { config } from "../../config/appConfig"

class HybridService {
  // Check if blockchain features are enabled
  isBlockchainEnabled(): boolean {
    return config.features.blockchain
  }

  // Check if AI assistant features are enabled
  isAiAssistantEnabled(): boolean {
    return config.features.aiAssistant
  }

  // Link wallet to user account
  async linkWallet(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isBlockchainEnabled()) {
        throw new Error("Blockchain features are not enabled")
      }

      // Get wallet address
      const address = await web3Provider.getAddress()
      if (!address) {
        throw new Error("No wallet address found. Please connect your wallet first.")
      }

      // Link wallet to user account
      const response = await apiService.linkWallet(token, address)

      if (!response.success) {
        throw new Error(response.error || "Failed to link wallet")
      }

      return { success: true }
    } catch (error: any) {
      console.error("Error linking wallet:", error)
      return { success: false, error: error.message }
    }
  }

  // Create a bounty (both on-chain and off-chain)
  async createBounty(
    token: string,
    bountyData: { title: string; description: string; reward: string },
  ): Promise<{ success: boolean; bountyId?: number; txHash?: string; error?: string }> {
    try {
      if (!this.isBlockchainEnabled()) {
        // If blockchain is disabled, just create off-chain bounty
        const response = await apiService.createBounty(token, bountyData)

        if (!response.success) {
          throw new Error(response.error || "Failed to create bounty")
        }

        return { success: true, bountyId: response.data?.id }
      }

      // Get wallet address
      const address = await web3Provider.getAddress()
      if (!address) {
        throw new Error("No wallet address found. Please connect your wallet first.")
      }

      // Create off-chain bounty first
      const offChainResponse = await apiService.createBounty(token, bountyData)

      if (!offChainResponse.success) {
        throw new Error(offChainResponse.error || "Failed to create off-chain bounty")
      }

      const bountyId = offChainResponse.data?.id

      // Create on-chain bounty
      const txHash = await bountyContractService.createBounty(
        address,
        bountyData.title,
        bountyData.description,
        bountyData.reward,
      )

      // Sync on-chain bounty ID with off-chain bounty
      if (bountyId) {
        await apiService.syncBounty(token, bountyId, txHash)
      }

      return { success: true, bountyId, txHash }
    } catch (error: any) {
      console.error("Error creating hybrid bounty:", error)
      return { success: false, error: error.message }
    }
  }

  // Create a marketplace listing (both on-chain and off-chain)
  async createMarketplaceListing(
    token: string,
    itemData: { title: string; description: string; price: string; file: File },
  ): Promise<{ success: boolean; itemId?: number; txHash?: string; error?: string }> {
    try {
      if (!this.isBlockchainEnabled()) {
        // If blockchain is disabled, just create off-chain listing
        const response = await apiService.createMarketplaceItem(token, itemData)

        if (!response.success) {
          throw new Error(response.error || "Failed to create marketplace listing")
        }

        return { success: true, itemId: response.data?.id }
      }

      // Get wallet address
      const address = await web3Provider.getAddress()
      if (!address) {
        throw new Error("No wallet address found. Please connect your wallet first.")
      }

      // Create off-chain listing first (this will handle file upload)
      const offChainResponse = await apiService.createMarketplaceItem(token, itemData)

      if (!offChainResponse.success) {
        throw new Error(offChainResponse.error || "Failed to create off-chain marketplace listing")
      }

      const itemId = offChainResponse.data?.id
      const fileUrl = offChainResponse.data?.file_url || ""

      // Create on-chain listing
      const txHash = await marketplaceContractService.listItem(
        address,
        itemData.title,
        itemData.description,
        itemData.price,
        fileUrl,
      )

      // Sync on-chain listing ID with off-chain listing
      if (itemId) {
        await apiService.syncMarketplaceItem(token, itemId, txHash)
      }

      return { success: true, itemId, txHash }
    } catch (error: any) {
      console.error("Error creating hybrid marketplace listing:", error)
      return { success: false, error: error.message }
    }
  }

  // Get token balance for current user
  async getTokenBalance(): Promise<{ success: boolean; balance?: string; error?: string }> {
    try {
      if (!this.isBlockchainEnabled()) {
        throw new Error("Blockchain features are not enabled")
      }

      // Get wallet address
      const address = await web3Provider.getAddress()
      if (!address) {
        throw new Error("No wallet address found. Please connect your wallet first.")
      }

      // Get token balance
      const balance = await tokenContractService.balanceOf(address)

      return { success: true, balance }
    } catch (error: any) {
      console.error("Error getting token balance:", error)
      return { success: false, error: error.message }
    }
  }
}

export default new HybridService()

