"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useApp } from "../../context/app-context"
import { config } from "../../utils/config"
import tokenContractService from "../../services/web3/token-contract-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

const TokenManagement: React.FC = () => {
  const { wallet, isAuthenticated } = useApp()
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    symbol: "",
    balance: "0",
    totalSupply: "0",
  })
  const [transferAmount, setTransferAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Check if token contract address is configured
  const isContractConfigured = Boolean(config.contracts.token)

  useEffect(() => {
    // Fetch token information when wallet is connected
    const fetchTokenInfo = async () => {
      if (wallet.isConnected && isContractConfigured) {
        try {
          setIsLoading(true)
          setError(null)

          const [name, symbol, totalSupply] = await Promise.all([
            tokenContractService.getName(),
            tokenContractService.getSymbol(),
            tokenContractService.getTotalSupply(),
          ])

          let balance = "0"
          if (wallet.address) {
            balance = await tokenContractService.balanceOf(wallet.address)
          }

          setTokenInfo({
            name,
            symbol,
            balance,
            totalSupply,
          })
        } catch (err) {
          console.error("Error fetching token info:", err)
          setError("Failed to fetch token information. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTokenInfo()

    // Set up interval to refresh token info every 30 seconds
    const intervalId = setInterval(fetchTokenInfo, 30000)

    return () => clearInterval(intervalId)
  }, [wallet.isConnected, wallet.address, isContractConfigured])

  const handleTransfer = async () => {
    if (!wallet.isConnected || !wallet.address || !recipientAddress || !transferAmount) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      // Validate amount
      const amount = Number.parseFloat(transferAmount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount greater than 0")
      }

      // Validate recipient address
      if (!recipientAddress.trim()) {
        throw new Error("Please enter a valid recipient address")
      }

      // Execute transfer
      const txHash = await tokenContractService.transfer(wallet.address, recipientAddress, transferAmount)

      setSuccess(`Transfer successful! Transaction hash: ${txHash}`)

      // Reset form
      setTransferAmount("")
      setRecipientAddress("")

      // Refresh token balance
      if (wallet.address) {
        const newBalance = await tokenContractService.balanceOf(wallet.address)
        setTokenInfo((prev) => ({ ...prev, balance: newBalance }))
      }
    } catch (err: any) {
      console.error("Error transferring tokens:", err)
      setError(err.message || "Failed to transfer tokens. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isContractConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Management</CardTitle>
          <CardDescription>Manage your HakiChain tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              Token contract address is not configured. Please set the REACT_APP_TOKEN_CONTRACT_ADDRESS environment
              variable.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Management</CardTitle>
        <CardDescription>Manage your HakiChain tokens</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {isLoading && !tokenInfo.name ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading token information...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Token Name</h3>
                <p className="text-lg font-semibold">{tokenInfo.name || "N/A"}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Token Symbol</h3>
                <p className="text-lg font-semibold">{tokenInfo.symbol || "N/A"}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Your Balance</h3>
                <p className="text-lg font-semibold">
                  {tokenInfo.balance} {tokenInfo.symbol}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Total Supply</h3>
                <p className="text-lg font-semibold">
                  {tokenInfo.totalSupply} {tokenInfo.symbol}
                </p>
              </div>
            </div>

            {wallet.isConnected && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Transfer Tokens</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter>
        {wallet.isConnected ? (
          <Button
            onClick={handleTransfer}
            disabled={isLoading || !recipientAddress || !transferAmount}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Transfer Tokens`
            )}
          </Button>
        ) : (
          <Button onClick={wallet.connect} className="w-full">
            Connect Wallet to Manage Tokens
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default TokenManagement

