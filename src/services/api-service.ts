/**
 * API Service for making requests to the backend
 * This service handles all API calls to the Django backend
 */

// Define base types for API responses
interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

// API service class
class ApiService {
  private baseUrl: string

  constructor() {
    // Use environment variable for API URL
    this.baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000/api"
  }

  // Helper method to get auth token from localStorage
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken")
    }
    return null
  }

  // Helper method to build headers with auth token
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    const token = this.getAuthToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    return headers
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    let url = `${this.baseUrl}${endpoint}`

    // Add query parameters if provided
    if (params) {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value)
      })
      url += `?${queryParams.toString()}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      data,
      status: response.status,
    }
  }

  // POST request
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      data,
      status: response.status,
    }
  }

  // PUT request
  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      data,
      status: response.status,
    }
  }

  // PATCH request
  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      data,
      status: response.status,
    }
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      data,
      status: response.status,
    }
  }

  // File upload
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {}
    const token = this.getAuthToken()

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      data,
      status: response.status,
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.post<{ token: string; user: any }>("/auth/login/", {
      email,
      password,
    })

    // Store token in localStorage
    if (response.data.token && typeof window !== "undefined") {
      localStorage.setItem("authToken", response.data.token)
    }

    return response
  }

  async register(userData: any): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.post<{ token: string; user: any }>("/auth/register/", userData)

    // Store token in localStorage
    if (response.data.token && typeof window !== "undefined") {
      localStorage.setItem("authToken", response.data.token)
    }

    return response
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
    }
  }
}

// Create and export a singleton instance
export const apiService = new ApiService()
import config from "../config"

// Base API URL from config
const API_URL = config.apiUrl

// Generic fetch function with authentication
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  // Get the token from localStorage
  const token = localStorage.getItem("authToken")

  // Set default headers
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Make the request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // Check if the response is ok
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API error: ${response.status}`)
  }

  // Return the response data
  return response.json()
}

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      fetchWithAuth("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (userData: any) =>
      fetchWithAuth("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    verifyEmail: (token: string) => fetchWithAuth(`/auth/verify-email/${token}`),
    resetPassword: (email: string) =>
      fetchWithAuth("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    setNewPassword: (token: string, password: string) =>
      fetchWithAuth("/auth/set-new-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      }),
  },

  // User endpoints
  users: {
    getProfile: () => fetchWithAuth("/users/profile"),
    updateProfile: (userData: any) =>
      fetchWithAuth("/users/profile", {
        method: "PATCH",
        body: JSON.stringify(userData),
      }),
    uploadProfileImage: async (file: File) => {
      const formData = new FormData()
      formData.append("image", file)

      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_URL}/users/profile/image`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API error: ${response.status}`)
      }

      return response.json()
    },
  },

  // Bounty endpoints
  bounties: {
    getAll: (page = 1, limit = 10) => fetchWithAuth(`/bounties?page=${page}&limit=${limit}`),
    getById: (id: string) => fetchWithAuth(`/bounties/${id}`),
    create: (bountyData: any) =>
      fetchWithAuth("/bounties", {
        method: "POST",
        body: JSON.stringify(bountyData),
      }),
    update: (id: string, bountyData: any) =>
      fetchWithAuth(`/bounties/${id}`, {
        method: "PATCH",
        body: JSON.stringify(bountyData),
      }),
    delete: (id: string) =>
      fetchWithAuth(`/bounties/${id}`, {
        method: "DELETE",
      }),
    applyForBounty: (id: string, applicationData: any) =>
      fetchWithAuth(`/bounties/${id}/apply`, {
        method: "POST",
        body: JSON.stringify(applicationData),
      }),
  },

  // Blockchain endpoints
  blockchain: {
    getAccountInfo: (accountId: string) => fetchWithAuth(`/blockchain/accounts/${accountId}`),
    getTransactionInfo: (transactionId: string) => fetchWithAuth(`/blockchain/transactions/${transactionId}`),
    getTokenInfo: (tokenId: string) => fetchWithAuth(`/blockchain/tokens/${tokenId}`),
  },

  // AI assistant endpoints
  ai: {
    analyzeDocument: async (file: File) => {
      const formData = new FormData()
      formData.append("document", file)

      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_URL}/ai/analyze-document`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API error: ${response.status}`)
      }

      return response.json()
    },
    chatWithAssistant: (message: string, conversationId?: string) =>
      fetchWithAuth("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message, conversationId }),
      }),
  },
}

export default api

