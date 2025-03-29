"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Mock data for a single bounty
const bountyData = {
  id: 1,
  title: "Legal Aid for Refugee Families",
  description:
    "Provide legal assistance to refugee families seeking asylum status in the United States. This includes document preparation, representation at hearings, and general legal counsel throughout the asylum process. The ideal candidate will have experience in immigration law and asylum cases.",
  longDescription: `
    ## Background
    Refugee families often face significant legal barriers when seeking asylum in the United States. Many lack access to quality legal representation, which significantly reduces their chances of a successful asylum claim.
    
    ## Scope of Work
    The selected lawyer or legal team will:
    - Provide comprehensive legal representation for 5-10 refugee families
    - Prepare and file all necessary asylum documentation
    - Represent clients at asylum interviews and immigration court hearings
    - Provide regular updates on case progress
    - Coordinate with interpreters and other support services as needed
    
    ## Requirements
    - Licensed attorney with experience in immigration law
    - Demonstrated experience with asylum cases
    - Ability to work with interpreters
    - Cultural sensitivity and trauma-informed approach
    - Commitment to the full asylum process (may take 1-2 years)
    
    ## Deliverables
    - Initial case assessments for each family
    - Completed asylum applications and supporting documentation
    - Regular progress reports
    - Representation at all hearings and interviews
    - Final case outcome reports
  `,
  amount: 5000,
  token: "HAKI",
  status: "Open",
  deadline: "2023-12-31",
  createdAt: "2023-08-15",
  tags: ["Immigration", "Asylum", "Human Rights"],
  applicants: 3,
  donor: {
    name: "Global Refugee Alliance",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    rating: 4.8,
    completedBounties: 12,
  },
  milestones: [
    {
      title: "Initial consultations and case assessments",
      amount: 1000,
      status: "Not Started",
      deadline: "2023-10-15",
    },
    {
      title: "Asylum applications prepared and filed",
      amount: 2000,
      status: "Not Started",
      deadline: "2023-11-15",
    },
    {
      title: "Representation at asylum interviews",
      amount: 1500,
      status: "Not Started",
      deadline: "2023-12-15",
    },
    {
      title: "Final case resolution and reporting",
      amount: 500,
      status: "Not Started",
      deadline: "2024-01-31",
    },
  ],
  applications: [
    {
      id: 101,
      lawyer: {
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
        rating: 4.9,
        completedBounties: 8,
        specialization: "Immigration Law",
      },
      proposal:
        "I have 7 years of experience with asylum cases and have successfully represented over 30 refugee families. I'm fluent in Spanish and have connections with interpreters for other languages.",
      status: "Under Review",
      submittedAt: "2023-08-20",
    },
    {
      id: 102,
      lawyer: {
        name: "James Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
        rating: 4.7,
        completedBounties: 5,
        specialization: "Human Rights Law",
      },
      proposal:
        "My team and I specialize in complex asylum cases. We take a holistic approach that includes legal representation as well as connections to social services and community support.",
      status: "Under Review",
      submittedAt: "2023-08-22",
    },
    {
      id: 103,
      lawyer: {
        name: "Aisha Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
        rating: 4.8,
        completedBounties: 6,
        specialization: "Immigration and Refugee Law",
      },
      proposal:
        "I've worked with the Refugee Legal Aid Project for 5 years and have expertise in cases involving persecution based on political opinion and membership in particular social groups.",
      status: "Under Review",
      submittedAt: "2023-08-25",
    },
  ],
}

export default function BountyDetailPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const [application, setApplication] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // In a real app, you would fetch the bounty data based on the ID
  const bounty = bountyData

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!application.trim()) {
      toast({
        title: "Application required",
        description: "Please provide details about your proposal.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })
      setApplication("")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{bounty.title}</CardTitle>
                  <CardDescription className="mt-2">{bounty.description}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  {bounty.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {bounty.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="applications">Applications ({bounty.applications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    {bounty.longDescription.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {bounty.milestones.map((milestone, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{milestone.title}</h3>
                        <Badge variant={milestone.status === "Completed" ? "default" : "outline"}>
                          {milestone.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>
                          Reward: {milestone.amount} {bounty.token}
                        </span>
                        <span>Deadline: {new Date(milestone.deadline).toLocaleDateString()}</span>
                      </div>
                      <Progress value={milestone.status === "Completed" ? 100 : 0} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {bounty.applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarImage src={app.lawyer.avatar} alt={app.lawyer.name} />
                          <AvatarFallback>{app.lawyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{app.lawyer.name}</div>
                          <div className="text-sm text-muted-foreground">{app.lawyer.specialization}</div>
                        </div>
                        <Badge className="ml-auto" variant="outline">
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{app.proposal}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          Rating: {app.lawyer.rating}/5 • {app.lawyer.completedBounties} bounties completed
                        </span>
                        <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Submit Your Application</CardTitle>
              <CardDescription>
                Explain why you're the right lawyer for this bounty and outline your approach.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApply}>
                <Textarea
                  placeholder="Describe your experience with similar cases and your proposed approach..."
                  className="min-h-[150px] mb-4"
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width on large screens */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Bounty Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Reward</div>
                <div className="font-medium text-lg">
                  {bounty.amount} {bounty.token}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground mb-1">Deadline</div>
                <div className="font-medium">{new Date(bounty.deadline).toLocaleDateString()}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground mb-1">Posted On</div>
                <div className="font-medium">{new Date(bounty.createdAt).toLocaleDateString()}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground mb-1">Applications</div>
                <div className="font-medium">{bounty.applicants}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">About the Donor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={bounty.donor.avatar} alt={bounty.donor.name} />
                  <AvatarFallback>{bounty.donor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{bounty.donor.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Rating: {bounty.donor.rating}/5 • {bounty.donor.completedBounties} bounties
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions about this bounty or how to apply? Our support team is here to help.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

