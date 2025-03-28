"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Badge,
  Avatar,
  Checkbox,
} from "@/components/ui"
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ArrowUpDown,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Star,
  StarHalf,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/utils/format-utils"

// Types
interface Bounty {
  id: string
  title: string
  description: string
  ngo: {
    id: string
    name: string
    logo: string
    verificationStatus: "verified" | "pending" | "unverified"
  }
  practiceArea: string
  location: string
  remote: boolean
  totalAmount: number
  deadline: string
  createdAt: string
  status: "open" | "in_progress" | "completed"
  milestones: number
  applicants: number
  matchScore?: number
  tags: string[]
}

interface FilterState {
  search: string
  practiceAreas: string[]
  location: string
  remote: boolean
  minFunding: number
  maxFunding: number
  matchThreshold: number
  sortBy: "match" | "newest" | "deadline" | "funding"
  sortDirection: "asc" | "desc"
}

// Practice areas
const PRACTICE_AREAS = [
  "Human Rights",
  "Immigration",
  "Refugee Law",
  "Criminal Justice",
  "Environmental Justice",
  "Indigenous Rights",
  "LGBTQ+ Rights",
  "Women's Rights",
  "Children's Rights",
  "Disability Rights",
  "Civil Liberties",
  "Constitutional Law",
  "International Law",
  "Humanitarian Law",
]

// Locations
const LOCATIONS = ["Global", "Africa", "Asia", "Europe", "North America", "South America", "Middle East", "Oceania"]

