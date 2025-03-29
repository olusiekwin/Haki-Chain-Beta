import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock data for tokens
const tokens = [
  {
    id: 1,
    name: "Refugee Legal Aid",
    symbol: "RLA",
    price: 0.025,
    change: 5.2,
    volume: 12500,
    marketCap: 125000,
    description: "Tokens representing legal aid services for refugee families seeking asylum.",
    issuer: "Global Refugee Alliance",
    category: "Immigration",
  },
  {
    id: 2,
    name: "Environmental Justice",
    symbol: "EJT",
    price: 0.035,
    change: -2.1,
    volume: 8700,
    marketCap: 175000,
    description: "Tokens for legal support in environmental cases affecting indigenous communities.",
    issuer: "Earth Rights Coalition",
    category: "Environmental",
  },
  {
    id: 3,
    name: "Housing Rights",
    symbol: "HRT",
    price: 0.018,
    change: 1.8,
    volume: 5600,
    marketCap: 90000,
    description: "Tokens for legal assistance in housing rights and tenant protection cases.",
    issuer: "Housing Justice Network",
    category: "Housing",
  },
  {
    id: 4,
    name: "Domestic Violence Prevention",
    symbol: "DVP",
    price: 0.022,
    change: 3.5,
    volume: 7200,
    marketCap: 110000,
    description: "Tokens supporting legal services for survivors of domestic violence.",
    issuer: "Safe Haven Foundation",
    category: "Family Law",
  },
]

// Mock data for user's portfolio
const portfolio = [
  {
    id: 1,
    name: "Refugee Legal Aid",
    symbol: "RLA",
    amount: 1000,
    value: 25,
    purchasePrice: 0.02,
  },
  {
    id: 3,
    name: "Housing Rights",
    symbol: "HRT",
    amount: 500,
    value: 9,
    purchasePrice: 0.015,
  },
]

// Mock data for transaction history
const transactions = [
  {
    id: 101,
    type: "Buy",
    token: "RLA",
    amount: 500,
    price: 0.02,
    total: 10,
    date: "2023-09-15T14:30:00Z",
    status: "Completed",
  },
  {
    id: 102,
    type: "Buy",
    token: "RLA",
    amount: 500,
    price: 0.02,
    total: 10,
    date: "2023-09-10T11:15:00Z",
    status: "Completed",
  },
  {
    id: 103,
    type: "Buy",
    token: "HRT",
    amount: 500,
    price: 0.015,
    total: 7.5,
    date: "2023-09-05T09:45:00Z",
    status: "Completed",
  },
]

export default function TokenMarketplacePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Token Marketplace</h1>

      <Tabs defaultValue="market">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="market">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tokens.map((token) => (
              <Card key={token.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{token.name}</CardTitle>
                      <CardDescription className="mt-1">{token.symbol}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        token.change >= 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }
                    >
                      {token.change >= 0 ? "+" : ""}
                      {token.change}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="font-medium">${token.price.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">24h Volume</span>
                      <span className="font-medium">${token.volume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Market Cap</span>
                      <span className="font-medium">${token.marketCap.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span className="font-medium">{token.category}</span>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground line-clamp-2">{token.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Trade</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>My Holdings</CardTitle>
                <CardDescription>Your current token portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.map((holding) => (
                      <div key={holding.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="font-medium">{holding.name}</h3>
                            <p className="text-sm text-muted-foreground">{holding.symbol}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${holding.value.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {(((holding.value / holding.amount) * holding.purchasePrice - 1) * 100).toFixed(2)}%
                              {holding.value / holding.amount > holding.purchasePrice ? " profit" : " loss"}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>
                            Amount: {holding.amount} {holding.symbol}
                          </span>
                          <span>Avg. Price: ${holding.purchasePrice.toFixed(3)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You don't have any tokens in your portfolio yet.</p>
                    <Button>Buy Your First Token</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Value</div>
                  <div className="font-medium text-2xl">
                    ${portfolio.reduce((sum, holding) => sum + holding.value, 0).toFixed(2)}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Number of Assets</div>
                  <div className="font-medium">{portfolio.length}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Tokens</div>
                  <div className="font-medium">{portfolio.reduce((sum, holding) => sum + holding.amount, 0)}</div>
                </div>
                <Separator />
                <div className="pt-4">
                  <Button className="w-full mb-2">Deposit Funds</Button>
                  <Button variant="outline" className="w-full">
                    Withdraw Funds
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent token transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={tx.type === "Buy" ? "default" : "destructive"} className="uppercase">
                            {tx.type}
                          </Badge>
                          <h3 className="font-medium">{tx.token}</h3>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${tx.total.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Amount: {tx.amount} {tx.token}
                        </span>
                        <span>Price: ${tx.price.toFixed(3)}</span>
                        <span>Status: {tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't made any transactions yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

