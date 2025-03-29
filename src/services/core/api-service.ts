import axios, { type AxiosInstance } from "axios"
import { ConfigService } from "./config-service"

/**
 * Unified API service that handles all backend API interactions
 * This replaces separate API services for different entities
 */
export class ApiService {
  private api: AxiosInstance
  private config: ConfigService

  constructor() {
    this.config = new ConfigService()

    this.api = axios.create({
      baseURL: this.config.getApiUrl(),
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor for authentication
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  // Generic API methods
  async get<T>(endpoint: string, params?: any): Promise<T> {
    const response = await this.api.get<T>(endpoint, { params })
    return response.data
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.post<T>(endpoint, data)
    return response.data
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.put<T>(endpoint, data)
    return response.data
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<T>(endpoint)
    return response.data
  }

  // User-related endpoints
  async login(credentials: { email: string; password: string }): Promise<any> {
    return this.post("/auth/login/", credentials)
  }

  async register(userData: any): Promise<any> {
    return this.post("/auth/register/", userData)
  }

  async getUserProfile(): Promise<any> {
    return this.get("/users/profile/")
  }

  async updateUserProfile(profileData: any): Promise<any> {
    return this.put("/users/profile/", profileData)
  }

  // Bounty-related endpoints
  async getBounties(filters?: any): Promise<any[]> {
    return this.get("/bounties/", filters)
  }

  async getBountyById(id: string): Promise<any> {
    return this.get(`/bounties/${id}/`)
  }

  async createBounty(bountyData: any): Promise<any> {
    return this.post("/bounties/", bountyData)
  }

  async updateBounty(id: string, bountyData: any): Promise<any> {
    return this.put(`/bounties/${id}/`, bountyData)
  }

  async deleteBounty(id: string): Promise<any> {
    return this.delete(`/bounties/${id}/`)
  }

  // Milestone-related endpoints
  async getMilestones(bountyId: string): Promise<any[]> {
    return this.get(`/bounties/${bountyId}/milestones/`)
  }

  async createMilestone(bountyId: string, milestoneData: any): Promise<any> {
    return this.post(`/bounties/${bountyId}/milestones/`, milestoneData)
  }

  async updateMilestone(bountyId: string, milestoneId: string, milestoneData: any): Promise<any> {
    return this.put(`/bounties/${bountyId}/milestones/${milestoneId}/`, milestoneData)
  }

  async approveMilestone(bountyId: string, milestoneId: string): Promise<any> {
    return this.post(`/bounties/${bountyId}/milestones/${milestoneId}/approve/`, {})
  }

  // Payment-related endpoints
  async getTransactions(): Promise<any[]> {
    return this.get("/transactions/")
  }

  async createDonation(donationData: any): Promise<any> {
    return this.post("/donations/", donationData)
  }

  // Message-related endpoints
  async getConversations(): Promise<any[]> {
    return this.get("/messages/conversations/")
  }

  async getMessages(conversationId: string): Promise<any[]> {
    return this.get(`/messages/conversations/${conversationId}/`)
  }

  async sendMessage(conversationId: string, messageData: any): Promise<any> {
    return this.post(`/messages/conversations/${conversationId}/`, messageData)
  }

  async createConversation(conversationData: any): Promise<any> {
    return this.post("/messages/conversations/", conversationData)
  }
}

// Export a singleton instance
export const apiService = new ApiService()

