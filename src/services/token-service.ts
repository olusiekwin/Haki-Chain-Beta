import api from "../utils/api"

export interface Token {
  id: string
  symbol: string
  name: string
  price: string
  change24h: string
  volume24h: string
  marketCap: string
  logoUrl: string
}

export interface TokenTransaction {
  id: string
  tokenId: string
  amount: string
  price: string
  type: "buy" | "sell"
  status: "pending" | "completed" | "failed"
  timestamp: string
}

const TokenService = {
  getAllTokens: async (): Promise<Token[]> => {
    const response = await api.get<Token[]>("/tokens")
    return response.data
  },

  getTokenById: async (id: string): Promise<Token> => {
    const response = await api.get<Token>(`/tokens/${id}`)
    return response.data
  },

  buyToken: async (tokenId: string, amount: string): Promise<TokenTransaction> => {
    const response = await api.post<TokenTransaction>("/tokens/buy", { tokenId, amount })
    return response.data
  },

  sellToken: async (tokenId: string, amount: string): Promise<TokenTransaction> => {
    const response = await api.post<TokenTransaction>("/tokens/sell", { tokenId, amount })
    return response.data
  },

  getTransactionHistory: async (): Promise<TokenTransaction[]> => {
    const response = await api.get<TokenTransaction[]>("/tokens/transactions")
    return response.data
  },
}

export default TokenService

