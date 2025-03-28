"use client"

import type React from "react"
import { useState } from "react"
import { useHybrid } from "../../hooks/use-hybrid"
import { useFeatures } from "../../hooks/use-features"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle, CheckCircle, Plus } from "lucide-react"
import { Switch } from "../ui/switch"

interface BountyFormProps {
  onSuccess?: (bounty: any) => void
}

export const BountyForm: React.FC<BountyFormProps> = ({ onSuccess }) => {
  const { createBounty, isLoading, error } = useHybrid()
  const { isBlockchainEnabled } = useFeatures()
  const [success, setSuccess] = useState(false)
  const [useBlockchain, setUseBlockchain] = useState(isBlockchainEnabled)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: "",
    tags: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Format data for API
      const bountyData = {
        ...formData,
        reward: Number.parseFloat(formData.reward),
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        use_blockchain: useBlockchain,
      }

      const result = await createBounty(bountyData)

      // Reset form
      setFormData({
        title: "",
        description: "",
        reward: "",
        tags: "",
      })

      // Show success message
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      console.error("Failed to create bounty:", err)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="mr-2" size={20} />
          Create New Bounty
        </CardTitle>
        <CardDescription>Post a new legal bounty on HakiChain</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Bounty successfully created!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter bounty title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the legal task or bounty"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward">Reward (HAKI Tokens)</Label>
            <Input
              id="reward"
              name="reward"
              type="number"
              value={formData.reward}
              onChange={handleChange}
              placeholder="Enter reward amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., contract, review, legal-advice"
            />
          </div>

          {isBlockchainEnabled && (
            <div className="flex items-center space-x-2">
              <Switch id="use-blockchain" checked={useBlockchain} onCheckedChange={setUseBlockchain} />
              <Label htmlFor="use-blockchain">Create on blockchain (Web3)</Label>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Bounty"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

