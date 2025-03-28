// Environment variables and configuration
const config = {
  // API URL from environment variable with fallback
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:8000/api",

  // Hedera network from environment variable with fallback to testnet
  hederaNetwork: process.env.HEDERA_NETWORK || "testnet",

  // Feature flags
  features: {
    // Enable/disable blockchain features
    blockchain: process.env.FEATURE_BLOCKCHAIN === "true",

    // Enable/disable AI assistant
    aiAssistant: process.env.FEATURE_AI_ASSISTANT === "true",
  },

  // Application settings
  settings: {
    // Default pagination limit
    defaultPageSize: 10,

    // Maximum file upload size in MB
    maxUploadSize: 10,
  },

  // Hedera settings
  hedera: {
    accountId: process.env.HEDERA_ACCOUNT_ID,
    privateKey: process.env.HEDERA_PRIVATE_KEY,
  },
}

export default config

