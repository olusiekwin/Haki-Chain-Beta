import { config } from "../utils/config"

// Hook to check if features are enabled
export const useFeatures = () => {
  return {
    isBlockchainEnabled: config.features.blockchain,
    isAiAssistantEnabled: config.features.aiAssistant,

    // Helper function to check if a specific feature is enabled
    isEnabled: (featureName: keyof typeof config.features) => {
      return config.features[featureName] || false
    },
  }
}

