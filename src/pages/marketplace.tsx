"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Filter } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

// Mock data for bounties
const mockBounties = [
  {
    id: "1",
    title: "Land Rights Case for Indigenous Community",
    description:
      "Seeking legal representation for an indigenous community facing land displacement due to corporate development.",
    fundingGoal: 15000,
    currentFunding: 8750,
    category: "Land Rights",
    location: "Brazil",
    deadline: "2023-12-15",
    ngo: "Amazon Defenders Coalition",
    status: "active",
  },
  {
    id: "2",
    title: "Domestic Violence Survivor Legal Support",
    description:
      "Legal assistance needed for survivors of domestic violence seeking restraining orders and divorce proceedings.",
    fundingGoal: 8000,
    currentFunding: 7200,
    category: "Family Law",
    location: "United States",
    deadline: "2023-11-30",
    ngo: "Safe Haven Foundation",
    status: "active",
  },
  {
    id: "3",
    title: "Environmental Pollution Class Action",
    description: "Representing a community affected by industrial pollution seeking compensation and remediation.",
    fundingGoal: 25000,
    currentFunding: 12500,
    category: "Environmental Law",
    location: "India",
    deadline: "2024-01-20",
    ngo: "Clean Earth Initiative",
    status: "active",
  },
  {
    id: "4",
    title: "Refugee Asylum Application Support",
    description: "Legal assistance for refugees seeking asylum status and work permits.",
    fundingGoal: 12000,
    currentFunding: 3600,
    category: "Immigration",
    location: "Germany",
    deadline: "2023-12-05",
    ngo: "Refugee Rights Network",
    status: "active",
  },
  {
    id: "5",
    title: "Wrongful Imprisonment Appeal",
    description: "Appeal case for an individual wrongfully imprisoned due to procedural errors and lack of evidence.",
    fundingGoal: 20000,
    currentFunding: 18000,
    category: "Criminal Law",
    location: "South Africa",
    deadline: "2023-11-15",
    ngo: "Justice Reform Initiative",
    status: "active",
  },
  {
    id: "6",
    title: "Disability Discrimination Lawsuit",
    description: "Representing individuals with disabilities facing workplace discrimination and accessibility issues.",
    fundingGoal: 10000,
    currentFunding: 2500,
    category: "Labor Law",
    location: "Canada",
    deadline: "2024-02-10",
    ngo: "Equal Access Alliance",
    status: "active",
  },
]

export function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Filter bounties based on search term and category
  const filteredBounties = mockBounties.filter((bounty) => {
    const matchesSearch =
      bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bounty.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === "all" || bounty.category === category
    return matchesSearch && matchesCategory
  })

  // Sort bounties based on selected sort option
  const sortedBounties = [...filteredBounties].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    } else if (sortBy === "funding") {
      return b.currentFunding / b.fundingGoal - a.currentFunding / a.fundingGoal
    } else if (sortBy === "goal") {
      return b.fundingGoal - a.fundingGoal
    }
    return 0
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Legal Bounties Marketplace</h1>
          <p className="text-muted-foreground">Browse and support legal cases that need funding</p>
        </div>
        <Button>Create Bounty</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Filters sidebar */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <h3 className="font-medium">Filters</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bounties..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Category</h3>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Land Rights">Land Rights</SelectItem>
                <SelectItem value="Family Law">Family Law</SelectItem>
                <SelectItem value="Environmental Law">Environmental Law</SelectItem>
                <SelectItem value="Immigration">Immigration</SelectItem>
                <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                <SelectItem value="Labor Law">Labor Law</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Sort By</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="funding">Funding Progress</SelectItem>
                <SelectItem value="goal">Funding Goal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bounties grid */}
        <div>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Bounties</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="my-contributions">My Contributions</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4">
              {sortedBounties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No bounties found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedBounties.map((bounty) => (
                    <Link to={`/bounty/${bounty.id}`} key={bounty.id}>
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge>{bounty.category}</Badge>
                            <Badge variant="outline">{bounty.location}</Badge>
                          </div>
                          <CardTitle className="text-lg mt-2">{bounty.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{bounty.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">By {bounty.ngo}</div>
                            <div className="w-full bg-secondary rounded-full h-2.5">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: `${(bounty.currentFunding / bounty.fundingGoal) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>${bounty.currentFunding.toLocaleString()}</span>
                              <span>${bounty.fundingGoal.toLocaleString()}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="w-full text-sm text-muted-foreground">
                            Deadline: {new Date(bounty.deadline).toLocaleDateString()}
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed">
              <div className="text-center py-12">
                <p className="text-muted-foreground">No completed bounties yet.</p>
              </div>
            </TabsContent>
            <TabsContent value="my-contributions">
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't contributed to any bounties yet.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

