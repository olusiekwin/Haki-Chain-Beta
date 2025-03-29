/**
 * Configuration Service
 *
 * Centralized configuration management for the application
 */
class ConfigService {
  // Contract addresses
  getTokenContractAddress(): string {
    return process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || ""
  }

  getEscrowContractAddress(): string {
    return process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS || ""
  }

  getBountyContractAddress(): string {
    return process.env.REACT_APP_BOUNTY_CONTRACT_ADDRESS || ""
  }

  getReputationContractAddress(): string {
    return process.env.REACT_APP_REPUTATION_CONTRACT_ADDRESS || ""
  }

  getMultiSigContractAddress(): string {
    return process.env.REACT_APP_MULTISIG_CONTRACT_ADDRESS || ""
  }

  // Hedera configuration
  getHederaNetwork(): string {
    return process.env.HEDERA_NETWORK || "testnet"
  }

  getHederaAccountId(): string {
    return process.env.HEDERA_ACCOUNT_ID || ""
  }

  // API configuration
  getApiUrl(): string {
    return process.env.REACT_APP_API_URL || "http://localhost:8000/api"
  }

  getApiTimeout(): number {
    return Number.parseInt(process.env.REACT_APP_API_TIMEOUT || "30000")
  }

  // Feature flags
  isBlockchainEnabled(): boolean {
    return process.env.REACT_APP_FEATURE_BLOCKCHAIN === "true"
  }

  isAiAssistantEnabled(): boolean {
    return process.env.REACT_APP_FEATURE_AI_ASSISTANT === "true"
  }

  // User roles
  getAdminRoles(): string[] {
    return ["admin"]
  }

  getLawyerRoles(): string[] {
    return ["lawyer"]
  }

  getNgoRoles(): string[] {
    return ["ngo"]
  }

  getDonorRoles(): string[] {
    return ["donor"]
  }
}

export const configService = new ConfigService()

