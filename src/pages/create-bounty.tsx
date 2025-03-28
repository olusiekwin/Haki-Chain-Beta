"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Separator } from "../components/ui/separator"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { useAuth } from "../contexts/auth-context"
import { AlertCircle, CheckCircle, Plus, Trash2, Upload, Info, FileText } from "lucide-react"

// Practice areas for selection
const practiceAreas = [
  "Environmental Law",
  "Human Rights",
  "Indigenous Rights",
  "Land Rights",
  "Class Action",
  "Public Health",
  "Immigration Law",
  "Asylum",
  "Family Law",
  "Domestic Violence",
  "Housing Rights",
  "Digital Rights",
  "Privacy Law",
  "Constitutional Law",
  "Criminal Defense",
  "Civil Rights",
  "Labor Law",
  "Disability Rights",
]

// Locations for selection
const locations = [
  "Global",
  "United States",
  "European Union",
  "Brazil",
  "Canada",
  "India",
  "Kenya",
  "South Africa",
  "Australia",
  "United Kingdom",
  "Mexico",
  "Philippines",
]

interface Milestone {
  id: string
  title: string
  description: string
  amount: number
}

export function CreateBounty() {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [deadline, setDeadline] = useState("")
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([{ id: "1", title: "", description: "", amount: 0 }])
  const [documents, setDocuments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const totalFundingGoal = milestones.reduce((sum, milestone) => sum + milestone.amount, 0)

  const handlePracticeAreaToggle = (area: string) => {
    setSelectedPracticeAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]))
  }

  const handleAddMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        title: "",
        description: "",
        amount: 0,
      },
    ])
  }

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones((prev) => prev.filter((milestone) => milestone.id !== id))
    }
  }

  const handleMilestoneChange = (id: string, field: keyof Milestone, value: string | number) => {
    setMilestones((prev) =>
      prev.map((milestone) => (milestone.id === id ? { ...milestone, [field]: value } : milestone)),
    )
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setDocuments((prev) => [...prev, ...newFiles])
    }
  }

  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    if (!title) return "Title is required"
    if (!description) return "Description is required"
    if (!location) return "Location is required"
    if (!deadline) return "Deadline is required"
    if (selectedPracticeAreas.length === 0) return "At least one practice area is required"

    for (const milestone of milestones) {
      if (!milestone.title) return "All milestone titles are required"
      if (!milestone.description) return "All milestone descriptions are required"
      if (milestone.amount <= 0) return "All milestone amounts must be greater than zero"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setTimeout(() => setError(null), 5000)
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, this would call your API
      // const formData = new FormData()
      // formData.append('title', title)
      // formData.append('description', description)
      // formData.append('location', location)
      // formData.append('deadline', deadline)
      // formData.append('practiceAreas', JSON.stringify(selectedPracticeAreas))
      // formData.append('milestones', JSON.stringify(milestones))
      // documents.forEach(doc => formData.append('documents', doc))
      // await apiService.post('/bounties', formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess("Bounty created successfully! It will be reviewed by our team before being published.")

      // Reset form
      setTitle("")
      setDescription("")
      setLocation("")
      setDeadline("")
      setSelectedPracticeAreas([])
      setMilestones([{ id: "1", title: "", description: "", amount: 0 }])
      setDocuments([])

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (error) {
      console.error("Error creating bounty:", error)
      setError("Failed to create bounty. Please try again.")

      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create a Bounty</h1>
        <p className="text-muted-foreground">Post a legal case and find qualified lawyers to help your cause</p>
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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-purple-100 dark:border-purple-900/50">
              <CardHeader>
                <CardTitle>Bounty Details</CardTitle>
                <CardDescription>Provide information about the legal case you need help with</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="E.g., Land Rights Case for Indigenous Community"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the legal case, its importance, and what you're looking for..."
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Location and Deadline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select value={location} onValueChange={setLocation} required>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                {/* Practice Areas */}
                <div className="space-y-2">
                  <Label>Practice Areas</Label>
                  <div className="border rounded-md p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedPracticeAreas.map((area) => (
                        <Badge key={area} variant="outline" className="bg-primary/5">
                          {area}
                          <button
                            type="button"
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            onClick={() => handlePracticeAreaToggle(area)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      {selectedPracticeAreas.length === 0 && (
                        <span className="text-sm text-muted-foreground">No practice areas selected</span>
                      )}
                    </div>
                    <Separator className="my-2" />
                    <div className="h-32 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-1">
                      {practiceAreas.map((area) => (
                        <div key={area} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`area-${area}`}
                            checked={selectedPracticeAreas.includes(area)}
                            onChange={() => handlePracticeAreaToggle(area)}
                            className="rounded text-primary focus:ring-primary"
                          />
                          <label htmlFor={`area-${area}`} className="text-sm">
                            {area}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900/50">
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>
                  Break down the case into milestones with specific deliverables and payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="p-4 border rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Milestone {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMilestone(milestone.id)}
                        disabled={milestones.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${milestone.id}-title`}>Title</Label>
                      <Input
                        id={`milestone-${milestone.id}-title`}
                        placeholder="E.g., Initial consultation and case assessment"
                        value={milestone.title}
                        onChange={(e) => handleMilestoneChange(milestone.id, "title", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${milestone.id}-description`}>Description</Label>
                      <Textarea
                        id={`milestone-${milestone.id}-description`}
                        placeholder="Describe what needs to be delivered for this milestone..."
                        rows={3}
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(milestone.id, "description", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${milestone.id}-amount`}>Amount (USD)</Label>
                      <div className="flex items-center">
                        <span className="absolute ml-3 text-muted-foreground">$</span>
                        <Input
                          id={`milestone-${milestone.id}-amount`}
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Enter amount"
                          value={milestone.amount || ""}
                          onChange={(e) => handleMilestoneChange(milestone.id, "amount", Number(e.target.value))}
                          className="pl-7"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-primary border-primary/20 hover:bg-primary/10"
                  onClick={handleAddMilestone}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Milestone
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900/50">
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
                <CardDescription>Upload any relevant documents to help lawyers understand the case</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground mb-4">PDF, DOCX, JPG, PNG (Max 10MB per file)</p>
                  <Input id="documents" type="file" multiple className="hidden" onChange={handleDocumentUpload} />
                  <Button type="button" variant="outline" onClick={() => document.getElementById("documents")?.click()}>
                    Browse Files
                  </Button>
                </div>

                {documents.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Uploaded Documents</h3>
                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm truncate max-w-[200px]">{doc.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveDocument(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-purple-100 dark:border-purple-900/50">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Review your bounty details before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Funding Goal</span>
                    <span className="font-medium">${totalFundingGoal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Number of Milestones</span>
                    <span className="font-medium">{milestones.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Practice Areas</span>
                    <span className="font-medium">{selectedPracticeAreas.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Documents</span>
                    <span className="font-medium">{documents.length}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Milestone Breakdown</h3>
                  <div className="space-y-1">
                    {milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate max-w-[150px]">
                          {milestone.title || `Milestone ${index + 1}`}
                        </span>
                        <span>${milestone.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Bounty..." : "Create Bounty"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  <div className="space-y-1">
                    <h4 className="font-medium">What happens next?</h4>
                    <p className="text-sm text-muted-foreground">
                      After submission, your bounty will be reviewed by our team. Once approved, it will be visible to
                      qualified lawyers who can claim it and start working on your case.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Tips for a Successful Bounty</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Be specific about the legal help you need</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Break down milestones into clear, achievable tasks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Provide detailed documentation to help lawyers understand the case</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Set realistic funding goals for each milestone</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

