"use client"

import type React from "react"
import { useState } from "react"
import { useApp } from "../../context/app-context"
import { config } from "../../utils/config"

const WalletConnector: React.FC = () => {
  const { wallet } = useApp()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const connected = await wallet.connect()
      if (!connected) {
        setError("Failed to connect wallet. Please try again.")
      }
    } catch (err) {
      setError("An error occurred while connecting to your wallet.")
      console.error(err)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
      <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
      <p className="text-sm text-gray-600 mb-4">
        Connect your Hedera wallet to access blockchain features on HakiChain. Currently connecting to{" "}
        <span className="font-medium">{config.blockchain.networkId}</span>.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
      )}

      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        {isConnecting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Connecting...
          </span>
        ) : (
          "Connect Wallet"
        )}
      </button>
    </div>
  )
}

export default WalletConnector

