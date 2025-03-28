"use client"

import { useState, useEffect, useCallback } from "react"
import { mockWalletInfo } from "../utils/mock-data"

// Mock Web3 hook for testing without actual blockchain connection
export const useMockWeb3 = () => {
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const connectWallet = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      setAccount(mockWalletInfo.address)
      setConnected(true)
      setLoading(false)

      return {
        web3: null, // Mock web3 instance
        account: mockWalletInfo.address,
        networkId: 1, // Mock Ethereum mainnet
        connected: true,
      }
    } catch (error) {
      setLoading(false)
      const err = error instanceof Error ? error : new Error("Unknown error occurred")
      setError(err)
      throw err
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setConnected(false)
  }, [])

  // Check if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      const wasConnected = localStorage.getItem("walletConnected") === "true"

      if (wasConnected) {
        try {
          await connectWallet()
        } catch (error) {
          console.error("Failed to reconnect wallet:", error)
        }
      }
    }

    checkConnection()
  }, [connectWallet])

  // Save connection state to localStorage
  useEffect(() => {
    if (connected) {
      localStorage.setItem("walletConnected", "true")
    } else {
      localStorage.removeItem("walletConnected")
    }
  }, [connected])

  return {
    web3: null, // Mock web3 instance
    account,
    networkId: connected ? 1 : null, // Mock Ethereum mainnet
    connected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
  }
}

