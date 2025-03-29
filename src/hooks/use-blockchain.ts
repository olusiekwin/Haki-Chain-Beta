"use client"

import { useState, useEffect, useCallback } from "react"
import { blockchainService } from "../services/core/blockchain-service"
import { useAuth } from "./use-auth"
import { useConfig } from "./use-config"

/**
 * Unified blockchain hook that provides all blockchain functionality
 * This replaces use-web3.ts, use-mock-web3.ts, and other specialized hooks
 */
export function useBlockchain() {
  const [isConnected, setIsConnected] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { user } = useAuth()
  const { isBlockchainEnabled, useMockData } = useConfig()

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isBlockchainEnabled) return

    try {
      setIsLoading(true)
      setError(null)

      const result = await blockchainService.connectWallet()
      setAccountId(result.accountId)
      setIsConnected(true)

      // Get initial balance
      const balance = await blockchainService.getWalletBalance()
      setBalance(balance)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to connect wallet"))
      console.error("Wallet connection error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [isBlockchainEnabled])

  // Transfer tokens
  const transferTokens = useCallback(
    async (recipient: string, amount: number) => {
      if (!isConnected || !isBlockchainEnabled) return null

      try {
        setIsLoading(true)
        setError(null)

        const txId = await blockchainService.transferTokens(recipient, amount)

        // Update balance after transfer
        const newBalance = await blockchainService.getWalletBalance()
        setBalance(newBalance)

        return txId
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to transfer tokens"))
        console.error("Token transfer error:", err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, isBlockchainEnabled],
  )

  // Create escrow
  const createEscrow = useCallback(
    async (bountyId: string, amount: number) => {
      if (!isConnected || !isBlockchainEnabled) return null

      try {
        setIsLoading(true)
        setError(null)

        const txId = await blockchainService.createEscrow(bountyId, amount)

        // Update balance after escrow creation
        const newBalance = await blockchainService.getWalletBalance()
        setBalance(newBalance)

        return txId
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to create escrow"))
        console.error("Escrow creation error:", err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, isBlockchainEnabled],
  )

  // Release escrow
  const releaseEscrow = useCallback(
    async (escrowId: string) => {
      if (!isConnected || !isBlockchainEnabled) return null

      try {
        setIsLoading(true)
        setError(null)

        const txId = await blockchainService.releaseEscrow(escrowId)
        return txId
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to release escrow"))
        console.error("Escrow release error:", err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, isBlockchainEnabled],
  )

  // Create bounty
  const createBounty = useCallback(
    async (bountyData: any) => {
      if (!isConnected || !isBlockchainEnabled) return null

      try {
        setIsLoading(true)
        setError(null)

        const txId = await blockchainService.createBounty(bountyData)
        return txId
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to create bounty"))
        console.error("Bounty creation error:", err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, isBlockchainEnabled],
  )

  // Complete bounty
  const completeBounty = useCallback(
    async (bountyId: string) => {
      if (!isConnected || !isBlockchainEnabled) return null

      try {
        setIsLoading(true)
        setError(null)

        const txId = await blockchainService.completeBounty(bountyId)
        return txId
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to complete bounty"))
        console.error("Bounty completion error:", err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, isBlockchainEnabled],
  )

  // Automatically connect wallet if user is logged in
  useEffect(() => {
    if (user && isBlockchainEnabled && !isConnected && !isLoading) {
      connectWallet()
    }
  }, [user, isBlockchainEnabled, isConnected, isLoading, connectWallet])

  return {
    isConnected,
    accountId,
    balance,
    isLoading,
    error,
    connectWallet,
    transferTokens,
    createEscrow,
    releaseEscrow,
    createBounty,
    completeBounty,
  }
}

