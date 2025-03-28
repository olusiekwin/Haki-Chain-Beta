"use client"

import type React from "react"
import { useState } from "react"
import { FeatureFlag } from "./feature-flag"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { aiAssistantService } from "../services/ai-assistant-service"

interface AiAssistantProps {
  initialPrompt?: string
  placeholder?: string
  onSuggestion?: (suggestion: string) => void
}

export function AiAssistant({
  initialPrompt = "",
  placeholder = "Ask the AI assistant for help...",
  onSuggestion,
}: AiAssistantProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) return

    setIsLoading(true)

    try {
      const result = await aiAssistantService.getSuggestions(prompt)
      setResponse(result.suggestions[0] || "No suggestions available.")

      if (result.suggestions[0] && onSuggestion) {
        onSuggestion(result.suggestions[0])
      }
    } catch (error) {
      console.error("Error getting AI suggestions:", error)
      setResponse("An error occurred while getting suggestions.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FeatureFlag feature="aiAssistant">
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>Get help with your legal tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              className="mb-4"
            />
            <Button type="submit" disabled={isLoading || !prompt.trim()}>
              {isLoading ? "Thinking..." : "Get Suggestions"}
            </Button>
          </form>

          {response && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h4 className="font-medium mb-2">AI Suggestion:</h4>
              <p>{response}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </FeatureFlag>
  )
}

