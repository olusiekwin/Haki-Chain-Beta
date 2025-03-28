"use client"

import React from "react"
import { FeatureFlag } from "./feature-flag"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { blockchainService } from "../services/blockchain-service"
import { useWallet } from "../contexts/wallet-context"

interface BlockchainTransactionProps {
  bountyId: string
  amount: number
  onSuccess?: (transactionId: string) => void
  onError?: (error: Error) => void
}

export function BlockchainTransaction({ bountyId, amount, onSuccess, onError }: BlockchainTransactionProps) {
  const { isConnected, accountId, connect } = useWallet()
  const [isLoading, setIsLoading] = React.useState(false)
  const [transactionId, setTransactionId] = React.useState<string | null>(null)

  const handleFundBounty = async () => {
    if (!isConnected) {
      await connect()
      return
    }

    setIsLoading(true)

    try {
      const result = await blockchainService.fundBounty(bountyId, amount)
      setTransactionId(result.transactionId)
      onSuccess?.(result.transactionId)
    } catch (error) {
      console.error("Error funding bounty:", error)
      onError?.(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FeatureFlag
      feature="blockchain"
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>Traditional Payment</CardTitle>
            <CardDescription>Blockchain features are disabled</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You will be funding this bounty using traditional payment methods.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => onSuccess?.("traditional-payment")}>Continue with Traditional Payment</Button>
          </CardFooter>
        </Card>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Transaction</CardTitle>
          <CardDescription>Fund this bounty using HBAR</CardDescription>
        </CardHeader>
        <CardContent>
          {transactionId ? (
            <div>
              <p className="text-green-600">Transaction successful!</p>
              <p className="text-sm text-gray-500">Transaction ID: {transactionId}</p>
            </div>
          ) : (
            <p>You are about to fund this bounty with {amount} HBAR.</p>
          )}
        </CardContent>
        <CardFooter>
          {!transactionId && (
            <Button onClick={handleFundBounty} disabled={isLoading}>
              {isLoading ? "Processing..." : isConnected ? "Fund Bounty" : "Connect Wallet"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </FeatureFlag>
  )
}

