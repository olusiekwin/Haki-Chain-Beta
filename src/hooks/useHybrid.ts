"use client"

import { useState } from "react"
import { useFeatures } from "./useFeatures"
import apiService from "../services/api/apiService"
import tokenContractService from "../services/web3/tokenContractService"
import bountyContractService from "../services/web3/bountyContractService"
import marketplaceContractService from "../services/web3/marketplaceContractService"

export function useHybrid() {
  const { isBlockchainEnabled } = useFeatures()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to create a bounty using the hybrid approach
  const createBounty = async (token: string, bountyData: { title: string; description: string; reward: string }) => {
    setIsProcessing(true)
    setError(null)

    try {
      // First, create the bounty in the database
      const response = await apiService.createBounty(token, bountyData)

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create bounty in database")
      }

      // If blockchain is enabled, also create it on-chain
      if (isBlockchainEnabled) {
        try {
          const blockchainId = await bountyContractService.createBounty(
            bountyData.title,
            bountyData.description,
            bountyData.reward,
          )

          // Sync the blockchain ID with the database
          await apiService.syncBounty(token, response.data.id, blockchainId)

          return {
            success: true,
            data: {
              ...response.data,
              blockchain_id: blockchainId,
            },
          }
        } catch (blockchainError: any) {
          console.error("Blockchain error:", blockchainError)
          // Even if blockchain fails, we still have the database record
          return {
            success: true,
            data: response.data,
            warning: "Bounty created in database but blockchain transaction failed",
          }
        }
      }

      return response
    } catch (error: any) {
      console.error("Error creating bounty:", error)
      setError(error.message || "An error occurred while creating the bounty")
      return {
        success: false,
        error: error.message || "An error occurred while creating the bounty",
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to create a marketplace item using the hybrid approach
  const createMarketplaceItem = async (
    token: string,
    itemData: { title: string; description: string; price: string; file: File },
  ) => {
    setIsProcessing(true)
    setError(null)

    try {
      // First, create the item in the database
      const response = await apiService.createMarketplaceItem(token, itemData)

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create marketplace item in database")
      }

      // If blockchain is enabled, also create it on-chain
      if (isBlockchainEnabled) {
        try {
          const blockchainId = await marketplaceContractService.createItem(
            itemData.title,
            itemData.description,
            itemData.price,
          )

          // Sync the blockchain ID with the database
          await apiService.syncMarketplaceItem(token, response.data.id, blockchainId)

          return {
            success: true,
            data: {
              ...response.data,
              blockchain_id: blockchainId,
            },
          }
        } catch (blockchainError: any) {
          console.error("Blockchain error:", blockchainError)
          // Even if blockchain fails, we still have the database record
          return {
            success: true,
            data: response.data,
            warning: "Item created in database but blockchain transaction failed",
          }
        }
      }

      return response
    } catch (error: any) {
      console.error("Error creating marketplace item:", error)
      setError(error.message || "An error occurred while creating the marketplace item")
      return {
        success: false,
        error: error.message || "An error occurred while creating the marketplace item",
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to transfer tokens using the hybrid approach
  const transferTokens = async (token: string, recipientAddress: string, amount: string) => {
    setIsProcessing(true)
    setError(null)

    try {
      if (!isBlockchainEnabled) {
        throw new Error("Blockchain features are disabled")
      }

      // Get the user's profile to get their wallet address
      const profileResponse = await apiService.getProfile(token)

      if (!profileResponse.success || !profileResponse.data) {
        throw new Error(profileResponse.error || "Failed to get user profile")
      }

      const senderAddress = profileResponse.data.wallet_address

      if (!senderAddress) {
        throw new Error("User does not have a wallet address")
      }

      // Perform the token transfer on the blockchain
      const txHash = await tokenContractService.transfer(senderAddress, recipientAddress, amount)

      return {
        success: true,
        data: {
          transaction_hash: txHash,
          from: senderAddress,
          to: recipientAddress,
          amount,
        },
      }
    } catch (error: any) {
      console.error("Error transferring tokens:", error)
      setError(error.message || "An error occurred while transferring tokens")
      return {
        success: false,
        error: error.message || "An error occurred while transferring tokens",
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    createBounty,
    createMarketplaceItem,
    transferTokens,
    isProcessing,
    error,
  }
}

