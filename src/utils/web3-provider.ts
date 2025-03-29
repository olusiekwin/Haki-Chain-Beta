import { ethers } from "ethers"
import { config } from "./config"

// Web3 provider class for blockchain interactions
class Web3Provider {
  private provider: ethers.providers.Web3Provider | null = null
  private signer: ethers.Signer | null = null

  // Initialize provider
  async initialize(): Promise<boolean> {
    // Check if window.ethereum is available (MetaMask or other wallet)
    if (window.ethereum) {
      try {
        // Create ethers provider
        this.provider = new ethers.providers.Web3Provider(window.ethereum)

        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" })

        // Get signer
        this.signer = this.provider.getSigner()

        return true
      } catch (error) {
        console.error("Error initializing Web3Provider:", error)
        return false
      }
    } else {
      console.error("No Ethereum provider found. Please install MetaMask or another wallet.")
      return false
    }
  }

  // Get current provider
  getProvider(): ethers.providers.Web3Provider | null {
    return this.provider
  }

  // Get current signer
  getSigner(): ethers.Signer | null {
    return this.signer
  }

  // Get current account address
  async getAddress(): Promise<string | null> {
    if (!this.signer) {
      return null
    }

    try {
      return await this.signer.getAddress()
    } catch (error) {
      console.error("Error getting address:", error)
      return null
    }
  }

  // Get contract instance
  getContract(address: string, abi: any): ethers.Contract | null {
    if (!this.provider || !address || !abi) {
      return null
    }

    try {
      return new ethers.Contract(address, abi, this.signer || this.provider)
    } catch (error) {
      console.error("Error creating contract instance:", error)
      return null
    }
  }

  // Check if connected to the correct network
  async checkNetwork(): Promise<boolean> {
    if (!this.provider) {
      return false
    }

    try {
      const network = await this.provider.getNetwork()
      // This would need to be updated based on your target network
      return network.name === config.blockchain.networkId
    } catch (error) {
      console.error("Error checking network:", error)
      return false
    }
  }

  // Disconnect provider
  disconnect(): void {
    this.provider = null
    this.signer = null
  }
}

// Create and export singleton instance
const web3Provider = new Web3Provider()
export default web3Provider

