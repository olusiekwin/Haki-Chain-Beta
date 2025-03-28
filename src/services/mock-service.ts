import { mockBounties, mockTokens, mockWalletInfo, mockTransactions, mockUser } from "../utils/mock-data"

// Mock service for testing without backend
export const MockService = {
  // Auth
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (email === "user@example.com" && password === "password") {
      localStorage.setItem("token", "mock-jwt-token")
      return {
        token: "mock-jwt-token",
        user: mockUser,
      }
    }

    throw new Error("Invalid credentials")
  },

  register: async (data: any) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    localStorage.setItem("token", "mock-jwt-token")
    return {
      token: "mock-jwt-token",
      user: {
        ...mockUser,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    }
  },

  getCurrentUser: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const token = localStorage.getItem("token")
    if (!token) return null

    return mockUser
  },

  // Bounties
  getAllBounties: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockBounties
  },

  getBountyById: async (id: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))
    const bounty = mockBounties.find((b) => b.id === id)

    if (!bounty) {
      throw new Error("Bounty not found")
    }

    return bounty
  },

  createBounty: async (data: any) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    return {
      id: Math.random().toString(36).substring(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: mockUser.walletAddress,
      status: "open",
    }
  },

  // Tokens
  getAllTokens: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockTokens
  },

  getTokenById: async (id: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))
    const token = mockTokens.find((t) => t.id === id)

    if (!token) {
      throw new Error("Token not found")
    }

    return token
  },

  // Wallet
  getWalletInfo: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockWalletInfo
  },

  getTransactions: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockTransactions
  },

  connectWallet: async (address: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    return {
      ...mockWalletInfo,
      address,
    }
  },
}

