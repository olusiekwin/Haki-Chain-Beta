// Configuration for HakiChain application
export const config = {
  // App information
  appName: "HakiChain",

  // API configuration
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:8000/api",

  // Feature flags
  features: {
    blockchain: process.env.FEATURE_BLOCKCHAIN === "true" || false,
    aiAssistant: process.env.FEATURE_AI_ASSISTANT === "true" || false,
  },

  // Contract addresses
  contracts: {
    token: process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || "",
    bounty: process.env.REACT_APP_BOUNTY_CONTRACT_ADDRESS || "",
    marketplace: process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS || "",
  },

  // Blockchain configuration
  blockchain: {
    networkId: process.env.HEDERA_NETWORK || "testnet",
    accountId: process.env.HEDERA_ACCOUNT_ID || "",
  },
}

