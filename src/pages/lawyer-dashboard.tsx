"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Button,
  Badge,
  Avatar,
} from "@/components/ui"
import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
  ChevronRight,
  Award,
  BarChart2,
} from "lucide-react"
import { formatCurrency } from "@/utils/format-utils"

// Types
interface Milestone {
  id: string
  title: string
  description: string
  amount: number
  status: "pending" | "submitted" | "approved" | "rejected"
  dueDate: string
  submissionDate?: string
  feedback?: string
}

interface Bounty {
  id: string
  title: string
  ngo: {
    name: string
    logo: string
  }
  practiceArea: string
  totalAmount: number
  claimedDate: string
  status: "active" | "completed" | "disputed"
  progress: number
  milestones: Milestone[]
  dueDate: string
}

interface Earning {
  id: string
  bountyTitle: string
  amount: number
  date: string
  type: "milestone" | "bonus" | "token"
  status: "pending" | "processing" | "completed"
  tokenAmount?: number
}

const LawyerDashboard: React.FC = () => {
  const [activeBounties, setActiveBounties] = useState<Bounty[]>([])
  const [completedBounties, setCompletedBounties] = useState<Bounty[]>([])
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [totalEarned, setTotalEarned] = useState(0)
  const [totalPending, setTotalPending] = useState(0)
  const [hakiBalance, setHakiBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const [submissionNote, setSubmissionNote] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, these would be API calls
        // const activeBountiesResponse = await apiService.get('/lawyer/bounties/active');
        // const completedBountiesResponse = await apiService.get('/lawyer/bounties/completed');
        // const earningsResponse = await apiService.get('/lawyer/earnings');
        // const walletResponse = await apiService.get('/lawyer/wallet');

        // For now, using mock data
        setActiveBounties(mockActiveBounties)
        setCompletedBounties(mockCompletedBounties)
        setEarnings(mockEarnings)

        // Calculate totals
        const earned = mockEarnings.filter((e) => e.status === "completed").reduce((sum, e) => sum + e.amount, 0)

        const pending = mockEarnings
          .filter((e) => e.status === "pending" || e.status === "processing")
          .reduce((sum, e) => sum + e.amount, 0)

        setTotalEarned(earned)
        setTotalPending(pending)

        // If blockchain feature is enabled, fetch HAKI balance
        if (process.env.FEATURE_BLOCKCHAIN === "true") {
          try {
            // const balance = await blockchainService.getTokenBalance();
            // setHakiBalance(balance);
            setHakiBalance(1250) // Mock data
          } catch (error) {
            console.error("Error fetching token balance:", error)
            setHakiBalance(0)
          }
        }
      } catch (error) {
        console.error("Error fetching lawyer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmitMilestone = async (bountyId: string, milestoneId: string) => {
    const bounty = activeBounties.find((b) => b.id === bountyId)
    if (!bounty) return

    const milestone = bounty.milestones.find((m) => m.id === milestoneId)
    if (!milestone) return

    setSelectedBounty(bounty)
    setSelectedMilestone(milestone)
  }

  const handleSubmitEvidence = async () => {
    if (!selectedBounty || !selectedMilestone || !evidenceFile) return

    setSubmitting(true)

    try {
      // In a real implementation, this would be an API call
      // const formData = new FormData();
      // formData.append('evidence', evidenceFile);
      // formData.append('note', submissionNote);
      // await apiService.post(`/lawyer/bounties/${selectedBounty.id}/milestones/${selectedMilestone.id}/submit`, formData);

      // Update local state to reflect the change
      const updatedBounties = activeBounties.map((bounty) => {
        if (bounty.id === selectedBounty.id) {
          const updatedMilestones = bounty.milestones.map((milestone) => {
            if (milestone.id === selectedMilestone.id) {
              return { ...milestone, status: "submitted", submissionDate: new Date().toISOString() }
            }
            return milestone
          })

          // Calculate new progress
          const totalMilestones = updatedMilestones.length
          const completedMilestones = updatedMilestones.filter(
            (m) => m.status === "approved" || m.status === "submitted",
          ).length
          const newProgress = Math.round((completedMilestones / totalMilestones) * 100)

          return {
            ...bounty,
            milestones: updatedMilestones,
            progress: newProgress,
          }
        }
        return bounty
      })

      setActiveBounties(updatedBounties)
      setSelectedBounty(null)
      setSelectedMilestone(null)
      setEvidenceFile(null)
      setSubmissionNote("")

      // Show success message
      alert("Milestone evidence submitted successfully!")
    } catch (error) {
      console.error("Error submitting milestone evidence:", error)
      alert("Failed to submit milestone evidence. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelSubmission = () => {
    setSelectedBounty(null)
    setSelectedMilestone(null)
    setEvidenceFile(null)
    setSubmissionNote("")
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lawyer Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{formatCurrency(totalEarned)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{formatCurrency(totalPending)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">HAKI Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{hakiBalance} HAKI</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active-bounties">
        <TabsList className="mb-6">
          <TabsTrigger value="active-bounties">Active Bounties</TabsTrigger>
          <TabsTrigger value="completed-bounties">Completed Bounties</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        {/* Active Bounties Tab */}
        <TabsContent value="active-bounties">
          <div className="space-y-6">
            {activeBounties.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No active bounties</p>
                  <p className="text-muted-foreground mb-4">You haven't claimed any bounties yet.</p>
                  <Button>Browse Available Bounties</Button>
                </CardContent>
              </Card>
            ) : (
              activeBounties.map((bounty) => (
                <Card key={bounty.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <img src={bounty.ngo.logo || "/placeholder.svg"} alt={bounty.ngo.name} />
                        </Avatar>
                        <div>
                          <CardTitle>{bounty.title}</CardTitle>
                          <CardDescription>{bounty.ngo.name}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={
                          bounty.status === "active"
                            ? "default"
                            : bounty.status === "completed"
                              ? "success"
                              : "destructive"
                        }
                      >
                        {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{bounty.practiceArea}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{formatCurrency(bounty.totalAmount)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(bounty.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm font-medium">{bounty.progress}%</span>
                      </div>
                      <Progress value={bounty.progress} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Milestones</h4>
                      {bounty.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                          <div className="flex items-start">
                            {milestone.status === "pending" && <Clock className="h-5 w-5 mr-2 text-yellow-500" />}
                            {milestone.status === "submitted" && <Clock className="h-5 w-5 mr-2 text-blue-500" />}
                            {milestone.status === "approved" && <CheckCircle className="h-5 w-5 mr-2 text-green-500" />}
                            {milestone.status === "rejected" && <AlertCircle className="h-5 w-5 mr-2 text-red-500" />}
                            <div>
                              <p className="font-medium">{milestone.title}</p>
                              <p className="text-sm text-muted-foreground">{formatCurrency(milestone.amount)}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              variant={
                                milestone.status === "pending"
                                  ? "outline"
                                  : milestone.status === "submitted"
                                    ? "secondary"
                                    : milestone.status === "approved"
                                      ? "success"
                                      : "destructive"
                              }
                              className="mr-2"
                            >
                              {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                            </Badge>
                            {milestone.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSubmitMilestone(bounty.id, milestone.id)}
                              >
                                Submit
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Completed Bounties Tab */}
        <TabsContent value="completed-bounties">
          <div className="space-y-6">
            {completedBounties.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No completed bounties</p>
                  <p className="text-muted-foreground">Complete your active bounties to see them here.</p>
                </CardContent>
              </Card>
            ) : (
              completedBounties.map((bounty) => (
                <Card key={bounty.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <img src={bounty.ngo.logo || "/placeholder.svg"} alt={bounty.ngo.name} />
                        </Avatar>
                        <div>
                          <CardTitle>{bounty.title}</CardTitle>
                          <CardDescription>{bounty.ngo.name}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="success">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{bounty.practiceArea}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{formatCurrency(bounty.totalAmount)}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        <span className="text-sm text-green-500">
                          Completed on {new Date(bounty.claimedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Your earnings from completed bounties and HAKI rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <BarChart2 className="h-16 w-16 text-muted-foreground" />
                  <span className="ml-4 text-muted-foreground">Earnings chart will be displayed here</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No earnings yet</p>
                    </div>
                  ) : (
                    earnings.map((earning) => (
                      <div key={earning.id} className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <p className="font-medium">{earning.bountyTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(earning.date).toLocaleDateString()} •
                            {earning.type === "milestone"
                              ? " Milestone Payment"
                              : earning.type === "bonus"
                                ? " Bonus Payment"
                                : " Token Reward"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(earning.amount)}</p>
                          {earning.tokenAmount && (
                            <p className="text-sm text-purple-500">+{earning.tokenAmount} HAKI</p>
                          )}
                          <Badge
                            variant={
                              earning.status === "completed"
                                ? "success"
                                : earning.status === "processing"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="mt-1"
                          >
                            {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Milestone Submission Modal */}
      {selectedBounty && selectedMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Submit Milestone Evidence</CardTitle>
              <CardDescription>
                {selectedBounty.title} - {selectedMilestone.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Evidence</label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    {evidenceFile ? (
                      <div>
                        <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">{evidenceFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(evidenceFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button variant="ghost" size="sm" className="mt-2" onClick={() => setEvidenceFile(null)}>
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm mb-1">Drag and drop your file here, or click to browse</p>
                        <p className="text-xs text-muted-foreground mb-2">PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
                        <input
                          type="file"
                          className="hidden"
                          id="evidence-upload"
                          onChange={(e) => e.target.files && setEvidenceFile(e.target.files[0])}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("evidence-upload")?.click()}
                        >
                          Browse Files
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Submission Note</label>
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Add any additional information about your submission..."
                    value={submissionNote}
                    onChange={(e) => setSubmissionNote(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCancelSubmission}>
                Cancel
              </Button>
              <Button onClick={handleSubmitEvidence} disabled={!evidenceFile || submitting}>
                {submitting ? "Submitting..." : "Submit Evidence"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

// Mock data
const mockActiveBounties: Bounty[] = [
  {
    id: "1",
    title: "Human Rights Violation Documentation in Region X",
    ngo: {
      name: "Global Justice Initiative",
      logo: "/placeholder.svg?height=40&width=40",
    },
    practiceArea: "Human Rights",
    totalAmount: 5000,
    claimedDate: "2023-10-15",
    status: "active",
    progress: 33,
    dueDate: "2023-12-30",
    milestones: [
      {
        id: "1-1",
        title: "Initial Documentation and Research",
        description: "Gather and organize all available evidence of human rights violations.",
        amount: 1500,
        status: "approved",
        dueDate: "2023-11-01",
        submissionDate: "2023-10-28",
      },
      {
        id: "1-2",
        title: "Victim Interviews and Statements",
        description: "Conduct interviews with victims and witnesses, prepare formal statements.",
        amount: 2000,
        status: "submitted",
        dueDate: "2023-11-30",
        submissionDate: "2023-11-25",
      },
      {
        id: "1-3",
        title: "Final Report and Recommendations",
        description: "Compile findings into a comprehensive report with legal recommendations.",
        amount: 1500,
        status: "pending",
        dueDate: "2023-12-30",
      },
    ],
  },
  {
    id: "2",
    title: "Environmental Damage Lawsuit Preparation",
    ngo: {
      name: "EarthDefenders",
      logo: "/placeholder.svg?height=40&width=40",
    },
    practiceArea: "Environmental Law",
    totalAmount: 7500,
    claimedDate: "2023-11-05",
    status: "active",
    progress: 25,
    dueDate: "2024-02-15",
    milestones: [
      {
        id: "2-1",
        title: "Evidence Collection and Analysis",
        description: "Gather scientific data, expert opinions, and documentation of environmental damage.",
        amount: 2000,
        status: "approved",
        dueDate: "2023-12-01",
        submissionDate: "2023-11-28",
      },
      {
        id: "2-2",
        title: "Legal Framework Analysis",
        description: "Research applicable laws and precedents for environmental damage claims.",
        amount: 1500,
        status: "pending",
        dueDate: "2024-01-15",
      },
      {
        id: "2-3",
        title: "Draft Legal Complaint",
        description: "Prepare the initial legal complaint document with all supporting evidence.",
        amount: 2000,
        status: "pending",
        dueDate: "2024-01-31",
      },
      {
        id: "2-4",
        title: "Expert Witness Coordination",
        description: "Identify and prepare expert witnesses for testimony.",
        amount: 2000,
        status: "pending",
        dueDate: "2024-02-15",
      },
    ],
  },
]

const mockCompletedBounties: Bounty[] = [
  {
    id: "3",
    title: "Refugee Status Appeal Case",
    ngo: {
      name: "Refugee Rights Alliance",
      logo: "/placeholder.svg?height=40&width=40",
    },
    practiceArea: "Immigration Law",
    totalAmount: 3500,
    claimedDate: "2023-08-10",
    status: "completed",
    progress: 100,
    dueDate: "2023-10-01",
    milestones: [
      {
        id: "3-1",
        title: "Case Review and Strategy",
        description: "Review case details and develop appeal strategy.",
        amount: 1000,
        status: "approved",
        dueDate: "2023-08-20",
        submissionDate: "2023-08-18",
      },
      {
        id: "3-2",
        title: "Appeal Documentation",
        description: "Prepare all necessary documentation for the appeal.",
        amount: 1500,
        status: "approved",
        dueDate: "2023-09-10",
        submissionDate: "2023-09-05",
      },
      {
        id: "3-3",
        title: "Hearing Representation",
        description: "Represent client at the appeal hearing.",
        amount: 1000,
        status: "approved",
        dueDate: "2023-10-01",
        submissionDate: "2023-09-28",
      },
    ],
  },
]

const mockEarnings: Earning[] = [
  {
    id: "1",
    bountyTitle: "Refugee Status Appeal Case",
    amount: 1000,
    date: "2023-08-20",
    type: "milestone",
    status: "completed",
    tokenAmount: 100,
  },
  {
    id: "2",
    bountyTitle: "Refugee Status Appeal Case",
    amount: 1500,
    date: "2023-09-10",
    type: "milestone",
    status: "completed",
    tokenAmount: 150,
  },
  {
    id: "3",
    bountyTitle: "Refugee Status Appeal Case",
    amount: 1000,
    date: "2023-10-01",
    type: "milestone",
    status: "completed",
    tokenAmount: 100,
  },
  {
    id: "4",
    bountyTitle: "Human Rights Violation Documentation",
    amount: 1500,
    date: "2023-10-28",
    type: "milestone",
    status: "completed",
    tokenAmount: 150,
  },
  {
    id: "5",
    bountyTitle: "Human Rights Violation Documentation",
    amount: 2000,
    date: "2023-11-25",
    type: "milestone",
    status: "processing",
    tokenAmount: 200,
  },
  {
    id: "6",
    bountyTitle: "Environmental Damage Lawsuit",
    amount: 2000,
    date: "2023-11-28",
    type: "milestone",
    status: "completed",
    tokenAmount: 200,
  },
  {
    id: "7",
    bountyTitle: "Pro Bono Excellence",
    amount: 500,
    date: "2023-11-30",
    type: "bonus",
    status: "pending",
  },
]

export default LawyerDashboard

