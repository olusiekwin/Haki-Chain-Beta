"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Progress } from "../components/ui/progress"
import { Alert, AlertDescription } from "../components/ui/alert"
import { useAuth } from "../contexts/auth-context"
import {
  DollarSign,
  Calendar,
  Heart,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  BarChart2,
  Award,
  FileText,
  Users,
} from "lucide-react"

// Mock data for donor dashboard
const mockDonorData = {
  totalDonated: 3500,
  totalBountiesSupported: 5,
  impactScore: 85,
  tokenBalance: 120,
  donations: [
    {
      id: "1",
      bounty: {
        id: "b1",
        title: "Land Rights Case for Indigenous Community",
        ngo: {
          name: "Amazon Defenders Coalition",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: true,
        },
        status: "active",
        progress: 25,
      },
      amount: 1000,
      date: "2023-09-15",
      tokensEarned: 50,
    },
    {
      id: "2",
      bounty: {
        id: "b2",
        title: "Environmental Pollution Class Action",
        ngo: {
          name: "Clean Water Initiative",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: true,
        },
        status: "active",
        progress: 50,
      },
      amount: 800,
      date: "2023-09-10",
      tokensEarned: 40,
    },
    {
      id: "3",
      bounty: {
        id: "b3",
        title: "Refugee Asylum Case Support",
        ngo: {
          name: "Refugee Rights Alliance",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: true,
        },
        status: "active",
        progress: 10,
      },
      amount: 500,
      date: "2023-08-25",
      tokensEarned: 25,
    },
    {
      id: "4",
      bounty: {
        id: "b4",
        title: "Indigenous Land Rights Case in Peru",
        ngo: {
          name: "Rainforest Alliance",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: true,
        },
        status: "completed",
        progress: 100,
      },
      amount: 1200,
      date: "2023-07-15",
      tokensEarned: 60,
    },
  ],
  recommendedBounties: [
    {
      id: "r1",
      title: "Domestic Violence Survivor Advocacy",
      ngo: {
        name: "Safe Haven Project",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      fundingGoal: 12000,
      currentFunding: 9000,
      deadline: "2023-11-15",
      matchScore: 92,
    },
    {
      id: "r2",
      title: "Digital Privacy Rights Defense",
      ngo: {
        name: "Digital Freedom Foundation",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      fundingGoal: 20000,
      currentFunding: 15000,
      deadline: "2024-01-15",
      matchScore: 88,
    },
  ],
  impactMetrics: {
    peopleHelped: 250,
    communitiesSupported: 3,
    legalPrecedentsSet: 1,
    environmentalAreaProtected: "5,000 acres",
  },
}

export function DonorDashboard() {
  const { user } = useAuth()
  const [donorData, setDonorData] = useState(mockDonorData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch donor data from API
  useEffect(() => {
    const fetchDonorData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would fetch from your API
        // const response = await apiService.get('/donor/dashboard')
        // setDonorData(response.data)

        // Using mock data for now
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setDonorData(mockDonorData)
      } catch (error) {
        console.error("Error fetching donor data:", error)
        setError("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonorData()
  }, [])

  const handleViewBounty = (bountyId: string) => {
    window.location.href = `/bounty-details/${bountyId}`
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Donor Dashboard</h1>
        <p className="text-muted-foreground">Track your donations and the impact you're making</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-background border-purple-100 dark:border-purple-900/50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Donated</p>
                    <p className="text-2xl font-bold">${donorData.totalDonated.toLocaleString()}</p>
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
                    <p className="text-sm text-muted-foreground">Bounties Supported</p>
                    <p className="text-2xl font-bold">{donorData.totalBountiesSupported}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-background border-purple-100 dark:border-purple-900/50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">HAKI Balance</p>
                    <p className="text-2xl font-bold">{donorData.tokenBalance} HAKI</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Metrics */}
          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>The difference your donations are making</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-2xl font-bold">{donorData.impactMetrics.peopleHelped}</p>
                  <p className="text-sm text-muted-foreground">People Helped</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-2xl font-bold">{donorData.impactMetrics.communitiesSupported}</p>
                  <p className="text-sm text-muted-foreground">Communities Supported</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-2xl font-bold">{donorData.impactMetrics.legalPrecedentsSet}</p>
                  <p className="text-sm text-muted-foreground">Legal Precedents Set</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-2xl font-bold">{donorData.impactMetrics.environmentalAreaProtected}</p>
                  <p className="text-sm text-muted-foreground">Area Protected</p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BarChart2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Impact Score: {donorData.impactScore}/100</p>
                    <p className="text-sm text-muted-foreground">Based on your donation history and case outcomes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donation History */}
          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>Your contributions to legal bounties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {donorData.donations.map((donation) => (
                <div key={donation.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-medium">{donation.bounty.title}</h3>
                      <div className="flex items-center">
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarImage src={donation.bounty.ngo.avatar} alt={donation.bounty.ngo.name} />
                          <AvatarFallback>{donation.bounty.ngo.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground flex items-center">
                          {donation.bounty.ngo.name}
                          {donation.bounty.ngo.verified && <CheckCircle className="h-3 w-3 ml-1 text-blue-500" />}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${donation.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{new Date(donation.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={donation.bounty.status === "completed" ? "default" : "outline"}
                        className={
                          donation.bounty.status === "completed"
                            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                            : ""
                        }
                      >
                        {donation.bounty.status === "completed" ? "Completed" : "In Progress"}
                      </Badge>
                      <div className="flex items-center text-sm">
                        <Award className="h-4 w-4 mr-1 text-purple-500" />
                        <span>{donation.tokensEarned} HAKI earned</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary border-primary/20 hover:bg-primary/10"
                      onClick={() => handleViewBounty(donation.bounty.id)}
                    >
                      View Bounty
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  {donation.bounty.status !== "completed" && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{donation.bounty.progress}%</span>
                      </div>
                      <Progress value={donation.bounty.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                variant="outline"
                className="w-full text-primary border-primary/20 hover:bg-primary/10"
                onClick={() => (window.location.href = "/donation-history")}
              >
                View Full Donation History
                <FileText className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle>Recommended Bounties</CardTitle>
              <CardDescription>Cases that match your interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {donorData.recommendedBounties.map((bounty) => (
                <div key={bounty.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{bounty.title}</h3>
                    <Badge className="bg-primary/10 text-primary border-primary/20">{bounty.matchScore}% Match</Badge>
                  </div>

                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={bounty.ngo.avatar} alt={bounty.ngo.name} />
                      <AvatarFallback>{bounty.ngo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground flex items-center">
                      {bounty.ngo.name}
                      {bounty.ngo.verified && <CheckCircle className="h-3 w-3 ml-1 text-blue-500" />}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>${bounty.fundingGoal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>Due: {new Date(bounty.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${bounty.currentFunding.toLocaleString()} raised</span>
                      <span>{Math.round((bounty.currentFunding / bounty.fundingGoal) * 100)}%</span>
                    </div>
                    <Progress value={(bounty.currentFunding / bounty.fundingGoal) * 100} className="h-1.5" />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => handleViewBounty(bounty.id)}
                  >
                    View & Donate
                  </Button>
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/discover")}>
                Discover More Bounties
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle>HAKI Tokens</CardTitle>
              <CardDescription>Manage your reward tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-xl font-bold">{donorData.tokenBalance} HAKI</p>
                  <p className="text-xs text-muted-foreground">≈ ${(donorData.tokenBalance * 0.32).toFixed(2)} USD</p>
                </div>
                <Award className="h-8 w-8 text-primary" />
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  Use Tokens
                </Button>
                <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/wallet")}>
                  Go to Wallet
                </Button>
              </div>

              <div className="rounded-md border p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">How to Earn More Tokens</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-1 mt-0.5 text-blue-600 dark:text-blue-500" />
                    <span>Donate to active bounties</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-1 mt-0.5 text-blue-600 dark:text-blue-500" />
                    <span>Refer friends to the platform</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-1 mt-0.5 text-blue-600 dark:text-blue-500" />
                    <span>Participate in community votes</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Invite Friends</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share the platform with friends and earn 50 HAKI tokens for each new donor who joins and makes their
                  first donation.
                </p>
                <Button variant="outline" className="w-full">
                  Send Invitations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

