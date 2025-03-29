"use client"

import type React from "react"
import { useState } from "react"
import { useHybrid } from "../../hooks/use-hybrid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

export const BlockchainSync: React.FC = () => {
  const { syncBlockchainData, isLoading, error } = useHybrid()
  const [syncSuccess, setSyncSuccess] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)

  const handleSync = async () => {
    try {
      const result = await syncBlockchainData()
      setSyncResult(result)
      setSyncSuccess(true)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSyncSuccess(false)
      }, 5000)
    } catch (err) {
      console.error("Failed to sync blockchain data:", err)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <RefreshCw className="mr-2" size={20} />
          Blockchain Synchronization
        </CardTitle>
        <CardDescription>Sync on-chain data with your HakiChain account</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {syncSuccess && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
\

