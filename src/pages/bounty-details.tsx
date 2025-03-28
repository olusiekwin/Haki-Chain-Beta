"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Progress } from "../components/ui/progress"
import { Separator } from "../components/ui/separator"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Textarea } from "../components/ui/textarea"
import { useAuth } from "../contexts/auth-context"
import {
  MapPin,
  Calendar,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  ThumbsUp,
  Download,
  Info,
  User,
} from "lucide-react"

// Mock data for bounty details
const mockBountyDetails = {
  id: "1",
  title: "Land Rights Case for Indigenous Community",
  description:
    "Seeking legal assistance to protect indigenous land rights against corporate development in the Amazon rainforest. The Yanomami community has lived on this land for generations, but a large mining corporation is attempting to exploit the area without proper consultation or consent. We need legal expertise to challenge the permits granted to the corporation and establish legal protection for the indigenous territory.",
  ngo: {
    id: "ngo1",
    name: "Amazon Defenders Coalition",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    rating: 4.8,
    reviewCount: 24,
    description:
      "Non-profit organization dedicated to protecting the Amazon rainforest and the rights of indigenous communities living within it.",
    yearFounded: 2010,
    casesSupported: 47,
  },
  location: "Brazil",
  practiceAreas: ["Environmental Law", "Indigenous Rights", "Land Rights"],
  fundingGoal: 15000,
  currentFunding: 12500,
  deadline: "2023-12-15",
  createdAt: "2023-08-10",
  status: "active",
  matchScore: 95,
  milestones: [
    {
      id: "m1",
      title: "Initial consultation and case assessment",
      description:
        "Review all existing documentation, conduct interviews with community representatives, and prepare an initial assessment of the legal situation and strategy.",
      amount: 3000,
      status: "pending",
      estimatedTime: "2 weeks",
    },
    {
      id: "m2",
      title: "File emergency injunction",
      description:
        "Prepare and file an emergency injunction to halt any ongoing or planned mining activities while the case is being reviewed.",
      amount: 5000,
      status: "pending",
      estimatedTime: "3 weeks",
    },
    {
      id: "m3",
      title: "Court representation",
      description:
        "Represent the community in court proceedings, including all necessary hearings and filings to secure land rights.",
      amount: 7000,
      status: "pending",
      estimatedTime: "2 months",
    },
  ],
  documents: [
    {
      id: "doc1",
      name: "Land_Ownership_History.pdf",
      size: 2.4, // MB
      uploadedAt: "2023-08-10",
    },
    {
      id: "doc2",
      name: "Mining_Company_Permits.pdf",
      size: 1.8, // MB
      uploadedAt: "2023-08-10",
    },
    {
      id: "doc3",
      name: "Community_Impact_Assessment.docx",
      size: 3.2, // MB
      uploadedAt: "2023-08-11",
    },
    {
      id: "doc4",
      name: "Previous_Legal_Correspondence.pdf",
      size: 4.5, // MB
      uploadedAt: "2023-08-12",
    },
  ],
  updates: [
    {
      id: "update1",
      content:
        "We've secured initial funding of $10,000 from individual donors. Still seeking additional support to reach our goal.",
      date: "2023-08-25",
      author: "Amazon Defenders Coalition",
    },
    {
      id: "update2",
      content:
        "The mining company has accelerated their timeline and is planning to begin operations next month. This case is becoming increasingly urgent.",
      date: "2023-09-05",
      author: "Amazon Defenders Coalition",
    },
  ],
  donors: [
    {
      id: "donor1",
      name: "John D.",
      amount: 5000,
      date: "2023-08-15",
    },
    {
      id: "donor2",
      name: "Environmental Justice Fund",
      amount: 3000,
      date: "2023-08-20",
    },
    {
      id: "donor3",
      name: "Sarah M.",
      amount: 1000,
      date: "2023-08-22",
    },
    {
      id: "donor4",
      name: "Anonymous",
      amount: 2000,
      date: "2023-09-01",
    },
    {
      id: "donor5",
      name: "Green Planet Foundation",
      amount: 1500,
      date: "2023-09-03",
    },
  ],
  comments: [
    {
      id: "comment1",
      user: {
        name: "Maria L.",
        avatar: "/placeholder.svg?height=30&width=30",
        role: "Lawyer",
      },
      content:
        "I've worked on similar cases in the past. The key will be establishing historical land use rights and challenging the permitting process.",
      date: "2023-08-20",
    },
    {
      id: "comment2",
      user: {
        name: "Carlos R.",
        avatar: "/placeholder.svg?height=30&width=30",
        role: "Environmental Activist",
      },
      content:
        "This case is critical for setting precedent. I've seen similar situations in other parts of the Amazon.",
      date: "2023-08-25",
    },
  ],
}

