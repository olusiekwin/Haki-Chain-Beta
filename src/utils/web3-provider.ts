import Web3 from "web3"
import type { AbiItem } from "web3-utils"

// Types
export interface ContractConfig {
  address: string
  abi: AbiItem[]
}

// Web3 instance
let web3Instance: Web3 | null = null

// Contract instances cache
const contractInstances: Record<string, any> = {}

// Initialize web3
export const initWeb3 = async (): Promise<Web3> => {
  if (web3Instance) return web3Instance

  // Check if MetaMask is installed
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })
      web3Instance = new Web3(window.ethereum)

      // Handle chain changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })

      // Handle account changes
      window.ethereum.on("accountsChanged", () => {
        window.location.reload()
      })

      return web3Instance
    } catch (error) {
      console.error("User denied account access", error)
      throw new Error("User denied account access")
    }
  }
  // If no injected web3 instance is detected, fallback to a local provider
  else {
    const provider = new Web3.providers.HttpProvider("http://localhost:8545")
    web3Instance = new Web3(provider)
    return web3Instance
  }
}

// Get contract instance
export const getContract = (config: ContractConfig): any => {
  if (contractInstances[config.address]) {
    return contractInstances[config.address]
  }

  if (!web3Instance) {
    throw new Error("Web3 not initialized")
  }

  const contract = new web3Instance.eth.Contract(config.abi, config.address)

  contractInstances[config.address] = contract
  return contract
}

// Get current account
export const getCurrentAccount = async (): Promise<string> => {
  if (!web3Instance) {
    throw new Error("Web3 not initialized")
  }

  const accounts = await web3Instance.eth.getAccounts()
  return accounts[0]
}

// Check if wallet is connected
export const isWalletConnected = async (): Promise<boolean> => {
  try {
    const accounts = await web3Instance?.eth.getAccounts()
    return !!accounts && accounts.length > 0
  } catch (error) {
    return false
  }
}

// Get network ID
export const getNetworkId = async (): Promise<number> => {
  if (!web3Instance) {
    throw new Error("Web3 not initialized")
  }

  return await web3Instance.eth.net.getId()
}

export default {
  initWeb3,
  getContract,
  getCurrentAccount,
  isWalletConnected,
  getNetworkId,
}

