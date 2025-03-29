/**
 * Application Configuration
 *
 * Central configuration for the entire application.
 * Environment variables are loaded and processed here.
 */

// Helper function to get environment variables with proper prefixing
const env = (key: string, defaultValue?: string): string => {
  // Try both VITE_ prefix and the original variable name (for compatibility)
  const value = import.meta.env[`VITE_${key}`] || import.meta.env[key] || defaultValue
  if (value === undefined) {
    console.warn(`Environment variable ${key} is not defined`)
    return ""
  }
  return value
}

// Feature flags
const features = {
  blockchain: env("FEATURE_BLOCKCHAIN", "true") === "true" || env("REACT_APP_FEATURE_BLOCKCHAIN", "true") === "true",
  ai: env("FEATURE_AI_ASSISTANT", "false") === "true" || env("REACT_APP_FEATURE_AI_ASSISTANT", "false") === "true",
}

// API configuration
const apiConfig = {
  url: env("API_URL", "http://localhost:8000/api") || env("REACT_APP_API_URL", "http://localhost:8000/api"),
  timeout: Number.parseInt(env("API_TIMEOUT", "30000") || env("REACT_APP_API_TIMEOUT", "30000")),
}

// Blockchain configuration
const blockchainConfig = {
  network: env("HEDERA_NETWORK", "testnet"),
  accountId: env("HEDERA_ACCOUNT_ID", ""),
  privateKey: env("HEDERA_PRIVATE_KEY", ""),
  contracts: {
    token: env("TOKEN_CONTRACT_ADDRESS", "") || env("REACT_APP_TOKEN_CONTRACT_ADDRESS", ""),
    bounty: env("BOUNTY_CONTRACT_ADDRESS", "") || env("REACT_APP_BOUNTY_CONTRACT_ADDRESS", ""),
    escrow: env("ESCROW_CONTRACT_ADDRESS", "") || env("REACT_APP_ESCROW_CONTRACT_ADDRESS", ""),
    reputation: env("REPUTATION_CONTRACT_ADDRESS", "") || env("REACT_APP_REPUTATION_CONTRACT_ADDRESS", ""),
    multisig: env("MULTISIG_CONTRACT_ADDRESS", "") || env("REACT_APP_MULTISIG_CONTRACT_ADDRESS", ""),
    marketplace: env("MARKETPLACE_CONTRACT_ADDRESS", "") || env("REACT_APP_MARKETPLACE_CONTRACT_ADDRESS", ""),
  },
}

// Application configuration
export const config = {
  appName: "Haki Platform",
  apiUrl: apiConfig.url,
  apiTimeout: apiConfig.timeout,
  features,
  blockchain: blockchainConfig,
  defaultPageSize: 10,
}

// Export individual constants for backward compatibility
export const API_URL = apiConfig.url
export const API_TIMEOUT = apiConfig.timeout

// Feature flags
export const FEATURE_BLOCKCHAIN = features.blockchain
export const FEATURE_AI_ASSISTANT = features.ai

// Contract addresses
export const TOKEN_CONTRACT_ADDRESS = blockchainConfig.contracts.token
export const BOUNTY_CONTRACT_ADDRESS = blockchainConfig.contracts.bounty
export const MARKETPLACE_CONTRACT_ADDRESS = blockchainConfig.contracts.marketplace
export const ESCROW_CONTRACT_ADDRESS = blockchainConfig.contracts.escrow
export const REPUTATION_CONTRACT_ADDRESS = blockchainConfig.contracts.reputation
export const MULTISIG_CONTRACT_ADDRESS = blockchainConfig.contracts.multisig

