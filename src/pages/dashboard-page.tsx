import type React from "react"
import { useApp } from "../context/app-context"
import { useHybrid } from "../hooks/use-hybrid"
import BlockchainDashboard from "../components/features/blockchain-dashboard"
import AiAssistantWidget from "../components/features/ai-assistant-widget"
import TokenManagement from "../components/features/token-management"
import BountyCreation from "../components/features/bounty-creation"
import MarketplaceListing from "../components/features/marketplace-listing"
import { config } from "../utils/config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

const DashboardPage: React.FC = () => {
  const { user } = useApp()
  const { isBlockchainEnabled, isAiAssistantEnabled } = useHybrid()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to HakiChain, {user?.first_name || "User"}!</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription>Current configuration and feature availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">API Endpoint</h3>
                <p className="text-lg font-semibold truncate">{config.apiUrl}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Blockchain Network</h3>
                <p className="text-lg font-semibold">{config.blockchain.networkId || "Not configured"}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Blockchain Features</h3>
                <p className={`text-lg font-semibold ${isBlockchainEnabled() ? "text-green-600" : "text-red-600"}`}>
                  {isBlockchainEnabled() ? "Enabled" : "Disabled"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">AI Assistant</h3>
                <p className={`text-lg font-semibold ${isAiAssistantEnabled() ? "text-green-600" : "text-red-600"}`}>
                  {isAiAssistantEnabled() ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>

            {(!isBlockchainEnabled() || !isAiAssistantEnabled()) && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Feature Notice</AlertTitle>
                <AlertDescription>
                  Some features are currently disabled. Check your environment variables to enable all platform
                  features.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {isAiAssistantEnabled() && (
          <Card className="col-span-1">
            <AiAssistantWidget />
          </Card>
        )}
      </div>

      <Tabs defaultValue="blockchain" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="bounties">Bounties</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="blockchain">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isBlockchainEnabled() ? (
              <>
                <BlockchainDashboard networkId={config.blockchain.networkId} accountId={config.blockchain.accountId} />
                <TokenManagement />
              </>
            ) : (
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Blockchain Features Disabled</CardTitle>
                  <CardDescription>Blockchain integration is currently disabled</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Feature Disabled</AlertTitle>
                    <AlertDescription>
                      Blockchain features are currently disabled. To enable blockchain features, set the
                      REACT_APP_FEATURE_BLOCKCHAIN or FEATURE_BLOCKCHAIN environment variable to "true".
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bounties">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BountyCreation />

            <Card>
              <CardHeader>
                <CardTitle>Your Active Bounties</CardTitle>
                <CardDescription>Legal tasks you've created or accepted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>You don't have any active bounties yet.</p>
                  <p className="text-sm mt-2">Create a new bounty to get started!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketplaceListing />

            <Card>
              <CardHeader>
                <CardTitle>Your Marketplace Listings</CardTitle>
                <CardDescription>Legal documents you've listed for sale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>You don't have any marketplace listings yet.</p>
                  <p className="text-sm mt-2">List a legal document to get started!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardPage

