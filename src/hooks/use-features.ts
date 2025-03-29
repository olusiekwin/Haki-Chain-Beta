"use client"

import { useMemo } from "react"
import { config } from "../utils/config"

export function useFeatures() {
  const features = useMemo(() => {
    return {
      isBlockchainEnabled: config.features.blockchain,
      isAIAssistantEnabled: config.features.aiAssistant,
    }
  }, [])

  return features
}

