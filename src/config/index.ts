// Environment variables and configuration
const config = {
  // API URL from environment variable with fallback
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:5000",

  // Hedera network from environment variable with fallback to testnet
  hederaNetwork: process.env.HEDERA_NETWORK || "testnet",

  // Feature flags
  features: {
    // Enable/disable blockchain features
    blockchain: process.env.FEATURE_BLOCKCHAIN === "true",

    // Enable/disable AI assistant
    aiAssistant: process.env.FEATURE_AI_ASSISTANT === "true",
  },

  // Hedera settings
  hedera: {
    accountId: process.env.HEDERA_ACCOUNT_ID || "0.0.5785491",
    privateKey: process.env.HEDERA_PRIVATE_KEY || "0x62e7a0692acb84a12229640f812af0311718c63a3a90cbd3d015254c2c295998",
  },
}

export default config

