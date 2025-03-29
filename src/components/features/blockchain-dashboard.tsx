"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useApp } from "../../context/app-context"
import WalletConnector from "./wallet-connector"

interface BlockchainDashboardProps {
  networkId: string
  accountId: string
}

const BlockchainDashboard: React.FC<BlockchainDashboardProps> = ({ networkId, accountId }) => {
  const { wallet } = useApp()
  const [networkName, setNetworkName] = useState<string>("")

  useEffect(() => {
    // Set network name based on networkId
    switch (networkId) {
      case "mainnet":
        setNetworkName("Hedera Mainnet")
        break
      case "testnet":
        setNetworkName("Hedera Testnet")
        break
      case "previewnet":
        setNetworkName("Hedera Previewnet")
        break
      default:
        setNetworkName(`Hedera ${networkId}`)
    }
  }, [networkId])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Blockchain Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Network</h3>
          <p className="text-lg font-semibold">{networkName}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Platform Account ID</h3>
          <p className="text-lg font-semibold truncate">{accountId || "Not configured"}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Your Wallet</h3>
        {wallet.isConnected ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Status</span>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="mb-2">
              <span className="text-sm font-medium text-green-700">Address</span>
              <p className="text-sm text-green-800 break-all">{wallet.address}</p>
            </div>
            <div className="mb-4">
              <span className="text-sm font-medium text-green-700">Balance</span>
              <p className="text-lg font-bold text-green-800">{wallet.balance} HBAR</p>
            </div>
            <button
              onClick={wallet.disconnect}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <WalletConnector />
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Recent Transactions</h3>
        <div className="bg-gray-50 rounded-md p-4 text-center">
          <p className="text-gray-500">No recent transactions found</p>
        </div>
      </div>
    </div>
  )
}

export default BlockchainDashboard

