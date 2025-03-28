import type { AbiItem } from "web3-utils"
import type { ContractConfig } from "../utils/web3-provider"
import { config } from "../utils/config"

// Import your contract ABIs
// These will need to be generated from your Solidity contracts
// For now, we'll use placeholder empty arrays
const tokenAbi: AbiItem[] = []
const bountyAbi: AbiItem[] = []
const marketplaceAbi: AbiItem[] = []

// Contract configurations using values from config
export const tokenContract: ContractConfig = {
  address: config.blockchain.contracts.token,
  abi: tokenAbi,
}

export const bountyContract: ContractConfig = {
  address: config.blockchain.contracts.bounty,
  abi: bountyAbi,
}

export const marketplaceContract: ContractConfig = {
  address: config.blockchain.contracts.marketplace,
  abi: marketplaceAbi,
}

