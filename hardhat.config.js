require("@nomicfoundation/hardhat-toolbox")
require("@hashgraph/hardhat-hedera")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // Standard Ethereum networks
    hardhat: {
      // Local development network
    },
    // Hedera networks
    hederaTestnet: {
      chainId: 296,
      url: "https://testnet.hashio.io/api",
      accounts: [process.env.HEDERA_PRIVATE_KEY],
      // Hedera-specific configuration
      hedera: {
        accountId: process.env.HEDERA_ACCOUNT_ID,
        privateKey: process.env.HEDERA_PRIVATE_KEY,
      },
    },
    hederaMainnet: {
      chainId: 295,
      url: "https://mainnet.hashio.io/api",
      accounts: [process.env.HEDERA_PRIVATE_KEY],
      // Hedera-specific configuration
      hedera: {
        accountId: process.env.HEDERA_ACCOUNT_ID,
        privateKey: process.env.HEDERA_PRIVATE_KEY,
      },
    },
  },
  // Paths for your contracts and artifacts
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}

