"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { AiAssistant } from "../components/ai-assistant"
import { BlockchainTransaction } from "../components/blockchain-transaction"
import { bountyService } from "../services/api-service"
import { blockchainService } from "../services/blockchain-service"
import { useToast } from "../components/ui/use-toast"

export function CreateBounty() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: 0,
    deadline: "",
    milestones: [{ title: "", description: "", amount: 0 }],
  })

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdBountyId, setCreatedBountyId] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMilestoneChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      const updatedMilestones = [...prev.milestones]
      updatedMilestones[index] = { ...updatedMilestones[index], [field]: value }
      return { ...prev, milestones: updatedMilestones }
    })
  }

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { title: "", description: "", amount: 0 }],
    }))
  }

  const removeMilestone = (index: number) => {
    if (formData.milestones.length <= 1) return

    setFormData((prev) => {
      const updatedMilestones = [...prev.milestones]
      updatedMilestones.splice(index, 1)
      return { ...prev, milestones: updatedMilestones }
    })
  }

  const handleAiSuggestion = (suggestion: string) => {
    setFormData((prev) => ({ ...prev, description: suggestion }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create bounty in the database
      const response = await bountyService.createBounty(formData)
      setCreatedBountyId(response.id)

      toast({
        title: "Bounty Created",
        description: "Your bounty has been created successfully!",
      })

      // Move to blockchain funding step if blockchain is enabled
      if (blockchainService.isEnabled()) {
        setStep(2)
      } else {
        // Navigate to bounty page if blockchain is disabled
        navigate(`/bounties/${response.id}`)
      }
    } catch (error) {
      console.error("Error creating bounty:", error)
      toast({
        title: "Error",
        description: "Failed to create bounty. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBlockchainSuccess = (transactionId: string) => {
    toast({
      title: "Funding Successful",
      description: `Your bounty has been funded successfully! Transaction ID: ${transactionId}`,
    })

    // Navigate to bounty page
    if (createdBountyId) {
      navigate(`/bounties/${createdBountyId}`)
    }
  }

  const handleBlockchainError = (error: Error) => {
    toast({
      title: "Funding Error",
      description: "Failed to fund bounty. Please try again.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Bounty</h1>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bounty Details</CardTitle>
                <CardDescription>Provide the details for your legal bounty</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Total Amount (HBAR)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Milestones</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                        Add Milestone
                      </Button>
                    </div>

                    {formData.milestones.map((milestone, index) => (
                      <Card key={index}>
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Milestone {index + 1}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMilestone(index)}
                              disabled={formData.milestones.length <= 1}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`milestone-${index}-title`}>Title</Label>
                            <Input
                              id={`milestone-${index}-title`}
                              value={milestone.title}
                              onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`milestone-${index}-description`}>Description</Label>
                            <Textarea
                              id={`milestone-${index}-description`}
                              value={milestone.description}
                              onChange={(e) => handleMilestoneChange(index, "description", e.target.value)}
                              rows={3}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`milestone-${index}-amount`}>Amount (HBAR)</Label>
                            <Input
                              id={`milestone-${index}-amount`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={milestone.amount}
                              onChange={(e) =>
                                handleMilestoneChange(index, "amount", Number.parseFloat(e.target.value))
                              }
                              required
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Bounty"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div>
            <AiAssistant
              initialPrompt="Help me write a description for a legal bounty about..."
              placeholder="Describe what kind of legal bounty you need help with..."
              onSuggestion={handleAiSuggestion}
            />
          </div>
        </div>
      )}

      {step === 2 && createdBountyId && (
        <div className="max-w-md mx-auto">
          <BlockchainTransaction
            bountyId={createdBountyId}
            amount={formData.amount}
            onSuccess={handleBlockchainSuccess}
            onError={handleBlockchainError}
          />
        </div>
      )}
    </div>
  )
}

