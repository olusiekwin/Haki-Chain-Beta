"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useApp } from "../../context/app-context"

interface Message {
  id: string
  text: string
  sender: "user" | "assistant"
  timestamp: Date
}

const AiAssistantWidget: React.FC = () => {
  const { user } = useApp()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello ${user?.first_name || "there"}! I'm your HakiChain legal assistant. How can I help you today?`,
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Sample legal questions for quick access
  const sampleQuestions = [
    "What is a smart contract?",
    "How do I create a legal bounty?",
    "Explain token-based legal services",
    "What are the benefits of blockchain for legal work?",
  ]

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getSimulatedResponse(input),
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  // Simple response simulation
  const getSimulatedResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("smart contract")) {
      return "A smart contract is a self-executing contract with the terms directly written into code. On HakiChain, smart contracts automate legal agreements, ensuring they execute exactly as programmed without the need for intermediaries."
    } else if (lowerQuestion.includes("bounty")) {
      return "To create a legal bounty on HakiChain, navigate to the Bounties section, click 'Create New Bounty', fill in the details of your legal task, set a reward amount, and publish it to the blockchain. Legal professionals can then bid to complete your task."
    } else if (lowerQuestion.includes("token")) {
      return "Token-based legal services on HakiChain use our native HAKI tokens to facilitate payments, escrow services, and reward distributions. This creates a transparent, efficient marketplace for legal services with reduced transaction costs."
    } else if (lowerQuestion.includes("blockchain")) {
      return "Blockchain technology provides several benefits for legal work: immutable record-keeping, transparent transactions, automated contract execution, reduced need for intermediaries, and global accessibility. HakiChain leverages these advantages to make legal services more efficient and accessible."
    } else {
      return "That's an interesting question about legal services on HakiChain. In a fully implemented version, I would connect to our knowledge base to provide you with a detailed answer. Is there something specific about HakiChain's legal services you'd like to know?"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      <div className="p-4 bg-primary text-white rounded-t-lg">
        <h2 className="text-xl font-bold">Legal Assistant</h2>
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto max-h-[400px]">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 ${message.sender === "user" ? "text-right" : ""}`}>
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                message.sender === "user"
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {message.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center mb-4">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions */}
      <div className="px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {sampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask a legal question..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-primary text-white px-4 py-2 rounded-r-lg disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default AiAssistantWidget

