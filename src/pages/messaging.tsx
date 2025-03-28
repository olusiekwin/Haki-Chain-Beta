"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, FileText, PaperclipIcon, Search, Send, User, Users, Download } from "lucide-react"

// Mock data for conversations
const mockConversations = [
  {
    id: "c1",
    type: "direct",
    participants: [
      {
        id: "u2",
        name: "EcoJustice NGO",
        avatar: "/placeholder.svg?height=40&width=40",
        isNgo: true,
      },
    ],
    lastMessage: {
      content: "Thank you for submitting your milestone. We'll review it shortly.",
      timestamp: "10:24 AM",
      isRead: true,
      senderId: "u2",
    },
    unreadCount: 0,
  },
  {
    id: "c2",
    type: "direct",
    participants: [
      {
        id: "u3",
        name: "Human Rights Watch",
        avatar: "/placeholder.svg?height=40&width=40",
        isNgo: true,
      },
    ],
    lastMessage: {
      content: "Are you available for a call tomorrow to discuss the bounty details?",
      timestamp: "Yesterday",
      isRead: false,
      senderId: "u3",
    },
    unreadCount: 2,
  },
  {
    id: "c3",
    type: "direct",
    participants: [
      {
        id: "u4",
        name: "James Mwangi",
        avatar: "/placeholder.svg?height=40&width=40",
        isNgo: false,
      },
    ],
    lastMessage: {
      content: "I'd like to collaborate on the environmental protection research bounty.",
      timestamp: "Monday",
      isRead: true,
      senderId: "u4",
    },
    unreadCount: 0,
  },
  {
    id: "c4",
    type: "group",
    name: "Environmental Law Experts",
    avatar: "/placeholder.svg?height=40&width=40",
    participants: [
      {
        id: "u2",
        name: "EcoJustice NGO",
        avatar: "/placeholder.svg?height=40&width=40",
        isNgo: true,
      },
      {
        id: "u4",
        name: "James Mwangi",
        avatar: "/placeholder.svg?height=40&width=40",
        isNgo: false,
      },
      {
        id: "u5",
        name: "Elizabeth Njeri",
        avatar: "/placeholder.svg?height=40&width=40",
        isNgo: false,
      },
    ],
    lastMessage: {
      content: "Let's coordinate our approach to the Lake Victoria case.",
      timestamp: "Apr 15",
      isRead: true,
      senderId: "u5",
    },
    unreadCount: 0,
  },
]

// Mock data for messages in a conversation
const mockMessages = [
  {
    id: "m1",
    senderId: "u2",
    content: "Hello Sarah, I noticed you've applied for our Environmental Protection Laws research bounty.",
    timestamp: "Apr 18, 10:05 AM",
    attachments: [],
  },
  {
    id: "m2",
    senderId: "u1", // Current user
    content:
      "Yes, I'm very interested in this bounty. I have extensive experience in environmental law research across East Africa.",
    timestamp: "Apr 18, 10:08 AM",
    attachments: [],
  },
  {
    id: "m3",
    senderId: "u2",
    content:
      "That's great to hear. I have a few questions about your proposed approach. Could you elaborate on how you plan to address the recent legislative changes?",
    timestamp: "Apr 18, 10:15 AM",
    attachments: [],
  },
  {
    id: "m4",
    senderId: "u1", // Current user
    content:
      "Of course. I plan to conduct a comparative analysis of the recent amendments to environmental protection laws across Kenya, Tanzania, and Uganda, with a particular focus on their implications for local communities and conservation efforts.",
    timestamp: "Apr 18, 10:20 AM",
    attachments: [],
  },
  {
    id: "m5",
    senderId: "u1", // Current user
    content:
      "I've also attached a sample of my previous work on a similar topic that might give you a better idea of my approach.",
    timestamp: "Apr 18, 10:21 AM",
    attachments: [
      {
        id: "a1",
        name: "Environmental_Law_Analysis_Sample.pdf",
        size: "2.4 MB",
        type: "pdf",
      },
    ],
  },
  {
    id: "m6",
    senderId: "u2",
    content:
      "Thank you for sharing this. The sample looks very comprehensive. I think your approach aligns well with what we're looking for.",
    timestamp: "Apr 18, 10:35 AM",
    attachments: [],
  },
  {
    id: "m7",
    senderId: "u2",
    content:
      "I've reviewed your application with the team, and we'd like to award you the bounty. Could you submit your first milestone by May 15?",
    timestamp: "Today, 10:24 AM",
    attachments: [],
  },
]

