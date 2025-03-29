"use client"

import type React from "react"
import { useState } from "react"
import { useApp } from "../../context/app-context"
import { config } from "../../utils/config"
import bountyContractService from "../../services/web3/bounty-contract-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

const BountyCreation: React.FC = () => {
  const { wallet } = useApp()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Check if bounty contract address is configured
  const isContractConfigured = Boolean(config.contracts.bounty)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet.isConnected || !wallet.address) {
      setError("Please connect your wallet first")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      // Validate form data
      if (!formData.title.trim()) {
        throw new Error("Please enter a title for the bounty")
      }

      if (!formData.description.trim()) {
        throw new Error("Please enter a description for the bounty")
      }

      const reward = Number.parseFloat(formData.reward)
      if (isNaN(reward) || reward <= 0) {
        throw new Error("Please enter a valid reward amount greater than 0")
      }

      // Create bounty
      const txHash = await bountyContractService.createBounty(
        wallet.address,
        formData.title,
        formData.description,
        formData.reward,
      )

      setSuccess(`Bounty created successfully! Transaction hash: ${txHash}`)

      // Reset form
      setFormData({
        title: "",
        description: "",
        reward: "",
      })
    } catch (err: any) {
      console.error("Error creating bounty:", err)
      setError(err.message || "Failed to create bounty. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isContractConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Legal Bounty</CardTitle>
          <CardDescription>Post a new legal task with a reward</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              Bounty contract address is not configured. Please set the REACT_APP_BOUNTY_CONTRACT_ADDRESS environment
              variable.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Legal Bounty</CardTitle>
        <CardDescription>Post a new legal task with a reward</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Draft a Non-Disclosure Agreement"
              value={formData.title}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the legal task in detail..."
              rows={5}
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward">Reward (HAKI Tokens)</Label>
            <Input
              id="reward"
              name="reward"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={formData.reward}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <p className="text-sm text-gray-500">The amount of HAKI tokens you're willing to pay for this task</p>
          </div>
        </CardContent>

        <CardFooter>
          {wallet.isConnected ? (
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Bounty...
                </>
              ) : (
                "Create Bounty"
              )}
            </Button>
          ) : (
            <Button type="button" onClick={wallet.connect} className="w-full">
              Connect Wallet to Create Bounty
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

export default BountyCreation

