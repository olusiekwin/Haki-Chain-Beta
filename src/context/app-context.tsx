"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import api from "../utils/api"
import web3Provider from "../utils/web3-provider"
import { config } from "../utils/config"

// Define types
interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  wallet_address: string | null
  profile_image: string | null
  is_verified: boolean
  created_at: string
}

interface Wallet {
  address: string | null
  balance: string
  isConnected: boolean
  connect: () => Promise<boolean>
  disconnect: () => void
}

interface AppContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  wallet: Wallet
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  error: string | null
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Wallet state
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState<string>("0")
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)

  // Initialize app state
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true)

      // Check for stored token
      const token = localStorage.getItem("token")
      if (token) {
        try {
          // Validate token and get user data
          const response = await api.get("/users/me/")
          setUser(response.data)
          setIsAuthenticated(true)

          // Initialize wallet if blockchain is enabled
          if (config.features.blockchain) {
            await initializeWallet()
          }
        } catch (error) {
          console.error("Error validating token:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setIsAuthenticated(false)
        }
      }

      setIsLoading(false)
    }

    initializeApp()
  }, [])

  // Initialize wallet
  const initializeWallet = async () => {
    if (config.features.blockchain) {
      const initialized = await web3Provider.initialize()
      if (initialized) {
        const address = await web3Provider.getAddress()
        setWalletAddress(address)
        setIsWalletConnected(!!address)

        // Get wallet balance (simplified)
        setWalletBalance("0")
      }
    }
  }

  // Connect wallet
  const connectWallet = async (): Promise<boolean> => {
    try {
      const initialized = await web3Provider.initialize()
      if (initialized) {
        const address = await web3Provider.getAddress()
        setWalletAddress(address)
        setIsWalletConnected(!!address)
        return true
      }
      return false
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError("Failed to connect wallet. Please try again.")
      return false
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    web3Provider.disconnect()
    setWalletAddress(null)
    setWalletBalance("0")
    setIsWalletConnected(false)
  }

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post("/auth/login/", { email, password })
      const { token, user } = response.data

      // Store token and user data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // Update state
      setUser(user)
      setIsAuthenticated(true)

      // Initialize wallet if blockchain is enabled
      if (config.features.blockchain) {
        await initializeWallet()
      }

      setIsLoading(false)
      return true
    } catch (error: any) {
      setIsLoading(false)
      setError(error.response?.data?.message || "Login failed. Please check your credentials.")
      return false
    }
  }

  // Register function
  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      await api.post("/auth/register/", userData)
      setIsLoading(false)
      return true
    } catch (error: any) {
      setIsLoading(false)
      setError(error.response?.data?.message || "Registration failed. Please try again.")
      return false
    }
  }

  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Disconnect wallet
    disconnectWallet()

    // Update state
    setUser(null)
    setIsAuthenticated(false)
  }

  // Create wallet object
  const wallet: Wallet = {
    address: walletAddress,
    balance: walletBalance,
    isConnected: isWalletConnected,
    connect: connectWallet,
    disconnect: disconnectWallet,
  }

  // Context value
  const contextValue: AppContextType = {
    isAuthenticated,
    isLoading,
    user,
    wallet,
    login,
    register,
    logout,
    error,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

// Custom hook to use the app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
  throw new Error("useApp must be used within an AppProvider")
  return context
}

