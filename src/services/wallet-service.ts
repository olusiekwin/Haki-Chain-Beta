import api from "../utils/api"

export interface WalletInfo {
  address: string
  balance: string
  tokens: {
    symbol: string
    balance: string
  }[]
}

export interface Transaction {
  id: string
  from: string
  to: string
  amount: string
  timestamp: string
  status: "pending" | "completed" | "failed"
  type: "send" | "receive"
}

const WalletService = {
  getWalletInfo: async (): Promise<WalletInfo> => {
    const response = await api.get<WalletInfo>("/wallet")
    return response.data
  },

  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>("/wallet/transactions")
    return response.data
  },

  connectWallet: async (address: string): Promise<WalletInfo> => {
    const response = await api.post<WalletInfo>("/wallet/connect", { address })
    return response.data
  },

  disconnectWallet: async (): Promise<void> => {
    await api.post("/wallet/disconnect")
  },
}

export default WalletService

