"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, CheckCircle2, ExternalLink, Globe, Heart, Mail, MapPin, Phone, Share2 } from "lucide-react"

// Mock data for NGO profile
const ngoData = {
  id: "ngo123",
  name: "EcoJustice NGO",
  logo: "/placeholder.svg?height=100&width=100",
  coverImage: "/placeholder.svg?height=300&width=1200",
  tagline: "Protecting Environmental Rights Across East Africa",
  description:
    "EcoJustice is a non-profit organization dedicated to protecting environmental rights and promoting sustainable development across East Africa. We work with local communities, governments, and international partners to address environmental challenges and advocate for policy changes.",
  founded: "2012",
  location: "Nairobi, Kenya",
  website: "https://ecojustice.org",
  email: "contact@ecojustice.org",
  phone: "+254 123 456 789",
  socialMedia: {
    twitter: "https://twitter.com/ecojustice",
    facebook: "https://facebook.com/ecojustice",
    linkedin: "https://linkedin.com/company/ecojustice",
  },
  impact: {
    communitiesServed: 120,
    casesWon: 45,
    peopleImpacted: "250,000+",
    successRate: 85,
  },
  team: [
    {
      name: "Dr. Sarah Kimani",
      role: "Executive Director",
      image: "/placeholder.svg?height=100&width=100",
      bio: "Environmental lawyer with 15+ years of experience in environmental advocacy and policy development.",
    },
    {
      name: "John Omondi",
      role: "Legal Director",
      image: "/placeholder.svg?height=100&width=100",
      bio: "Human rights lawyer specializing in environmental justice and community rights.",
    },
    {
      name: "Amina Hassan",
      role: "Community Outreach Manager",
      image: "/placeholder.svg?height=100&width=100",
      bio: "Experienced community organizer with a background in sustainable development.",
    },
  ],
  activeBounties: [
    {
      id: "b123",
      title: "Legal Research on Environmental Protection Laws",
      compensation: "2,500 HAKI",
      deadline: "June 15, 2025",
      status: "Open",
      applicants: 8,
    },
    {
      id: "b124",
      title: "Draft Policy Brief on Water Rights",
      compensation: "1,800 HAKI",
      deadline: "May 30, 2025",
      status: "Open",
      applicants: 5,
    },
  ],
  completedBounties: [
    {
      id: "b120",
      title: "Community Legal Education Materials",
      compensation: "2,000 HAKI",
      completedDate: "March 10, 2025",
      lawyer: "James Mwangi",
    },
    {
      id: "b119",
      title: "Analysis of Recent Environmental Court Decisions",
      compensation: "3,200 HAKI",
      completedDate: "February 22, 2025",
      lawyer: "Elizabeth Njeri",
    },
    {
      id: "b118",
      title: "Legal Framework for Community Conservation Areas",
      compensation: "2,800 HAKI",
      completedDate: "January 15, 2025",
      lawyer: "Robert Ochieng",
    },
  ],
  successStories: [
    {
      title: "Lake Victoria Fishing Rights",
      description:
        "Successfully advocated for the rights of local fishing communities against industrial pollution, resulting in new regulations and compensation for affected families.",
      image: "/placeholder.svg?height=200&width=300",
      year: "2024",
    },
    {
      title: "Nairobi River Cleanup Initiative",
      description:
        "Led a legal campaign that resulted in government commitment to clean up the Nairobi River and implement stricter pollution controls on industrial discharge.",
      image: "/placeholder.svg?height=200&width=300",
      year: "2023",
    },
  ],
}

