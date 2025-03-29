"use client"

import { useEffect, useState } from "react"
import { config } from "../config/appConfig"

export function useFeatures() {
  const [isBlockchainEnabled, setIsBlockchainEnabled] = useState<boolean>(config.features.blockchain)
  const [isAiAssistantEnabled, setIsAiAssistantEnabled] = useState<boolean>(config.features.aiAssistant)

  useEffect(() => {
    // This effect ensures that the feature flags are updated if the config changes
    setIsBlockchainEnabled(config.features.blockchain)
    setIsAiAssistantEnabled(config.features.aiAssistant)
  }, [config.features.blockchain, config.features.aiAssistant])

  return {
    isBlockchainEnabled,
    isAiAssistantEnabled,
  }
}

