"use client"

import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { useAuth } from "../contexts/auth-context"
import {
  BarChart,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Gavel,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  Briefcase,
  FileCheck,
  User,
  Building,
} from "lucide-react"

// Mock data for dashboard
const mockBounties = [
  {
    id: "1",
    title: "Land Rights Case for Indigenous Community",
    description: "Seeking legal representation for an indigenous community facing land displacement.",
    fundingGoal: 15000,
    currentFunding: 8750,
    category: "Land Rights",
    deadline: "2023-12-15",
    status: "active",
    ngo: "Amazon Defenders Coalition",
  },
  {
    id: "2",
    title: "Domestic Violence Survivor Legal Support",
    description: "Legal assistance needed for survivors of domestic violence.",
    fundingGoal: 8000,
    currentFunding: 7200,
    category: "Family Law",
    deadline: "2023-11-30",
    status: "active",
    ngo: "Safe Haven Foundation",
  },
  {
    id: "3",
    title: "Environmental Pollution Class Action",
    description: "Representing a community affected by industrial pollution.",
    fundingGoal: 25000,
    currentFunding: 12500,
    category: "Environmental Law",
    deadline: "2024-01-20",
    status: "active",
    ngo: "Clean Earth Initiative",
  },
]

const mockMilestones = [
  {
    id: "1",
    bountyId: "1",
    title: "Initial consultation and case assessment",
    description: "Meet with community leaders, gather evidence, and assess legal options",
    amount: 3000,
    status: "completed",
    completedDate: "2023-09-15",
  },
  {
    id: "2",
    bountyId: "1",
    title: "File emergency injunction",
    description: "Prepare and file emergency injunction to halt development activities",
    amount: 5000,
    status: "in-progress",
    dueDate: "2023-10-30",
  },
  {
    id: "3",
    bountyId: "2",
    title: "Initial client interviews",
    description: "Conduct interviews with clients to document cases",
    amount: 2000,
    status: "in-progress",
    dueDate: "2023-10-25",
  },
]

const mockDonations = [
  {
    id: "1",
    bountyId: "1",
    bountyTitle: "Land Rights Case for Indigenous Community",
    amount: 500,
    date: "2023-09-18",
  },
  {
    id: "2",
    bountyId: "3",
    bountyTitle: "Environmental Pollution Class Action",
    amount: 1000,
    date: "2023-09-15",
  },
]

const mockLawyers = [
  {
    id: "1",
    name: "Jane Lawyer",
    email: "jane@example.com",
    specialization: "Environmental Law",
    rating: 4.8,
    casesCompleted: 12,
    verificationStatus: "pending",
    appliedDate: "2023-09-15",
  },
  {
    id: "2",
    name: "Mark Attorney",
    email: "mark@example.com",
    specialization: "Human Rights",
    rating: 4.5,
    casesCompleted: 8,
    verificationStatus: "pending",
    appliedDate: "2023-09-18",
  },
]

export function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Determine which dashboard to show based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case "ngo":
        return <NgoDashboard />
      case "lawyer":
        return <LawyerDashboard />
      case "donor":
        return <DonorDashboard />
      case "admin":
        return <AdminDashboard />
      default:
        return <DefaultDashboard />
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || "Guest"}</p>
        </div>
        {user?.role === "ngo" && (
          <Link to="/create-bounty">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Bounty
            </Button>
          </Link>
        )}
      </div>

      {renderDashboard()}
    </div>
  )
}

function NgoDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bounties</p>
                <h3 className="text-2xl font-bold">3</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Funding</p>
                <h3 className="text-2xl font-bold">$28,450</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Gavel className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cases Won</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">People Helped</p>
                <h3 className="text-2xl font-bold">1,240</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="bounties">
        <TabsList>
          <TabsTrigger value="bounties">My Bounties</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bounties" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBounties.map((bounty) => (
              <Link to={`/bounty/${bounty.id}`} key={bounty.id}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge>{bounty.category}</Badge>
                      <Badge variant={bounty.status === "active" ? "default" : "outline"}>
                        {bounty.status === "active" ? "Active" : "Completed"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{bounty.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{bounty.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${(bounty.currentFunding / bounty.fundingGoal) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>${bounty.currentFunding.toLocaleString()}</span>
                        <span>${bounty.fundingGoal.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Deadline: {new Date(bounty.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {mockMilestones.map((milestone) => {
            const bounty = mockBounties.find((b) => b.id === milestone.bountyId)
            return (
              <Card key={milestone.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Bounty</p>
                      <CardTitle className="text-base">{bounty?.title}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        milestone.status === "completed"
                          ? "default"
                          : milestone.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {milestone.status === "completed"
                        ? "Completed"
                        : milestone.status === "in-progress"
                          ? "In Progress"
                          : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">${milestone.amount.toLocaleString()}</span>
                      {milestone.status === "completed" ? (
                        <span className="text-sm text-muted-foreground">
                          Completed on {new Date(milestone.completedDate!).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Due by {new Date(milestone.dueDate!).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funding Overview</CardTitle>
              <CardDescription>Your bounty funding performance over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart className="mx-auto h-16 w-16 mb-2" />
                <p>Analytics visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LawyerDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                <h3 className="text-2xl font-bold">2</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Earnings</p>
                <h3 className="text-2xl font-bold">$8,000</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Gavel className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cases Won</p>
                <h3 className="text-2xl font-bold">8</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</p>
                <h3 className="text-2xl font-bold">3</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification status alert if pending */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
        <div>
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Verification Pending</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Your account is pending verification by an admin. You'll be able to claim bounties once verified.
          </p>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="active-cases">
        <TabsList>
          <TabsTrigger value="active-cases">Active Cases</TabsTrigger>
          <TabsTrigger value="available-bounties">Available Bounties</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="active-cases" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockBounties.slice(0, 2).map((bounty) => (
              <Link to={`/bounty/${bounty.id}`} key={bounty.id}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge>{bounty.category}</Badge>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{bounty.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{bounty.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Next milestone due: {new Date(bounty.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available-bounties" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBounties.map((bounty) => (
              <Link to={`/bounty/${bounty.id}`} key={bounty.id}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge>{bounty.category}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{bounty.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{bounty.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${(bounty.currentFunding / bounty.fundingGoal) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>${bounty.currentFunding.toLocaleString()}</span>
                        <span>${bounty.fundingGoal.toLocaleString()}</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {mockMilestones.map((milestone) => {
            const bounty = mockBounties.find((b) => b.id === milestone.bountyId)
            return (
              <Card key={milestone.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Bounty</p>
                      <CardTitle className="text-base">{bounty?.title}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        milestone.status === "completed"
                          ? "default"
                          : milestone.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {milestone.status === "completed"
                        ? "Completed"
                        : milestone.status === "in-progress"
                          ? "In Progress"
                          : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">${milestone.amount.toLocaleString()}</span>
                      {milestone.status === "in-progress" && <Button size="sm">Mark as Completed</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DonorDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donated</p>
                <h3 className="text-2xl font-bold">$1,500</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounties Supported</p>
                <h3 className="text-2xl font-bold">2</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">People Helped</p>
                <h3 className="text-2xl font-bold">120</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="my-contributions">
        <TabsList>
          <TabsTrigger value="my-contributions">My Contributions</TabsTrigger>
          <TabsTrigger value="recommended">Recommended Bounties</TabsTrigger>
          <TabsTrigger value="impact">My Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="my-contributions" className="space-y-4">
          {mockDonations.map((donation) => {
            const bounty = mockBounties.find((b) => b.id === donation.bountyId)
            return (
              <Card key={donation.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{donation.bountyTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">${donation.amount.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">
                        Donated on {new Date(donation.date).toLocaleDateString()}
                      </span>
                    </div>
                    <Link to={`/bounty/${donation.bountyId}`}>
                      <Button variant="outline" size="sm">
                        View Bounty
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBounties.map((bounty) => (
              <Link to={`/bounty/${bounty.id}`} key={bounty.id}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge>{bounty.category}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{bounty.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{bounty.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${(bounty.currentFunding / bounty.fundingGoal) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>${bounty.currentFunding.toLocaleString()}</span>
                        <span>${bounty.fundingGoal.toLocaleString()}</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        Donate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>How your donations have made a difference</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart className="mx-auto h-16 w-16 mb-2" />
                <p>Impact visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">1,245</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">NGOs</p>
                <h3 className="text-2xl font-bold">48</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lawyers</p>
                <h3 className="text-2xl font-bold">156</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bounties</p>
                <h3 className="text-2xl font-bold">78</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="verifications">
        <TabsList>
          <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="bounties">Bounty Management</TabsTrigger>
          <TabsTrigger value="analytics">Platform Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lawyer Verification Requests</CardTitle>
              <CardDescription>Review and verify lawyer accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-4 font-medium border-b">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Specialization</div>
                  <div>Date Applied</div>
                  <div className="text-right">Actions</div>
                </div>
                {mockLawyers.map((lawyer) => (
                  <div key={lawyer.id} className="grid grid-cols-5 p-4 border-b items-center">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{lawyer.name}</span>
                    </div>
                    <div>{lawyer.email}</div>
                    <div>{lawyer.specialization}</div>
                    <div>{new Date(lawyer.appliedDate).toLocaleDateString()}</div>
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="default">
                        <CheckCircle className="h-4 w-4 mr-1" /> Verify
                      </Button>
                      <Button size="sm" variant="destructive">
                        <AlertCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">User management interface would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bounties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bounty Management</CardTitle>
              <CardDescription>Manage and moderate bounties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Bounty management interface would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Platform performance and metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart className="mx-auto h-16 w-16 mb-2" />
                <p>Analytics visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DefaultDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Welcome to Haki</h3>
          <p className="text-muted-foreground mb-4">Please log in or register to access your personalized dashboard.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button variant="default" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="w-full sm:w-auto">
                Register
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockBounties.map((bounty) => (
          <Link to={`/bounty/${bounty.id}`} key={bounty.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge>{bounty.category}</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{bounty.title}</CardTitle>
                <CardDescription className="line-clamp-2">{bounty.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${(bounty.currentFunding / bounty.fundingGoal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>${bounty.currentFunding.toLocaleString()}</span>
                    <span>${bounty.fundingGoal.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

