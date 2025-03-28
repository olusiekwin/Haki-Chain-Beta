"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2, AlertCircle, CheckCircle, Wallet } from "lucide-react"
import QRCode from "qrcode.react"

export function WalletConnect() {
  const { isConnected, accountId, pairingString, isConnecting, error, connect, disconnect } = useWallet()

  return (
    <Card className="elegant-card w-full max-w-md mx-auto overflow-hidden">
      <div className="h-2 bg-gradient-elegant"></div>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Connect Wallet</CardTitle>
        <CardDescription className="text-gray-500">
          Connect your Hedera wallet to access blockchain features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="border-0 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isConnected ? (
          <div className="space-y-6">
            <Alert className="border-0 bg-green-50 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription>Wallet connected successfully</AlertDescription>
            </Alert>

            <div className="p-5 border rounded-xl bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">Account ID</div>
              <div className="font-mono text-sm break-all font-medium">{accountId}</div>
            </div>

            <Button
              variant="outline"
              className="w-full elegant-button border-elegant-primary text-elegant-primary hover:bg-elegant-primary hover:text-white"
              onClick={disconnect}
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {pairingString ? (
              <div className="flex flex-col items-center space-y-5">
                <div className="bg-white p-4 rounded-xl shadow-card">
                  <QRCode value={pairingString} size={220} />
                </div>

                <p className="text-sm text-center text-gray-500">
                  Scan this QR code with your Hedera wallet app to connect
                </p>
                <div className="w-full pt-2">
                  <Button variant="outline" className="w-full elegant-button" onClick={() => window.location.reload()}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full elegant-button bg-gradient-elegant text-white hover:shadow-elegant py-6"
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

