"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for conversations
const conversations = [
  {
    id: 1,
    contact: {
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    lastMessage: "I've reviewed the case details and have some questions about the documentation requirements.",
    timestamp: "10:32 AM",
    unread: true,
    messages: [
      {
        id: 101,
        sender: "Maria Rodriguez",
        content: "Hello! I'm interested in the refugee legal aid bounty you posted.",
        timestamp: "Yesterday, 9:15 AM",
        isMe: false,
      },
      {
        id: 102,
        sender: "You",
        content: "Hi Maria, thanks for your interest! Do you have experience with asylum cases?",
        timestamp: "Yesterday, 9:30 AM",
        isMe: true,
      },
      {
        id: 103,
        sender: "Maria Rodriguez",
        content:
          "Yes, I've worked on over 30 asylum cases in the past 5 years. I specialize in cases involving political persecution.",
        timestamp: "Yesterday, 9:45 AM",
        isMe: false,
      },
      {
        id: 104,
        sender: "You",
        content:
          "That's great to hear. The families in this case are primarily from Central America. Are you familiar with that region?",
        timestamp: "Yesterday, 10:00 AM",
        isMe: true,
      },
      {
        id: 105,
        sender: "Maria Rodriguez",
        content: "I've reviewed the case details and have some questions about the documentation requirements.",
        timestamp: "Today, 10:32 AM",
        isMe: false,
      },
    ],
  },
  {
    id: 2,
    contact: {
      name: "James Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
    },
    lastMessage:
      "I've submitted my application for the environmental justice bounty. Looking forward to your response.",
    timestamp: "Yesterday",
    unread: false,
    messages: [
      {
        id: 201,
        sender: "James Wilson",
        content: "Hello, I'm interested in the environmental justice bounty for indigenous communities.",
        timestamp: "2 days ago, 3:15 PM",
        isMe: false,
      },
      {
        id: 202,
        sender: "You",
        content: "Hi James, thanks for reaching out. What's your experience with environmental law?",
        timestamp: "2 days ago, 4:20 PM",
        isMe: true,
      },
      {
        id: 203,
        sender: "James Wilson",
        content:
          "I've been practicing environmental law for 8 years, with a focus on indigenous land rights and natural resource protection.",
        timestamp: "2 days ago, 5:05 PM",
        isMe: false,
      },
      {
        id: 204,
        sender: "You",
        content: "That sounds perfect for this case. Have you worked with tribal governments before?",
        timestamp: "2 days ago, 5:30 PM",
        isMe: true,
      },
      {
        id: 205,
        sender: "James Wilson",
        content:
          "I've submitted my application for the environmental justice bounty. Looking forward to your response.",
        timestamp: "Yesterday, 11:45 AM",
        isMe: false,
      },
    ],
  },
  {
    id: 3,
    contact: {
      name: "Aisha Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
    },
    lastMessage:
      "Thank you for selecting me for the bounty. I'll start working on the initial consultations next week.",
    timestamp: "2 days ago",
    unread: false,
    messages: [],
  },
]

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // In a real app, you would send this to an API
    console.log("Sending message:", newMessage)
    setNewMessage("")
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversation list */}
        <Card className="md:col-span-1 overflow-hidden flex flex-col">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-grow">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${activeConversation.id === conversation.id ? "bg-muted" : ""}`}
                onClick={() => setActiveConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
                      <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                        conversation.contact.status === "online"
                          ? "bg-green-500"
                          : conversation.contact.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                      }`}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium truncate">{conversation.contact.name}</span>
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      <span className="sr-only">Unread messages</span>
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Message thread */}
        <Card className="md:col-span-2 overflow-hidden flex flex-col">
          <CardHeader className="px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={activeConversation.contact.avatar} alt={activeConversation.contact.name} />
                <AvatarFallback>{activeConversation.contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{activeConversation.contact.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {activeConversation.contact.status === "online"
                    ? "Online"
                    : activeConversation.contact.status === "away"
                      ? "Away"
                      : "Offline"}
                </p>
              </div>
            </div>
          </CardHeader>

          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {activeConversation.messages.length > 0 ? (
              activeConversation.messages.map((message) => (
                <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}