const BountyDiscovery: React.FC = () => {
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [filteredBounties, setFilteredBounties] = useState<Bounty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    practiceAreas: [],
    location: "",
    remote: false,
    minFunding: 0,
    maxFunding: 10000,
    matchThreshold: 60,
    sortBy: "match",
    sortDirection: "desc",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // In a real implementation, these would be API calls
        // const bountiesResponse = await apiService.get('/bounties/available');
        // const profileResponse = await apiService.get('/users/profile');

        // For now, using mock data
        setBounties(mockBounties)
        setUserProfile(mockUserProfile)

        // Apply initial filtering and sorting
        applyFiltersAndSort(mockBounties)
      } catch (error) {
        console.error("Error fetching bounty data:", error)
        setError("Failed to load bounties. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply filters and sorting whenever filters change
  useEffect(() => {
    applyFiltersAndSort(bounties)
  }, [filters, bounties])

  // Calculate match score for a bounty based on user profile
  const calculateMatchScore = (bounty: Bounty): number => {
    if (!userProfile) return 0

    let score = 0
    const maxScore = 100

    // Practice area match (30%)
    if (userProfile.practiceAreas.includes(bounty.practiceArea)) {
      score += 30
    }

    // Location match (20%)
    if (bounty.remote || userProfile.locations.includes(bounty.location)) {
      score += 20
    }

    // Experience level match (15%)
    const experienceMatch = userProfile.experienceYears >= 5 ? 15 : userProfile.experienceYears >= 3 ? 10 : 5
    score += experienceMatch

    // Language match (15%)
    const hasLanguageMatch = bounty.tags.some(
      (tag) => tag.startsWith("language:") && userProfile.languages.includes(tag.split(":")[1]),
    )
    if (hasLanguageMatch) {
      score += 15
    }

    // Previous NGO collaboration (10%)
    if (userProfile.previousNGOs.includes(bounty.ngo.id)) {
      score += 10
    }

    // Tags match (10%)
    const tagMatches = bounty.tags.filter((tag) => userProfile.interests.includes(tag)).length
    score += Math.min(10, tagMatches * 2)

    return Math.min(maxScore, score)
  }

  // Apply filters and sorting to bounties
  const applyFiltersAndSort = (bountyList: Bounty[]) => {
    // First, calculate match scores
    const bountiesWithScores = bountyList.map((bounty) => ({
      ...bounty,
      matchScore: calculateMatchScore(bounty),
    }))

    // Apply filters
    const result = bountiesWithScores.filter((bounty) => {
      // Search filter
      if (
        filters.search &&
        !bounty.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !bounty.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Practice area filter
      if (filters.practiceAreas.length > 0 && !filters.practiceAreas.includes(bounty.practiceArea)) {
        return false
      }

      // Location filter
      if (filters.location && bounty.location !== filters.location && !(filters.remote && bounty.remote)) {
        return false
      }

      // Funding range filter
      if (bounty.totalAmount < filters.minFunding || bounty.totalAmount > filters.maxFunding) {
        return false
      }

      // Match threshold filter
      if (bounty.matchScore! < filters.matchThreshold) {
        return false
      }

      return true
    })

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case "match":
          comparison = (b.matchScore || 0) - (a.matchScore || 0)
          break
        case "newest":
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
        case "deadline":
          comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          break
        case "funding":
          comparison = b.totalAmount - a.totalAmount
          break
      }

      return filters.sortDirection === "asc" ? -comparison : comparison
    })

    setFilteredBounties(result)
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Toggle practice area selection
  const togglePracticeArea = (area: string) => {
    setFilters((prev) => {
      const practiceAreas = prev.practiceAreas.includes(area)
        ? prev.practiceAreas.filter((a) => a !== area)
        : [...prev.practiceAreas, area]

      return {
        ...prev,
        practiceAreas,
      }
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: "",
      practiceAreas: [],
      location: "",
      remote: false,
      minFunding: 0,
      maxFunding: 10000,
      matchThreshold: 60,
      sortBy: "match",
      sortDirection: "desc",
    })
  }

  // Render match score badge
  const renderMatchBadge = (score = 0) => {
    if (score >= 80) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <Star className="h-3 w-3 mr-1" />
          {score}% Match
        </Badge>
      )
    } else if (score >= 60) {
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <StarHalf className="h-3 w-3 mr-1" />
          {score}% Match
        </Badge>
      )
    } else {
      return <Badge variant="outline">{score}% Match</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-lg font-medium text-center">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Discover Bounties</h1>
          <p className="text-muted-foreground mt-2">Find legal bounties that match your expertise and interests</p>
        </div>

        <div className="flex items-center mt-4 md:mt-0">
          <Button variant="outline" className="mr-2" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="funding">Funding</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleFilterChange("sortDirection", filters.sortDirection === "asc" ? "desc" : "asc")}
            className="ml-2"
          >
            <ArrowUpDown className={`h-4 w-4 ${filters.sortDirection === "asc" ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search bounties by title or description..."
          className="pl-10"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Filter Bounties</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Practice Areas */}
              <div>
                <h3 className="text-sm font-medium mb-3">Practice Areas</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {PRACTICE_AREAS.map((area) => (
                    <div key={area} className="flex items-center">
                      <Checkbox
                        id={`area-${area}`}
                        checked={filters.practiceAreas.includes(area)}
                        onCheckedChange={() => togglePracticeArea(area)}
                      />
                      <label htmlFor={`area-${area}`} className="ml-2 text-sm">
                        {area}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-medium mb-3">Location</h3>
                <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    {LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center mt-4">
                  <Switch
                    id="remote"
                    checked={filters.remote}
                    onCheckedChange={(checked) => handleFilterChange("remote", checked)}
                  />
                  <label htmlFor="remote" className="ml-2 text-sm">
                    Include remote opportunities
                  </label>
                </div>
              </div>

              {/* Funding Range */}
              <div>
                <h3 className="text-sm font-medium mb-3">Funding Range</h3>
                <div className="px-2">
                  <Slider
                    min={0}
                    max={10000}
                    step={500}
                    value={[filters.minFunding, filters.maxFunding]}
                    onValueChange={(value) => {
                      handleFilterChange("minFunding", value[0])
                      handleFilterChange("maxFunding", value[1])
                    }}
                    className="mb-6"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(filters.minFunding)}</span>
                  <span>{formatCurrency(filters.maxFunding)}</span>
                </div>
              </div>

              {/* Match Settings */}
              <div className="md:col-span-2 lg:col-span-3">
                <h3 className="text-sm font-medium mb-3">Match Settings</h3>
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm">Show bounties with at least {filters.matchThreshold}% match</span>
                </div>
                <div className="px-2 mt-2">
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[filters.matchThreshold]}
                    onValueChange={(value) => handleFilterChange("matchThreshold", value[0])}
                  />
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredBounties.length} of {bounties.length} bounties
        </p>
      </div>

      {/* Bounty Cards */}
      {filteredBounties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No bounties found</p>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your filters or check back later for new opportunities
            </p>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBounties.map((bounty) => (
            <Card key={bounty.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <img src={bounty.ngo.logo || "/placeholder.svg?height=40&width=40"} alt={bounty.ngo.name} />
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{bounty.title}</CardTitle>
                      <CardDescription>{bounty.ngo.name}</CardDescription>
                    </div>
                  </div>
                  {bounty.ngo.verificationStatus === "verified" && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Verified NGO
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-3 flex-grow">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bounty.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{bounty.practiceArea}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{bounty.location}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{formatCurrency(bounty.totalAmount)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{formatDate(bounty.deadline)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {bounty.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {bounty.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{bounty.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">Match:</span>
                    {renderMatchBadge(bounty.matchScore)}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">
                      {bounty.applicants} applicant{bounty.applicants !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" variant="outline">
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Mock data
const mockUserProfile = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  practiceAreas: ["Human Rights", "Immigration", "Refugee Law"],
  locations: ["North America", "Europe"],
  languages: ["English", "Spanish", "French"],
  experienceYears: 5,
  previousNGOs: ["ngo-1", "ngo-3"],
  interests: ["women's rights", "children's rights", "language:Spanish", "documentation"],
}

const mockBounties: Bounty[] = [
  {
    id: "bounty-1",
    title: "Human Rights Violation Documentation in Region X",
    description:
      "We need a lawyer to document human rights violations in Region X, interview victims, and prepare a comprehensive report for international advocacy.",
    ngo: {
      id: "ngo-1",
      name: "Global Justice Initiative",
      logo: "/placeholder.svg?height=40&width=40",
      verificationStatus: "verified",
    },
    practiceArea: "Human Rights",
    location: "Africa",
    remote: false,
    totalAmount: 5000,
    deadline: "2023-12-30",
    createdAt: "2023-10-15",
    status: "open",
    milestones: 3,
    applicants: 2,
    tags: ["documentation", "interviews", "report-writing", "language:French"],
  },
  {
    id: "bounty-2",
    title: "Asylum Seeker Legal Support Program",
    description:
      "Provide legal support to asylum seekers navigating the immigration system. Help prepare asylum applications, conduct legal research, and represent clients in hearings.",
    ngo: {
      id: "ngo-2",
      name: "Refugee Rights Alliance",
      logo: "/placeholder.svg?height=40&width=40",
      verificationStatus: "verified",
    },
    practiceArea: "Immigration",
    location: "North America",
    remote: true,
    totalAmount: 7500,
    deadline: "2024-01-15",
    createdAt: "2023-10-20",
    status: "open",
    milestones: 4,
    applicants: 5,
    tags: ["asylum", "immigration", "legal-research", "language:Spanish"],
  },
  {
    id: "bounty-3",
    title: "Environmental Damage Lawsuit Preparation",
    description:
      "Help prepare a lawsuit against corporations responsible for environmental damage affecting indigenous communities. Gather evidence, interview affected community members, and draft legal documents.",
    ngo: {
      id: "ngo-3",
      name: "EarthDefenders",
      logo: "/placeholder.svg?height=40&width=40",
      verificationStatus: "verified",
    },
    practiceArea: "Environmental Justice",
    location: "South America",
    remote: false,
    totalAmount: 8000,
    deadline: "2024-02-28",
    createdAt: "2023-11-05",
    status: "open",
    milestones: 5,
    applicants: 3,
    tags: ["environmental", "indigenous rights", "litigation", "language:Spanish", "language:Portuguese"],
  },
  {
    id: "bounty-4",
    title: "Women's Rights Legal Education Campaign",
    description:
      "Develop and deliver legal education materials for women in underserved communities. Focus on rights awareness, domestic violence prevention, and access to justice.",
    ngo: {
      id: "ngo-4",
      name: "Women's Legal Empowerment",
      logo: "/placeholder.svg?height=40&width=40",
      verificationStatus: "pending",
    },
    practiceArea: "Women's Rights",
    location: "Asia",
    remote: true,
    totalAmount: 4000,
    deadline: "2024-01-10",
    createdAt: "2023-11-10",
    status: "open",
    milestones: 3,
    applicants: 4,
    tags: ["women's rights", "legal education", "domestic violence", "language:Hindi"],
  },
  {
    id: "bounty-5",
    title: "LGBTQ+ Discrimination Case Documentation",
    description:
      "Document cases of discrimination against LGBTQ+ individuals in employment and housing. Prepare legal briefs and policy recommendations for advocacy organizations.",
    ngo: {
      id: "ngo-5",
      name: "Equality Now",
      logo: "/placeholder.svg?height=40&width=40",
      verificationStatus: "verified",
    },
    practiceArea: "LGBTQ+ Rights",
    location: "Europe",
    remote: true,
    totalAmount: 6000,
    deadline: "2024-03-15",
    createdAt: "2023-11-15",
    status: "open",
    milestones: 4,
    applicants: 2,
    tags: ["lgbtq+", "discrimination", "policy", "documentation"],
  },
  {
    id: "bounty-6",
    title: "Children's Rights in Detention Facilities",
    description:
      "Investigate conditions for children in detention facilities, document rights violations, and prepare recommendations for policy reform and potential litigation.",
    ngo: {
      id: "ngo-6",
      name: "Child Rights International",
      logo: "/placeholder.svg?height=40&width=40",
      verificationStatus: "verified",
    },
    practiceArea: "Children's Rights",
    location: "North America",
    remote: false,
    totalAmount: 7000,
    deadline: "2024-02-10",
    createdAt: "2023-11-20",
    status: "open",
    milestones: 4,
    applicants: 3,
    tags: ["children's rights", "detention", "investigation", "policy reform"],
  },
  {
    id: "bounty-7",
    title: "Disability Rights Accessibility Audit",
    description:
      "Conduct a legal audit of public facilities for compliance with disability accessibility laws. Document violations and prepare demand letters and potential litigation strategy.",
    ngo: {
      id: "ngo-7",
      name: "Disability Justice Network",
      logo: "/placeholder.svg?height=40&width=40",
      verificationStatus: "pending",
    },
    practiceArea: "Disability Rights",
    location: "Europe",
    remote: false,
    totalAmount: 5500,
    deadline: "2024-01-30",
    createdAt: "2023-11-25",
    status: "open",
    milestones: 3,
    applicants: 1,
    tags: ["disability rights", "accessibility", "audit", "compliance"],
  },
  {
    id: "bounty-8",
    title: "Indigenous Land Rights Documentation",
    description:
      "Document historical land claims of indigenous communities, research legal precedents, and prepare materials for land rights negotiations and potential litigation.",
    ngo: {
      id: "ngo-8",
      name: "Indigenous Rights Coalition",
      logo: "/placeholder.svg?height=40&width=40",
      verificationStatus: "verified",
    },
    practiceArea: "Indigenous Rights",
    location: "Oceania",
    remote: true,
    totalAmount: 9000,
    deadline: "2024-04-15",
    createdAt: "2023-12-01",
    status: "open",
    milestones: 5,
    applicants: 2,
    tags: ["indigenous rights", "land rights", "legal research", "documentation"],
  },
  {
    id: "bounty-9",
    title: "Refugee Status Determination Support",
    description:
      "Provide legal support for refugees in the status determination process. Interview clients, prepare applications, and represent them in administrative proceedings.",
    ngo: {
      id: "ngo-9",
      name: "Refugee Support Network",
      logo: "/placeholder.svg?height=40&width=40",
      verificationStatus: "verified",
    },
    practiceArea: "Refugee Law",
    location: "Middle East",
    remote: true,
    totalAmount: 6500,
    deadline: "2024-02-20",
    createdAt: "2023-12-05",
    status: "open",
    milestones: 4,
    applicants: 3,
    tags: ["refugee", "status determination", "legal representation", "language:Arabic"],
  },
  {
    id: "bounty-10",
    title: "Digital Privacy Rights Advocacy",
    description:
      "Research and document digital privacy violations, prepare legal analyses of current laws and regulations, and develop advocacy materials for policy reform.",
    ngo: {
      id: "ngo-10",
      name: "Digital Rights Watch",
      logo: "/placeholder.svg?height=40&width=40",
      verificationStatus: "pending",
    },
    practiceArea: "Civil Liberties",
    location: "Global",
    remote: true,
    totalAmount: 5000,
    deadline: "2024-03-01",
    createdAt: "2023-12-10",
    status: "open",
    milestones: 3,
    applicants: 2,
    tags: ["digital rights", "privacy", "policy", "legal research"],
  },
]

export default BountyDiscovery

