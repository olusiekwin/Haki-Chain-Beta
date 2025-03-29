"use client"

import type React from "react"
import { useState } from "react"
import { useApp } from "../../context/app-context"
import { config } from "../../utils/config"
import marketplaceContractService from "../../services/web3/marketplace-contract-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { AlertCircle, CheckCircle, Loader2, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

const MarketplaceListing: React.FC = () => {
  const { wallet } = useApp()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    file: null as File | null,
  })
  const [fileHash, setFileHash] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Check if marketplace contract address is configured
  const isContractConfigured = Boolean(config.contracts.marketplace)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleUploadFile = async () => {
    if (!formData.file) {
      setError("Please select a file to upload")
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // In a real implementation, this would upload to IPFS or similar
      // For this demo, we'll simulate the upload and generate a fake hash
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate upload delay

      // Generate a fake IPFS hash
      const fakeHash = `ipfs://${Array.from(Array(46))
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`
      setFileHash(fakeHash)

      setSuccess("File uploaded successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err: any) {
      console.error("Error uploading file:", err)
      setError(err.message || "Failed to upload file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet.isConnected || !wallet.address) {
      setError("Please connect your wallet first")
      return
    }

    if (!fileHash) {
      setError("Please upload a file first")
      return
    }

    try {
      setIsCreating(true)
      setError(null)
      setSuccess(null)

      // Validate form data
      if (!formData.title.trim()) {
        throw new Error("Please enter a title for the listing")
      }

      if (!formData.description.trim()) {
        throw new Error("Please enter a description for the listing")
      }

      const price = Number.parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        throw new Error("Please enter a valid price greater than 0")
      }

      // Create listing
      const txHash = await marketplaceContractService.listItem(
        wallet.address,
        formData.title,
        formData.description,
        formData.price,
        fileHash,
      )

      setSuccess(`Listing created successfully! Transaction hash: ${txHash}`)

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        file: null,
      })
      setFileHash("")
    } catch (err: any) {
      console.error("Error creating listing:", err)
      setError(err.message || "Failed to create listing. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  if (!isContractConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>List Legal Document</CardTitle>
          <CardDescription>Sell your legal document template on the marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              Marketplace contract address is not configured. Please set the REACT_APP_MARKETPLACE_CONTRACT_ADDRESS
              environment variable.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>List Legal Document</CardTitle>
        <CardDescription>Sell your legal document template on the marketplace</CardDescription>
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
              placeholder="e.g., Standard Employment Contract"
              value={formData.title}
              onChange={handleChange}
              disabled={isCreating}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your legal document..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              disabled={isCreating}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (HAKI Tokens)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              disabled={isCreating}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Document File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
              <Input
                id="file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || isCreating}
                accept=".pdf,.doc,.docx,.txt"
              />

              {formData.file ? (
                <div className="text-center">
                  <p className="text-sm font-medium">{formData.file.name}</p>
                  <p className="text-xs text-gray-500">{(formData.file.size / 1024).toFixed(2)} KB</p>

                  {fileHash ? (
                    <div className="mt-2 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Uploaded
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={handleUploadFile}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-3 w-3" />
                          Upload
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <Label htmlFor="file" className="cursor-pointer text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">Click to select a file</p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT (Max 10MB)</p>
                </Label>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          {wallet.isConnected ? (
            <Button type="submit" disabled={isCreating || isUploading || !fileHash} className="w-full">
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                "List Document for Sale"
              )}
            </Button>
          ) : (
            <Button type="button" onClick={wallet.connect} className="w-full">
              Connect Wallet to List Document
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

export default MarketplaceListing

