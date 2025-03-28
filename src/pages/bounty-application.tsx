"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const BountyApplication = () => {
  const router = useRouter()
  const { bountyId } = router.query

  const [date, setDate] = useState<Date>()
  const [milestones, setMilestones] = useState([
    { title: "", description: "", deadline: null, deliverables: "", compensation: "" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Mock bounty data - in a real app, this would be fetched based on bountyId
  const bounty = {
    id: bountyId || "b123",
    title: "Legal Research on Environmental Protection Laws",
    organization: "EcoJustice NGO",
    compensation: "2,500 HAKI",
    deadline: "June 15, 2025",
    description:
      "Research and compile a comprehensive report on environmental protection laws in East Africa, focusing on recent legislative changes and their implications for local communities.",
    skills: ["Environmental Law", "Legal Research", "Report Writing"],
    estimatedHours: "40-60 hours",
  }

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", deadline: null, deliverables: "", compensation: "" }])
  }

  const removeMilestone = (index: number) => {
    const updatedMilestones = [...milestones]
    updatedMilestones.splice(index, 1)
    setMilestones(updatedMilestones)
  }

  const updateMilestone = (index: number, field: string, value: any) => {
    const updatedMilestones = [...milestones]
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value }
    setMilestones(updatedMilestones)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      // In a real app, you would redirect to a confirmation page or application tracking page
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800 text-lg font-semibold">Application Submitted Successfully!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your application for "{bounty.title}" has been submitted. The NGO will review your application and respond
            soon. You can track the status of your application in your dashboard.
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => router.push("/lawyer-dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Apply for Bounty</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{bounty.title}</CardTitle>
          <CardDescription>Posted by {bounty.organization}</CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {bounty.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-muted-foreground">Compensation</span>
              <p className="font-medium">{bounty.compensation}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Deadline</span>
              <p className="font-medium">{bounty.deadline}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Estimated Hours</span>
              <p className="font-medium">{bounty.estimatedHours}</p>
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Description</span>
            <p className="mt-1">{bounty.description}</p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="proposal" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="proposal">Proposal</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="proposal" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Relevant Experience</Label>
              <Textarea
                id="experience"
                placeholder="Describe your relevant experience for this bounty..."
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="approach">Proposed Approach</Label>
              <Textarea
                id="approach"
                placeholder="Outline your approach to completing this bounty..."
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeline">Estimated Completion Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Estimated Hours</Label>
                <Input id="hours" type="number" placeholder="Total hours" required />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Proposed Milestones</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Break down the bounty into manageable milestones with clear deliverables and deadlines.
              </p>
            </div>

            {milestones.map((milestone, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Label htmlFor={`milestone-${index}-title`}>Milestone {index + 1}</Label>
                    {milestones.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMilestone(index)}
                        className="h-8 w-8 absolute top-2 right-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    id={`milestone-${index}-title`}
                    placeholder="Milestone title"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, "title", e.target.value)}
                    className="mt-1"
                    required
                  />
                </CardHeader>
                <CardContent className="space-y-4 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor={`milestone-${index}-description`}>Description</Label>
                    <Textarea
                      id={`milestone-${index}-description`}
                      placeholder="Describe what will be accomplished in this milestone"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, "description", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${index}-deadline`}>Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id={`milestone-${index}-deadline`}
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !milestone.deadline && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {milestone.deadline ? format(milestone.deadline, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={milestone.deadline}
                            onSelect={(date) => updateMilestone(index, "deadline", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${index}-compensation`}>Compensation (HAKI)</Label>
                      <Input
                        id={`milestone-${index}-compensation`}
                        placeholder="Amount in HAKI"
                        value={milestone.compensation}
                        onChange={(e) => updateMilestone(index, "compensation", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`milestone-${index}-deliverables`}>Deliverables</Label>
                    <Textarea
                      id={`milestone-${index}-deliverables`}
                      placeholder="List the specific deliverables for this milestone"
                      value={milestone.deliverables}
                      onChange={(e) => updateMilestone(index, "deliverables", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BountyApplication

