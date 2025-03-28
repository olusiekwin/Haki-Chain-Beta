"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Separator } from "../components/ui/separator"
import { Alert, AlertDescription } from "../components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { useAuth } from "../contexts/auth-context"
import { CheckCircle, XCircle, AlertCircle, DollarSign, User, Eye, Users, Briefcase } from "lucide-react"

// Mock data for pending bounties
const mockPendingBounties = [
  {
    id: "1",
    title: "Land Rights Case for Indigenous Community",
    ngo: {
      id: "ngo1",
      name: "Amazon Defenders Coalition",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    location: "Brazil",
    practiceAreas: ["Environmental Law", "Indigenous Rights", "Land Rights"],
    fundingGoal: 15000,
    createdAt: "2023-09-10",
    status: "pending",
  },
  {
    id: "2",
    title: "Environmental Pollution Class Action",
    ngo: {
      id: "ngo2",
      name: "Clean Water Initiative",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    location: "United States",
    practiceAreas: ["Environmental Law", "Class Action", "Public Health"],
    fundingGoal: 25000,
    createdAt: "2023-09-05",
    status: "pending",
  },
  {
    id: "3",
    title: "Refugee Asylum Case Support",
    ngo: {
      id: "ngo3",
      name: "Refugee Rights Alliance",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    location: "Global",
    practiceAreas: ["Immigration Law", "Human Rights", "Asylum"],
    fundingGoal: 18000,
    createdAt: "2023-09-15",
    status: "pending",
  },
]

// Mock data for active bounties
const mockActiveBounties = [
  {
    id: "4",
    title: "Domestic Violence Survivor Advocacy",
    ngo: {
      id: "ngo4",
      name: "Safe Haven Project",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    lawyer: {
      id: "lawyer1",
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    location: "Canada",
    practiceAreas: ["Family Law", "Domestic Violence", "Housing Rights"],
    fundingGoal: 12000,
    currentFunding: 9000,
    createdAt: "2023-08-01",
    status: "active",
    progress: 25,
  },
  {
    id: "5",
    title: "Digital Privacy Rights Defense",
    ngo: {
      id: "ngo5",
      name: "Digital Freedom Foundation",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    lawyer: {
      id: "lawyer2",
      name: "James Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    location: "European Union",
    practiceAreas: ["Digital Rights", "Privacy Law", "Constitutional Law"],
    fundingGoal: 20000,
    currentFunding: 15000,
    createdAt: "2023-08-20",
    status: "active",
    progress: 50,
  },
]

// Mock data for completed bounties
const mockCompletedBounties = [
  {
    id: "6",
    title: "Indigenous Land Rights Case in Peru",
    ngo: {
      id: "ngo6",
      name: "Rainforest Alliance",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    lawyer: {
      id: "lawyer3",
      name: "Carlos Mendez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    location: "Peru",
    practiceAreas: ["Environmental Law", "Indigenous Rights", "Land Rights"],
    fundingGoal: 10000,
    currentFunding: 10000,
    createdAt: "2023-07-01",
    completedAt: "2023-08-15",
    status: "completed",
  },
]

// Mock data for platform statistics
const mockStats = {
  totalBounties: 25,
  activeBounties: 12,
  completedBounties: 8,
  pendingBounties: 5,
  totalFunding: 350000,
  totalLawyers: 45,
  totalNGOs: 18,
  totalDonors: 230,
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [pendingBounties, setPendingBounties] = useState(mockPendingBounties)
  const [activeBounties, setActiveBounties] = useState(mockActiveBounties)
  const [completedBounties, setCompletedBounties] = useState(mockCompletedBounties)
  const [stats, setStats] = useState(mockStats)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBounty, setSelectedBounty] = useState<any>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [approvalNotes, setApprovalNotes] = useState("")
  const [rejectionNotes, setRejectionNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would fetch from your API
        // const pendingResponse = await apiService.get('/bounties?status=pending')
        // const activeResponse = await apiService.get('/bounties?status=active')
        // const completedResponse = await apiService.get('/bounties?status=completed')
        // const statsResponse = await apiService.get('/admin/stats')

        // setPendingBounties(pendingResponse.data)
        // setActiveBounties(activeResponse.data)
        // setCompletedBounties(completedResponse.data)
        // setStats(statsResponse.data)

        // Using mock data for now
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setPendingBounties(mockPendingBounties)
        setActiveBounties(mockActiveBounties)
        setCompletedBounties(mockCompletedBounties)
        setStats(mockStats)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleViewBounty = (bounty: any) => {
    window.location.href = `/bounty-details/${bounty.id}`
  }

  const handleApproveBounty = async () => {
    if (!selectedBounty) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, this would call your API
      // await apiService.post(`/bounties/${selectedBounty.id}/approve`, { notes: approvalNotes })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update local state
      setPendingBounties((prev) => prev.filter((b) => b.id !== selectedBounty.id))
      setActiveBounties((prev) => [
        {
          ...selectedBounty,
          status: "active",
          currentFunding: 0,
          progress: 0,
        },
        ...prev,
      ])
      setStats((prev) => ({
        ...prev,
        pendingBounties: prev.pendingBounties - 1,
        activeBounties: prev.activeBounties + 1,
      }))

      setSuccess(`Bounty "${selectedBounty.title}" has been approved successfully`)

      // Clear form and close dialog
      setApprovalNotes("")
      setIsApproveDialogOpen(false)
      setSelectedBounty(null)

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (error) {
      console.error("Error approving bounty:", error)
      setError("Failed to approve bounty. Please try again.")

      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectBounty = async () => {
    if (!selectedBounty) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, this would call your API
      // await apiService.post(`/bounties/${selectedBounty.id}/reject`, { notes: rejectionNotes })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update local state
      setPendingBounties((prev) => prev.filter((b) => b.id !== selectedBounty.id))
      setStats((prev) => ({
        ...prev,
        pendingBounties: prev.pendingBounties - 1,
      }))

      setSuccess(`Bounty "${selectedBounty.title}" has been rejected`)

      // Clear form and close dialog
      setRejectionNotes("")
      setIsRejectDialogOpen(false)
      setSelectedBounty(null)

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (error) {
      console.error("Error rejecting bounty:", error)
      setError("Failed to reject bounty. Please try again.")

      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage bounties, users, and platform settings</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-background border-purple-100 dark:border-purple-900/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Bounties</p>
                <p className="text-2xl font-bold">{stats.totalBounties}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-background border-purple-100 dark:border-purple-900/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Funding</p>
                <p className="text-2xl font-bold">${stats.totalFunding.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-background border-purple-100 dark:border-purple-900/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Lawyers</p>
                <p className="text-2xl font-bold">{stats.totalLawyers}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-background border-purple-100 dark:border-purple-900/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total NGOs</p>
                <p className="text-2xl font-bold">{stats.totalNGOs}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="pending">Pending Approval ({pendingBounties.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeBounties.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedBounties.length})</TabsTrigger>
        </TabsList>

        {/* Pending Bounties Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle>Bounties Pending Approval</CardTitle>
              <CardDescription>Review and approve or reject new bounties</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : pendingBounties.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p className="text-muted-foreground">There are no bounties pending approval at the moment.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bounty</TableHead>
                      <TableHead>NGO</TableHead>
                      <TableHead>Funding Goal</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBounties.map((bounty) => (
                      <TableRow key={bounty.id}>
                        <TableCell>
                          <div className="font-medium">{bounty.title}</div>
                          <div className="text-sm text-muted-foreground">{bounty.location}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={bounty.ngo.avatar} alt={bounty.ngo.name} />
                              <AvatarFallback>{bounty.ngo.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center">
                              {bounty.ngo.name}
                              {bounty.ngo.verified && <CheckCircle className="h-3 w-3 ml-1 text-blue-500" />}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${bounty.fundingGoal.toLocaleString()}</TableCell>
                        <TableCell>{new Date(bounty.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewBounty(bounty)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20"
                              onClick={() => {
                                setSelectedBounty(bounty)
                                setIsApproveDialogOpen(true)
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                              onClick={() => {
                                setSelectedBounty(bounty)
                                setIsRejectDialogOpen(true)
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Bounties Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle>Active Bounties</CardTitle>
              <CardDescription>Monitor ongoing bounties and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : activeBounties.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium">No active bounties</h3>
                  <p className="text-muted-foreground">There are no active bounties at the moment.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bounty</TableHead>
                      <TableHead>NGO</TableHead>
                      <TableHead>Lawyer</TableHead>
                      <TableHead>Funding</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeBounties.map((bounty) => (
                      <TableRow key={bounty.id}>
                        <TableCell>
                          <div className="font-medium">{bounty.title}</div>
                          <div className="text-sm text-muted-foreground">{bounty.location}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={bounty.ngo.avatar} alt={bounty.ngo.name} />
                              <AvatarFallback>{bounty.ngo.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{bounty.ngo.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={bounty.lawyer.avatar} alt={bounty.lawyer.name} />
                              <AvatarFallback>{bounty.lawyer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{bounty.lawyer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${bounty.currentFunding.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">of ${bounty.fundingGoal.toLocaleString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${bounty.progress}%` }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{bounty.progress}% complete</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewBounty(bounty)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Bounties Tab */}
        <TabsContent value="completed" className="space-y-4">
          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle>Completed Bounties</CardTitle>
              <CardDescription>Review successfully completed bounties</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : completedBounties.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium">No completed bounties</h3>
                  <p className="text-muted-foreground">There are no completed bounties at the moment.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bounty</TableHead>
                      <TableHead>NGO</TableHead>
                      <TableHead>Lawyer</TableHead>
                      <TableHead>Funding</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedBounties.map((bounty) => (
                      <TableRow key={bounty.id}>
                        <TableCell>
                          <div className="font-medium">{bounty.title}</div>
                          <div className="text-sm text-muted-foreground">{bounty.location}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={bounty.ngo.avatar} alt={bounty.ngo.name} />
                              <AvatarFallback>{bounty.ngo.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{bounty.ngo.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={bounty.lawyer.avatar} alt={bounty.lawyer.name} />
                              <AvatarFallback>{bounty.lawyer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{bounty.lawyer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>${bounty.fundingGoal.toLocaleString()}</TableCell>
                        <TableCell>{new Date(bounty.completedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewBounty(bounty)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Bounty</DialogTitle>
            <DialogDescription>
              This will make the bounty visible to lawyers and allow them to claim it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedBounty && (
              <div className="space-y-2">
                <h3 className="font-medium">{selectedBounty.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={selectedBounty.ngo.avatar} alt={selectedBounty.ngo.name} />
                    <AvatarFallback>{selectedBounty.ngo.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{selectedBounty.ngo.name}</span>
                </div>
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="approval-notes">Admin Notes (Optional)</Label>
              <Textarea
                id="approval-notes"
                placeholder="Add any notes or feedback for the NGO..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApproveBounty}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
            >
              {isLoading ? "Approving..." : "Approve Bounty"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Bounty</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this bounty. This feedback will be sent to the NGO.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedBounty && (
              <div className="space-y-2">
                <h3 className="font-medium">{selectedBounty.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={selectedBounty.ngo.avatar} alt={selectedBounty.ngo.name} />
                    <AvatarFallback>{selectedBounty.ngo.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{selectedBounty.ngo.name}</span>
                </div>
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="rejection-notes">Rejection Reason (Required)</Label>
              <Textarea
                id="rejection-notes"
                placeholder="Explain why this bounty is being rejected..."
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRejectBounty}
              disabled={isLoading || !rejectionNotes.trim()}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
            >
              {isLoading ? "Rejecting..." : "Reject Bounty"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

