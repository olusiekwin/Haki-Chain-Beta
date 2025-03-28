"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useHybrid } from "../../hooks/use-hybrid"
import { useApp } from "../../context/app-context"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle, CheckCircle, ExternalLink, Clock, User, Tag, Award } from "lucide-react"
import api from "../../utils/api"

interface BountyDetailsProps {
  bountyId: string
  onStatusChange?: () => void
}

export const BountyDetails: React.FC<BountyDetailsProps> = ({ bountyId, onStatusChange }) => {
  const { completeBounty, isLoading, error } = useHybrid()
  const { user, wallet } = useApp()
  const [bounty, setBounty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  // Fetch bounty details
  useEffect(() => {
    const fetchBounty = async () => {
      try {
        const response = await api.get(`/bounties/${bountyId}/`)
        setBounty(response.data)
      } catch (err) {
        console.error("Failed to fetch bounty:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBounty()
  }, [bountyId])

  // Handle bounty completion
  const handleComplete = async () => {
    try {
      await completeBounty(bountyId)

      // Refresh bounty data
      const response = await api.get(`/bounties/${bountyId}/`)
      setBounty(response.data)

      // Show success message
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Call status change callback if provided
      if (onStatusChange) {
        onStatusChange()
      }
    } catch (err) {
      console.error("Failed to complete bounty:", err)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="py-10">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!bounty) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="py-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Bounty not found</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{bounty.title}</CardTitle>
            <CardDescription>Posted on {formatDate(bounty.created_at)}</CardDescription>
          </div>
          <Badge
            className={
              bounty.status === "open"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : bounty.status === "in_progress"
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  : bounty.status === "completed"
                    ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
          >
            {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
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
            <AlertDescription>Bounty status updated successfully!</AlertDescription>
          </Alert>
        )}

        <div className="prose max-w-none">
          <h3>Description</h3>
          <p>{bounty.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Award className="mr-2 h-4 w-4" />
              <span className="font-medium">Reward:</span>
              <span className="ml-2">{bounty.reward} HAKI Tokens</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <User className="mr-2 h-4 w-4" />
              <span className="font-medium">Created by:</span>
              <span className="ml-2">{bounty.created_by_username || "Anonymous"}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Clock className="mr-2 h-4 w-4" />
              <span className="font-medium">Status:</span>
              <span className="ml-2 capitalize">{bounty.status}</span>
            </div>
          </div>

          <div className="space-y-2">
            {bounty.tags && bounty.tags.length > 0 && (
              <div className="flex flex-wrap items-center text-sm text-gray-600">
                <Tag className="mr-2 h-4 w-4" />
                <span className="font-medium mr-2">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {bounty.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {bounty.is_on_chain && (
              <div className="flex items-center text-sm text-gray-600">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span className="font-medium">On Blockchain:</span>
                <span className="ml-2 text-green-600">Yes</span>
              </div>
            )}

            {bounty.blockchain_tx_hash && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">TX Hash:</span>
                <span className="ml-2 font-mono text-xs truncate max-w-[200px]">{bounty.blockchain_tx_hash}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        {bounty.status === "open" && user && user.id === bounty.assigned_to && (
          <Button onClick={handleComplete} disabled={isLoading || !wallet.isConnected} className="ml-auto">
            {isLoading ? "Processing..." : "Complete Bounty"}
          </Button>
        )}

        {bounty.status === "open" && user && user.id !== bounty.created_by && !bounty.assigned_to && (
          <Button
            onClick={async () => {
              try {
                await api.post(`/bounties/${bountyId}/accept/`)
                // Refresh bounty data
                const response = await api.get(`/bounties/${bountyId}/`)
                setBounty(response.data)
                if (onStatusChange) onStatusChange()
              } catch (err) {
                console.error("Failed to accept bounty:", err)
              }
            }}
            disabled={isLoading || (bounty.is_on_chain && !wallet.isConnected)}
            className="ml-auto"
          >
            Accept Bounty
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

