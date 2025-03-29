"use client"

import { useEffect, useState } from "react"

export function EnvironmentIndicator() {
  const [environment, setEnvironment] = useState<string>("development")

  useEffect(() => {
    // In a real app, you would get this from environment variables
    // For now, we'll just use development as default
    setEnvironment("development")
  }, [])

  if (environment === "production") {
    return null
  }

  return (
    <div className="fixed bottom-2 right-2 z-50 px-2 py-1 text-xs font-medium rounded bg-yellow-500 text-black">
      {environment}
    </div>
  )
}

