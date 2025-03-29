const hre = require("hardhat")
const fs = require("fs")

async function main() {
  console.log("Deploying all Haki contracts...")

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners()
  console.log("Deploying with account:", deployer.address)

  // Deploy HakiToken
  console.log("\nDeploying HakiToken...")
  const HakiToken = await hre.ethers.getContractFactory("HakiToken")
  const token = await HakiToken.deploy(deployer.address)
  await token.deployed()
  console.log("HakiToken deployed to:", token.address)

  // Deploy HakiEscrow
  console.log("\nDeploying HakiEscrow...")
  const HakiEscrow = await hre.ethers.getContractFactory("HakiEscrow")
  const escrow = await HakiEscrow.deploy()
  await escrow.deployed()
  console.log("HakiEscrow deployed to:", escrow.address)

  // Deploy HakiBounty
  console.log("\nDeploying HakiBounty...")
  const HakiBounty = await hre.ethers.getContractFactory("HakiBounty")
  const bounty = await HakiBounty.deploy(deployer.address)
  await bounty.deployed()
  console.log("HakiBounty deployed to:", bounty.address)

  // Deploy HakiReputation
  console.log("\nDeploying HakiReputation...")
  const HakiReputation = await hre.ethers.getContractFactory("HakiReputation")
  const reputation = await HakiReputation.deploy(deployer.address)
  await reputation.deployed()
  console.log("HakiReputation deployed to:", reputation.address)

  // Deploy HakiMultiSig
  console.log("\nDeploying HakiMultiSig...")
  const HakiMultiSig = await hre.ethers.getContractFactory("HakiMultiSig")
  const multisig = await HakiMultiSig.deploy([deployer.address], 1)
  await multisig.deployed()
  console.log("HakiMultiSig deployed to:", multisig.address)

  // For Hedera, convert addresses to contract IDs
  let contractIds = {}
  if (hre.network.name.includes("hedera")) {
    console.log("\nConverting addresses to Hedera contract IDs...")

    // Convert Ethereum addresses to Hedera contract ID format
    // This is a simplified example - in a real app you'd use the Hedera SDK
    const convertToContractId = (address) => {
      const addressBytes = address.slice(2) // Remove 0x prefix
      const contractNum = Number.parseInt(addressBytes.slice(-8), 16) // Last 4 bytes as contract num
      return `0.0.${contractNum}`
    }

    contractIds = {
      token: convertToContractId(token.address),
      escrow: convertToContractId(escrow.address),
      bounty: convertToContractId(bounty.address),
      reputation: convertToContractId(reputation.address),
      multisig: convertToContractId(multisig.address),
    }

    console.log("Hedera Contract IDs:")
    console.log("HakiToken:", contractIds.token)
    console.log("HakiEscrow:", contractIds.escrow)
    console.log("HakiBounty:", contractIds.bounty)
    console.log("HakiReputation:", contractIds.reputation)
    console.log("HakiMultiSig:", contractIds.multisig)
  }

  // Save the contract addresses to a file
  const deploymentData = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      token: token.address,
      escrow: escrow.address,
      bounty: bounty.address,
      reputation: reputation.address,
      multisig: multisig.address,
    },
    contractIds: contractIds,
  }

  fs.writeFileSync("deployed-contracts.json", JSON.stringify(deploymentData, null, 2))
  console.log("\nDeployment data saved to deployed-contracts.json")

  // Generate .env file with contract addresses
  const envContent = `
# Hedera Configuration
HEDERA_NETWORK=${hre.network.name.includes("hedera") ? "testnet" : "local"}
HEDERA_ACCOUNT_ID=${process.env.HEDERA_ACCOUNT_ID || ""}

# Contract Addresses
REACT_APP_TOKEN_CONTRACT_ADDRESS=${token.address}
REACT_APP_ESCROW_CONTRACT_ADDRESS=${escrow.address}
REACT_APP_BOUNTY_CONTRACT_ADDRESS=${bounty.address}
REACT_APP_REPUTATION_CONTRACT_ADDRESS=${reputation.address}
REACT_APP_MULTISIG_CONTRACT_ADDRESS=${multisig.address}

# Feature Flags
REACT_APP_FEATURE_BLOCKCHAIN=true
REACT_APP_FEATURE_AI_ASSISTANT=false

# API Configuration
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_TIMEOUT=30000
`

  fs.writeFileSync(".env.local", envContent)
  console.log("Generated .env.local file with contract addresses")

  console.log("\nAll contracts deployed successfully!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error)
    process.exit(1)
  })

