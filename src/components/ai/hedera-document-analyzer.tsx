"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Upload, FileCheck, AlertCircle, ShieldCheck, CheckCircle, Info } from "lucide-react"
import { analyzeLegalDocumentWithVerification } from "@/services/ai/hedera-ai-service"

interface DocumentAnalysisResult {
  summary: string
  keyPoints: string[]
  legalIssues: string[]
  recommendedActions: string[]
  relevantCaseLaw?: string[]
}

export function HederaDocumentAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [documentText, setDocumentText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DocumentAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)
  const [verificationTxId, setVerificationTxId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file type
      if (
        ![
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(selectedFile.type)
      ) {
        setError("Please upload a PDF, DOC, DOCX, or TXT file")
        return
      }

      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size should be less than 10MB")
        return
      }

      setFile(selectedFile)
      setError(null)

      // For demo purposes, we'll use a mock text extraction
      // In a real app, you would use a PDF parsing library or send the file to your backend
      const mockExtractedText =
        "AGREEMENT OF LEASE\n\n" +
        'THIS AGREEMENT OF LEASE made this 1st day of June, 2023, by and between LANDOWNER LLC, a Delaware limited liability company ("Landlord"), and TENANT CORPORATION, a Nevada corporation ("Tenant").\n\n' +
        "WITNESSETH:\n\n" +
        'Landlord hereby leases to Tenant and Tenant hereby rents from Landlord the premises located at 123 Main Street, Suite 300, New York, NY 10001 (the "Premises"), for a term of five (5) years, commencing on July 1, 2023 (the "Commencement Date") and ending on June 30, 2028, at the annual rental rate of $50,000 payable in equal monthly installments of $4,166.67 on the first day of each month in advance.\n\n' +
        "..." +
        "IN WITNESS WHEREOF, the parties hereto have executed this Agreement of Lease as of the day and year first above written."

      setDocumentText(mockExtractedText)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setDocumentText("")
    setResult(null)
    setVerified(false)
    setVerificationTxId(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAnalyzeDocument = async () => {
    if (!documentText) {
      setError("Please upload a document first")
      return
    }

    setLoading(true)
    setError(null)
    setVerified(false)
    setVerificationTxId(null)

    try {
      // For demo purposes, we'll use a hardcoded topic ID
      // In a real app, you would retrieve this from your backend
      const topicId = "0.0.12345"

      // Call the Hedera AI service to analyze the document with verification
      const analysisResult = await analyzeLegalDocumentWithVerification(documentText, topicId)

      setResult(analysisResult)
      setVerified(true)
      setVerificationTxId("0.0.12345@1684947200.123456789") // Mock transaction ID
    } catch (err) {
      setError("Failed to analyze document")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Legal Document Analyzer
          {verified && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              <ShieldCheck className="h-3 w-3 mr-1" /> Hedera Verified
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Analyze legal documents using AI with secure verification through the Hedera network
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {!file ? (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
              />
              <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">Upload a Legal Document</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your legal document here, or click to browse
              </p>
              <Button type="button" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Select Document
              </Button>
              <p className="text-xs text-muted-foreground mt-4">Supported formats: PDF, DOC, DOCX, TXT (max 10MB)</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-green-500" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleRemoveFile}>
                  Remove
                </Button>
              </div>

              {!result && (
                <Button onClick={handleAnalyzeDocument} disabled={loading} className="w-full">
                  {loading ? "Analyzing..." : "Analyze Document"}
                </Button>
              )}
            </div>
          )}

          {result && (
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="issues">Legal Issues</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Document Summary</h4>
                  <p>{result.summary}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Key Points</h4>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <ul className="space-y-2">
                      {result.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="issues" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Potential Legal Issues</h4>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <ul className="space-y-2">
                      {result.legalIssues.map((issue, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 shrink-0" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>

                {result.relevantCaseLaw && result.relevantCaseLaw.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Relevant Case Law</h4>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      <ul className="space-y-2">
                        {result.relevantCaseLaw.map((caseRef, index) => (
                          <li key={index} className="flex items-start">
                            <FileText className="h-4 w-4 text-blue-500 mr-2 mt-0.5 shrink-0" />
                            <span>{caseRef}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Recommended Actions</h4>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <ul className="space-y-2">
                      {result.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="verification" className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-md">
                  <h4 className="font-medium mb-2">Hedera Verification</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    This document analysis has been verified and recorded on the Hedera network for transparency and
                    immutability.
                  </p>
                  {verificationTxId && (
                    <div className="bg-white p-3 rounded border text-sm font-mono break-all">
                      <span className="text-muted-foreground">Transaction ID: </span>
                      {verificationTxId}
                    </div>
                  )}
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500 mr-2" />
                  <AlertDescription className="text-blue-700">
                    The document hash and analysis results have been stored on Hedera's immutable ledger, providing a
                    permanent record that can be verified by all parties.
                  </AlertDescription>
                </Alert>

                <div>
                  <h4 className="font-medium mb-2">Verification Benefits</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span>Tamper-proof record of document analysis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span>Proof of document existence at a specific time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span>Secure AI analysis with traceable provenance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span>Compliance with legal record-keeping requirements</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        {result && (
          <div className="w-full flex justify-end space-x-2">
            <Button variant="outline">Download Analysis</Button>
            <Button>Request Legal Assistance</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

