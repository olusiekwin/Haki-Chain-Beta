import { api } from "./api-service"
import config from "../config"

// AI Assistant service for handling all AI-related operations
export const aiAssistantService = {
  // Check if AI assistant features are enabled
  isEnabled: () => {
    return config.features.aiAssistant
  },

  // Get AI suggestions for a bounty description
  getSuggestions: async (prompt: string) => {
    if (!config.features.aiAssistant) {
      console.log("AI Assistant features are disabled")
      return { suggestions: [] }
    }

    try {
      const response = await api.post("/ai/suggestions", { prompt })
      return response.data
    } catch (error) {
      console.error("Error getting AI suggestions:", error)
      throw error
    }
  },

  // Analyze a legal document
  analyzeLegalDocument: async (documentText: string) => {
    if (!config.features.aiAssistant) {
      console.log("AI Assistant features are disabled")
      return { analysis: "AI Assistant features are disabled" }
    }

    try {
      const response = await api.post("/ai/analyze-legal", { documentText })
      return response.data
    } catch (error) {
      console.error("Error analyzing legal document:", error)
      throw error
    }
  },

  // Get AI assistance for milestone completion
  getMilestoneAssistance: async (bountyId: string, milestoneId: string) => {
    if (!config.features.aiAssistant) {
      console.log("AI Assistant features are disabled")
      return { assistance: "AI Assistant features are disabled" }
    }

    try {
      const response = await api.get(`/ai/bounties/${bountyId}/milestones/${milestoneId}/assistance`)
      return response.data
    } catch (error) {
      console.error("Error getting milestone assistance:", error)
      throw error
    }
  },
}

