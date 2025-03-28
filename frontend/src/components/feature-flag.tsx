import type React from "react"
import config from "../config"

interface FeatureFlagProps {
  feature: "blockchain" | "aiAssistant"
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureFlag({ feature, children, fallback }: FeatureFlagProps) {
  const isEnabled = config.features[feature]

  if (isEnabled) {
    return <>{children}</>
  }

  return fallback ? <>{fallback}</> : null
}

