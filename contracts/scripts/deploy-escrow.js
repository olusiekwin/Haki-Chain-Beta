const hre = require("hardhat")

async function main() {
  console.log("Deploying HakiEscrow contract...")

  // Deploy the contract
  const HakiEscrow = await hre.ethers.getContractFactory("HakiEscrow")
  const escrow = await HakiEscrow.deploy()

  await escrow.deployed()

  console.log("HakiEscrow deployed to:", escrow.address)

  // For Hedera, we need to store the contract ID in a different format
  if (hre.network.name.includes("hedera")) {
    // Convert Ethereum address to Hedera contract ID format
    // This is a simplified example - in a real app you'd use the Hedera SDK
    const addressBytes = escrow.address.slice(2) // Remove 0x prefix
    const contractNum = Number.parseInt(addressBytes.slice(-8), 16) // Last 4 bytes as contract num
    const contractId = `0.0.${contractNum}`

    console.log("Hedera Contract ID:", contractId)

    // Save the contract address and ID to a file for future reference
    const fs = require("fs")
    fs.writeFileSync(
      "deployed-escrow.json",
      JSON.stringify(
        {
          address: escrow.address,
          contractId: contractId,
          network: hre.network.name,
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      ),
    )
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

