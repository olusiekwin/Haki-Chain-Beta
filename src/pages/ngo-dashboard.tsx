"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Progress } from "../components/ui/progress"
import { Separator } from "../components/ui/separator"
import { Alert, AlertDescription } from "../components/ui/alert"
import { useAuth } from "../contexts/auth-context"
import { DollarSign, Calendar, CheckCircle, AlertCircle, Plus, Eye, Download } from "lucide-react"

// Mock data for NGO dashboard
const mockNgoDashboardData = {
  totalFunding: 45000,
  activeBounties: 3,
  completedBounties: 2,
  pendingBounties: 1,
  bounties: [
    {
      id: "1",
      title: "Land Rights Case for Indigenous Community",
      description:
        "Seeking legal assistance to protect indigenous land rights against corporate development in the Amazon rainforest.",
      fundingGoal: 15000,
      currentFunding: 12500,
      deadline: "2023-12-15",
      createdAt: "2023-08-10",
      status: "active",
      lawyer: {
        id: "lawyer1",
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      milestones: [
        {
          id: "m1",
          title: "Initial consultation and case assessment",
          amount: 3000,
          status: "completed",
          completedDate: "2023-09-15",
          paymentStatus: "paid",
          evidence: "consultation_report.pdf",
        },
        {
          id: "m2",
          title: "File emergency injunction",
          amount: 5000,
          status: "in-progress",
          dueDate: "2023-10-30",
          paymentStatus: "pending",
        },
        {
          id: "m3",
          title: "Court representation",
          amount: 7000,
          status: "pending",
          dueDate: "2023-11-30",
          paymentStatus: "pending",
        },
      ],
      donors: 15,
      progress: 33,
    },
    {
      id: "2",
      title: "Environmental Pollution Class Action",
      description:
        "Representing community affected by industrial pollution in local water sources causing health issues.",
      fundingGoal: 25000,
      currentFunding: 18000,
      deadline: "2023-11-30",
      createdAt: "2023-08-05",
      status: "active",
      lawyer: {
        id: "lawyer2",
        name: "James Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      milestones: [
        {
          id: "m4",
          title: "Initial evidence gathering",
          amount: 5000,
          status: "completed",
          completedDate: "2023-09-10",
          paymentStatus: "paid",
          evidence: "evidence_report.pdf",
        },
        {
          id: "m5",
          title: "Class certification filing",
          amount: 8000,
          status: "completed",
          completedDate: "2023-10-05",
          paymentStatus: "pending",
          evidence: "certification_filing.pdf",
        },
        {
          id: "m6",
          title: "Settlement negotiation",
          amount: 12000,
          status: "pending",
          dueDate: "2023-11-15",
          paymentStatus: "pending",
        },
      ],
      donors: 23,
      progress: 66,
    },
    {
      id: "3",
      title: "Refugee Asylum Case Support",
      description: "Providing legal assistance to refugees seeking asylum status and family reunification.",
      fundingGoal: 18000,
      currentFunding: 12000,
      deadline: "2023-12-30",
      createdAt: "2023-08-15",
      status: "active",
      lawyer: {
        id: "lawyer3",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      milestones: [
        {
          id: "m7",
          title: "Case assessment and documentation",
          amount: 4000,
          status: "completed",
          completedDate: "2023-09-20",
          paymentStatus: "paid",
          evidence: "case_assessment.pdf",
        },
        {
          id: "m8",
          title: "Asylum application preparation",
          amount: 6000,
          status: "in-progress",
          dueDate: "2023-10-25",
          paymentStatus: "pending",
        },
        {
          id: "m9",
          title: "Hearing representation",
          amount: 8000,
          status: "pending",
          dueDate: "2023-11-30",
          paymentStatus: "pending",
        },
      ],
      donors: 18,
      progress: 33,
    },
    {
      id: "4",
      title: "Indigenous Land Rights Case in Peru",
      description: "Legal support for indigenous communities in Peru facing displacement due to mining operations.",
      fundingGoal: 10000,
      currentFunding: 10000,
      deadline: "2023-07-30",
      createdAt: "2023-07-01",
      completedAt: "2023-08-15",
      status: "completed",
      lawyer: {
        id: "lawyer4",
        name: "Carlos Mendez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      milestones: [
        {
          id: "m10",
          title: "Initial consultation",
          amount: 2000,
          status: "completed",
          completedDate: "2023-07-10",
          paymentStatus: "paid",
          evidence: "peru_consultation.pdf",
        },
        {
          id: "m11",
          title: "Legal documentation",
          amount: 3000,
          status: "completed",
          completedDate: "2023-07-25",
          paymentStatus: "paid",
          evidence: "peru_documentation.pdf",
        },
        {
          id: "m12",
          title: "Court representation",
          amount: 5000,
          status: "completed",
          completedDate: "2023-08-10",
          paymentStatus: "paid",
          evidence: "peru_court_outcome.pdf",
        },
      ],
      donors: 12,
      progress: 100,
      outcome: "Successfully secured land rights for the indigenous community, preventing displacement of 200 people.",
    },
  ],
}

const NGODashboard = () => {
  const [ngoDashboardData, setNgoDashboardData] = useState(mockNgoDashboardData)
  const { user } = useAuth()

  useEffect(() => {
    // Simulate API call to fetch NGO dashboard data
    // apiService.get("/ngo-dashboard").then((response) => {
    //   setNgoDashboardData(response.data);
    // });
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Welcome, {user?.firstName} {user?.lastName}!
          </CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Bounty
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Funding</CardTitle>
                <CardDescription>Total funds raised for all bounties</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="text-3xl font-bold">${ngoDashboardData.totalFunding}</div>
                <Progress value={65} />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <DollarSign className="mr-2 h-4 w-4" /> 65% of funding goals met
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Bounties</CardTitle>
                <CardDescription>Bounties currently open for contributions</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="text-3xl font-bold">{ngoDashboardData.activeBounties}</div>
                <Progress value={70} />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" /> Deadlines approaching
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completed Bounties</CardTitle>
                <CardDescription>Bounties successfully completed</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="text-3xl font-bold">{ngoDashboardData.completedBounties}</div>
                <Progress value={100} />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <CheckCircle className="mr-2 h-4 w-4" /> Impact created
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Bounties</CardTitle>
                <CardDescription>Bounties awaiting approval</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="text-3xl font-bold">{ngoDashboardData.pendingBounties}</div>
                <Progress value={30} />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <AlertCircle className="mr-2 h-4 w-4" /> Review required
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Bounties</TabsTrigger>
          <TabsTrigger value="completed">Completed Bounties</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ngoDashboardData.bounties
              .filter((bounty) => bounty.status === "active")
              .map((bounty) => (
                <Card key={bounty.id}>
                  <CardHeader>
                    <CardTitle>{bounty.title}</CardTitle>
                    <CardDescription>{bounty.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center">
                      <Avatar className="mr-3">
                        <AvatarImage src={bounty.lawyer.avatar} alt={bounty.lawyer.name} />
                        <AvatarFallback>{bounty.lawyer.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">{bounty.lawyer.name}</div>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Funding</div>
                      <Progress value={bounty.progress} />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          ${bounty.currentFunding} / ${bounty.fundingGoal}
                        </span>
                        <span>{bounty.progress}%</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Deadline: {bounty.deadline}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        {bounty.donors} Donors
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </Button>
                    <Button>
                      <DollarSign className="mr-2 h-4 w-4" /> Donate
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ngoDashboardData.bounties
              .filter((bounty) => bounty.status === "completed")
              .map((bounty) => (
                <Card key={bounty.id}>
                  <CardHeader>
                    <CardTitle>{bounty.title}</CardTitle>
                    <CardDescription>{bounty.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center">
                      <Avatar className="mr-3">
                        <AvatarImage src={bounty.lawyer.avatar} alt={bounty.lawyer.name} />
                        <AvatarFallback>{bounty.lawyer.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">{bounty.lawyer.name}</div>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Funding</div>
                      <Progress value={bounty.progress} />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          ${bounty.currentFunding} / ${bounty.fundingGoal}
                        </span>
                        <span>{bounty.progress}%</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Completed: {bounty.completedAt}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        {bounty.donors} Donors
                      </div>
                    </div>
                    <Separator />
                    <div className="text-sm font-medium">Outcome</div>
                    <Alert className="mt-2">
                      <AlertDescription>{bounty.outcome}</AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" /> Download Report
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default NGODashboard

