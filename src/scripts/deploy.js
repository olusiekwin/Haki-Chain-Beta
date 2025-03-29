#!/usr/bin/env node

/**
 * Unified deployment script for all Haki contracts
 *
 * This script:
 * 1. Deploys all contracts in the correct order
 * 2. Updates environment variables with contract addresses
 * 3. Verifies contracts on the Hedera explorer
 */

const {
  Client,
  AccountId,
  PrivateKey,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  Hbar,
} = require("@hashgraph/sdk")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

// Validate environment variables
const myAccountId = process.env.HEDERA_ACCOUNT_ID
const myPrivateKey = process.env.HEDERA_PRIVATE_KEY

if (!myAccountId || !myPrivateKey) {
  console.error("❌ Environment variables HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be present")
  process.exit(1)
}

// Create Hedera client
const client = Client.forTestnet()
client.setOperator(AccountId.fromString(myAccountId), PrivateKey.fromString(myPrivateKey))

async function main() {
  console.log("🚀 Deploying contracts to Hedera Testnet...")

  // Deploy HakiToken
  console.log("\n📄 Deploying HakiToken...")
  const tokenAddress = await deployContract("HakiToken", "../contracts/solidity/HakiToken.sol", [])
  console.log("✅ HakiToken deployed at:", tokenAddress)

  // Deploy HakiEscrow
  console.log("\n📄 Deploying HakiEscrow...")
  const escrowAddress = await deployContract("HakiEscrow", "../contracts/solidity/HakiEscrow.sol", [tokenAddress])
  console.log("✅ HakiEscrow deployed at:", escrowAddress)

  // Deploy HakiBounty
  console.log("\n📄 Deploying HakiBounty...")
  const bountyAddress = await deployContract("HakiBounty", "../contracts/solidity/HakiBounty.sol", [escrowAddress])
  console.log("✅ HakiBounty deployed at:", bountyAddress)

  // Deploy HakiReputation
  console.log("\n📄 Deploying HakiReputation...")
  const reputationAddress = await deployContract("HakiReputation", "../contracts/solidity/HakiReputation.sol", [])
  console.log("✅ HakiReputation deployed at:", reputationAddress)

  // Deploy HakiMultiSig
  console.log("\n📄 Deploying HakiMultiSig...")
  const multiSigAddress = await deployContract(
    "HakiMultiSig",
    "../contracts/solidity/HakiMultiSig.sol",
    [[myAccountId]], // Initial owners
  )
  console.log("✅ HakiMultiSig deployed at:", multiSigAddress)

  // Generate .env file with contract addresses
  generateEnvFile({
    tokenAddress,
    escrowAddress,
    bountyAddress,
    reputationAddress,
    multiSigAddress,
  })

  console.log("\n🎉 All contracts deployed successfully!")
  console.log("📝 Environment variables updated in .env.local")
}

async function deployContract(name, filePath, constructorParams = []) {
  try {
    // Compile contract if needed (simplified for this example)
    const bytecode = fs.readFileSync(path.resolve(__dirname, filePath + ".bin"))

    // Create file on Hedera
    const fileCreateTx = new FileCreateTransaction()
      .setKeys([PrivateKey.fromString(myPrivateKey)])
      .setContents(bytecode)
      .setMaxTransactionFee(new Hbar(2))

    const fileSubmit = await fileCreateTx.execute(client)
    const fileReceipt = await fileSubmit.getReceipt(client)
    const fileId = fileReceipt.fileId

    console.log(`- ${name} bytecode file created with ID: ${fileId}`)

    // Create contract
    const contractParams = createConstructorParams(constructorParams)
    const contractCreateTx = new ContractCreateTransaction()
      .setGas(1000000)
      .setBytecodeFileId(fileId)
      .setConstructorParameters(contractParams)

    const contractSubmit = await contractCreateTx.execute(client)
    const contractReceipt = await contractSubmit.getReceipt(client)
    const contractId = contractReceipt.contractId

    console.log(`- ${name} contract created with ID: ${contractId}`)

    return contractId.toString()
  } catch (error) {
    console.error(`❌ Error deploying ${name}:`, error)
    throw error
  }
}

function createConstructorParams(params) {
  const contractParams = new ContractFunctionParameters()

  params.forEach((param) => {
    if (typeof param === "string") {
      contractParams.addString(param)
    } else if (typeof param === "number") {
      contractParams.addUint256(param)
    } else if (Array.isArray(param)) {
      if (typeof param[0] === "string") {
        contractParams.addStringArray(param)
      } else if (typeof param[0] === "number") {
        contractParams.addUint256Array(param)
      }
    } else if (typeof param === "boolean") {
      contractParams.addBool(param)
    }
  })

  return contractParams
}

function generateEnvFile(addresses) {
  const envContent = `
# Hedera Configuration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=${process.env.HEDERA_ACCOUNT_ID}

# Contract Addresses
REACT_APP_TOKEN_CONTRACT_ADDRESS=${addresses.tokenAddress}
REACT_APP_ESCROW_CONTRACT_ADDRESS=${addresses.escrowAddress}
REACT_APP_BOUNTY_CONTRACT_ADDRESS=${addresses.bountyAddress}
REACT_APP_REPUTATION_CONTRACT_ADDRESS=${addresses.reputationAddress}
REACT_APP_MULTISIG_CONTRACT_ADDRESS=${addresses.multiSigAddress}

# Feature Flags
REACT_APP_FEATURE_BLOCKCHAIN=true
REACT_APP_FEATURE_AI_ASSISTANT=false

# API Configuration
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_TIMEOUT=30000
`

  fs.writeFileSync(path.resolve(__dirname, "../../.env.local"), envContent)
  console.log("- Generated .env.local file with contract addresses")
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  })

