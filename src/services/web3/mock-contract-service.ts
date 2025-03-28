import { mockBounties, mockTokens, mockWalletInfo } from "../../utils/mock-data"

// Mock contract service for testing without actual blockchain
export const MockContractService = {
  // Token contract
  getTokenInfo: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      symbol: "HAKI",
      name: "Haki Token",
      totalSupply: "10000000",
      decimals: 18,
    }
  },

  getTokenBalance: async (address: string) => {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const token = mockWalletInfo.tokens.find((t) => t.symbol === "HAKI")
    return token ? token.balance : "0"
  },

  transferToken: async (from: string, to: string, amount: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return "0x" + Math.random().toString(16).substring(2, 66)
  },

  // Bounty contract
  createBounty: async (from: string, title: string, description: string, reward: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    return "0x" + Math.random().toString(16).substring(2, 66)
  },

  getBounty: async (bountyId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const bounty = mockBounties.find((b) => b.id === bountyId)

    if (!bounty) {
      throw new Error("Bounty not found")
    }

    return {
      id: bounty.id,
      title: bounty.title,
      description: bounty.description,
      reward: bounty.reward.toString(),
      creator: mockWalletInfo.address,
      hunter: "0x0000000000000000000000000000000000000000",
      status: bounty.status === "open" ? 0 : bounty.status === "in_progress" ? 1 : 2,
      createdAt: new Date(bounty.createdAt).getTime() / 1000,
    }
  },

  getAllBounties: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockBounties.map((bounty) => ({
      id: bounty.id,
      title: bounty.title,
      description: bounty.description,
      reward: bounty.reward.toString(),
      creator: mockWalletInfo.address,
      hunter: "0x0000000000000000000000000000000000000000",
      status: bounty.status === "open" ? 0 : bounty.status === "in_progress" ? 1 : 2,
      createdAt: new Date(bounty.createdAt).getTime() / 1000,
    }))
  },

  // Marketplace contract
  createListing: async (from: string, tokenId: string, amount: string, price: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    return "0x" + Math.random().toString(16).substring(2, 66)
  },

  buyToken: async (from: string, listingId: string, value: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return "0x" + Math.random().toString(16).substring(2, 66)
  },

  getAllListings: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockTokens.map((token, index) => ({
      id: (index + 1).toString(),
      seller: "0x" + Math.random().toString(16).substring(2, 42),
      tokenId: token.id,
      amount: (Math.floor(Math.random() * 1000) + 100).toString(),
      price: token.price,
      status: 0, // Active
    }))
  },
}

