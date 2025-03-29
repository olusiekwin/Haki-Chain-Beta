"use client"

import { useState, useCallback } from "react"
import { useApp } from "../context/app-context"
import hybridService from "../services/hybrid-service"

export const useHybrid = () => {
  const { token } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Link wallet to user account
  const linkWallet = useCallback(async () => {
    if (!token) {
      throw new Error("You must be logged in to link your wallet")
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await hybridService.linkWallet(token)

      if (!result.success) {
        throw new Error(result.error || "Failed to link wallet")
      }

      return true
    } catch (err: any) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Create a bounty (both on-chain and off-chain)
  const createBounty = useCallback(
    async (bountyData: { title: string; description: string; reward: string }) => {
      if (!token) {
        throw new Error("You must be logged in to create a bounty")
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await hybridService.createBounty(token, bountyData)

        if (!result.success) {
          throw new Error(result.error || "Failed to create bounty")
        }

        return { bountyId: result.bountyId, txHash: result.txHash }
      } catch (err: any) {
        setError(err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [token],
  )

  // Create a marketplace listing (both on-chain and off-chain)
  const createMarketplaceListing = useCallback(
    async (itemData: { title: string; description: string; price: string; file: File }) => {
      if (!token) {
        throw new Error("You must be logged in to create a marketplace listing")
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await hybridService.createMarketplaceListing(token, itemData)

        if (!result.success) {
          throw new Error(result.error || "Failed to create marketplace listing")
        }

        return { itemId: result.itemId, txHash: result.txHash }
      } catch (err: any) {
        setError(err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [token],
  )

  // Get token balance for current user
  const getTokenBalance = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await hybridService.getTokenBalance()

      if (!result.success) {
        throw new Error(result.error || "Failed to get token balance")
      }

      return result.balance
    } catch (err: any) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check if blockchain features are enabled
  const isBlockchainEnabled = useCallback(() => {
    return hybridService.isBlockchainEnabled()
  }, [])

  // Check if AI assistant features are enabled
  const isAiAssistantEnabled = useCallback(() => {
    return hybridService.isAiAssistantEnabled()
  }, [])

  return {
    linkWallet,
    createBounty,
    createMarketplaceListing,
    getTokenBalance,
    isBlockchainEnabled,
    isAiAssistantEnabled,
    isLoading,
    error,
  }
}

