"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui"
import { TrendingUp, TrendingDown, DollarSign, Award, ArrowRight, BarChart2, RefreshCw, Clock } from "lucide-react"
import { formatCurrency } from "@/utils/format-utils"

// Types
interface TokenPrice {
  timestamp: string
  price: number
}

interface TokenStats {
  currentPrice: number
  priceChange24h: number
  priceChangePercentage24h: number
  marketCap: number
  volume24h: number
  circulatingSupply: number
  totalSupply: number
}

const TokenMarketplace: React.FC = () => {
  const [usdBalance, setUsdBalance] = useState(0)
  const [hakiBalance, setHakiBalance] = useState(0)
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null)
  const [priceHistory, setPriceHistory] = useState<TokenPrice[]>([])
  const [buyAmount, setBuyAmount] = useState("")
  const [sellAmount, setSellAmount] = useState("")
  const [buyTotal, setBuyTotal] = useState(0)
  const [sellTotal, setSellTotal] = useState(0)
  const [timeframe, setTimeframe] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [transacting, setTransacting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, these would be API calls
        // const walletResponse = await apiService.get('/wallet');
        // const tokenStatsResponse = await apiService.get('/token/stats');
        // const priceHistoryResponse = await apiService.get(`/token/price-history?timeframe=${timeframe}`);

        // For now, using mock data
        setUsdBalance(3750.25)
        setHakiBalance(1250)
        setTokenStats(mockTokenStats)
        setPriceHistory(generateMockPriceHistory(timeframe))
      } catch (error) {
        console.error("Error fetching token data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeframe])

  useEffect(() => {
    // Calculate buy total
    if (buyAmount && !isNaN(Number(buyAmount)) && tokenStats) {
      const amount = Number(buyAmount)
      setBuyTotal(amount * tokenStats.currentPrice)
    } else {
      setBuyTotal(0)
    }

    // Calculate sell total
    if (sellAmount && !isNaN(Number(sellAmount)) && tokenStats) {
      const amount = Number(sellAmount)
      setSellTotal(amount * tokenStats.currentPrice)
    } else {
      setSellTotal(0)
    }
  }, [buyAmount, sellAmount, tokenStats])

  const handleBuyTokens = async () => {
    if (!buyAmount || isNaN(Number(buyAmount)) || Number(buyAmount) <= 0 || !tokenStats) {
      return
    }

    const amount = Number(buyAmount)
    const total = amount * tokenStats.currentPrice

    if (total > usdBalance) {
      alert("Insufficient USD balance")
      return
    }

    setTransacting(true)

    try {
      // In a real implementation, this would be an API call
      // await apiService.post('/token/buy', {
      //   amount
      // });

      // Update balances
      setUsdBalance((prev) => prev - total)
      setHakiBalance((prev) => prev + amount)

      // Reset form
      setBuyAmount("")

      // Show success message
      alert(`Successfully purchased ${amount} HAKI tokens!`)
    } catch (error) {
      console.error("Error buying tokens:", error)
      alert("Failed to buy tokens. Please try again.")
    } finally {
      setTransacting(false)
    }
  }

  const handleSellTokens = async () => {
    if (!sellAmount || isNaN(Number(sellAmount)) || Number(sellAmount) <= 0 || !tokenStats) {
      return
    }

    const amount = Number(sellAmount)

    if (amount > hakiBalance) {
      alert("Insufficient HAKI balance")
      return
    }

    setTransacting(true)

    try {
      // In a real implementation, this would be an API call
      // await apiService.post('/token/sell', {
      //   amount
      // });

      // Update balances
      const total = amount * tokenStats.currentPrice
      setHakiBalance((prev) => prev - amount)
      setUsdBalance((prev) => prev + total)

      // Reset form
      setSellAmount("")

      // Show success message
      alert(`Successfully sold ${amount} HAKI tokens!`)
    } catch (error) {
      console.error("Error selling tokens:", error)
      alert("Failed to sell tokens. Please try again.")
    } finally {
      setTransacting(false)
    }
  }

  const renderPriceChart = () => {
    // In a real implementation, this would be a proper chart component
    // For now, just showing a placeholder
    return (
      <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
        <BarChart2 className="h-16 w-16 text-muted-foreground" />
        <span className="ml-4 text-muted-foreground">Price chart will be displayed here</span>
      </div>
    )
  }

  if (loading || !tokenStats) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">HAKI Token Marketplace</h1>

      {/* Token Stats */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-purple-500" />
                HAKI Token
              </CardTitle>
              <CardDescription>Current market statistics</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(tokenStats.currentPrice)}</div>
              <div
                className={`flex items-center justify-end ${
                  tokenStats.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {tokenStats.priceChangePercentage24h >= 0 ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                {tokenStats.priceChangePercentage24h >= 0 ? "+" : ""}
                {tokenStats.priceChangePercentage24h.toFixed(2)}%
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="font-medium">{formatCurrency(tokenStats.marketCap)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="font-medium">{formatCurrency(tokenStats.volume24h)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Circulating Supply</p>
              <p className="font-medium">{tokenStats.circulatingSupply.toLocaleString()} HAKI</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Supply</p>
              <p className="font-medium">{tokenStats.totalSupply.toLocaleString()} HAKI</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Chart */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Price History</CardTitle>
            <TabsList>
              <TabsTrigger
                value="24h"
                onClick={() => setTimeframe("24h")}
                className={timeframe === "24h" ? "bg-primary text-primary-foreground" : ""}
              >
                24h
              </TabsTrigger>
              <TabsTrigger
                value="7d"
                onClick={() => setTimeframe("7d")}
                className={timeframe === "7d" ? "bg-primary text-primary-foreground" : ""}
              >
                7d
              </TabsTrigger>
              <TabsTrigger
                value="30d"
                onClick={() => setTimeframe("30d")}
                className={timeframe === "30d" ? "bg-primary text-primary-foreground" : ""}
              >
                30d
              </TabsTrigger>
              <TabsTrigger
                value="all"
                onClick={() => setTimeframe("all")}
                className={timeframe === "all" ? "bg-primary text-primary-foreground" : ""}
              >
                All
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>{renderPriceChart()}</CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => setTimeframe(timeframe)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardFooter>
      </Card>

      {/* Buy/Sell Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buy Card */}
        <Card>
          <CardHeader>
            <CardTitle>Buy HAKI Tokens</CardTitle>
            <CardDescription>Purchase HAKI tokens with your USD balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your USD Balance</label>
                <div className="flex items-center p-3 bg-muted rounded-md">
                  <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">{formatCurrency(usdBalance)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount to Buy (HAKI)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-center py-2">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total Cost (USD)</label>
                <div className="flex items-center p-3 bg-muted rounded-md">
                  <span className="font-medium">{formatCurrency(buyTotal)}</span>
                </div>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Processing Time</AlertTitle>
                <AlertDescription>Token purchases are processed immediately on the Hedera network.</AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleBuyTokens}
              disabled={
                !buyAmount || isNaN(Number(buyAmount)) || Number(buyAmount) <= 0 || buyTotal > usdBalance || transacting
              }
            >
              {transacting ? "Processing..." : "Buy HAKI Tokens"}
            </Button>
          </CardFooter>
        </Card>

        {/* Sell Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sell HAKI Tokens</CardTitle>
            <CardDescription>Sell your HAKI tokens for USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your HAKI Balance</label>
                <div className="flex items-center p-3 bg-muted rounded-md">
                  <Award className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="font-medium">{hakiBalance.toFixed(2)} HAKI</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount to Sell (HAKI)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-center py-2">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total Received (USD)</label>
                <div className="flex items-center p-3 bg-muted rounded-md">
                  <span className="font-medium">{formatCurrency(sellTotal)}</span>
                </div>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Processing Time</AlertTitle>
                <AlertDescription>Token sales are processed immediately on the Hedera network.</AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleSellTokens}
              disabled={
                !sellAmount ||
                isNaN(Number(sellAmount)) ||
                Number(sellAmount) <= 0 ||
                Number(sellAmount) > hakiBalance ||
                transacting
              }
            >
              {transacting ? "Processing..." : "Sell HAKI Tokens"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

// Mock data
const mockTokenStats: TokenStats = {
  currentPrice: 1.25,
  priceChange24h: 0.05,
  priceChangePercentage24h: 4.17,
  marketCap: 12500000,
  volume24h: 750000,
  circulatingSupply: 10000000,
  totalSupply: 100000000,
}

// Generate mock price history data
const generateMockPriceHistory = (timeframe: string): TokenPrice[] => {
  const now = new Date()
  const data: TokenPrice[] = []

  let dataPoints = 0
  let startPrice = 1.0

  switch (timeframe) {
    case "24h":
      dataPoints = 24
      startPrice = 1.2
      break
    case "7d":
      dataPoints = 7
      startPrice = 1.15
      break
    case "30d":
      dataPoints = 30
      startPrice = 1.0
      break
    case "all":
      dataPoints = 90
      startPrice = 0.5
      break
  }

  for (let i = dataPoints; i >= 0; i--) {
    const date = new Date()

    if (timeframe === "24h") {
      date.setHours(now.getHours() - i)
    } else if (timeframe === "7d") {
      date.setDate(now.getDate() - i)
    } else if (timeframe === "30d") {
      date.setDate(now.getDate() - i)
    } else {
      date.setDate(now.getDate() - i)
    }

    // Generate a somewhat realistic price progression
    const randomFactor = 1 + (Math.random() * 0.1 - 0.05) // -5% to +5%

    if (i === dataPoints) {
      // First data point
      data.push({
        timestamp: date.toISOString(),
        price: startPrice,
      })
    } else {
      // Subsequent data points based on previous price
      const prevPrice = data[data.length - 1].price
      data.push({
        timestamp: date.toISOString(),
        price: prevPrice * randomFactor,
      })
    }
  }

  // Ensure the last price matches the current price
  if (data.length > 0) {
    data[data.length - 1].price = mockTokenStats.currentPrice
  }

  return data
}

export default TokenMarketplace

