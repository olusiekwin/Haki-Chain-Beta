"use client"

import { useState, useCallback } from "react"
import { apiService } from "../services/core/api-service"
import { useAuth } from "./use-auth"

/**
 * Generic hook for making API requests with loading and error states
 */
export function useApi<T = any, P = any>(
  requestFn: (params: P) => Promise<T>,
  options: {
    requiresAuth?: boolean
    initialData?: T
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  } = {},
) {
  const { requiresAuth = true, initialData = null, onSuccess, onError } = options

  const [data, setData] = useState<T | null>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { isAuthenticated } = useAuth()

  const execute = useCallback(
    async (params?: P) => {
      if (requiresAuth && !isAuthenticated) {
        const authError = new Error("Authentication required")
        setError(authError)
        onError?.(authError)
        return null
      }

      try {
        setIsLoading(true)
        setError(null)

        const result = await requestFn(params as P)
        setData(result)
        onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error("API request failed")
        setError(error)
        onError?.(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [requestFn, requiresAuth, isAuthenticated, onSuccess, onError],
  )

  return {
    data,
    isLoading,
    error,
    execute,
  }
}

/**
 * Hook for bounty-related API operations
 */
export function useBounties() {
  const getBounties = useApi((filters) => apiService.getBounties(filters))
  const getBountyById = useApi((id: string) => apiService.getBountyById(id))
  const createBounty = useApi((data) => apiService.createBounty(data))
  const updateBounty = useApi(({ id, data }: { id: string; data: any }) => apiService.updateBounty(id, data))
  const deleteBounty = useApi((id: string) => apiService.deleteBounty(id))

  return {
    getBounties,
    getBountyById,
    createBounty,
    updateBounty,
    deleteBounty,
  }
}

/**
 * Hook for milestone-related API operations
 */
export function useMilestones() {
  const getMilestones = useApi((bountyId: string) => apiService.getMilestones(bountyId))
  const createMilestone = useApi(({ bountyId, data }: { bountyId: string; data: any }) =>
    apiService.createMilestone(bountyId, data),
  )
  const updateMilestone = useApi(
    ({ bountyId, milestoneId, data }: { bountyId: string; milestoneId: string; data: any }) =>
      apiService.updateMilestone(bountyId, milestoneId, data),
  )
  const approveMilestone = useApi(({ bountyId, milestoneId }: { bountyId: string; milestoneId: string }) =>
    apiService.approveMilestone(bountyId, milestoneId),
  )

  return {
    getMilestones,
    createMilestone,
    updateMilestone,
    approveMilestone,
  }
}

/**
 * Hook for message-related API operations
 */
export function useMessages() {
  const getConversations = useApi(() => apiService.getConversations())
  const getMessages = useApi((conversationId: string) => apiService.getMessages(conversationId))
  const sendMessage = useApi(({ conversationId, data }: { conversationId: string; data: any }) =>
    apiService.sendMessage(conversationId, data),
  )
  const createConversation = useApi((data) => apiService.createConversation(data))

  return {
    getConversations,
    getMessages,
    sendMessage,
    createConversation,
  }
}

