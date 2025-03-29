import web3Provider from "../../utils/web3-provider"
import { tokenContractABI, contractAddresses } from "../../contracts/contract-config"
import { ethers } from "ethers"

class TokenContractService {
  // Get contract instance
  private getContract() {
    if (!contractAddresses.token) {
      throw new Error("Token contract address not configured")
    }

    const contract = web3Provider.getContract(contractAddresses.token, tokenContractABI)

    if (!contract) {
      throw new Error("Failed to create token contract instance")
    }

    return contract
  }

  // Get token name
  async getName(): Promise<string> {
    try {
      const contract = this.getContract()
      return await contract.name()
    } catch (error) {
      console.error("Error getting token name:", error)
      throw error
    }
  }

  // Get token symbol
  async getSymbol(): Promise<string> {
    try {
      const contract = this.getContract()
      return await contract.symbol()
    } catch (error) {
      console.error("Error getting token symbol:", error)
      throw error
    }
  }

  // Get token decimals
  async getDecimals(): Promise<number> {
    try {
      const contract = this.getContract()
      return await contract.decimals()
    } catch (error) {
      console.error("Error getting token decimals:", error)
      throw error
    }
  }

  // Get token total supply
  async getTotalSupply(): Promise<string> {
    try {
      const contract = this.getContract()
      const totalSupply = await contract.totalSupply()
      return ethers.utils.formatEther(totalSupply)
    } catch (error) {
      console.error("Error getting token total supply:", error)
      throw error
    }
  }

  // Get token balance for an address
  async balanceOf(address: string): Promise<string> {
    try {
      const contract = this.getContract()
      const balance = await contract.balanceOf(address)
      return ethers.utils.formatEther(balance)
    } catch (error) {
      console.error("Error getting token balance:", error)
      throw error
    }
  }

  // Transfer tokens to another address
  async transfer(from: string, to: string, amount: string): Promise<string> {
    try {
      const contract = this.getContract()

      // Convert amount to wei (assuming token has 18 decimals like ETH)
      const amountInWei = ethers.utils.parseEther(amount)

      // Transfer tokens
      const tx = await contract.transfer(to, amountInWei)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Return transaction hash
      return receipt.transactionHash
    } catch (error) {
      console.error("Error transferring tokens:", error)
      throw error
    }
  }

  // Approve tokens for another address to spend
  async approve(from: string, spender: string, amount: string): Promise<string> {
    try {
      const contract = this.getContract()

      // Convert amount to wei (assuming token has 18 decimals like ETH)
      const amountInWei = ethers.utils.parseEther(amount)

      // Approve tokens
      const tx = await contract.approve(spender, amountInWei)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Return transaction hash
      return receipt.transactionHash
    } catch (error) {
      console.error("Error approving tokens:", error)
      throw error
    }
  }
}

export default new TokenContractService()

