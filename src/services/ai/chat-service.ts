export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: Date
}

// Mock responses for testing the UI
const mockResponses: Record<string, string> = {
  "How do I create a legal bounty?":
    "To create a legal bounty on Haki, follow these steps:\n\n1. Navigate to the 'Create Bounty' page\n2. Fill in the details of your legal issue\n3. Set your budget and milestone payments\n4. Upload any relevant documents\n5. Review and submit your bounty\n\nYour bounty will then be visible to verified lawyers who can apply to work on your case.",

  "What is the Haki token?":
    "The HAKI token is the native utility token of the Haki platform built on Hedera. It serves several purposes:\n\n• Platform governance - token holders can vote on platform decisions\n• Fee payments - used to pay for services on the platform\n• Staking - lawyers stake tokens as a form of reputation\n• Rewards - earned by contributing to the ecosystem\n\nHAKI tokens are implemented as Hedera tokens using the Hedera Token Service (HTS).",

  "How do smart contracts work on Haki?":
    "Smart contracts on Haki are implemented using Hedera Smart Contract Service. They handle:\n\n1. Escrow management - securely holding funds until milestones are completed\n2. Milestone verification - releasing payments when conditions are met\n3. Dispute resolution - managing the arbitration process\n4. Reputation tracking - recording lawyer performance metrics\n\nAll contracts are audited for security and deployed on the Hedera network for maximum reliability and transparency.",

  "How can I verify my lawyer credentials?":
    "To verify your lawyer credentials on Haki:\n\n1. Go to your profile settings\n2. Select 'Verify Credentials'\n3. Upload your bar association license/certificate\n4. Provide your bar number and jurisdiction information\n5. Submit for verification\n\nOur team will verify your credentials with the relevant authorities. This process typically takes 2-3 business days. Once verified, you'll receive a verification badge on your profile and can start accepting bounties.",
}

// This is a simplified version for browser compatibility
export async function getChatResponse(messages: ChatMessage[], onChunk: (chunk: string) => void): Promise<string> {
  // Get the last user message
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")

  if (!lastUserMessage) {
    return "I don't see a question. How can I help you?"
  }

  // Check if we have a mock response for this question
  const exactMatch = mockResponses[lastUserMessage.content]

  // If we have an exact match, return it with simulated streaming
  if (exactMatch) {
    await simulateStreamingResponse(exactMatch, onChunk)
    return exactMatch
  }

  // Otherwise, look for keywords in the question
  const userQuestion = lastUserMessage.content.toLowerCase()

  if (userQuestion.includes("bounty") || userQuestion.includes("create")) {
    await simulateStreamingResponse(mockResponses["How do I create a legal bounty?"], onChunk)
    return mockResponses["How do I create a legal bounty?"]
  }

  if (userQuestion.includes("token") || userQuestion.includes("haki token")) {
    await simulateStreamingResponse(mockResponses["What is the Haki token?"], onChunk)
    return mockResponses["What is the Haki token?"]
  }

  if (userQuestion.includes("smart contract") || userQuestion.includes("contract")) {
    await simulateStreamingResponse(mockResponses["How do smart contracts work on Haki?"], onChunk)
    return mockResponses["How do smart contracts work on Haki?"]
  }

  if (userQuestion.includes("verify") || userQuestion.includes("lawyer") || userQuestion.includes("credentials")) {
    await simulateStreamingResponse(mockResponses["How can I verify my lawyer credentials?"], onChunk)
    return mockResponses["How can I verify my lawyer credentials?"]
  }

  // Default response
  const defaultResponse =
    "I'm not sure I understand your question. Could you please rephrase or ask about creating bounties, Haki tokens, smart contracts, or lawyer verification?"
  await simulateStreamingResponse(defaultResponse, onChunk)
  return defaultResponse
}

// Helper function to simulate streaming responses
async function simulateStreamingResponse(text: string, onChunk: (chunk: string) => void): Promise<void> {
  const words = text.split(" ")

  for (let i = 0; i < words.length; i++) {
    // Send 1-3 words at a time to simulate natural chunking
    const chunkSize = Math.floor(Math.random() * 3) + 1
    const chunk = words.slice(i, i + chunkSize).join(" ") + " "
    onChunk(chunk)
    i += chunkSize - 1 // Adjust for the words we've already processed

    // Random delay between chunks (50-150ms) to simulate typing
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 100) + 50))
  }
}

// This is a placeholder for the real implementation that would use Hedera
export async function initializeHederaClient() {
  console.log("Initializing Hedera client (mock implementation)")
  return {
    status: "connected",
    network: "testnet",
    accountId: "0.0.12345",
  }
}

