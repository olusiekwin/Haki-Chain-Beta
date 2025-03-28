"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Briefcase, CheckCircle, Award, MessageSquare, ShieldCheck } from "lucide-react"
import { matchLawyersWithVerification } from "@/services/ai/hedera-ai-service"

interface Bounty {
  id: string
  title: string
  description: string
  category: string
  location: string
  requirements?: string[]
}

interface Lawyer {
  id: string
  name: string
  avatar?: string
  specialization: string
  yearsOfExperience: number
  location: string
  casesCompleted: number
  rating: number
  verificationStatus: string
}

interface MatchResult {
  lawyerId: string
  score: number
  reasoning: string
}

export function AILawyerMatching({ bountyId }: { bountyId: string }) {
  const [bounty, setBounty] = useState<Bounty | null>(null)
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [matchResults, setMatchResults] = useState<(MatchResult & { lawyer?: Lawyer })[]>([])
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [topicId, setTopicId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [verificationTxId, setVerificationTxId] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, fetch the bounty and available lawyers from your API
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        const mockBounty: Bounty = {
          id: bountyId,
          title: "Land Rights Case for Indigenous Community",
          description:
            "Seeking legal representation for an indigenous community facing land displacement due to corporate development.",
          category: "Land Rights",
          location: "Brazil",
          requirements: ["Experience with indigenous rights", "Environmental law knowledge", "Fluent in Portuguese"],
        }

        const mockLawyers: Lawyer[] = [
          {
            id: "1",
            name: "Maria Silva",
            avatar: "/placeholder.svg?height=100&width=100",
            specialization: "Indigenous Rights",
            yearsOfExperience: 8,
            location: "Brazil",
            casesCompleted: 12,
            rating: 4.8,
            verificationStatus: "verified",
          },
          {
            id: "2",
            name: "James Rodriguez",
            avatar: "/placeholder.svg?height=100&width=100",
            specialization: "Environmental Law",
            yearsOfExperience: 5,
            location: "United States",
            casesCompleted: 7,
            rating: 4.2,
            verificationStatus: "verified",
          },
          {
            id: "3",
            name: "Ana Pereira",
            avatar: "/placeholder.svg?height=100&width=100",
            specialization: "Human Rights",
            yearsOfExperience: 10,
            location: "Brazil",
            casesCompleted: 15,
            rating: 4.9,
            verificationStatus: "verified",
          },
          {
            id: "4",
            name: "David Chen",
            avatar: "/placeholder.svg?height=100&width=100",
            specialization: "Corporate Law",
            yearsOfExperience: 7,
            location: "Canada",
            casesCompleted: 9,
            rating: 4.3,
            verificationStatus: "verified",
          },
          {
            id: "5",
            name: "Sofia Morales",
            avatar: "/placeholder.svg?height=100&width=100",
            specialization: "Environmental Law",
            yearsOfExperience: 3,
            location: "Mexico",
            casesCompleted: 4,
            rating: 4.0,
            verificationStatus: "pending",
          },
        ]

        // Set the data in state
        setBounty(mockBounty)
        setLawyers(mockLawyers)

        // In a real app, you'd retrieve the topicId from your API or database
        // For now, we'll use a mock topic ID
        setTopicId("0.0.12345")
      } catch (err) {
        setError("Failed to load data")
        console.error(err)
      }
    }

    fetchData()
  }, [bountyId])

  const handleMatchLawyers = async () => {
    if (!bounty) return

    setLoading(true)
    setError(null)
    setVerified(false)
    setVerificationTxId(null)

    try {
      // Call the Hedera AI service to match lawyers with verification
      const results = await matchLawyersWithVerification(bounty, lawyers, topicId)

      // Combine match results with lawyer details
      const combinedResults = results.map((result) => {
        const lawyer = lawyers.find((l) => l.id === result.lawyerId)
        return {
          ...result,
          lawyer,
        }
      })

      setMatchResults(combinedResults)
      setVerified(true)
      setVerificationTxId("0.0.12345@1684947200.123456789") // Mock transaction ID
    } catch (err) {
      setError("Failed to match lawyers")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center text-red-500 mb-4">
            <p>{error}</p>
          </div>
          <Button onClick={() => setError(null)}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          AI Lawyer Matching
          {verified && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              <ShieldCheck className="h-3 w-3 mr-1" /> Hedera Verified
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Find the best lawyers for your legal bounty using AI matching powered by Hedera
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bounty ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{bounty.title}</h3>
              <p className="text-sm text-muted-foreground">{bounty.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge>{bounty.category}</Badge>
                <Badge variant="outline">{bounty.location}</Badge>
                {bounty.requirements?.map((req, index) => (
                  <Badge key={index} variant="secondary">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>

            {matchResults.length > 0 ? (
              <Tabs defaultValue="matches">
                <TabsList>
                  <TabsTrigger value="matches">Top Matches</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                </TabsList>
                <TabsContent value="matches">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {matchResults.map((result, index) => (
                        <Card key={result.lawyerId} className={index === 0 ? "border-primary" : ""}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={result.lawyer?.avatar} alt={result.lawyer?.name} />
                                <AvatarFallback>{result.lawyer?.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{result.lawyer?.name || "Unknown Lawyer"}</h4>
                                    <p className="text-sm text-muted-foreground">{result.lawyer?.specialization}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-bold text-lg">{result.score}%</span>
                                    <p className="text-xs text-muted-foreground">Match Score</p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <Progress value={result.score} className="h-2" />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <div className="flex items-center text-xs">
                                    <Award className="h-3 w-3 mr-1 text-yellow-500" />
                                    <span>{result.lawyer?.rating} Rating</span>
                                  </div>
                                  <div className="flex items-center text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                    <span>{result.lawyer?.casesCompleted} Cases</span>
                                  </div>
                                  <div className="flex items-center text-xs">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    <span>{result.lawyer?.yearsOfExperience} Years Exp.</span>
                                  </div>
                                </div>
                                <p className="text-sm mt-2">{result.reasoning}</p>
                                <div className="mt-3">
                                  <Button size="sm">Contact Lawyer</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="verification">
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/50 rounded-md">
                      <h4 className="font-medium mb-2">Hedera Verification</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        This AI matching result has been verified and recorded on the Hedera network for transparency
                        and immutability.
                      </p>
                      {verificationTxId && (
                        <div className="bg-white p-3 rounded border text-sm font-mono break-all">
                          <span className="text-muted-foreground">Transaction ID: </span>
                          {verificationTxId}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Verification Benefits</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          <span>Immutable record of AI matching process</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          <span>Transparency for all stakeholders</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          <span>Auditable decision-making process</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          <span>Verifiable AI-human interactions</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex justify-center">
                <Button onClick={handleMatchLawyers} disabled={loading} className="mt-4">
                  {loading ? "Matching..." : "Find Matching Lawyers"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

