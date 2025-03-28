"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Clock, FileText, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for bounty and milestones
const mockBounty = {
  id: "b123",
  title: "Legal Research on Environmental Protection Laws",
  organization: "EcoJustice NGO",
  totalCompensation: "2,500 HAKI",
  deadline: "June 15, 2025",
  progress: 40,
  status: "In Progress",
}

const mockMilestones = [
  {
    id: "m1",
    title: "Initial Research and Outline",
    description: "Conduct preliminary research and create a detailed outline of the report structure.",
    deadline: "April 20, 2025",
    compensation: "500 HAKI",
    status: "Completed",
    feedback: "Excellent work on the outline. The structure is comprehensive and well-organized.",
    submissionDate: "April 18, 2025",
    deliverables: [
      { name: "Research_Outline.pdf", url: "#", size: "1.2 MB" },
      { name: "Sources_List.xlsx", url: "#", size: "845 KB" },
    ],
  },
  {
    id: "m2",
    title: "Draft Report on Current Legislation",
    description: "Compile and analyze current environmental protection laws across East Africa.",
    deadline: "May 15, 2025",
    compensation: "1,000 HAKI",
    status: "In Review",
    submissionDate: "May 12, 2025",
    deliverables: [
      { name: "Draft_Report_v1.docx", url: "#", size: "3.5 MB" },
      { name: "Case_Studies.pdf", url: "#", size: "2.1 MB" },
    ],
  },
  {
    id: "m3",
    title: "Final Report with Recommendations",
    description: "Finalize the report with comprehensive analysis and actionable recommendations.",
    deadline: "June 15, 2025",
    compensation: "1,000 HAKI",
    status: "Not Started",
    deliverables: [],
  },
]

const MilestoneManagement = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [milestones, setMilestones] = useState(mockMilestones)
  const [selectedMilestone, setSelectedMilestone] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState([])
  const [submissionNote, setSubmissionNote] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const filteredMilestones =
    activeTab === "all"
      ? milestones
      : milestones.filter((m) =>
          activeTab === "completed"
            ? m.status === "Completed"
            : activeTab === "in-review"
              ? m.status === "In Review"
              : activeTab === "upcoming"
                ? m.status === "Not Started"
                : true,
        )

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(0) + " KB",
        type: file.type,
        file: file,
      }))
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleSubmitMilestone = (milestoneId) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const updatedMilestones = milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: "In Review",
              submissionDate: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            }
          : m,
      )

      setMilestones(updatedMilestones)
      setIsSubmitting(false)
      setFiles([])
      setSubmissionNote("")
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Review":
        return "bg-blue-100 text-blue-800"
      case "Not Started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "In Review":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "Not Started":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{mockBounty.title}</h1>
          <p className="text-muted-foreground mt-1">
            {mockBounty.organization} • Due {mockBounty.deadline}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge
            className={
              mockBounty.status === "Completed"
                ? "bg-green-100 text-green-800"
                : mockBounty.status === "In Progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
            }
          >
            {mockBounty.status}
          </Badge>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <div className="mb-2 md:mb-0">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <div className="flex items-center gap-2">
                <Progress value={mockBounty.progress} className="h-2 w-64" />
                <span className="text-sm font-medium">{mockBounty.progress}%</span>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Total Compensation</span>
              <p className="font-medium">{mockBounty.totalCompensation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Milestone Submitted</AlertTitle>
          <AlertDescription className="text-green-700">
            Your milestone submission has been received and is now under review.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="in-review">In Review</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredMilestones.map((milestone) => (
          <Card key={milestone.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{milestone.title}</CardTitle>
                  <CardDescription className="mt-1">Due {milestone.deadline}</CardDescription>
                </div>
                <Badge className={getStatusColor(milestone.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(milestone.status)}
                    {milestone.status}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{milestone.description}</p>

              {milestone.status === "Completed" && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Completed on {milestone.submissionDate}</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Feedback from NGO</h4>
                    <p className="text-sm">{milestone.feedback}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Submitted Deliverables</h4>
                    <div className="space-y-2">
                      {milestone.deliverables.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-md">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>{file.name}</span>
                          <span className="text-muted-foreground text-xs ml-auto">{file.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {milestone.status === "In Review" && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      Submitted on {milestone.submissionDate} - Awaiting review
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Submitted Deliverables</h4>
                    <div className="space-y-2">
                      {milestone.deliverables.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-md">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>{file.name}</span>
                          <span className="text-muted-foreground text-xs ml-auto">{file.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                <span className="text-sm text-muted-foreground">Compensation</span>
                <p className="font-medium">{milestone.compensation}</p>
              </div>

              {milestone.status === "Not Started" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Submit Milestone</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Submit Milestone: {milestone.title}</DialogTitle>
                      <DialogDescription>
                        Upload all required deliverables and provide any additional notes for review.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="files">Upload Deliverables</Label>
                        <div
                          className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => document.getElementById("file-upload").click()}
                        >
                          <Upload className="h-6 w-6 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Drag and drop files here, or click to browse
                          </p>
                          <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                        </div>

                        {files.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span>{file.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground text-xs">{file.size}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => removeFile(index)}
                                  >
                                    <AlertCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Submission Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Add any additional context or notes about your submission..."
                          value={submissionNote}
                          onChange={(e) => setSubmissionNote(e.target.value)}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={files.length === 0 || isSubmitting}
                        onClick={() => handleSubmitMilestone(milestone.id)}
                      >
                        {isSubmitting ? "Submitting..." : "Submit for Review"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MilestoneManagement