const Messaging = () => {
  const [activeConversation, setActiveConversation] = useState(mockConversations[0])
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const [newConversationRecipient, setNewConversationRecipient] = useState("")
  const [newConversationMessage, setNewConversationMessage] = useState("")
  const messagesEndRef = useRef(null)

  const filteredConversations = searchTerm
    ? mockConversations.filter((conv) => {
        if (conv.type === "direct") {
          return conv.participants[0].name.toLowerCase().includes(searchTerm.toLowerCase())
        } else {
          return conv.name.toLowerCase().includes(searchTerm.toLowerCase())
        }
      })
    : mockConversations

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeConversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg = {
      id: `m${messages.length + 1}`,
      senderId: "u1", // Current user
      content: newMessage,
      timestamp: "Just now",
      attachments: [],
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCreateConversation = () => {
    // In a real app, this would create a new conversation and send the first message
    setIsComposing(false)
    setNewConversationRecipient("")
    setNewConversationMessage("")
  }

  const getConversationName = (conversation) => {
    if (conversation.type === "group") {
      return conversation.name
    } else {
      return conversation.participants[0].name
    }
  }

  const getConversationAvatar = (conversation) => {
    if (conversation.type === "group") {
      return conversation.avatar
    } else {
      return conversation.participants[0].avatar
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  const isCurrentUser = (senderId) => senderId === "u1"

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        {/* Conversations List */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Conversations</h2>
              <Dialog open={isComposing} onOpenChange={setIsComposing}>
                <DialogTrigger asChild>
                  <Button size="sm">New Message</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                    <DialogDescription>Start a new conversation with a user or organization.</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="recipient" className="text-sm font-medium">
                        Recipient
                      </label>
                      <Input
                        id="recipient"
                        placeholder="Search for a user or organization"
                        value={newConversationRecipient}
                        onChange={(e) => setNewConversationRecipient(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Type your message..."
                        value={newConversationMessage}
                        onChange={(e) => setNewConversationMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={handleCreateConversation}
                      disabled={!newConversationRecipient || !newConversationMessage}
                    >
                      Send Message
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-1 p-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                        activeConversation.id === conversation.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage
                            src={getConversationAvatar(conversation)}
                            alt={getConversationName(conversation)}
                          />
                          <AvatarFallback>{getInitials(getConversationName(conversation))}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="font-medium truncate">
                              {getConversationName(conversation)}
                              {conversation.type === "direct" && conversation.participants[0].isNgo && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  NGO
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {conversation.lastMessage.timestamp}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage.senderId === "u1" ? "You: " : ""}
                              {conversation.lastMessage.content}
                            </p>

                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="unread" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-1 p-2">
                  {filteredConversations
                    .filter((c) => c.unreadCount > 0)
                    .map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                          activeConversation.id === conversation.id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => setActiveConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage
                              src={getConversationAvatar(conversation)}
                              alt={getConversationName(conversation)}
                            />
                            <AvatarFallback>{getInitials(getConversationName(conversation))}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div className="font-medium truncate">
                                {getConversationName(conversation)}
                                {conversation.type === "direct" && conversation.participants[0].isNgo && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    NGO
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {conversation.lastMessage.timestamp}
                              </span>
                            </div>

                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage.content}
                              </p>

                              <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Conversation View */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
          {activeConversation ? (
            <>
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={getConversationAvatar(activeConversation)}
                      alt={getConversationName(activeConversation)}
                    />
                    <AvatarFallback>{getInitials(getConversationName(activeConversation))}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="font-semibold flex items-center">
                      {getConversationName(activeConversation)}
                      {activeConversation.type === "direct" && activeConversation.participants[0].isNgo && (
                        <Badge variant="outline" className="ml-2">
                          NGO
                        </Badge>
                      )}
                    </h2>

                    {activeConversation.type === "group" && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        {activeConversation.participants.length} members
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Button variant="ghost" size="icon">
                    <AlertCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser(message.senderId) ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] ${isCurrentUser(message.senderId) ? "order-2" : "order-1"}`}>
                        {!isCurrentUser(message.senderId) && (
                          <Avatar className="h-8 w-8 mb-2">
                            <AvatarImage
                              src={getConversationAvatar(activeConversation)}
                              alt={getConversationName(activeConversation)}
                            />
                            <AvatarFallback>{getInitials(getConversationName(activeConversation))}</AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`rounded-lg p-3 ${
                            isCurrentUser(message.senderId)
                              ? "bg-primary text-primary-foreground"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p>{message.content}</p>

                          {message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className={`flex items-center gap-2 p-2 rounded ${
                                    isCurrentUser(message.senderId) ? "bg-primary-foreground/10" : "bg-gray-200"
                                  }`}
                                >
                                  <FileText className="h-4 w-4" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                                    <p className="text-xs opacity-70">{attachment.size}</p>
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <p
                          className={`text-xs text-muted-foreground mt-1 ${
                            isCurrentUser(message.senderId) ? "text-right" : "text-left"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    className="min-h-[80px]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <PaperclipIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="rounded-full"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-muted-foreground mt-1">Select a conversation or start a new one</p>
                <Button className="mt-4" onClick={() => setIsComposing(true)}>
                  New Message
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messaging

