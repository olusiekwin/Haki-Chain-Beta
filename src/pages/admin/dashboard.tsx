"use client"

import { useState } from "react"
import { Navigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import {
  BarChart,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Briefcase,
  FileCheck,
  Building,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Download,
} from "lucide-react"

// Mock data for lawyers pending verification
const mockLawyers = [
  {
    id: "1",
    name: "Jane Lawyer",
    email: "jane@example.com",
    lawSocietyNumber: "LS123456",
    jurisdiction: "New York",
    specialization: "Environmental Law",
    yearsOfExperience: "8",
    appliedDate: "2023-09-15",
    documents: [
      { name: "ID Document", type: "pdf", size: "1.2 MB" },
      { name: "Law Society Certificate", type: "pdf", size: "2.4 MB" },
    ],
  },
  {
    id: "2",
    name: "Mark Attorney",
    email: "mark@example.com",
    lawSocietyNumber: "LS789012",
    jurisdiction: "California",
    specialization: "Human Rights",
    yearsOfExperience: "5",
    appliedDate: "2023-09-18",
    documents: [
      { name: "ID Document", type: "jpg", size: "3.1 MB" },
      { name: "Law Society Certificate", type: "pdf", size: "1.8 MB" },
    ],
  },
  {
    id: "3",
    name: "Sarah Counsel",
    email: "sarah@example.com",
    lawSocietyNumber: "LS345678",
    jurisdiction: "Texas",
    specialization: "Family Law",
    yearsOfExperience: "12",
    appliedDate: "2023-09-20",
    documents: [
      { name: "ID Document", type: "png", size: "2.5 MB" },
      { name: "Law Society Certificate", type: "pdf", size: "1.5 MB" },
    ],
  },
]

// Mock data for bounties pending approval
const mockPendingBounties = [
  {
    id: "1",
    title: "Land Rights Case for Indigenous Community",
    description:
      "Seeking legal representation for an indigenous community facing land displacement due to corporate development.",
    fundingGoal: 15000,
    category: "Land Rights",
    location: "Brazil",
    ngo: {
      name: "Amazon Defenders Coalition",
      id: "ngo1",
    },
    submittedDate: "2023-09-22",
  },
  {
    id: "2",
    title: "Domestic Violence Survivor Legal Support",
    description:
      "Legal assistance needed for survivors of domestic violence seeking restraining orders and divorce proceedings.",
    fundingGoal: 8000,
    category: "Family Law",
    location: "United States",
    ngo: {
      name: "Safe Haven Foundation",
      id: "ngo2",
    },
    submittedDate: "2023-09-23",
  },
  {
    id: "3",
    title: "Environmental Pollution Class Action",
    description: "Representing a community affected by industrial pollution seeking compensation and remediation.",
    fundingGoal: 25000,
    category: "Environmental Law",
    location: "India",
    ngo: {
      name: "Clean Earth Initiative",
      id: "ngo3",
    },
    submittedDate: "2023-09-24",
  },
]

export function AdminDashboard() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLawyer, setSelectedLawyer] = useState<any>(null)
  const [selectedBounty, setSelectedBounty] = useState<any>(null)
  const [pendingLawyers, setPendingLawyers] = useState(mockLawyers)
  const [pendingBounties, setPendingBounties] = useState(mockPendingBounties)

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  // Filter lawyers based on search term
  const filteredLawyers = pendingLawyers.filter(
    (lawyer) =>
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.lawSocietyNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter bounties based on search term
  const filteredBounties = pendingBounties.filter(
    (bounty) =>
      bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bounty.ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bounty.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle lawyer approval
  const handleLawyerApproval = (lawyerId: string, approved: boolean) => {
    // In a real app, this would make an API call to update the lawyer's status
    console.log(`Lawyer ${lawyerId} ${approved ? "approved" : "rejected"}`)

    // Remove from pending list
    setPendingLawyers((prev) => prev.filter((lawyer) => lawyer.id !== lawyerId))
  }

  // Handle bounty approval
  const handleBountyApproval = (bountyId: string, approved: boolean) => {
    // In a real app, this would make an API call to update the bounty's status
    console.log(`Bounty ${bountyId} ${approved ? "approved" : "rejected"}`)

    // Remove from pending list
    setPendingBounties((prev) => prev.filter((bounty) => bounty.id !== bountyId))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage platform users, bounties, and verifications</p>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search lawyers, bounties, or users..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="lawyer-verifications">
        <TabsList>
          <TabsTrigger value="lawyer-verifications">Lawyer Verifications</TabsTrigger>
          <TabsTrigger value="bounty-approvals">Bounty Approvals</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="platform-analytics">Platform Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="lawyer-verifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pending Lawyer Verifications</CardTitle>
                  <CardDescription>Review and verify lawyer credentials</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" /> Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredLawyers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending lawyer verifications found.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 font-medium border-b">
                    <div>Name</div>
                    <div>Law Society #</div>
                    <div>Jurisdiction</div>
                    <div>Specialization</div>
                    <div>Applied Date</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {filteredLawyers.map((lawyer) => (
                    <div key={lawyer.id} className="grid grid-cols-6 p-4 border-b items-center">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{lawyer.name}</p>
                          <p className="text-xs text-muted-foreground">{lawyer.email}</p>
                        </div>
                      </div>
                      <div>{lawyer.lawSocietyNumber}</div>
                      <div>{lawyer.jurisdiction}</div>
                      <div>{lawyer.specialization}</div>
                      <div>{new Date(lawyer.appliedDate).toLocaleDateString()}</div>
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedLawyer(lawyer)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Lawyer Verification Details</DialogTitle>
                              <DialogDescription>Review lawyer credentials and documents</DialogDescription>
                            </DialogHeader>
                            {selectedLawyer && (
                              <div className="space-y-6 py-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">{selectedLawyer.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-medium">{selectedLawyer.name}</h3>
                                    <p className="text-muted-foreground">{selectedLawyer.email}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Law Society Number</h4>
                                    <p>{selectedLawyer.lawSocietyNumber}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Jurisdiction</h4>
                                    <p>{selectedLawyer.jurisdiction}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Specialization</h4>
                                    <p>{selectedLawyer.specialization}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Years of Experience</h4>
                                    <p>{selectedLawyer.yearsOfExperience} years</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Uploaded Documents</h4>
                                  <div className="space-y-2">
                                    {selectedLawyer.documents.map((doc, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-3 border rounded-md"
                                      >
                                        <div className="flex items-center">
                                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                                          <span>{doc.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline">{doc.type.toUpperCase()}</Badge>
                                          <span className="text-sm text-muted-foreground">{doc.size}</span>
                                          <Button size="sm" variant="outline">
                                            <Download className="h-4 w-4 mr-1" /> Download
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="bg-muted p-4 rounded-md">
                                  <h4 className="font-medium mb-2">Notes</h4>
                                  <Textarea placeholder="Add verification notes here..." className="min-h-[100px]" />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedLawyer(null)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  handleLawyerApproval(selectedLawyer.id, false)
                                  setSelectedLawyer(null)
                                }}
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" /> Reject
                              </Button>
                              <Button
                                onClick={() => {
                                  handleLawyerApproval(selectedLawyer.id, true)
                                  setSelectedLawyer(null)
                                }}
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" /> Approve
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="default" onClick={() => handleLawyerApproval(lawyer.id, true)}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleLawyerApproval(lawyer.id, false)}>
                          <AlertCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bounty-approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pending Bounty Approvals</CardTitle>
                  <CardDescription>Review and approve bounties submitted by NGOs</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" /> Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredBounties.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending bounty approvals found.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 font-medium border-b">
                    <div>Title</div>
                    <div>Category</div>
                    <div>NGO</div>
                    <div>Location</div>
                    <div>Funding Goal</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {filteredBounties.map((bounty) => (
                    <div key={bounty.id} className="grid grid-cols-6 p-4 border-b items-center">
                      <div className="font-medium">{bounty.title}</div>
                      <div>
                        <Badge variant="outline">{bounty.category}</Badge>
                      </div>
                      <div>{bounty.ngo.name}</div>
                      <div>{bounty.location}</div>
                      <div>${bounty.fundingGoal.toLocaleString()}</div>
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedBounty(bounty)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Bounty Details</DialogTitle>
                              <DialogDescription>Review bounty details before approval</DialogDescription>
                            </DialogHeader>
                            {selectedBounty && (
                              <div className="space-y-6 py-4">
                                <div>
                                  <h3 className="text-xl font-bold">{selectedBounty.title}</h3>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline">{selectedBounty.category}</Badge>
                                    <Badge variant="outline">{selectedBounty.location}</Badge>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Description</h4>
                                  <p className="text-muted-foreground">{selectedBounty.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">NGO</h4>
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarFallback>{selectedBounty.ngo.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span>{selectedBounty.ngo.name}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Funding Goal</h4>
                                    <p className="text-xl font-bold">${selectedBounty.fundingGoal.toLocaleString()}</p>
                                  </div>
                                </div>

                                <div className="bg-muted p-4 rounded-md">
                                  <h4 className="font-medium mb-2">Review Notes</h4>
                                  <Textarea placeholder="Add approval notes here..." className="min-h-[100px]" />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedBounty(null)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  handleBountyApproval(selectedBounty.id, false)
                                  setSelectedBounty(null)
                                }}
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" /> Reject
                              </Button>
                              <Button
                                onClick={() => {
                                  handleBountyApproval(selectedBounty.id, true)
                                  setSelectedBounty(null)
                                }}
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" /> Approve
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="default" onClick={() => handleBountyApproval(bounty.id, true)}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBountyApproval(bounty.id, false)}>
                          <AlertCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-management" className="space-y-4">
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

        <TabsContent value="platform-analytics" className="space-y-4">
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

