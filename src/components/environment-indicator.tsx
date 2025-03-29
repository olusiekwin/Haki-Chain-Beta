"use client"

import { useState } from "react"
import { AlertCircle, X } from "lucide-react"

export function EnvironmentIndicator() {
  const [isVisible, setIsVisible] = useState(true)
  const environment = process.env.NODE_ENV || "development"
  const network = process.env.HEDERA_NETWORK || "testnet"

  // Hide in production
  if (environment === "production" && network === "mainnet") {
    return null
  }

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in-50 slide-in-from-bottom-5">
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md shadow-lg bg-background border border-border">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <div>
              <span className="uppercase">{environment}</span>
              {network && (
                <span className="ml-1">
                  (<span className="text-primary">{network}</span>)
                </span>
              )}
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 ml-2 rounded-full hover:bg-muted"
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default EnvironmentIndicator

