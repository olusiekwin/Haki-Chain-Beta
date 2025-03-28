import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface DocumentAnalysisResult {
  summary: string
  keyPoints: string[]
  legalIssues: string[]
  recommendedActions: string[]
  relevantCaseLaw?: string[]
}

export async function analyzeLegalDocument(documentText: string): Promise<DocumentAnalysisResult> {
  const prompt = `
    Analyze the following legal document and provide:
    1. A concise summary (max 3 sentences)
    2. Key points (bullet points)
    3. Potential legal issues identified
    4. Recommended actions
    5. Relevant case law if applicable
    
    Document:
    ${documentText}
    
    Format your response as JSON with the following structure:
    {
      "summary": "string",
      "keyPoints": ["string"],
      "legalIssues": ["string"],
      "recommendedActions": ["string"],
      "relevantCaseLaw": ["string"] // optional
    }
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error analyzing document:", error)
    return {
      summary: "Error analyzing document",
      keyPoints: ["Error occurred during analysis"],
      legalIssues: ["Unable to identify issues due to error"],
      recommendedActions: ["Please try again or consult a legal professional"],
    }
  }
}

