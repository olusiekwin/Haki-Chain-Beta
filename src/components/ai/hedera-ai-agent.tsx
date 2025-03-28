"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Bot, Cpu } from "lucide-react"

export function HederaAIAgent() {
  const [activeAgents, setActiveAgents] = useState([
    {
      id: "1",
      name: "Document Analyzer",
      type: "Legal",
      status: "active",
      lastActive: new Date(),
      transactions: 24,
      icon: "FileText",
    },
    {
      id: "2",
      name: "Lawyer Matcher",
      type: "Recruitment",
      status: "active",
      lastActive: new Date(),
      transactions: 18,
      icon: "Users",
    },
    {
      id: "3",
      name: "Chat Assistant",
      type: "Support",
      status: "active",
      lastActive: new Date(),
      transactions: 156,
      icon: "MessageCircle",
    },
  ])

  const [agentMetrics, setAgentMetrics] = useState({
    totalTransactions: 198,
    averageResponseTime: "1.2s",
    successRate: 99.2,
    activeTopics: 5,
  })

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-corporate-purple to-corporate-blue text-white">
        <div className="flex items-center">
          <Cpu className="h-6 w-6 mr-2" />
          <div>
            <CardTitle>Hedera AI Agent Dashboard</CardTitle>
            <CardDescription className="text-white/80">
              Monitor and manage your AI agents on the Hedera network
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white shadow-sm border-corporate-purple/20">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <p className="text-sm text-corporate-gray mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-corporate-purple">{agentMetrics.totalTransactions}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-corporate-blue/20">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <p className="text-sm text-corporate-gray mb-1">Avg Response Time</p>
                <p className="text-3xl font-bold text-corporate-blue">{agentMetrics.averageResponseTime}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-corporate-teal/20">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <p className="text-sm text-corporate-gray mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-corporate-teal">{agentMetrics.successRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-corporate-green/20">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <p className="text-sm text-corporate-gray mb-1">Active Topics</p>
                <p className="text-3xl font-bold text-corporate-green">{agentMetrics.activeTopics}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-corporate-purple data-[state=active]:text-white"
            >
              Active Agents
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-corporate-blue data-[state=active]:text-white"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-corporate-teal data-[state=active]:text-white">
              Transaction Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-4">
              {activeAgents.map((agent) => (
                <Card key={agent.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-gradient-to-r from-corporate-purple to-corporate-blue text-white">
                            <Bot size={20} />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-corporate-gray">{agent.name}</h4>
                          <div className="flex items-center mt-1">
                            <Badge className="bg-corporate-green/20 text-corporate-green border-0 mr-2">
                              {agent.status}
                            </Badge>
                            <span className="text-xs text-corporate-gray">{agent.transactions} transactions</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-corporate-purple hover:bg-corporate-purple/90">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button className="w-full bg-gradient-to-r from-corporate-purple to-corporate-blue hover:opacity-90">
                Deploy New AI Agent
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium text-corporate-gray mb-4">Agent Performance</h3>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-corporate-gray">Document Analyzer</span>
                      <span className="text-sm font-medium text-corporate-purple">92%</span>
                    </div>
                    <Progress value={92} className="h-2 bg-corporate-purple/20">
                      <div
                        className="h-full bg-gradient-to-r from-corporate-purple to-corporate-blue rounded-full"
                        style={{ width: "92%" }}
                      />
                    </Progress>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-corporate-gray">Lawyer Matcher</span>
                      <span className="text-sm font-medium text-corporate-blue">88%</span>
                    </div>
                    <Progress value={88} className="h-2 bg-corporate-blue/20">
                      <div
                        className="h-full bg-gradient-to-r from-corporate-blue to-corporate-teal rounded-full"
                        style={{ width: "88%" }}
                      />
                    </Progress>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-corporate-gray">Chat Assistant</span>
                      <span className="text-sm font-medium text-corporate-teal">95%</span>
                    </div>
                    <Progress value={95} className="h-2 bg-corporate-teal/20">
                      <div
                        className="h-full bg-gradient-to-r from-corporate-teal to-corporate-green rounded-full"
                        style={{ width: "95%" }}
                      />
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium text-corporate-gray mb-4">Recent Transactions</h3>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="p-3 border rounded-md">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-corporate-gray">
                            Transaction #{Math.floor(Math.random() * 1000000)}
                          </span>
                          <Badge className="bg-corporate-green/20 text-corporate-green border-0">Success</Badge>
                        </div>
                        <div className="text-xs text-corporate-gray mt-1">
                          {new Date(Date.now() - Math.floor(Math.random() * 86400000)).toLocaleString()}
                        </div>
                        <div className="flex items-center mt-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="bg-gradient-to-r from-corporate-purple to-corporate-blue text-white text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">
                            {["Document Analysis", "Lawyer Matching", "Chat Response"][Math.floor(Math.random() * 3)]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

