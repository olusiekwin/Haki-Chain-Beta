import {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
} from "@hashgraph/sdk"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Initialize Hedera client
const initializeHederaClient = () => {
  // Get environment variables
  const myAccountId = process.env.HEDERA_ACCOUNT_ID
  const myPrivateKey = process.env.HEDERA_PRIVATE_KEY
  const network = process.env.HEDERA_NETWORK || "testnet"

  if (!myAccountId || !myPrivateKey) {
    throw new Error("Environment variables HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be present")
  }

  // Create Hedera client
  let client
  if (network === "mainnet") {
    client = Client.forMainnet()
  } else {
    client = Client.forTestnet()
  }

  // Set operator with account ID and private key
  client.setOperator(myAccountId, myPrivateKey)
  return client
}

/**
 * Creates a new Hedera consensus topic for AI analytics
 * @param name Name of the topic (e.g., "case-matching", "document-analysis")
 * @returns Topic ID
 */
export async function createAITopic(name: string): Promise<string> {
  const client = initializeHederaClient()

  // Create a new topic
  const transaction = await new TopicCreateTransaction()
    .setAdminKey(PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!))
    .setSubmitKey(PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!))
    .setTopicMemo(`Haki AI Topic: ${name}`)
    .execute(client)

  // Get the topic ID
  const receipt = await transaction.getReceipt(client)
  const topicId = receipt.topicId!.toString()

  console.log(`Created AI topic: ${topicId}`)
  return topicId
}

/**
 * Submit an AI analysis result to Hedera for immutable record
 * @param topicId Hedera topic ID
 * @param analysisType Type of analysis (e.g., "CaseMatching", "DocumentAnalysis")
 * @param inputHash Hash of the input data
 * @param result Result of the AI analysis
 * @returns Transaction ID
 */
export async function submitAIResult(
  topicId: string,
  analysisType: string,
  inputHash: string,
  result: any,
): Promise<string> {
  const client = initializeHederaClient()

  // Create message with metadata
  const message = {
    type: analysisType,
    timestamp: new Date().toISOString(),
    inputHash,
    result,
  }

  // Submit message to the topic
  const transaction = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(JSON.stringify(message))
    .execute(client)

  // Get the transaction ID
  const transactionId = transaction.transactionId.toString()
  console.log(`Submitted AI result to topic: ${topicId}, txId: ${transactionId}`)

  return transactionId
}

/**
 * Match lawyers to a legal bounty with verification through Hedera
 * @param bounty The legal bounty to match
 * @param lawyers Array of available lawyers
 * @param topicId Hedera topic ID for storing the match results
 * @returns Array of matched lawyers with scores
 */
export async function matchLawyersWithVerification(bounty: any, lawyers: any[], topicId: string): Promise<any[]> {
  // Format input for AI
  const bountyInfo = {
    title: bounty.title,
    description: bounty.description,
    category: bounty.category,
    location: bounty.location,
    requirements: bounty.requirements,
  }

  const lawyersInfo = lawyers.map((lawyer) => ({
    id: lawyer.id,
    specialization: lawyer.specialization,
    experience: lawyer.yearsOfExperience,
    location: lawyer.location,
    cases: lawyer.casesCompleted,
    rating: lawyer.rating,
  }))

  try {
    // Use AI to match lawyers to the bounty
    const prompt = `
      Match the following lawyers to this legal bounty based on expertise, experience, and location.
      Provide a matching score from 0-100 and brief reasoning for each match.
      
      Bounty details:
      ${JSON.stringify(bountyInfo, null, 2)}
      
      Available lawyers:
      ${JSON.stringify(lawyersInfo, null, 2)}
      
      Return the results as a JSON array of objects with the following structure:
      [
        {
          "lawyerId": "id",
          "score": number,
          "reasoning": "string"
        }
      ]
    `

    // Generate matching results
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse results
    const matches = JSON.parse(text)

    // Calculate hash of the input data for verification
    const inputData = JSON.stringify({ bounty: bountyInfo, lawyers: lawyersInfo })
    const inputHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(inputData)).then((hash) =>
      Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    )

    // Submit results to Hedera for verification
    await submitAIResult(topicId, "LawyerMatching", inputHash, matches)

    // Return matches sorted by score
    return matches.sort((a: any, b: any) => b.score - a.score)
  } catch (error) {
    console.error("Error matching lawyers:", error)
    throw error
  }
}

/**
 * Analyze a legal document with verification through Hedera
 * @param documentText The text of the legal document
 * @param topicId Hedera topic ID for storing analysis results
 * @returns Document analysis result
 */
export async function analyzeLegalDocumentWithVerification(documentText: string, topicId: string): Promise<any> {
  try {
    // Use AI to analyze the document
    const prompt = `
      Analyze the following legal document and provide:
      1. A concise summary (max 3 sentences)
      2. Key points (bullet points)
      3. Potential legal issues identified
      4. Recommended actions
      5. Relevant case law if applicable
      
      Document:
      ${documentText.substring(0, 8000)} ${documentText.length > 8000 ? "...(truncated)" : ""}
      
      Format your response as JSON with the following structure:
      {
        "summary": "string",
        "keyPoints": ["string"],
        "legalIssues": ["string"],
        "recommendedActions": ["string"],
        "relevantCaseLaw": ["string"] // optional
      }
    `

    // Generate analysis
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse analysis
    const analysis = JSON.parse(text)

    // Calculate hash of the input document for verification
    const inputHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(documentText)).then((hash) =>
      Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    )

    // Submit analysis to Hedera for verification
    await submitAIResult(topicId, "DocumentAnalysis", inputHash, analysis)

    return analysis
  } catch (error) {
    console.error("Error analyzing document:", error)
    throw error
  }
}

/**
 * Retrieve AI analysis history from Hedera
 * @param topicId Hedera topic ID
 * @param limit Maximum number of messages to retrieve
 * @returns Array of AI analysis results
 */
export async function getAIAnalysisHistory(topicId: string, limit = 20): Promise<any[]> {
  const client = initializeHederaClient()

  // Query messages from the topic
  const messageQuery = new TopicMessageQuery().setTopicId(topicId).setLimit(limit)

  try {
    // Subscribe to topic messages
    const messages: any[] = []
    await new Promise<void>((resolve, reject) => {
      messageQuery.subscribe(
        client,
        (message) => {
          try {
            const messageContent = JSON.parse(Buffer.from(message.contents).toString())
            messages.push({
              sequenceNumber: message.sequenceNumber.toString(),
              consensusTimestamp: message.consensusTimestamp.toString(),
              content: messageContent,
            })

            // If we've received the expected number of messages, resolve
            if (messages.length >= limit) {
              resolve()
            }
          } catch (error) {
            console.error("Error processing message:", error)
          }
        },
        (error) => {
          reject(error)
        },
      )

      // Set a timeout to resolve the promise if fewer messages are available
      setTimeout(() => {
        resolve()
      }, 10000) // 10 seconds timeout
    })

    return messages
  } catch (error) {
    console.error("Error retrieving AI analysis history:", error)
    return []
  }
}

