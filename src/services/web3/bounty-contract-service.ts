import { getContract } from "../../utils/web3-provider"
import { bountyContract } from "../../contracts/contract-config"

export interface BountyData {
  id: string
  title: string
  description: string
  reward: string
  creator: string
  hunter: string
  status: number // 0: Open, 1: In Progress, 2: Completed, 3: Cancelled
  createdAt: number
}

const BountyContractService = {
  getContract: () => {
    return getContract(bountyContract)
  },

  createBounty: async (from: string, title: string, description: string, reward: string): Promise<string> => {
    const contract = getContract(bountyContract)
    const tx = await contract.methods.createBounty(title, description, reward).send({ from })
    return tx.transactionHash
  },

  getBounty: async (bountyId: string): Promise<BountyData> => {
    const contract = getContract(bountyContract)
    const bounty = await contract.methods.getBounty(bountyId).call()
    return bounty
  },

  getAllBounties: async (): Promise<BountyData[]> => {
    const contract = getContract(bountyContract)
    const count = await contract.methods.getBountyCount().call()

    const bounties = []
    for (let i = 0; i < count; i++) {
      const bountyId = await contract.methods.bountyIds(i).call()
      const bounty = await contract.methods.getBounty(bountyId).call()
      bounties.push(bounty)
    }

    return bounties
  },

  acceptBounty: async (from: string, bountyId: string): Promise<string> => {
    const contract = getContract(bountyContract)
    const tx = await contract.methods.acceptBounty(bountyId).send({ from })
    return tx.transactionHash
  },

  completeBounty: async (from: string, bountyId: string): Promise<string> => {
    const contract = getContract(bountyContract)
    const tx = await contract.methods.completeBounty(bountyId).send({ from })
    return tx.transactionHash
  },

  cancelBounty: async (from: string, bountyId: string): Promise<string> => {
    const contract = getContract(bountyContract)
    const tx = await contract.methods.cancelBounty(bountyId).send({ from })
    return tx.transactionHash
  },
}

export default BountyContractService

