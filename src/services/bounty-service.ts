import api from "../utils/api"

export interface Bounty {
  id: string
  title: string
  description: string
  reward: number
  status: "open" | "in_progress" | "completed"
  createdAt: string
  createdBy: string
  tags: string[]
}

export interface CreateBountyData {
  title: string
  description: string
  reward: number
  tags: string[]
}

const BountyService = {
  getAllBounties: async (): Promise<Bounty[]> => {
    const response = await api.get<Bounty[]>("/bounties")
    return response.data
  },

  getBountyById: async (id: string): Promise<Bounty> => {
    const response = await api.get<Bounty>(`/bounties/${id}`)
    return response.data
  },

  createBounty: async (data: CreateBountyData): Promise<Bounty> => {
    const response = await api.post<Bounty>("/bounties", data)
    return response.data
  },

  updateBounty: async (id: string, data: Partial<CreateBountyData>): Promise<Bounty> => {
    const response = await api.put<Bounty>(`/bounties/${id}`, data)
    return response.data
  },

  deleteBounty: async (id: string): Promise<void> => {
    await api.delete(`/bounties/${id}`)
  },
}

export default BountyService

