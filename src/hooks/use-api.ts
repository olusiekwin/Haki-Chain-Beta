"use client"

import { useState, useCallback } from "react"
import api from "../utils/api"
import { MockService } from "../services/mock-service"

// Flag to determine whether to use mock data or real API
// You can toggle this until your backend is ready
const USE_MOCK_DATA = true

export const useApi = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const callApi = useCallback(async <T>(\
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    mockFunction?: () => Promise<T>
  ): Promise<T> => {
    setLoading(true);
    setError(null)

    try {
      // Use mock data if flag is set and mock function is provided
      if (USE_MOCK_DATA && mockFunction) {
        const result = await mockFunction()
        setLoading(false)
        return result
      }

      // Otherwise use real API
      let response

      switch (method) {
        case "GET":
          response = await api.get(endpoint)
          break
        case "POST":
          response = await api.post(endpoint, data)
          break
        case "PUT":
          response = await api.put(endpoint, data)
          break
        case "DELETE":
          response = await api.delete(endpoint)
          break
      }

      setLoading(false)
      return response.data
    } catch (err) {
      setLoading(false)
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      setError(error)
      throw error
    }
  },
  []
)

return {
    callApi,
    loading,
    error,
    // Helper methods for common API calls with mock fallbacks
    api: {
      // Auth
      login: (email: string, password: string) => 
        callApi('/auth/login', 'POST', { email, password }, 
          () => MockService.login(email, password)),
      
      register: (data: any) => 
        callApi('/auth/register', 'POST', data, 
          () => MockService.register(data)),
      
      getCurrentUser: () => 
        callApi('/auth/me', 'GET', undefined, 
          () => MockService.getCurrentUser()),
      
      // Bounties
      getAllBounties: () => 
        callApi('/bounties', 'GET', undefined, 
          () => MockService.getAllBounties()),
      
      getBountyById: (id: string) => 
        callApi(`/bounties/${id}`, 'GET', undefined, 
          () => MockService.getBountyById(id)),
      
      createBounty: (data: any) => 
        callApi('/bounties', 'POST', data, 
          () => MockService.createBounty(data)),
      
      // Tokens
      getAllTokens: () => 
        callApi('/tokens', 'GET', undefined, 
          () => MockService.getAllTokens()),
      
      getTokenById: (id: string) => 
        callApi(`/tokens/${id}`, 'GET', undefined, 
          () => MockService.getTokenById(id)),
      
      // Wallet
      getWalletInfo: () => 
        callApi('/wallet', 'GET', undefined, 
          () => MockService.getWalletInfo()),
      
      getTransactions: () => 
        callApi('/wallet/transactions', 'GET', undefined, 
          () => MockService.getTransactions()),
      
      connectWallet: (address: string) => 
        callApi('/wallet/connect', 'POST', { address }, 
          () => MockService.connectWallet(address)),
    }
  };
}

