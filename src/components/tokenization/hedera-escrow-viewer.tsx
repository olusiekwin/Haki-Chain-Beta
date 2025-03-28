"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Shield,
  ShieldCheck,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  Info,
  ExternalLink,
} from "lucide-react"
import { getEscrowStatus, releaseMilestonePayment } from "@/services/hedera/escrow-service"

interface Milestone {
  id: string
  amount: number
  description: string
  status: "pending" | "released"
  releasedAt?: string
}

interface EscrowData {
  totalAmount: number
  releasedAmount: number
  remainingAmount: number
  ngoId: string
  lawyerId: string
  bountyId: string
  status: "active" | "completed" | "refunded"
  milestones: Milestone[]
}

export function HederaEscrowViewer({ contractId, userRole }: { contractId: string; userRole: string }) {
  const [escrowData, setEscrowData] = useState<EscrowData | null>(null)
  const [loading, setLoading] = useState(true)
  const [releasingMilestone, setReleasingMilestone] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetchEscrowData = async () => {
      try {
        // In a real app, you would call your API
        const data = await getEscrowStatus(contractId)
        setEscrowData(data)
      } catch (err) {
        setError("Failed to load escrow data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEscrowData()
  }, [contractId])

  const handleReleaseMilestone = async (milestone: Milestone) => {
    setSelectedMilestone(milestone)
    setDialogOpen(true)
  }

  const confirmReleaseMilestone = async () => {
    if (!selectedMilestone || !escrowData) return

    setReleasingMilestone(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, you would call your API
      await releaseMilestonePayment(contractId, selectedMilestone.id, escrowData.lawyerId)

      // Update the local state
      const updatedMilestones = escrowData.milestones.map((m) =>
        m.id === selectedMilestone.id ? { ...m, status: "released", releasedAt: new Date().toISOString() } : m,
      )

      const releasedAmount = selectedMilestone.amount + escrowData.releasedAmount
      const remainingAmount = escrowData.totalAmount - releasedAmount

      setEscrowData({
        ...escrowData,
        milestones: updatedMilestones,
        releasedAmount,
        remainingAmount,
        status: remainingAmount === 0 ? "completed" : "active",
      })

      setSuccess(`Successfully released milestone payment of $${selectedMilestone.amount}`)
      setDialogOpen(false)
    } catch (err) {
      setError("Failed to release milestone payment")
      console.error(err)
    } finally {
      setReleasingMilestone(false)
    }
  }

  if (loading) {
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
          <Shield className="h-5 w-5 mr-2" />
          Hedera Escrow Contract
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
            <ShieldCheck className="h-3 w-3 mr-1" /> Secure
          </Badge>
        </CardTitle>
        <CardDescription>
          View and manage the secure escrow for this legal bounty powered by Hedera's distributed ledger
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
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {escrowData && (
          <div className="space-y-6">
            {/* Escrow overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg flex items-center">
                <DollarSign className="h-8 w-8 mr-3 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">${escrowData.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg flex items-center">
                <CheckCircle className="h-8 w-8 mr-3 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Released</p>
                  <p className="text-2xl font-bold">${escrowData.releasedAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg flex items-center">
                <Lock className="h-8 w-8 mr-3 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Remaining in Escrow</p>
                  <p className="text-2xl font-bold">${escrowData.remainingAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Escrow Progress</span>
                <span>{Math.round((escrowData.releasedAmount / escrowData.totalAmount) * 100)}%</span>
              </div>
              <Progress value={(escrowData.releasedAmount / escrowData.totalAmount) * 100} className="h-2" />
            </div>

            {/* Contract details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Contract ID</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm">{contractId}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://hashscan.io/testnet/contract/${contractId}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={
                    escrowData.status === "completed"
                      ? "default"
                      : escrowData.status === "active"
                        ? "outline"
                        : "secondary"
                  }
                  className="mt-1"
                >
                  {escrowData.status === "completed"
                    ? "COMPLETED"
                    : escrowData.status === "active"
                      ? "ACTIVE"
                      : "REFUNDED"}
                </Badge>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="text-lg font-medium mb-3">Milestones</h3>
              <div className="space-y-3">
                {escrowData.milestones.map((milestone) => (
                  <div key={milestone.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{milestone.description}</h4>
                        <p className="text-lg font-bold mt-1">${milestone.amount.toLocaleString()}</p>
                      </div>
                      <Badge
                        variant={milestone.status === "released" ? "default" : "outline"}
                        className={
                          milestone.status === "released" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                        }
                      >
                        {milestone.status === "released" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" /> RELEASED
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 mr-1" /> IN ESCROW
                          </>
                        )}
                      </Badge>
                    </div>

                    {milestone.status === "released" && milestone.releasedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Released on {new Date(milestone.releasedAt).toLocaleDateString()}
                      </p>
                    )}

                    {/* Show release button for NGO role if milestone is pending */}
                    {userRole === "ngo" && milestone.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleReleaseMilestone(milestone)}
                      >
                        <Unlock className="h-3 w-3 mr-1" /> Release Payment
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow security info */}
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500 mr-2" />
              <AlertDescription className="text-blue-700">
                This escrow is secured by the Hedera distributed ledger. All funds are held in a smart contract and can
                only be released when milestones are verified and approved.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>

      {/* Release milestone dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Milestone Payment</DialogTitle>
            <DialogDescription>
              Confirm that you want to release this milestone payment from escrow to the assigned lawyer.
            </DialogDescription>
          </DialogHeader>

          {selectedMilestone && (
            <div className="py-4">
              <div className="p-4 border rounded-lg mb-4">
                <p className="text-sm text-muted-foreground">Milestone</p>
                <p className="font-medium">{selectedMilestone.description}</p>
                <p className="text-xl font-bold mt-1">${selectedMilestone.amount.toLocaleString()}</p>
              </div>

              <Alert>
                <Info className="h-4 w-4 mr-2" />
                <AlertDescription>
                  This action cannot be undone. The funds will be permanently released from escrow to the lawyer's
                  account.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReleaseMilestone} disabled={releasingMilestone}>
              {releasingMilestone ? "Processing..." : "Confirm Release"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

