import web3Provider from "../../utils/web3-provider"
import { marketplaceContractABI, contractAddresses } from "../../contracts/contract-config"
import { ethers } from "ethers"

class MarketplaceContractService {
  // Get contract instance
  private getContract() {
    if (!contractAddresses.marketplace) {
      throw new Error("Marketplace contract address not configured")
    }

    const contract = web3Provider.getContract(contractAddresses.marketplace, marketplaceContractABI)

    if (!contract) {
      throw new Error("Failed to create marketplace contract instance")
    }

    return contract
  }

  // List a new item
  async listItem(
    walletAddress: string,
    title: string,
    description: string,
    price: string,
    fileHash: string,
  ): Promise<string> {
    try {
      const contract = this.getContract()

      // Convert price to wei (assuming token has 18 decimals like ETH)
      const priceInWei = ethers.utils.parseEther(price)

      // List item transaction
      const tx = await contract.listItem(title, description, priceInWei, fileHash)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Return transaction hash
      return receipt.transactionHash
    } catch (error) {
      console.error("Error listing item on marketplace:", error)
      throw error
    }
  }

  // Buy an item
  async buyItem(walletAddress: string, itemId: string): Promise<string> {
    try {
      const contract = this.getContract()

      // Buy item transaction
      const tx = await contract.buyItem(itemId)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Return transaction hash
      return receipt.transactionHash
    } catch (error) {
      console.error("Error buying item from marketplace:", error)
      throw error
    }
  }

  // Delist an item
  async delistItem(walletAddress: string, itemId: string): Promise<string> {
    try {
      const contract = this.getContract()

      // Delist item transaction
      const tx = await contract.delistItem(itemId)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Return transaction hash
      return receipt.transactionHash
    } catch (error) {
      console.error("Error delisting item from marketplace:", error)
      throw error
    }
  }

  // Get a single item
  async getItem(itemId: string): Promise<any> {
    try {
      const contract = this.getContract()

      // Get item data
      const itemData = await contract.getItem(itemId)

      // Format item data
      return {
        id: itemId,
        seller: itemData.seller,
        title: itemData.title,
        description: itemData.description,
        price: ethers.utils.formatEther(itemData.price),
        fileHash: itemData.fileHash,
        isActive: itemData.isActive,
      }
    } catch (error) {
      console.error("Error getting item from marketplace:", error)
      throw error
    }
  }

  // Get all items (simplified)
  async getAllItems(): Promise<any[]> {
    try {
      const contract = this.getContract()

      // Get item count
      const itemCount = await contract.getItemCount()

      // Get all items
      const items = []
      for (let i = 1; i <= itemCount.toNumber(); i++) {
        try {
          const item = await this.getItem(i.toString())
          if (item.isActive) {
            items.push(item)
          }
        } catch (error) {
          console.error(`Error getting item ${i}:`, error)
        }
      }

      return items
    } catch (error) {
      console.error("Error getting all items from marketplace:", error)
      throw error
    }
  }

  // Get user's items
  async getUserItems(walletAddress: string): Promise<any[]> {
    try {
      const contract = this.getContract()

      // Get user's item IDs
      const itemIds = await contract.getUserItems(walletAddress)

      // Get item details for each ID
      const items = []
      for (const itemId of itemIds) {
        try {
          const item = await this.getItem(itemId.toString())
          items.push(item)
        } catch (error) {
          console.error(`Error getting item ${itemId}:`, error)
        }
      }

      return items
    } catch (error) {
      console.error("Error getting user items from marketplace:", error)
      throw error
    }
  }
}

export default new MarketplaceContractService()

