import axios from "axios"
import config from "../config"

// Create axios instance with base URL from environment variable
export const api = axios.create({
  baseURL: config.apiUrl,
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("haki_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Log the API URL being used (for debugging)
console.log(`API URL: ${config.apiUrl}`)

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/users/login/", { email, password })
    return response.data
  },

  register: async (userData: any) => {
    const response = await api.post("/users/register/", userData)
    return response.data
  },

  verifyLawyer: async (lawyerId: string, status: "verified" | "rejected", notes: string) => {
    const response = await api.post(`/users/lawyers/${lawyerId}/${status}/`, { notes })
    return response.data
  },

  submitVerification: async (verificationData: any) => {
    const formData = new FormData()

    // Add all fields to form data
    Object.keys(verificationData).forEach((key) => {
      if (key === "documents") {
        verificationData.documents.forEach((doc: File, index: number) => {
          formData.append(`documents[${index}]`, doc)
        })
      } else {
        formData.append(key, verificationData[key])
      }
    })

    const response = await api.post("/users/lawyers/submit-verification/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  },

  getProfile: async () => {
    const response = await api.get("/users/me/")
    return response.data
  },

  updateProfile: async (profileData: any) => {
    const response = await api.patch("/users/me/", profileData)
    return response.data
  },

  connectWallet: async (walletAddress: string) => {
    const response = await api.post("/users/connect-wallet/", { wallet_address: walletAddress })
    return response.data
  },
}

// Bounty services
export const bountyService = {
  getBounties: async (filters = {}) => {
    const response = await api.get("/bounties/", { params: filters })
    return response.data
  },

  getBountyById: async (id: string) => {
    const response = await api.get(`/bounties/${id}/`)
    return response.data
  },

  createBounty: async (bountyData: any) => {
    const formData = new FormData()

    // Add basic fields
    Object.keys(bountyData).forEach((key) => {
      if (key !== "documents" && key !== "milestones") {
        formData.append(key, bountyData[key])
      }
    })

    // Add milestones
    if (bountyData.milestones) {
      bountyData.milestones.forEach((milestone: any, index: number) => {
        Object.keys(milestone).forEach((key) => {
          formData.append(`milestones[${index}][${key}]`, milestone[key])
        })
      })
    }

    // Add documents
    if (bountyData.documents) {
      bountyData.documents.forEach((doc: any, index: number) => {
        formData.append(`documents[${index}][title]`, doc.title)
        formData.append(`documents[${index}][file]`, doc.file)
      })
    }

    const response = await api.post("/bounties/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  },

  claimBounty: async (bountyId: string, message: string) => {
    const response = await api.post(`/bounties/${bountyId}/claim/`, { message })
    return response.data
  },

  donate: async (bountyId: string, amount: number) => {
    const response = await api.post(`/bounties/${bountyId}/donate/`, { amount })
    return response.data
  },

  completeMilestone: async (bountyId: string, milestoneId: string, data: any) => {
    const formData = new FormData()
    formData.append("notes", data.notes)

    if (data.evidence) {
      formData.append("evidence", data.evidence)
    }

    const response = await api.post(`/bounties/${bountyId}/milestones/${milestoneId}/complete/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  },

  approveMilestone: async (bountyId: string, milestoneId: string, notes: string) => {
    const response = await api.post(`/bounties/${bountyId}/milestones/${milestoneId}/approve/`, { notes })

    return response.data
  },

  getPendingVerifications: async () => {
    const response = await api.get("/users/lawyers/pending-verification/")
    return response.data
  },
}

