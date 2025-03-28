"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Send, Upload, FileText, Bot, Sparkles } from "lucide-react"
import { getChatResponse, type ChatMessage } from "../services/ai/chat-service"
import { v4 as uuidv4 } from "uuid"

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm Haki's AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Improved scroll to bottom function
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight
    }
  }

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Create a placeholder for the assistant's response
    const assistantMessageId = uuidv4()
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
      },
    ])

    // Function to update the assistant's message as chunks arrive
    const updateAssistantMessage = (chunk: string) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk } : msg)),
      )
      // Scroll after each update
      setTimeout(scrollToBottom, 10)
    }

    try {
      await getChatResponse([...messages, userMessage], updateAssistantMessage)
      setIsLoading(false)
    } catch (error) {
      console.error("Error getting chat response:", error)
      updateAssistantMessage("I'm sorry, I encountered an error. Please try again later.")
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Generate test messages to check scrolling
  const addTestMessages = () => {
    const testMessages: ChatMessage[] = []
    for (let i = 0; i < 10; i++) {
      testMessages.push({
        id: `test-user-${i}`,
        content: `This is test user message ${i} to check scrolling`,
        role: "user",
        timestamp: new Date(),
      })
      testMessages.push({
        id: `test-assistant-${i}`,
        content: `This is test assistant response ${i} to check scrolling. The scroll area should automatically scroll to show new messages as they appear.`,
        role: "assistant",
        timestamp: new Date(),
      })
    }
    setMessages((prev) => [...prev, ...testMessages])
  }

  const suggestedQuestions = [
    "How do I create a legal bounty?",
    "What is the Haki token?",
    "How do smart contracts work on Haki?",
    "How can I verify my lawyer credentials?",
  ]

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-12rem)] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-5 w-5" />
                    Haki AI Assistant
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Ask questions about legal bounties, smart contracts, and the Haki platform
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTestMessages}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  Test Scroll
                </Button>
              </div>
            </CardHeader>
            <CardContent
              className="flex-1 overflow-y-auto p-4 space-y-4"
              ref={chatContainerRef}
              style={{ scrollBehavior: "smooth" }}
            >
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content || <div className="h-5 w-5 animate-pulse bg-gray-300 rounded"></div>}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Suggested Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {suggestedQuestions.map((question) => (
                  <Badge
                    key={question}
                    variant="outline"
                    className="mr-2 mb-2 py-2 px-3 cursor-pointer bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-blue-200 text-blue-700"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Document Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-4">Upload legal documents for AI analysis and get insights.</p>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardContent>
          </Card>

          <Card>
            <Tabs defaultValue="about">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-green-500 text-white pb-2">
                <CardTitle className="text-lg">AI Assistant Info</CardTitle>
                <TabsList className="bg-white/20">
                  <TabsTrigger value="about" className="text-white data-[state=active]:bg-white/30">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="capabilities" className="text-white data-[state=active]:bg-white/30">
                    Capabilities
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">
                <TabsContent value="about">
                  <p className="text-sm text-gray-600">
                    The Haki AI Assistant is powered by Hedera's AI agent technology, providing secure and verifiable AI
                    interactions on the blockchain.
                  </p>
                </TabsContent>
                <TabsContent value="capabilities">
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                    <li>Answer questions about the Haki platform</li>
                    <li>Explain legal concepts and terminology</li>
                    <li>Guide users through bounty creation</li>
                    <li>Provide information about blockchain integration</li>
                  </ul>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

