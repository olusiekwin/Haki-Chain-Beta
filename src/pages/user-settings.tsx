"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, CreditCard, Globe, Lock, Moon, Shield, Sun, Upload, User, Bell, PlusCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+254 712 345 678",
    bio: "Environmental lawyer with 8 years of experience in East Africa. Specializing in community rights and conservation law.",
    location: "Nairobi, Kenya",
    expertise: ["Environmental Law", "Human Rights", "Community Advocacy"],
    languages: ["English", "Swahili", "French"],
    profileVisibility: "public",
    notifications: {
      email: {
        newBounties: true,
        applicationUpdates: true,
        milestoneReminders: true,
        platformUpdates: false,
      },
      inApp: {
        newBounties: true,
        applicationUpdates: true,
        milestoneReminders: true,
        platformUpdates: true,
        messages: true,
      },
    },
    connectedAccounts: {
      bank: true,
      hedera: true,
      linkedin: false,
      twitter: true,
    },
    twoFactorEnabled: false,
  })

  const handleSaveProfile = () => {
    // Simulate API call
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, this would toggle a 'dark' class on the root element
    document.documentElement.classList.toggle("dark")
  }

  const updateNotificationSetting = (category, type, value) => {
    setUserData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [category]: {
          ...prev.notifications[category],
          [type]: value,
        },
      },
    }))
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Settings Saved</AlertTitle>
          <AlertDescription className="text-green-700">
            Your account settings have been updated successfully.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-1 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt={userData.name} />
                    <AvatarFallback>
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-lg font-medium text-center">{userData.name}</h3>
                <p className="text-sm text-muted-foreground text-center">Lawyer</p>
              </div>

              <nav className="space-y-1">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant={activeTab === "payment" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
                <Button
                  variant={activeTab === "security" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("security")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </Button>
                <Button
                  variant={activeTab === "appearance" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("appearance")}
                >
                  {isDarkMode ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                  Appearance
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and how it's displayed to others on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt={userData.name} />
                      <AvatarFallback>
                        {userData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={userData.location}
                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={userData.bio}
                      onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise">Areas of Expertise</Label>
                    <Textarea
                      id="expertise"
                      value={userData.expertise.join(", ")}
                      onChange={(e) => setUserData({ ...userData, expertise: e.target.value.split(", ") })}
                      placeholder="Enter areas separated by commas"
                    />
                    <p className="text-sm text-muted-foreground">Separate each area of expertise with a comma</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages</Label>
                    <Textarea
                      id="languages"
                      value={userData.languages.join(", ")}
                      onChange={(e) => setUserData({ ...userData, languages: e.target.value.split(", ") })}
                      placeholder="Enter languages separated by commas"
                    />
                    <p className="text-sm text-muted-foreground">Separate each language with a comma</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visibility">Profile Visibility</Label>
                    <Select
                      value={userData.profileVisibility}
                      onValueChange={(value) => setUserData({ ...userData, profileVisibility: value })}
                    >
                      <SelectTrigger id="visibility">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Visible to everyone</SelectItem>
                        <SelectItem value="platform">Platform - Only visible to platform users</SelectItem>
                        <SelectItem value="private">Private - Only visible to NGOs you work with</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how and when you receive notifications from the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-new-bounties">New Bounties</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails when new bounties matching your expertise are posted
                        </p>
                      </div>
                      <Switch
                        id="email-new-bounties"
                        checked={userData.notifications.email.newBounties}
                        onCheckedChange={(checked) => updateNotificationSetting("email", "newBounties", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-application-updates">Application Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails when there are updates to your bounty applications
                        </p>
                      </div>
                      <Switch
                        id="email-application-updates"
                        checked={userData.notifications.email.applicationUpdates}
                        onCheckedChange={(checked) => updateNotificationSetting("email", "applicationUpdates", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-milestone-reminders">Milestone Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails reminding you of upcoming milestone deadlines
                        </p>
                      </div>
                      <Switch
                        id="email-milestone-reminders"
                        checked={userData.notifications.email.milestoneReminders}
                        onCheckedChange={(checked) => updateNotificationSetting("email", "milestoneReminders", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-platform-updates">Platform Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about platform updates and new features
                        </p>
                      </div>
                      <Switch
                        id="email-platform-updates"
                        checked={userData.notifications.email.platformUpdates}
                        onCheckedChange={(checked) => updateNotificationSetting("email", "platformUpdates", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="inapp-new-bounties">New Bounties</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive in-app notifications for new bounties matching your expertise
                        </p>
                      </div>
                      <Switch
                        id="inapp-new-bounties"
                        checked={userData.notifications.inApp.newBounties}
                        onCheckedChange={(checked) => updateNotificationSetting("inApp", "newBounties", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="inapp-application-updates">Application Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive in-app notifications for updates to your bounty applications
                        </p>
                      </div>
                      <Switch
                        id="inapp-application-updates"
                        checked={userData.notifications.inApp.applicationUpdates}
                        onCheckedChange={(checked) => updateNotificationSetting("inApp", "applicationUpdates", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="inapp-milestone-reminders">Milestone Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive in-app notifications for upcoming milestone deadlines
                        </p>
                      </div>
                      <Switch
                        id="inapp-milestone-reminders"
                        checked={userData.notifications.inApp.milestoneReminders}
                        onCheckedChange={(checked) => updateNotificationSetting("inApp", "milestoneReminders", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="inapp-messages">Messages</Label>
                        <p className="text-sm text-muted-foreground">Receive in-app notifications for new messages</p>
                      </div>
                      <Switch
                        id="inapp-messages"
                        checked={userData.notifications.inApp.messages}
                        onCheckedChange={(checked) => updateNotificationSetting("inApp", "messages", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {/* Payment Methods */}
          {activeTab === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your bank accounts and payment methods for withdrawals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Connected Bank Accounts</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Kenya Commercial Bank</p>
                          <p className="text-sm text-muted-foreground">Account ending in 4589</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Equity Bank</p>
                          <p className="text-sm text-muted-foreground">Account ending in 7823</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add New Bank Account
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Connected Blockchain Wallets</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                          <Globe className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Hedera Wallet</p>
                          <p className="text-sm text-muted-foreground">0x71C...F3E2</p>
                        </div>
                      </div>
                      <Badge>Primary</Badge>
                    </div>

                    <Button variant="outline" className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Connect Another Wallet
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Password</h3>
                  <div className="space-y-4">
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
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account by requiring a verification code
                        </p>
                      </div>
                      <Switch
                        id="two-factor"
                        checked={userData.twoFactorEnabled}
                        onCheckedChange={(checked) => setUserData({ ...userData, twoFactorEnabled: checked })}
                      />
                    </div>

                    {userData.twoFactorEnabled && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Two-Factor Authentication is Enabled</h4>
                        <p className="text-sm mb-4">
                          You will be required to enter a verification code sent to your phone when signing in from a
                          new device.
                        </p>
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4 mr-2" />
                          Manage 2FA Settings
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Session Management</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">Current Session</h4>
                          <p className="text-sm text-muted-foreground">Chrome on macOS • Nairobi, Kenya</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Started: Today at 10:24 AM</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">Mobile App</h4>
                          <p className="text-sm text-muted-foreground">iPhone 13 • Nairobi, Kenya</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Last active: Yesterday at 6:42 PM</p>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      Sign Out of All Other Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the platform looks and feels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Theme</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                      </div>
                      <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Language</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Interface Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="sw">Swahili</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserSettings

