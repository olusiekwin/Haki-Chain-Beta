"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { authService } from "@/services/api-service"
import { Upload, AlertCircle, Info } from "lucide-react"

export function LawyerVerification() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    lawSocietyNumber: "",
    jurisdiction: "",
    specialization: "",
    yearsOfExperience: "",
  })
  const [documents, setDocuments] = useState<
    Array<{
      type: "id" | "lawSociety" | "other"
      file: File | null
      description?: string
    }>
  >([
    { type: "id", file: null },
    { type: "lawSociety", file: null },
  ])

  // Redirect if not a lawyer
  useEffect(() => {
    if (user && user.role !== "lawyer") {
      navigate("/dashboard")
    }

    // If already verified or pending, redirect to dashboard
    if (
      user &&
      user.role === "lawyer" &&
      (user.verificationStatus === "verified" || user.verificationStatus === "pending")
    ) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDocumentFileChange = (index: number, file: File | null) => {
    const updatedDocuments = [...documents]
    updatedDocuments[index] = { ...updatedDocuments[index], file }
    setDocuments(updatedDocuments)
  }

  const handleDocumentDescriptionChange = (index: number, description: string) => {
    const updatedDocuments = [...documents]
    updatedDocuments[index] = { ...updatedDocuments[index], description }
    setDocuments(updatedDocuments)
  }

  const addDocument = () => {
    setDocuments([...documents, { type: "other", file: null, description: "" }])
  }

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    // Basic validation
    if (
      !formData.lawSocietyNumber ||
      !formData.jurisdiction ||
      !formData.specialization ||
      !formData.yearsOfExperience
    ) {
      setError("Please fill in all required fields")
      return false
    }

    // Validate required documents
    if (!documents[0].file || !documents[1].file) {
      setError("Please upload both ID document and Law Society certificate")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      if (!validateForm()) {
        setIsSubmitting(false)
        return
      }

      // Prepare verification data
      const verificationData = {
        ...formData,
        documents: documents.map((doc) => doc.file).filter(Boolean) as File[],
        documentDescriptions: documents.map((doc) => ({
          type: doc.type,
          description: doc.description || "",
        })),
      }

      // Submit verification
      await authService.submitVerification(verificationData)

      setSuccess(true)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during submission")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
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
                  Your verification request has been submitted successfully and is pending review by an admin.
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
                  <h3 className="text-lg font-medium">Professional Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="lawSocietyNumber">
                      Law Society Number / Bar Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lawSocietyNumber"
                      name="lawSocietyNumber"
                      value={formData.lawSocietyNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., LS123456"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jurisdiction">
                      Jurisdiction <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.jurisdiction}
                      onValueChange={(value) => handleSelectChange("jurisdiction", value)}
                      required
                    >
                      <SelectTrigger id="jurisdiction">
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="Texas">Texas</SelectItem>
                        <SelectItem value="Florida">Florida</SelectItem>
                        <SelectItem value="Illinois">Illinois</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">
                      Specialization <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) => handleSelectChange("specialization", value)}
                      required
                    >
                      <SelectTrigger id="specialization">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Human Rights">Human Rights</SelectItem>
                        <SelectItem value="Environmental Law">Environmental Law</SelectItem>
                        <SelectItem value="Land Rights">Land Rights</SelectItem>
                        <SelectItem value="Family Law">Family Law</SelectItem>
                        <SelectItem value="Immigration">Immigration</SelectItem>
                        <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                        <SelectItem value="Labor Law">Labor Law</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">
                      Years of Experience <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Required Documents</h3>

                  {/* ID Document */}
                  <div className="space-y-2">
                    <Label htmlFor="idDocument">
                      ID Document <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="idDocument"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          handleDocumentFileChange(0, file)
                        }}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <Label
                        htmlFor="idDocument"
                        className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 w-full cursor-pointer hover:bg-secondary/50"
                      >
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {documents[0].file
                            ? documents[0].file.name
                            : "Upload ID document (passport, driver's license)"}
                        </span>
                      </Label>
                      {documents[0].file && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDocumentFileChange(0, null)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Law Society Certificate */}
                  <div className="space-y-2">
                    <Label htmlFor="lawSocietyDocument">
                      Law Society Certificate <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="lawSocietyDocument"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          handleDocumentFileChange(1, file)
                        }}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <Label
                        htmlFor="lawSocietyDocument"
                        className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 w-full cursor-pointer hover:bg-secondary/50"
                      >
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {documents[1].file ? documents[1].file.name : "Upload Law Society certificate"}
                        </span>
                      </Label>
                      {documents[1].file && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDocumentFileChange(1, null)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Additional Documents */}
                  {documents.slice(2).map((document, index) => (
                    <div key={index + 2} className="space-y-2 border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`additionalDocument-${index}`}>Additional Document</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index + 2)}>
                          Remove
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Input
                          placeholder="Document description"
                          value={document.description || ""}
                          onChange={(e) => handleDocumentDescriptionChange(index + 2, e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <Input
                          id={`additionalDocument-${index}`}
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            handleDocumentFileChange(index + 2, file)
                          }}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <Label
                          htmlFor={`additionalDocument-${index}`}
                          className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 w-full cursor-pointer hover:bg-secondary/50"
                        >
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {document.file ? document.file.name : "Upload document"}
                          </span>
                        </Label>
                        {document.file && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDocumentFileChange(index + 2, null)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addDocument}>
                    Add Additional Document
                  </Button>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    By submitting this form, you confirm that all information provided is accurate and that you are a
                    licensed legal professional in the jurisdiction specified.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Verification"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

