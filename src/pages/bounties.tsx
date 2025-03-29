import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

// Mock data for bounties
const bounties = [
  {
    id: 1,
    title: "Legal Aid for Refugee Families",
    description: "Provide legal assistance to refugee families seeking asylum status in the United States.",
    amount: 5000,
    token: "HAKI",
    status: "Open",
    deadline: "2023-12-31",
    tags: ["Immigration", "Asylum", "Human Rights"],
    applicants: 3,
  },
  {
    id: 2,
    title: "Environmental Justice for Indigenous Communities",
    description: "Legal support for indigenous communities fighting against environmental degradation of their lands.",
    amount: 7500,
    token: "HAKI",
    status: "Open",
    deadline: "2023-11-15",
    tags: ["Environmental", "Indigenous Rights", "Land Rights"],
    applicants: 5,
  },
  {
    id: 3,
    title: "Domestic Violence Survivor Advocacy",
    description:
      "Legal representation for survivors of domestic violence seeking restraining orders and divorce proceedings.",
    amount: 4000,
    token: "HAKI",
    status: "Open",
    deadline: "2023-10-30",
    tags: ["Domestic Violence", "Family Law", "Protection Orders"],
    applicants: 2,
  },
  {
    id: 4,
    title: "Housing Rights for Low-Income Tenants",
    description: "Legal assistance for tenants facing eviction or living in substandard housing conditions.",
    amount: 3500,
    token: "HAKI",
    status: "Open",
    deadline: "2023-11-20",
    tags: ["Housing", "Tenant Rights", "Eviction Defense"],
    applicants: 4,
  },
]

export default function BountyDiscoveryPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Legal Bounties</h1>
        <Button asChild>
          <Link to="/create-bounty">Create Bounty</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bounties.map((bounty) => (
          <Card key={bounty.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{bounty.title}</CardTitle>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  {bounty.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{bounty.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reward</span>
                  <span className="font-medium">
                    {bounty.amount} {bounty.token}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Deadline</span>
                  <span className="font-medium">{new Date(bounty.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Applicants</span>
                  <span className="font-medium">{bounty.applicants}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {bounty.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/bounties/${bounty.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

