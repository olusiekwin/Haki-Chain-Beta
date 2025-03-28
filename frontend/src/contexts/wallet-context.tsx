"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { connectWallet, getAccountInfo } from "../utils/hedera-utils"
import { authService } from "../services/api-service"

interface WalletContextType {
  isConnected: boolean
  accountId: string | null
  pairingString: string | null
  topic: string | null
  isConnecting: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  accountId: null,
  pairingString: null,
  topic: null,
  isConnecting: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
})

export const useWallet = () => useContext(WalletContext)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [pairingString, setPairingString] = useState<string | null>(null)
  const [topic, setTopic] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for existing connection on mount
  useEffect(() => {
    const savedTopic = localStorage.getItem("wallet_topic")
    const savedAccountId = localStorage.getItem("wallet_account_id")

    if (savedTopic && savedAccountId) {
      setTopic(savedTopic)
      setAccountId(savedAccountId)
      setIsConnected(true)
    }
  }, [])

  const connect = async () => {
    try {
      setIsConnecting(true)
      setError(null)

      // Connect to wallet
      const { pairingString: newPairingString, topic: newTopic } = await connectWallet()

      setPairingString(newPairingString)
      setTopic(newTopic)

      // Wait for user to approve connection in their wallet
      // In a real app, you'd listen for the paired event
      // For now, we'll just set a timeout to simulate the process
      setTimeout(async () => {
        try {
          if (newTopic) {
            const { accountId: newAccountId } = await getAccountInfo(newTopic)

            // Save connection info
            setAccountId(newAccountId)
            setIsConnected(true)
            localStorage.setItem("wallet_topic", newTopic)
            localStorage.setItem("wallet_account_id", newAccountId)

            // Update backend with wallet address
            await authService.connectWallet(newAccountId)
          }
        } catch (err) {
          console.error("Error getting account info:", err)
          setError("Failed to get account info")
        } finally {
          setIsConnecting(false)
        }
      }, 3000)
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError("Failed to connect wallet")
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAccountId(null)
    setPairingString(null)
    setTopic(null)
    localStorage.removeItem("wallet_topic")
    localStorage.removeItem("wallet_account_id")
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        accountId,
        pairingString,
        topic,
        isConnecting,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

