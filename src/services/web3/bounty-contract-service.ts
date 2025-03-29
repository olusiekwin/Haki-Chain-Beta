import web3Provider from "../../utils/web3-provider"
import { bountyContractABI, contractAddresses } from "../../contracts/contract-config"
import { ethers } from "ethers"

class BountyContractService {
  // Get contract instance
  private getContract() {
    if (!contractAddresses.bounty) {
      throw new Error("Bounty contract address not configured")
    }

    const contract = web3Provider.getContract(contractAddresses.bounty, bountyContractABI)

    if (!contract) {
      throw new Error("Failed to create bounty contract instance")
    }

    return contract
  }

  // Create a new bounty
  async createBounty(walletAddress: string, title: string, description: string, reward: string): Promise<string> {
    try {
      const contract = this.getContract()

      // Convert reward to wei (assuming token has 18 decimals like ETH)
      const rewardInWei = ethers.utils.parseEther(reward)

      // Create bounty transaction
      const tx = await contract.createBounty(title, description, rewardInWei)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Return transaction hash
      return receipt.transactionHash
    } catch (error) {
      console.error("Error creating bounty on blockchain:", error)
      throw error
    }
  }

  // Accept a bounty
  async acceptBounty(walletAddress: string, bountyId: string): Promise<string> {
    try {
      const contract = this.getContract()

      // Accept bounty transaction
      const tx = await contract.acceptBounty(bountyId)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Return transaction hash
      return receipt.transactionHash
    } catch (error) {
      console.error("Error accepting bounty on blockchain:", error)
      throw error
    }
  }

  // Complete a bounty
  async completeBounty(walletAddress: string, bountyId: string): Promise<string> {
    try {
      const contract = this.getContract()

      // Complete bounty transaction
      const tx = await contract.completeBounty(bountyId)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Return transaction hash
      return receipt.transactionHash
    } catch (error) {
      console.error("Error completing bounty on blockchain:", error)
      throw error
    }
  }

  // Cancel a bounty
  async cancelBounty(walletAddress: string, bountyId: string): Promise<string> {
    try {
      const contract = this.getContract()

      // Cancel bounty transaction
      const tx = await contract.cancelBounty(bountyId)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Return transaction hash
      return receipt.transactionHash
    } catch (error) {
      console.error("Error cancelling bounty on blockchain:", error)
      throw error
    }
  }

  // Get a single bounty
  async getBounty(bountyId: string): Promise<any> {
    try {
      const contract = this.getContract()

      // Get bounty data
      const bountyData = await contract.getBounty(bountyId)

      // Format bounty data
      return {
        id: bountyId,
        creator: bountyData.creator,
        title: bountyData.title,
        description: bountyData.description,
        reward: ethers.utils.formatEther(bountyData.reward),
        status: this.getBountyStatusString(bountyData.status),
        worker: bountyData.worker,
      }
    } catch (error) {
      console.error("Error getting bounty from blockchain:", error)
      throw error
    }
  }

  // Get all bounties (simplified)
  async getAllBounties(): Promise<any[]> {
    try {
      const contract = this.getContract()

      // Get bounty count
      const bountyCount = await contract.getBountyCount()

      // Get all bounties
      const bounties = []
      for (let i = 1; i <= bountyCount.toNumber(); i++) {
        try {
          const bounty = await this.getBounty(i.toString())
          bounties.push(bounty)
        } catch (error) {
          console.error(`Error getting bounty ${i}:`, error)
        }
      }

      return bounties
    } catch (error) {
      console.error("Error getting all bounties from blockchain:", error)
      throw error
    }
  }

  // Get user's bounties
  async getUserBounties(walletAddress: string): Promise<any[]> {
    try {
      const contract = this.getContract()

      // Get user's bounty IDs
      const bountyIds = await contract.getUserBounties(walletAddress)

      // Get bounty details for each ID
      const bounties = []
      for (const bountyId of bountyIds) {
        try {
          const bounty = await this.getBounty(bountyId.toString())
          bounties.push(bounty)
        } catch (error) {
          console.error(`Error getting bounty ${bountyId}:`, error)
        }
      }

      return bounties
    } catch (error) {
      console.error("Error getting user bounties from blockchain:", error)
      throw error
    }
  }

  // Helper to convert numeric status to string
  private getBountyStatusString(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: "open",
      1: "in_progress",
      2: "completed",
      3: "cancelled",
    }

    return statusMap[status] || "unknown"
  }
}

export default new BountyContractService()

