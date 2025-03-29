import { config } from "../utils/config"

// Define types for API responses
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

interface UserProfile {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  wallet_address?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

interface Bounty {
  id: number
  title: string
  description: string
  reward: string
  status: string
  creator: {
    id: number
    username: string
  }
  worker?: {
    id: number
    username: string
  }
  created_at: string
  updated_at: string
  blockchain_id?: string
}

interface MarketplaceItem {
  id: number
  title: string
  description: string
  price: string
  file_url: string
  seller: {
    id: number
    username: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
  blockchain_id?: string
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = config.apiUrl
  }

  // Helper method for making API requests
  private async request<T>(endpoint: string, method = "GET", data?: any, token?: string): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}/${endpoint}`

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const options: RequestInit = {
        method,
        headers,
      }

      if (data) {
        options.body = JSON.stringify(data)
      }

      const response = await fetch(url, options)
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "An error occurred with the API request")
      }

      return {
        success: true,
        data: responseData,
      }
    } catch (error: any) {
      console.error("API request error:", error)
      return {
        success: false,
        error: error.message || "An unknown error occurred",
      }
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: UserProfile }>> {
    return this.request<{ token: string; user: UserProfile }>("auth/login/", "POST", { email, password })
  }

  async register(userData: {
    username: string
    email: string
    password: string
    first_name: string
    last_name: string
  }): Promise<ApiResponse<{ token: string; user: UserProfile }>> {
    return this.request<{ token: string; user: UserProfile }>("auth/register/", "POST", userData)
  }

  async getProfile(token: string): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("users/profile/", "GET", undefined, token)
  }

  async updateProfile(token: string, profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("users/profile/", "PATCH", profileData, token)
  }

  // Bounty methods
  async getBounties(token: string): Promise<ApiResponse<Bounty[]>> {
    return this.request<Bounty[]>("bounties/", "GET", undefined, token)
  }

  async getBounty(token: string, id: number): Promise<ApiResponse<Bounty>> {
    return this.request<Bounty>(`bounties/${id}/`, "GET", undefined, token)
  }

  async createBounty(
    token: string,
    bountyData: { title: string; description: string; reward: string },
  ): Promise<ApiResponse<Bounty>> {
    return this.request<Bounty>("bounties/", "POST", bountyData, token)
  }

  async updateBounty(token: string, id: number, bountyData: Partial<Bounty>): Promise<ApiResponse<Bounty>> {
    return this.request<Bounty>(`bounties/${id}/`, "PATCH", bountyData, token)
  }

  // Marketplace methods
  async getMarketplaceItems(token: string): Promise<ApiResponse<MarketplaceItem[]>> {
    return this.request<MarketplaceItem[]>("marketplace/", "GET", undefined, token)
  }

  async getMarketplaceItem(token: string, id: number): Promise<ApiResponse<MarketplaceItem>> {
    return this.request<MarketplaceItem>(`marketplace/${id}/`, "GET", undefined, token)
  }

  async createMarketplaceItem(
    token: string,
    itemData: { title: string; description: string; price: string; file: File },
  ): Promise<ApiResponse<MarketplaceItem>> {
    // For file uploads, we need to use FormData instead of JSON
    const formData = new FormData()
    formData.append("title", itemData.title)
    formData.append("description", itemData.description)
    formData.append("price", itemData.price)
    formData.append("file", itemData.file)

    try {
      const url = `${this.baseUrl}/marketplace/`

      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "An error occurred with the API request")
      }

      return {
        success: true,
        data: responseData,
      }
    } catch (error: any) {
      console.error("API request error:", error)
      return {
        success: false,
        error: error.message || "An unknown error occurred",
      }
    }
  }

  // Blockchain integration methods
  async linkWallet(token: string, walletAddress: string): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("blockchain/link-wallet/", "POST", { wallet_address: walletAddress }, token)
  }

  async syncBounty(token: string, bountyId: number, blockchainId: string): Promise<ApiResponse<Bounty>> {
    return this.request<Bounty>(`blockchain/sync-bounty/${bountyId}/`, "POST", { blockchain_id: blockchainId }, token)
  }

  async syncMarketplaceItem(
    token: string,
    itemId: number,
    blockchainId: string,
  ): Promise<ApiResponse<MarketplaceItem>> {
    return this.request<MarketplaceItem>(
      `blockchain/sync-marketplace/${itemId}/`,
      "POST",
      { blockchain_id: blockchainId },
      token,
    )
  }
}

export default new ApiService()

