"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coins, DollarSign, TrendingUp, BarChart3, History, ShieldCheck, Info, AlertCircle } from "lucide-react"

interface TokenData {
  name: string
  symbol: string
  totalSupply: number
  decimals: number
  price: number
  priceChange: number
  marketCap: number
  volume24h: number
}

interface TokenTransaction {
  id: string
  type: "buy" | "sell"
  amount: number
  price: number
  account: string
  timestamp: string
}

export function BountyTokenMarketplace() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [transactions, setTransactions] = useState<TokenTransaction[]>([])
  const [loadingToken, setLoadingToken] = useState(true)
  const [loadingTransfer, setLoadingTransfer] = useState(false)
  const [tokenAmount, setTokenAmount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userBalance, setUserBalance] = useState<number | null>(null)

  useEffect(() => {
    // In a real app, fetch the token data from your API
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        // In a real app, you would call your API to get this data
        // For example:
        // const tokenId = "0.0.1234567";
        // const tokenInfo = await getTokenInfo(tokenId);

        const mockTokenData: TokenData = {
          name: "Haki Legal Bounty Token",
          symbol: "HAKI",
          totalSupply: 1000000,
          decimals: 2,
          price: 0.32, // USD
          priceChange: 5.2, // Percentage
          marketCap: 320000, // USD
          volume24h: 45000, // USD
        }

        const mockTransactions: TokenTransaction[] = [
          {
            id: "0.0.12345@1684947100.123456789",
            type: "buy",
            amount: 1000,
            price: 0.3,
            account: "0.0.54321",
            timestamp: "2023-09-25T10:30:00Z",
          },
          {
            id: "0.0.12345@1684947000.123456789",
            type: "sell",
            amount: 500,
            price: 0.29,
            account: "0.0.65432",
            timestamp: "2023-09-25T10:15:00Z",
          },
          {
            id: "0.0.12345@1684946900.123456789",
            type: "buy",
            amount: 2000,
            price: 0.28,
            account: "0.0.76543",
            timestamp: "2023-09-25T10:00:00Z",
          },
          {
            id: "0.0.12345@1684946800.123456789",
            type: "buy",
            amount: 1500,
            price: 0.28,
            account: "0.0.87654",
            timestamp: "2023-09-25T09:45:00Z",
          },
          {
            id: "0.0.12345@1684946700.123456789",
            type: "sell",
            amount: 800,
            price: 0.27,
            account: "0.0.98765",
            timestamp: "2023-09-25T09:30:00Z",
          },
        ]

        // Mock user balance
        const mockUserBalance = 2500

        setTokenData(mockTokenData)
        setTransactions(mockTransactions)
        setUserBalance(mockUserBalance)
        setLoadingToken(false)
      } catch (err) {
        setError("Failed to load token data")
        console.error(err)
        setLoadingToken(false)
      }
    }

    fetchData()
  }, [])

  const handleBuyTokens = async () => {
    if (!tokenAmount || isNaN(Number(tokenAmount)) || Number(tokenAmount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoadingTransfer(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, call your API to handle the token purchase
      // For example:
      // const tokenId = "0.0.1234567";
      // const fromAccountId = "0.0.12345"; // Treasury or market maker
      // const toAccountId = "0.0.67890"; // User's account
      // const amount = Number(tokenAmount);
      // const privateKey = "..."; // Treasury's private key
      // const txId = await transferTokens(tokenId, fromAccountId, toAccountId, amount, privateKey);

      // Simulate token purchase
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user balance (mock)
      if (userBalance !== null) {
        setUserBalance(userBalance + Number(tokenAmount))
      }

      // Add transaction to list (mock)
      const newTransaction: TokenTransaction = {
        id: `0.0.12345@${Date.now()}.123456789`,
        type: "buy",
        amount: Number(tokenAmount),
        price: tokenData?.price || 0,
        account: "0.0.54321", // User's account
        timestamp: new Date().toISOString(),
      }

      setTransactions([newTransaction, ...transactions])
      setSuccess(`Successfully purchased ${tokenAmount} HAKI tokens`)
      setTokenAmount("")
    } catch (err) {
      setError("Failed to complete token purchase")
      console.error(err)
    } finally {
      setLoadingTransfer(false)
    }
  }

  const handleSellTokens = async () => {
    if (!tokenAmount || isNaN(Number(tokenAmount)) || Number(tokenAmount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (userBalance !== null && Number(tokenAmount) > userBalance) {
      setError("Insufficient token balance")
      return
    }

    setLoadingTransfer(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, call your API to handle the token sale
      // Simulate token sale
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user balance (mock)
      if (userBalance !== null) {
        setUserBalance(userBalance - Number(tokenAmount))
      }

      // Add transaction to list (mock)
      const newTransaction: TokenTransaction = {
        id: `0.0.12345@${Date.now()}.123456789`,
        type: "sell",
        amount: Number(tokenAmount),
        price: tokenData?.price || 0,
        account: "0.0.54321", // User's account
        timestamp: new Date().toISOString(),
      }

      setTransactions([newTransaction, ...transactions])
      setSuccess(`Successfully sold ${tokenAmount} HAKI tokens`)
      setTokenAmount("")
    } catch (err) {
      setError("Failed to complete token sale")
      console.error(err)
    } finally {
      setLoadingTransfer(false)
    }
  }

  if (loadingToken) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coins className="h-5 w-5 mr-2" />
          HAKI Token Marketplace
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
            <ShieldCheck className="h-3 w-3 mr-1" /> Hedera Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Securely trade HAKI tokens on Hedera's distributed ledger for transparent legal fundraising
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {tokenData && (
          <div className="space-y-6">
            {/* Token overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg flex items-center">
                <DollarSign className="h-8 w-8 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold">${tokenData.price}</p>
                    <Badge
                      variant="outline"
                      className={`ml-2 ${tokenData.priceChange >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {tokenData.priceChange}%
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg flex items-center">
                <Coins className="h-8 w-8 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-2xl font-bold">${tokenData.marketCap.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-2xl font-bold">${tokenData.volume24h.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg flex items-center">
                <History className="h-8 w-8 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Supply</p>
                  <p className="text-2xl font-bold">
                    {tokenData.totalSupply.toLocaleString()} {tokenData.symbol}
                  </p>
                </div>
              </div>
            </div>

            {/* User balance */}
            {userBalance !== null && (
              <div className="p-4 bg-primary/5 rounded-lg border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Balance</p>
                    <p className="text-xl font-bold">
                      {userBalance.toLocaleString()} {tokenData.symbol}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Value</p>
                    <p className="text-xl font-bold">${(userBalance * tokenData.price).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trading interface */}
            <Tabs defaultValue="buy">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy Tokens</TabsTrigger>
                <TabsTrigger value="sell">Sell Tokens</TabsTrigger>
              </TabsList>

              <TabsContent value="buy" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="buy-amount">Amount to Buy ({tokenData.symbol})</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="buy-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                    />
                    <Button onClick={handleBuyTokens} disabled={loadingTransfer}>
                      {loadingTransfer ? "Processing..." : "Buy"}
                    </Button>
                  </div>
                  {tokenAmount && !isNaN(Number(tokenAmount)) && (
                    <p className="text-sm text-muted-foreground">
                      Total cost: ${(Number(tokenAmount) * tokenData.price).toFixed(2)}
                    </p>
                  )}
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500 mr-2" />
                  <AlertDescription className="text-blue-700">
                    Tokens are used to fund legal bounties and receive rewards for contributions. All transactions are
                    securely recorded on the Hedera ledger.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="sell" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="sell-amount">Amount to Sell ({tokenData.symbol})</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="sell-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                    />
                    <Button onClick={handleSellTokens} disabled={loadingTransfer}>
                      {loadingTransfer ? "Processing..." : "Sell"}
                    </Button>
                  </div>
                  {tokenAmount && !isNaN(Number(tokenAmount)) && (
                    <p className="text-sm text-muted-foreground">
                      You will receive: ${(Number(tokenAmount) * tokenData.price).toFixed(2)}
                    </p>
                  )}
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500 mr-2" />
                  <AlertDescription className="text-blue-700">
                    Selling tokens converts your HAKI back to stablecoin at the current market rate. Transaction fees
                    may apply.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>

            {/* Recent transactions */}
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Transactions</h3>
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-3 border rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge variant={tx.type === "buy" ? "default" : "destructive"} className="mr-2">
                        {tx.type === "buy" ? "BUY" : "SELL"}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">
                          {tx.amount.toLocaleString()} {tokenData.symbol}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${(tx.amount * tx.price).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">at ${tx.price}/token</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

