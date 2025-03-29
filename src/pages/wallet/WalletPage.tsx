"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useApp } from "../../context/AppContext"
import { useHybrid } from "../../hooks/useHybrid"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card"
import { Alert, AlertDescription } from "../../components/ui/Alert"
import { Wallet, Copy, ExternalLink } from "lucide-react"

const WalletPage: React.FC = () => {
  const { user, wallet } = useApp()
  const { isBlockchainEnabled, getTokenBalance, linkWallet } = useHybrid()

  const [tokenBalance, setTokenBalance] = useState<string | null>(null)
  const [isLinking, setIsLinking] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Fetch token balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet.isConnected && isBlockchainEnabled()) {
        try {
          const result = await getTokenBalance()
          if (result.success) {
            setTokenBalance(result.balance)
          }
        } catch (error) {
          console.error("Error fetching token balance:", error)
        }
      }
    }

    fetchBalance()
  }, [wallet.isConnected, isBlockchainEnabled, getTokenBalance])

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await wallet.connect()
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  // Handle wallet disconnection
  const handleDisconnectWallet = () => {
    wallet.disconnect()
    setTokenBalance(null)
  }

  // Handle linking wallet to user account
  const handleLinkWallet = async () => {
    setIsLinking(true)
    setLinkError(null)

    try {
      const result = await linkWallet("mock-token") // In a real app, use the actual token

      if (!result.success) {
        setLinkError(result.error || "Failed to link wallet")
      }
    } catch (error: any) {
      setLinkError(error.message || "An unexpected error occurred")
    } finally {
      setIsLinking(false)
    }
  }

  // Handle copying wallet address
  const handleCopyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Render blockchain disabled message
  if (!isBlockchainEnabled()) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>

        <Alert className="mb-6">
          <AlertDescription>
            Blockchain features are currently disabled. Please contact the administrator to enable them.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Connection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              Wallet Connection
            </CardTitle>
            <CardDescription>Connect your wallet to interact with the HakiChain platform</CardDescription>
          </CardHeader>

          <CardContent>
            {wallet.isConnected ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm text-green-500 font-medium">Connected</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Address:</span>
                  <div className="flex items-center">
                    <span className="text-sm truncate max-w-[200px]">{wallet.address}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-1"
                      onClick={handleCopyAddress}
                      title="Copy address"
                    >
                      {copied ? <span className="text-xs text-green-500">Copied!</span> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {user?.wallet_address ? (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Linked to account:</span>
                    <span className="text-sm text-green-500 font-medium">Yes</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Linked to account:</span>
                    <span className="text-sm text-yellow-500 font-medium">No</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No wallet connected. Connect your wallet to access blockchain features.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            {wallet.isConnected ? (
              <Button variant="destructive" onClick={handleDisconnectWallet}>
                Disconnect Wallet
              </Button>
            ) : (
              <Button onClick={handleConnectWallet}>Connect Wallet</Button>
            )}
          </CardFooter>
        </Card>

        {/* Token Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle>Token Balance</CardTitle>
            <CardDescription>Your HakiToken balance and transactions</CardDescription>
          </CardHeader>

          <CardContent>
            {wallet.isConnected ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">HAKI Balance:</span>
                  <span className="text-xl font-bold">{tokenBalance || "0"} HAKI</span>
                </div>

                {!user?.wallet_address && (
                  <div className="mt-4">
                    <Alert variant="warning" className="mb-4">
                      <AlertDescription>
                        Your wallet is not linked to your account. Link it now to access all features.
                      </AlertDescription>
                    </Alert>

                    {linkError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{linkError}</AlertDescription>
                      </Alert>
                    )}

                    <Button onClick={handleLinkWallet} disabled={isLinking} className="w-full">
                      {isLinking ? "Linking..." : "Link Wallet to Account"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">Connect your wallet to view your token balance</p>
              </div>
            )}
          </CardContent>

          {wallet.isConnected && (
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2">
                Send Tokens
              </Button>
              <Button>Receive Tokens</Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Transaction History */}
      {wallet.isConnected && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Recent transactions from your wallet</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 border-b px-4 py-2 font-medium">
                <div>Type</div>
                <div>Amount</div>
                <div>Date</div>
                <div>Status</div>
                <div></div>
              </div>

              {/* Mock transaction data */}
              <div className="grid grid-cols-5 border-b px-4 py-3">
                <div>Received</div>
                <div className="text-green-500">+100 HAKI</div>
                <div>{new Date().toLocaleDateString()}</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Completed
                  </span>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="icon" title="View transaction">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-5 border-b px-4 py-3">
                <div>Sent</div>
                <div className="text-red-500">-50 HAKI</div>
                <div>{new Date(Date.now() - 86400000).toLocaleDateString()}</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Completed
                  </span>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="icon" title="View transaction">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-5 px-4 py-3">
                <div>Bounty Reward</div>
                <div className="text-green-500">+200 HAKI</div>
                <div>{new Date(Date.now() - 172800000).toLocaleDateString()}</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Completed
                  </span>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="icon" title="View transaction">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default WalletPage

