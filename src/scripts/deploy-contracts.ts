import {
  Client,
  AccountId,
  PrivateKey,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  Hbar,
} from "@hashgraph/sdk"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

/**
 * Deploy all Haki contracts to Hedera
 *
 * This script deploys all required contracts for the Haki platform:
 * - HakiToken
 * - HakiEscrow
 * - HakiBounty
 * - HakiReputation
 * - HakiMultiSig
 */
async function deployContracts() {
  // Validate environment variables
  const myAccountId = process.env.HEDERA_ACCOUNT_ID
  const myPrivateKey = process.env.HEDERA_PRIVATE_KEY

  if (!myAccountId || !myPrivateKey) {
    throw new Error("Environment variables HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be present")
  }

  // Create Hedera client
  const client = Client.forTestnet()
  client.setOperator(AccountId.fromString(myAccountId), PrivateKey.fromString(myPrivateKey))

  console.log("Deploying contracts to Hedera Testnet...")

  // Deploy HakiToken
  const tokenAddress = await deployContract(client, "HakiToken", "contracts/HakiToken.json", [])
  console.log("HakiToken deployed at:", tokenAddress)

  // Deploy HakiEscrow (depends on HakiToken)
  const escrowAddress = await deployContract(client, "HakiEscrow", "contracts/HakiEscrow.json", [tokenAddress])
  console.log("HakiEscrow deployed at:", escrowAddress)

  // Deploy HakiBounty (depends on HakiEscrow)
  const bountyAddress = await deployContract(client, "HakiBounty", "contracts/HakiBounty.json", [escrowAddress])
  console.log("HakiBounty deployed at:", bountyAddress)

  // Deploy HakiReputation
  const reputationAddress = await deployContract(client, "HakiReputation", "contracts/HakiReputation.json", [])
  console.log("HakiReputation deployed at:", reputationAddress)

  // Deploy HakiMultiSig
  const multiSigAddress = await deployContract(
    client,
    "HakiMultiSig",
    "contracts/HakiMultiSig.json",
    [[myAccountId]], // Initial owners
  )
  console.log("HakiMultiSig deployed at:", multiSigAddress)

  // Generate .env file with contract addresses
  generateEnvFile({
    tokenAddress,
    escrowAddress,
    bountyAddress,
    reputationAddress,
    multiSigAddress,
  })

  console.log("All contracts deployed successfully!")
}

/**
 * Deploy a single contract
 */
async function deployContract(
  client: Client,
  name: string,
  artifactPath: string,
  constructorParams: any[] = [],
): Promise<string> {
  console.log(`Deploying ${name}...`)

  // Read contract bytecode
  const artifact = JSON.parse(fs.readFileSync(path.resolve(artifactPath), "utf8"))
  const bytecode = artifact.bytecode

  // Create file on Hedera
  const fileCreateTx = new FileCreateTransaction()
    .setKeys([PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!)])
    .setContents(bytecode)
    .setMaxTransactionFee(new Hbar(2))

  const fileSubmit = await fileCreateTx.execute(client)
  const fileReceipt = await fileSubmit.getReceipt(client)
  const fileId = fileReceipt.fileId

  console.log(`- ${name} bytecode file created with ID: ${fileId}`)

  // Create contract
  const contractCreateTx = new ContractCreateTransaction()
    .setGas(1000000)
    .setBytecodeFileId(fileId)
    .setConstructorParameters(createConstructorParams(constructorParams))

  const contractSubmit = await contractCreateTx.execute(client)
  const contractReceipt = await contractSubmit.getReceipt(client)
  const contractId = contractReceipt.contractId

  console.log(`- ${name} contract created with ID: ${contractId}`)

  return contractId!.toString()
}

/**
 * Create constructor parameters for contract deployment
 */
function createConstructorParams(params: any[]): ContractFunctionParameters {
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

/**
 * Generate .env file with contract addresses
 */
function generateEnvFile(addresses: {
  tokenAddress: string
  escrowAddress: string
  bountyAddress: string
  reputationAddress: string
  multiSigAddress: string
}): void {
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

  fs.writeFileSync(".env.local", envContent)
  console.log("Generated .env.local file with contract addresses")
}

// Execute deployment
deployContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error)
    process.exit(1)
  })

