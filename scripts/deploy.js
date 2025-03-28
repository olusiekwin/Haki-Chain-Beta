const hre = require("hardhat")

async function main() {
  // Detect if we're deploying to Hedera or Ethereum
  const isHedera = hre.network.name.includes("hedera")

  console.log(`Deploying to ${hre.network.name}...`)

  // Get the contract factory
  const EscrowFactory = await hre.ethers.getContractFactory("HakiEscrow")

  // Deploy the contract
  const escrow = await EscrowFactory.deploy()
  await escrow.deployed()

  console.log(`Escrow contract deployed to: ${escrow.address}`)

  // If deploying to Hedera, we might need to do additional steps
  if (isHedera) {
    console.log("Performing Hedera-specific deployment steps...")
    // Any Hedera-specific steps would go here
  }

  // Verify the contract if not on a local network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...")
    await escrow.deployTransaction.wait(5)

    console.log("Verifying contract...")
    await hre.run("verify:verify", {
      address: escrow.address,
      constructorArguments: [],
    })
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

