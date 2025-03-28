"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useApi } from "../hooks/use-api"
import { useBlockchain } from "../hooks/use-blockchain"
import { useFeatures } from "../hooks/use-features"

// Define the context type
interface AppContextType {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  wallet: {
    address: string | null
    isConnected: boolean
    connect: () => Promise<void>
    disconnect: () => void
  }
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { api, loading: apiLoading, error: apiError } = useApi()
  const { account, connected, connectWallet, disconnectWallet, loading: web3Loading } = useBlockchain()
  const { isBlockchainEnabled } = useFeatures()

  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await api.getCurrentUser()
        setUser(userData)
      } catch (err) {
        // Clear token if authentication fails
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [api])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { user } = await api.login(email, password)
      setUser(user)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed")
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (data: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const { user } = await api.register(data)
      setUser(user)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Registration failed")
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)

    // Also disconnect wallet if connected
    if (connected) {
      disconnectWallet()
    }
  }

  // Connect wallet
  const connectUserWallet = async () => {
    try {
      const { account } = await connectWallet()

      if (account && user) {
        // Update user's wallet address in backend
        await api.connectWallet(account)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to connect wallet")
      setError(error)
      throw error
    }
  }

  // Context value
  const value: AppContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || apiLoading || web3Loading,
    error: error || apiError,
    login,
    register,
    logout,
    wallet: {
      address: account,
      isConnected: connected,
      connect: connectUserWallet,
      disconnect: disconnectWallet,
    },
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }

  return context
}