export function BountyDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [bounty, setBounty] = useState(mockBountyDetails)
  const [isLoading, setIsLoading] = useState(false)
  const [claimingBounty, setClaimingBounty] = useState(false)
  const [donatingAmount, setDonatingAmount] = useState("")
  const [commentText, setCommentText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch bounty details from API
  useEffect(() => {
    const fetchBountyDetails = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would fetch from your API
        // const response = await apiService.get(`/bounties/${id}`)
        // setBounty(response.data)

        // Using mock data for now
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setBounty(mockBountyDetails)
      } catch (error) {
        console.error("Error fetching bounty details:", error)
        setError("Failed to load bounty details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBountyDetails()
  }, [id])

  const handleClaimBounty = async () => {
    setClaimingBounty(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, this would call your API
      // await apiService.post(`/bounties/${id}/claim`)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update local state
      setBounty((prev) => ({ ...prev, status: "claimed" }))

      setSuccess("Successfully claimed bounty. You can now start working on the first milestone.")

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (error) {
      console.error("Error claiming bounty:", error)
      setError("Failed to claim bounty. Please try again.")

      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setClaimingBounty(false)
    }
  }

  const handleDonate = async () => {
    if (!donatingAmount || isNaN(Number(donatingAmount)) || Number(donatingAmount) <= 0) {
      setError("Please enter a valid donation amount")
      setTimeout(() => setError(null), 5000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, this would call your API
      // await apiService.post(`/bounties/${id}/donate`, { amount: Number(donatingAmount) })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update local state
      const amount = Number(donatingAmount)
      setBounty((prev) => ({
        ...prev,
        currentFunding: prev.currentFunding + amount,
        donors: [
          {
            id: `donor${prev.donors.length + 1}`,
            name: user?.name || "Anonymous",
            amount,
            date: new Date().toISOString().split("T")[0],
          },
          ...prev.donors,
        ],
      }))

      setSuccess(`Thank you for your donation of $${amount.toLocaleString()}!`)
      setDonatingAmount("")

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (error) {
      console.error("Error donating:", error)
      setError("Failed to process donation. Please try again.")

      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      setError("Please enter a comment")
      setTimeout(() => setError(null), 5000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, this would call your API
      // await apiService.post(`/bounties/${id}/comments`, { content: commentText })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setBounty((prev) => ({
        ...prev,
        comments: [
          {
            id: `comment${prev.comments.length + 1}`,
            user: {
              name: user?.name || "Anonymous",
              avatar: user?.avatar || "/placeholder.svg?height=30&width=30",
              role: user?.role || "User",
            },
            content: commentText,
            date: new Date().toISOString().split("T")[0],
          },
          ...prev.comments,
        ],
      }))

      setSuccess("Comment added successfully")
      setCommentText("")

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (error) {
      console.error("Error adding comment:", error)
      setError("Failed to add comment. Please try again.")

      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadDocument = (documentId: string, documentName: string) => {
    // In a real app, this would download the document
    console.log(`Downloading document: ${documentId} - ${documentName}`)

    // Show success message
    setSuccess(`Downloading ${documentName}...`)
    setTimeout(() => setSuccess(null), 3000)
  }

  if (isLoading && !bounty) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading bounty details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
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
          <Card className="border-purple-100 dark:border-purple-900/50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-background">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {bounty.status === "active" && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        Active
                      </Badge>
                    )}
                    {bounty.status === "claimed" && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                        Claimed
                      </Badge>
                    )}
                    {bounty.status === "completed" && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                        Completed
                      </Badge>
                    )}
                    <Badge className="bg-primary/10 text-primary border-primary/20">{bounty.matchScore}% Match</Badge>
                  </div>
                  <CardTitle className="text-2xl">{bounty.title}</CardTitle>
                  <div className="flex items-center mt-2">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={bounty.ngo.avatar} alt={bounty.ngo.name} />
                      <AvatarFallback>{bounty.ngo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardDescription className="flex items-center">
                      {bounty.ngo.name}
                      {bounty.ngo.verified && <CheckCircle className="h-3 w-3 ml-1 text-blue-500" />}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{bounty.location}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Deadline</span>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{new Date(bounty.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Funding Goal</span>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>${bounty.fundingGoal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{new Date(bounty.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{bounty.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Practice Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {bounty.practiceAreas.map((area) => (
                      <Badge key={area} variant="outline" className="bg-primary/5">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Funding Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>${bounty.currentFunding.toLocaleString()} raised</span>
                      <span>${bounty.fundingGoal.toLocaleString()} goal</span>
                    </div>
                    <Progress value={(bounty.currentFunding / bounty.fundingGoal) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {Math.round((bounty.currentFunding / bounty.fundingGoal) * 100)}% funded by {bounty.donors.length}{" "}
                      donors
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              {user?.role === "lawyer" && bounty.status === "active" && (
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleClaimBounty}
                  disabled={claimingBounty}
                >
                  {claimingBounty ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    "Claim Bounty"
                  )}
                </Button>
              )}
              {user?.role === "lawyer" && bounty.status === "claimed" && (
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => (window.location.href = `/lawyer-dashboard`)}
                >
                  Go to Dashboard
                </Button>
              )}
              {user?.role === "donor" && (
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Amount"
                      value={donatingAmount}
                      onChange={(e) => setDonatingAmount(e.target.value)}
                      className="pl-7 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button
                    onClick={handleDonate}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Donate
                  </Button>
                </div>
              )}
              {user?.role === "ngo" && bounty.ngo.id === user.id && (
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => (window.location.href = `/ngo-dashboard`)}
                >
                  Manage Bounty
                </Button>
              )}
            </CardFooter>
          </Card>

          <Tabs defaultValue="milestones" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="milestones" className="space-y-4">
              <Card className="border-purple-100 dark:border-purple-900/50">
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                  <CardDescription>The bounty is broken down into these milestones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bounty.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium">
                            Milestone {index + 1}: {milestone.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          <div className="flex items-center space-x-4 text-sm mt-2">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>${milestone.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>Est. {milestone.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={milestone.status === "completed" ? "default" : "outline"}
                          className={
                            milestone.status === "completed"
                              ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                              : milestone.status === "in-progress"
                                ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                : ""
                          }
                        >
                          {milestone.status === "completed"
                            ? "Completed"
                            : milestone.status === "in-progress"
                              ? "In Progress"
                              : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card className="border-purple-100 dark:border-purple-900/50">
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                  <CardDescription>Documents provided by the NGO to help understand the case</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bounty.documents.map((doc) => (
                      <div key={doc.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.size} MB • Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc.id, doc.name)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="updates" className="space-y-4">
              <Card className="border-purple-100 dark:border-purple-900/50">
                <CardHeader>
                  <CardTitle>Updates</CardTitle>
                  <CardDescription>Latest updates from the NGO about this case</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bounty.updates.map((update) => (
                      <div key={update.id} className="p-4 border rounded-lg">
                        <p className="mb-2">{update.content}</p>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>{update.author}</span>
                          <span>{new Date(update.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card className="border-purple-100 dark:border-purple-900/50">
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>Join the discussion about this case</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add your comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment} disabled={isLoading}>
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    {bounty.comments.map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h4 className="font-medium">{comment.user.name}</h4>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {comment.user.role}
                              </Badge>
                            </div>
                            <p className="mt-1">{comment.content}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span>{new Date(comment.date).toLocaleDateString()}</span>
                              <button className="flex items-center hover:text-foreground">
                                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                Like
                              </button>
                              <button className="flex items-center hover:text-foreground">
                                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle>About the NGO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={bounty.ngo.avatar} alt={bounty.ngo.name} />
                  <AvatarFallback>{bounty.ngo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium flex items-center">
                    {bounty.ngo.name}
                    {bounty.ngo.verified && <CheckCircle className="h-4 w-4 ml-1 text-blue-500" />}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                    <span>
                      {bounty.ngo.rating} ({bounty.ngo.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{bounty.ngo.description}</p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Founded</p>
                  <p className="font-medium">{bounty.ngo.yearFounded}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cases Supported</p>
                  <p className="font-medium">{bounty.ngo.casesSupported}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full text-primary border-primary/20 hover:bg-primary/10"
                onClick={() => (window.location.href = `/ngo-profile/${bounty.ngo.id}`)}
              >
                View NGO Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle>Recent Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bounty.donors.slice(0, 5).map((donor) => (
                  <div key={donor.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{donor.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${donor.amount.toLocaleString()}</span>
                      <p className="text-xs text-muted-foreground">{new Date(donor.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}

                {bounty.donors.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full text-sm"
                    onClick={() => {
                      /* View all donors */
                    }}
                  >
                    View all {bounty.donors.length} donors
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                <div className="space-y-1">
                  <h4 className="font-medium">How It Works</h4>
                  <p className="text-sm text-muted-foreground">
                    Lawyers can claim this bounty and work on the milestones. Once a milestone is completed and approved
                    by the NGO, payment is automatically released through the Hedera blockchain.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Share This Bounty</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

