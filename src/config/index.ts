/**
 * Application Configuration
 *
 * Central configuration for the entire application.
 * Environment variables are loaded and processed here.
 */

// Load environment variables
const env = (key: string, defaultValue?: string): string => {
  const value = process.env[`REACT_APP_${key}`] || defaultValue
  if (value === undefined) {
    console.warn(`Environment variable ${key} is not defined`)
    return ""
  }
  return value
}

// Feature flags
const features = {
  blockchain: env("FEATURE_BLOCKCHAIN", "true") === "true",
  ai: env("FEATURE_AI_ASSISTANT", "false") === "true",
}

// API configuration
const apiConfig = {
  url: env("API_URL", "http://localhost:8000/api"),
  timeout: Number.parseInt(env("API_TIMEOUT", "30000")),
}

// Blockchain configuration
const blockchainConfig = {
  network: process.env.HEDERA_NETWORK || "testnet",
  accountId: process.env.HEDERA_ACCOUNT_ID || "",
  contracts: {
    token: process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || "",
    bounty: process.env.REACT_APP_BOUNTY_CONTRACT_ADDRESS || "",
    escrow: process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS || "",
    reputation: process.env.REACT_APP_REPUTATION_CONTRACT_ADDRESS || "",
    multisig: process.env.REACT_APP_MULTISIG_CONTRACT_ADDRESS || "",
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

