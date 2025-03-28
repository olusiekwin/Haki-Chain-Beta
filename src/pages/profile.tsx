"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { useAuth } from "../contexts/auth-context"
import { ProfileImageUpload } from "../components/profile-image-upload"
import {
  Wallet,
  Shield,
  Award,
  Bell,
  Settings,
  User,
  Users,
  DollarSign,
  Briefcase,
  MapPin,
  Building,
  FileCheck,
} from "lucide-react"

export function Profile() {
  const { user, connectWallet, updateProfile, verifyLawyer } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    organization: user?.organization || "",
    location: user?.location || "",
  })
  const [pendingVerifications, setPendingVerifications] = useState([
    { id: "3", name: "Jane Lawyer", email: "lawyer@example.com", dateApplied: "Sep 15, 2023" },
    { id: "5", name: "Mark Lawyer", email: "mark@example.com", dateApplied: "Sep 18, 2023" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateProfile(formData)
      // Show success message or notification here
    } catch (error) {
      // Handle error
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyLawyer = async (id: string, status: string) => {
    await verifyLawyer(id, status)
    // Optimistically update the UI
    setPendingVerifications((prev) => prev.filter((lawyer) => lawyer.id !== id))
  }

  // Render different profile information based on user role
  const renderRoleSpecificInfo = () => {
    if (!user) return null

    switch (user.role) {
      case "lawyer":
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">Lawyer</span>
              {user.verificationStatus && (
                <Badge
                  variant={
                    user.verificationStatus === "verified"
                      ? "default"
                      : user.verificationStatus === "pending"
                        ? "outline"
                        : "destructive"
                  }
                  className="ml-2"
                >
                  {user.verificationStatus === "verified"
                    ? "Verified"
                    : user.verificationStatus === "pending"
                      ? "Pending Verification"
                      : "Verification Rejected"}
                </Badge>
              )}
            </div>
            {user.organization && (
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{user.organization}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{user.casesCompleted || 0} Cases Completed</span>
            </div>
            {user.rating && (
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                <span>{user.rating} Rating</span>
              </div>
            )}
            {user.verificationStatus === "pending" && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Your account is pending verification by an admin. You'll be able to claim bounties once verified.
                </p>
              </div>
            )}
          </div>
        )

      case "ngo":
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">NGO</span>
              {user.isVerified && <Badge className="ml-2">Verified</Badge>}
            </div>
            {user.organization && (
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{user.organization}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{user.casesCompleted || 0} Bounties Created</span>
            </div>
            {user.rating && (
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                <span>{user.rating} Rating</span>
              </div>
            )}
          </div>
        )

      case "donor":
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">Donor</span>
            </div>
            {user.location && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{user.location}</span>
              </div>
            )}
          </div>
        )

      case "admin":
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">Administrator</span>
              <Badge className="ml-2">System Admin</Badge>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <ProfileImageUpload />
                <h2 className="text-xl font-bold mt-4">{user?.name || "User"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-2">
                  <Badge variant="outline" className="capitalize">
                    {user?.role || "Guest"}
                  </Badge>
                </div>
              </div>

              {renderRoleSpecificInfo()}

              <Separator className="my-4" />

              <nav className="space-y-1">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "wallet" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("wallet")}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet
                </Button>
                <Button
                  variant={activeTab === "reputation" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("reputation")}
                >
                  <Award className="mr-2 h-4 w-4" />
                  Reputation
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                {user?.role === "admin" && (
                  <Button
                    variant={activeTab === "admin" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("admin")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                )}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={user?.email} disabled />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      value={formData.bio}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      name="organization"
                      placeholder="Your organization or company"
                      value={formData.organization}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "wallet" && (
            <Card>
              <CardHeader>
                <CardTitle>Wallet</CardTitle>
                <CardDescription>Manage your blockchain wallet and tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user?.walletAddress ? (
                  <>
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Connected Wallet</p>
                          <p className="font-mono text-sm">{user.walletAddress}</p>
                        </div>
                        <Shield className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-muted-foreground">HAKI Balance</p>
                              <p className="text-2xl font-bold">250 HAKI</p>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Award className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-muted-foreground">Escrow Balance</p>
                              <p className="text-2xl font-bold">$1,200</p>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Wallet className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Transaction History</h3>
                      <div className="rounded-md border">
                        <div className="p-4 border-b">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Bounty Contribution</p>
                              <p className="text-sm text-muted-foreground">Land Rights Case</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">-$500</p>
                              <p className="text-sm text-muted-foreground">Sep 18, 2023</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-b">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Milestone Payment</p>
                              <p className="text-sm text-muted-foreground">Initial Consultation</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">+$3,000</p>
                              <p className="text-sm text-muted-foreground">Sep 15, 2023</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">HAKI Token Reward</p>
                              <p className="text-sm text-muted-foreground">Case Completion Bonus</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">+50 HAKI</p>
                              <p className="text-sm text-muted-foreground">Sep 10, 2023</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Wallet Connected</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect your wallet to receive HAKI tokens and manage your funds.
                    </p>
                    <Button onClick={connectWallet}>Connect Wallet</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "reputation" && (
            <Card>
              <CardHeader>
                <CardTitle>Reputation</CardTitle>
                <CardDescription>Your reputation and ratings on the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{user?.rating || 0}</span>
                      </div>
                      <svg className="h-32 w-32" viewBox="0 0 100 100">
                        <circle
                          className="text-secondary"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-primary"
                          strokeWidth="8"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 * (1 - (user?.rating || 0) / 5)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Based on {user?.casesCompleted || 0} reviews</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Recent Reviews</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">Jane Doe</span>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Award
                              key={star}
                              className={`h-4 w-4 ${star <= 5 ? "text-yellow-400" : "text-gray-300"}`}
                              fill={star <= 5 ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">
                        "Excellent work on our land rights case. Very professional and thorough in their approach."
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">September 15, 2023</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>MS</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">Maria Silva</span>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Award
                              key={star}
                              className={`h-4 w-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                              fill={star <= 4 ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">
                        "Great communication throughout the process. Would definitely work with them again."
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">August 28, 2023</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Achievements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-md text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">Trusted Partner</p>
                    </div>
                    <div className="p-4 border rounded-md text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">Top Contributor</p>
                    </div>
                    <div className="p-4 border rounded-md text-center opacity-50">
                      <Users className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Community Leader</p>
                    </div>
                    <div className="p-4 border rounded-md text-center opacity-50">
                      <Wallet className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Power Donor</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "admin" && user?.role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Manage platform users and verify lawyers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pending Lawyer Verifications</h3>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 p-4 font-medium border-b">
                      <div>Name</div>
                      <div>Email</div>
                      <div>Date Applied</div>
                      <div className="text-right">Actions</div>
                    </div>
                    {pendingVerifications.map((lawyer) => (
                      <div className="p-4 border-b" key={lawyer.id}>
                        <div className="grid grid-cols-4 items-center">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{lawyer.name}</span>
                          </div>
                          <div>{lawyer.email}</div>
                          <div>{lawyer.dateApplied}</div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleVerifyLawyer(lawyer.id, "verified")}
                            >
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleVerifyLawyer(lawyer.id, "rejected")}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Platform Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Users</p>
                            <p className="text-2xl font-bold">1,245</p>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Active Bounties</p>
                            <p className="text-2xl font-bold">78</p>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-full">
                            <FileCheck className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Funds</p>
                            <p className="text-2xl font-bold">$1.2M</p>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-full">
                            <DollarSign className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recent Notifications</h3>
                  <div className="space-y-2">
                    <div className="p-4 border rounded-md">
                      <div className="flex">
                        <div className="mr-4 mt-0.5">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Bell className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Milestone Completed</p>
                          <p className="text-sm text-muted-foreground">
                            The "Initial consultation" milestone for "Land Rights Case" has been marked as completed.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="flex">
                        <div className="mr-4 mt-0.5">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <DollarSign className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Donation Received</p>
                          <p className="text-sm text-muted-foreground">
                            Your bounty "Environmental Pollution Class Action" received a $1,000 donation.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <div className="flex">
                        <div className="mr-4 mt-0.5">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">New Review</p>
                          <p className="text-sm text-muted-foreground">
                            You received a 5-star review from Jane Doe for "Land Rights Case".
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Button variant="outline">Enabled</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Button variant="outline">Disabled</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Milestone Updates</p>
                        <p className="text-sm text-muted-foreground">Get notified about milestone changes</p>
                      </div>
                      <Button variant="outline">Enabled</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Donation Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified about new donations</p>
                      </div>
                      <Button variant="outline">Enabled</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

