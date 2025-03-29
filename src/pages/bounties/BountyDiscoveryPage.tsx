"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useApp } from "../../context/AppContext"
import { useHybrid } from "../../hooks/useHybrid"
import apiService from "../../services/api/apiService"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs"
import { Badge } from "../../components/ui/Badge"
import { Briefcase, Search, Plus, Filter } from "lucide-react"

// Define types
interface Bounty {
  id: number
  title: string
  description: string
  reward: string
  status: string
  creator: {
    id: number
    username: string
  }
  worker?: {
    id: number
    username: string
  }
  created_at: string
  updated_at: string
  blockchain_id?: string
}

const BountyDiscoveryPage: React.FC = () => {
  const { isAuthenticated, user } = useApp()
  const { isBlockchainEnabled } = useHybrid()

  const [bounties, setBounties] = useState<Bounty[]>([])
  const [filteredBounties, setFilteredBounties] = useState<Bounty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [activeTab, setActiveTab] = useState("all")

  // Fetch bounties on component mount
  useEffect(() => {
    const fetchBounties = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiService.getBounties("mock-token") // In a real app, use the actual token

        if (response.success && response.data) {
          setBounties(response.data)
          setFilteredBounties(response.data)
        } else {
          setError(response.error || "Failed to fetch bounties")
        }
      } catch (error: any) {
        setError(error.message || "An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBounties()
  }, [])

  // Apply filters when filter states change
  useEffect(() => {
    let result = [...bounties]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (bounty) =>
          bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bounty.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((bounty) => bounty.status === statusFilter)
    }

    // Apply tab filter
    if (activeTab === "created" && user) {
      result = result.filter((bounty) => bounty.creator.id === user.id)
    } else if (activeTab === "working" && user) {
      result = result.filter((bounty) => bounty.worker && bounty.worker.id === user.id)
    }

    // Apply sorting
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    } else if (sortBy === "highest-reward") {
      result.sort((a, b) => Number.parseFloat(b.reward) - Number.parseFloat(a.reward))
    } else if (sortBy === "lowest-reward") {
      result.sort((a, b) => Number.parseFloat(a.reward) - Number.parseFloat(b.reward))
    }

    setFilteredBounties(result)
  }, [bounties, searchQuery, statusFilter, sortBy, activeTab, user])

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Bounties</h1>

        <Link to="/bounties/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Bounty
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search bounties..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest-reward">Highest Reward</SelectItem>
                    <SelectItem value="lowest-reward">Lowest Reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Bounties</TabsTrigger>
            <TabsTrigger value="created">Created by Me</TabsTrigger>
            <TabsTrigger value="working">Working On</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading bounties...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredBounties.length === 0 ? (
              <div className="text-center py-8">
                <p>No bounties found. Try adjusting your filters or create a new bounty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBounties.map((bounty) => (
                  <Card key={bounty.id} className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{bounty.title}</CardTitle>
                        <Badge className={getStatusBadgeColor(bounty.status)}>{bounty.status}</Badge>
                      </div>
                      <CardDescription>
                        Posted by {bounty.creator.username} on {new Date(bounty.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{bounty.description}</p>

                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Reward:</span>
                          <span className="font-bold">{bounty.reward} HAKI</span>
                        </div>

                        {bounty.blockchain_id && isBlockchainEnabled() && (
                          <div className="mt-2 text-xs text-gray-500">
                            On-chain ID: {bounty.blockchain_id.substring(0, 10)}...
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Link to={`/bounties/${bounty.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="created" className="mt-0">
            {/* Same content structure as "all" tab but filtered for created bounties */}
            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading bounties...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredBounties.length === 0 ? (
              <div className="text-center py-8">
                <p>You haven't created any bounties yet.</p>
                <Link to="/bounties/create" className="mt-4 inline-block">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Bounty
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Same card structure as in "all" tab */}
                {filteredBounties.map((bounty) => (
                  <Card key={bounty.id} className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{bounty.title}</CardTitle>
                        <Badge className={getStatusBadgeColor(bounty.status)}>{bounty.status}</Badge>
                      </div>
                      <CardDescription>Posted on {new Date(bounty.created_at).toLocaleDateString()}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{bounty.description}</p>

                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Reward:</span>
                          <span className="font-bold">{bounty.reward} HAKI</span>
                        </div>

                        {bounty.blockchain_id && isBlockchainEnabled() && (
                          <div className="mt-2 text-xs text-gray-500">
                            On-chain ID: {bounty.blockchain_id.substring(0, 10)}...
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Link to={`/bounties/${bounty.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="working" className="mt-0">
            {/* Same content structure as other tabs but filtered for bounties the user is working on */}
            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading bounties...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredBounties.length === 0 ? (
              <div className="text-center py-8">
                <p>You're not working on any bounties yet.</p>
                <Link to="/bounties" className="mt-4 inline-block">
                  <Button>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Bounties
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Same card structure as in other tabs */}
                {filteredBounties.map((bounty) => (
                  <Card key={bounty.id} className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{bounty.title}</CardTitle>
                        <Badge className={getStatusBadgeColor(bounty.status)}>{bounty.status}</Badge>
                      </div>
                      <CardDescription>
                        Posted by {bounty.creator.username} on {new Date(bounty.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{bounty.description}</p>

                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Reward:</span>
                          <span className="font-bold">{bounty.reward} HAKI</span>
                        </div>

                        {bounty.blockchain_id && isBlockchainEnabled() && (
                          <div className="mt-2 text-xs text-gray-500">
                            On-chain ID: {bounty.blockchain_id.substring(0, 10)}...
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Link to={`/bounties/${bounty.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default BountyDiscoveryPage

