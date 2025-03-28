"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useApp } from "../../context/app-context"
import { useHybrid } from "../../hooks/use-hybrid"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle, CheckCircle, Wallet } from "lucide-react"

export const WalletConnector: React.FC = () => {
  const { user, wallet, isAuthenticated } = useApp()
  const { linkWallet, isLoading, error } = useHybrid()
  const [isLinked, setIsLinked] = useState(false)
  const [linkSuccess, setLinkSuccess] = useState(false)

  // Check if wallet is already linked
  useEffect(() => {
    if (isAuthenticated && user && user.wallet_address) {
      setIsLinked(true)
    } else {
      setIsLinked(false)
    }
  }, [isAuthenticated, user])

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await wallet.connect()
    } catch (err) {
      console.error("Failed to connect wallet:", err)
    }
  }

  // Handle wallet linking to account
  const handleLinkWallet = async () => {
    try {
      await linkWallet()
      setLinkSuccess(true)
      setIsLinked(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setLinkSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Failed to link wallet:", err)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="mr-2" size={20} />
          Wallet Connection
        </CardTitle>
        <CardDescription>Connect your blockchain wallet to access HakiChain features</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {linkSuccess && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Wallet successfully linked to your account!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Wallet Status:</span>
            <span
              className={`px-2 py-1 rounded text-sm ${wallet.isConnected ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
            >
              {wallet.isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {wallet.isConnected && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Wallet Address:</span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {wallet.address
                  ? `${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`
                  : "Unknown"}
              </span>
            </div>
          )}

          {isAuthenticated && wallet.isConnected && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Account Linking:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${isLinked ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
              >
                {isLinked ? "Linked" : "Not Linked"}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        {!wallet.isConnected ? (
          <Button onClick={handleConnectWallet} className="w-full" disabled={isLoading}>
            Connect Wallet
          </Button>
        ) : (
          <>
            <Button onClick={() => wallet.disconnect()} variant="outline" className="w-full" disabled={isLoading}>
              Disconnect Wallet
            </Button>

            {isAuthenticated && !isLinked && (
              <Button onClick={handleLinkWallet} className="w-full" disabled={isLoading}>
                {isLoading ? "Linking..." : "Link Wallet to Account"}
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}

