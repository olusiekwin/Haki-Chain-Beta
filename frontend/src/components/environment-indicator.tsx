import config from "../config"

export function EnvironmentIndicator() {
  const isProduction = process.env.NODE_ENV === "production"
  const apiUrl = config.apiUrl
  const hederaNetwork = config.hederaNetwork
  const blockchainEnabled = config.features.blockchain
  const aiAssistantEnabled = config.features.aiAssistant

  if (isProduction) return null

  return (
    <div className="fixed bottom-2 right-2 bg-black/80 text-white text-xs p-2 rounded-md z-50">
      <div>API: {apiUrl}</div>
      <div>Hedera: {hederaNetwork}</div>
      <div>ENV: {process.env.NODE_ENV}</div>
      <div>Features:</div>
      <div className="pl-2">
        <div>Blockchain: {blockchainEnabled ? "✅" : "❌"}</div>
        <div>AI Assistant: {aiAssistantEnabled ? "✅" : "❌"}</div>
      </div>
    </div>
  )
}

