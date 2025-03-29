"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import apiService from "../services/api/apiService"

// Types
interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  wallet_address?: string
}

interface Wallet {
  isConnected: boolean
  address: string | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
}

interface AppContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  wallet: Wallet
  login: (token: string, userData: User) => void
  logout: () => void
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useLocalStorage<string | null>("hakichain-token", null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Wallet state
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState("0")

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await apiService.getProfile(token)
          if (response.success && response.data) {
            setUser(response.data)
          } else {
            // Token is invalid or expired
            setToken(null)
            setUser(null)
          }
        } catch (error) {
          console.error("Auth check error:", error)
          setToken(null)
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [token, setToken])

  // Connect wallet function
  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockAddress =
        "0x" +
        Array.from(Array(40))
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")
      setWalletAddress(mockAddress)
      setWalletConnected(true)
      setWalletBalance("1000")

      // In a real implementation, this would connect to MetaMask or similar
      console.log("Wallet connected:", mockAddress)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  // Disconnect wallet function
  const disconnectWallet = () => {
    setWalletAddress(null)
    setWalletConnected(false)
    setWalletBalance("0")
  }

  // Login function
  const login = (newToken: string, userData: User) => {
    setToken(newToken)
    setUser(userData)
  }

  // Logout function
  const logout = () => {
    setToken(null)
    setUser(null)
    disconnectWallet()
  }

  const value = {
    isAuthenticated: !!token,
    isLoading,
    user,
    wallet: {
      isConnected: walletConnected,
      address: walletAddress,
      balance: walletBalance,
      connect: connectWallet,
      disconnect: disconnectWallet,
    },
    login,
    logout,
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

