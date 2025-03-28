"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, Send, MessageSquare } from "lucide-react"
import { getChatResponse, type ChatMessage } from "../services/ai/chat-service"
import { v4 as uuidv4 } from "uuid"

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
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
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Improved scroll to bottom function
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight
    }
  }

  // Scroll when messages change or when chat is opened
  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

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

  return (
    <>
      {isOpen ? (
        <Card className="fixed bottom-4 right-4 w-80 md:w-96 h-96 flex flex-col shadow-xl border border-gray-200 z-50 overflow-hidden bg-white rounded-xl">
          <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 p-3 flex justify-between items-center text-white">
            <h3 className="font-semibold">Haki AI Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div
            className="flex-1 overflow-y-auto p-3 space-y-3"
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
          </div>
          <div className="p-3 border-t border-gray-200">
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
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg z-50 hover:from-purple-700 hover:to-blue-600"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </>
  )
}

