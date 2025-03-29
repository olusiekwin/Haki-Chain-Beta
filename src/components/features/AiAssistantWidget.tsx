"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../ui/Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/Card"
import { MessageCircle, X } from "lucide-react"

const AiAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your HakiChain AI assistant. How can I help you today?" },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message to conversation
    setConversation([...conversation, { role: "user", content: message }])

    // Simulate AI response
    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm a simulated AI assistant. In a real implementation, this would connect to an AI service to provide helpful responses about HakiChain.",
        },
      ])
    }, 1000)

    // Clear input
    setMessage("")
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 flex items-center justify-center shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 md:w-96 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">AI Assistant</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-4">
        <div className="h-64 overflow-y-auto space-y-4">
          {conversation.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default AiAssistantWidget

