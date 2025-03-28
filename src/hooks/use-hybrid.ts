"use client"

import { useState, useCallback } from "react"
import hybridService from "../services/hybrid-service"
import { useApp } from "../context/app-context"

export function useHybrid() {
  const { wallet, isAuthenticated } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Create a bounty in both systems
  const createBounty = useCallback(
    async (bountyData: any) => {
      if (!isAuthenticated) {
        throw new Error("User must be authenticated")
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await hybridService.createBounty(bountyData, wallet.address || "")
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to create bounty")
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, wallet.address],
  )

  // Link wallet to user account
  const linkWallet = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated")
    }

    if (!wallet.address) {
      throw new Error("Wallet must be connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await hybridService.linkWalletToAccount(wallet.address)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to link wallet")
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, wallet.address])

  // Complete a bounty in both systems
  const completeBounty = useCallback(
    async (bountyId: string) => {
      if (!isAuthenticated) {
        throw new Error("User must be authenticated")
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await hybridService.completeBounty(bountyId, wallet.address || "")
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to complete bounty")
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, wallet.address],
  )

  // Transfer tokens
  const transferTokens = useCallback(
    async (toAddress: string, amount: string) => {
      if (!isAuthenticated) {
        throw new Error("User must be authenticated")
      }

      if (!wallet.address) {
        throw new Error("Wallet must be connected")
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await hybridService.transferTokens(toAddress, amount, wallet.address)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to transfer tokens")
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, wallet.address],
  )

  // Sync blockchain data with Django
  const syncBlockchainData = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated")
    }

    if (!wallet.address) {
      throw new Error("Wallet must be connected")
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await hybridService.syncBlockchainData(wallet.address)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to sync blockchain data")
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, wallet.address])

  return {
    createBounty,
    linkWallet,
    completeBounty,
    transferTokens,
    syncBlockchainData,
    isLoading,
    error,
  }
}