const NGOProfile = () => {
  const [isFollowing, setIsFollowing] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")

  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Cover Image and Profile Header */}
      <div className="relative mb-8">
        <div className="h-64 w-full rounded-lg overflow-hidden">
          <Image
            src={ngoData.coverImage || "/placeholder.svg"}
            alt={`${ngoData.name} cover image`}
            className="object-cover"
            width={1200}
            height={300}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20 px-4 md:px-6">
          <div className="bg-white rounded-lg p-2 shadow-md mb-4 md:mb-0">
            <Image
              src={ngoData.logo || "/placeholder.svg"}
              alt={ngoData.name}
              width={100}
              height={100}
              className="rounded-lg"
            />
          </div>

          <div className="md:ml-6 flex-1">
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{ngoData.name}</h1>
                  <p className="text-lg text-muted-foreground mt-1">{ngoData.tagline}</p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {ngoData.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Founded {ngoData.founded}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                  <Button variant="outline" size="sm" onClick={toggleFollow}>
                    {isFollowing ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Donate HAKI</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Donate to {ngoData.name}</DialogTitle>
                        <DialogDescription>
                          Your donation helps support environmental justice initiatives across East Africa.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (HAKI)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                          />
                        </div>

                        <div className="flex justify-between gap-2">
                          {[100, 250, 500, 1000].map((amount) => (
                            <Button
                              key={amount}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => setDonationAmount(amount.toString())}
                            >
                              {amount}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="submit" disabled={!donationAmount || Number.parseInt(donationAmount) <= 0}>
                          Complete Donation
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{ngoData.description}</p>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                  <a
                    href={ngoData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline flex items-center"
                  >
                    {ngoData.website.replace("https://", "")}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>

                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                  <a href={`mailto:${ngoData.email}`} className="text-sm hover:underline">
                    {ngoData.email}
                  </a>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">{ngoData.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{ngoData.impact.communitiesServed}</p>
                  <p className="text-sm text-muted-foreground">Communities Served</p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{ngoData.impact.casesWon}</p>
                  <p className="text-sm text-muted-foreground">Cases Won</p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{ngoData.impact.peopleImpacted}</p>
                  <p className="text-sm text-muted-foreground">People Impacted</p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{ngoData.impact.successRate}%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ngoData.team.map((member, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-sm mt-1">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="bounties" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bounties">Bounties</TabsTrigger>
              <TabsTrigger value="success-stories">Success Stories</TabsTrigger>
              <TabsTrigger value="impact">Impact Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="bounties" className="space-y-6 mt-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Active Bounties</h3>
                <div className="space-y-4">
                  {ngoData.activeBounties.map((bounty) => (
                    <Card key={bounty.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{bounty.title}</CardTitle>
                          <Badge>{bounty.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm">
                          <div>
                            <span className="text-muted-foreground">Compensation:</span> {bounty.compensation}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deadline:</span> {bounty.deadline}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Applicants:</span> {bounty.applicants}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Completed Bounties</h3>
                <div className="space-y-4">
                  {ngoData.completedBounties.map((bounty) => (
                    <Card key={bounty.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{bounty.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm">
                          <div>
                            <span className="text-muted-foreground">Compensation:</span> {bounty.compensation}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Completed:</span> {bounty.completedDate}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Lawyer:</span> {bounty.lawyer}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          View Results
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="success-stories" className="space-y-6 mt-6">
              {ngoData.successStories.map((story, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <Image
                        src={story.image || "/placeholder.svg"}
                        alt={story.title}
                        width={300}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{story.year}</p>
                      <p>{story.description}</p>
                      <Button variant="link" className="mt-2 p-0">
                        Read full story
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="impact" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Annual Impact Report 2024</CardTitle>
                  <CardDescription>Published April 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Our 2024 Impact Report details the outcomes of our legal advocacy work across East Africa,
                    highlighting key victories in environmental protection and community rights.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Key Achievements</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Successfully advocated for 3 new environmental protection laws</li>
                        <li>Provided legal support to 28 communities facing environmental threats</li>
                        <li>Trained 150+ community paralegals in environmental rights</li>
                        <li>Secured compensation for 5 communities affected by industrial pollution</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Resource Allocation</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Legal Advocacy</span>
                            <span>45%</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Community Support</span>
                            <span>30%</span>
                          </div>
                          <Progress value={30} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Research & Policy</span>
                            <span>15%</span>
                          </div>
                          <Progress value={15} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Administration</span>
                            <span>10%</span>
                          </div>
                          <Progress value={10} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Download Full Report</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Previous Impact Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[2023, 2022, 2021].map((year) => (
                      <div key={year} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Annual Impact Report {year}</h4>
                          <p className="text-sm text-muted-foreground">Published April {year}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default NGOProfile

