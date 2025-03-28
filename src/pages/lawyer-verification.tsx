"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Upload, FileText, AlertCircle, Info } from "lucide-react"

export function LawyerVerification() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    lawSocietyNumber: "",
    jurisdiction: "",
    specialization: "",
    yearsOfExperience: "",
    additionalInfo: "",
  })
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [lawSocietyDocument, setLawSocietyDocument] = useState<File | null>(null)

  // Redirect if not a lawyer
  if (user && user.role !== "lawyer") {
    navigate("/dashboard")
    return null
  }

  // Redirect if already verified or verification in progress
  if (user?.verificationStatus === "verified" || user?.verificationStatus === "pending") {
    navigate("/dashboard")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0])
    }
  }

  const handleLawSocietyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLawSocietyDocument(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form
      if (!formData.lawSocietyNumber || !formData.jurisdiction || !idDocument || !lawSocietyDocument) {
        throw new Error("Please fill in all required fields and upload all required documents")
      }

      // In a real app, you would upload the files to a server here
      // For now, we'll simulate a successful upload
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update user profile with verification status
      await updateProfile({
        verificationStatus: "pending",
        ...formData,
      })

      setSuccess(true)
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during submission")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Lawyer Verification</CardTitle>
            <CardDescription>Submit your credentials to verify your lawyer status on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
                <Info className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Your verification documents have been submitted successfully. Our admin team will review your
                  application and update your status within 1-2 business days.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lawSocietyNumber">
                        Law Society Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lawSocietyNumber"
                        name="lawSocietyNumber"
                        value={formData.lawSocietyNumber}
                        onChange={handleInputChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Your official registration number with your law society
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jurisdiction">
                        Jurisdiction <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="jurisdiction"
                        name="jurisdiction"
                        placeholder="e.g., New York, California, Ontario"
                        value={formData.jurisdiction}
                        onChange={handleInputChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        The jurisdiction where you are licensed to practice
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Area of Specialization</Label>
                      <Input
                        id="specialization"
                        name="specialization"
                        placeholder="e.g., Human Rights, Environmental Law"
                        value={formData.specialization}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                      <Input
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idDocument">
                      Government-Issued ID <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="idDocument"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleIdUpload}
                        className="hidden"
                      />
                      <Label
                        htmlFor="idDocument"
                        className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 w-full cursor-pointer hover:bg-secondary/50"
                      >
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {idDocument ? idDocument.name : "Upload your ID (PDF, JPG, PNG)"}
                        </span>
                      </Label>
                      {idDocument && (
                        <Button type="button" variant="outline" size="sm" onClick={() => setIdDocument(null)}>
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Upload a clear copy of your government-issued ID</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lawSocietyDocument">
                      Law Society Certificate <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="lawSocietyDocument"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleLawSocietyUpload}
                        className="hidden"
                      />
                      <Label
                        htmlFor="lawSocietyDocument"
                        className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 w-full cursor-pointer hover:bg-secondary/50"
                      >
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {lawSocietyDocument
                            ? lawSocietyDocument.name
                            : "Upload your Law Society Certificate (PDF, JPG, PNG)"}
                        </span>
                      </Label>
                      {lawSocietyDocument && (
                        <Button type="button" variant="outline" size="sm" onClick={() => setLawSocietyDocument(null)}>
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload your law society certificate or practicing license
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Any additional information you'd like to provide to support your verification"
                      rows={4}
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800 dark:text-blue-200">Privacy Notice</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Your documents will be securely stored and only accessed by our verification team. We do not
                        share your personal information with third parties. Documents will be deleted after verification
                        is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
          {!success && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit for Verification"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

