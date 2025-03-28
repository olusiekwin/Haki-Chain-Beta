"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
} from "@/components/ui"
import { Mail, Lock, AlertCircle, User, Building, Briefcase } from "lucide-react"

const LoginPage: React.FC = () => {
  // Login states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState("")

  // Registration states
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [userType, setUserType] = useState("lawyer")
  const [organizationName, setOrganizationName] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [regError, setRegError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setLoginError("Please enter both email and password")
      return
    }

    setIsLoggingIn(true)
    setLoginError("")

    try {
      // In a real implementation, this would be an API call
      // const response = await apiService.post('/auth/login', {
      //   email,
      //   password
      // });

      // For demo purposes, simulate a successful login
      setTimeout(() => {
        // Redirect to dashboard based on user type
        // In a real app, this would be determined by the user's role
        if (email.includes("lawyer")) {
          window.location.href = "/lawyer-dashboard"
        } else if (email.includes("ngo")) {
          window.location.href = "/ngo-dashboard"
        } else if (email.includes("donor")) {
          window.location.href = "/donor-dashboard"
        } else if (email.includes("admin")) {
          window.location.href = "/admin-dashboard"
        } else {
          window.location.href = "/bounty-discovery"
        }
      }, 1000)
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("Invalid email or password")
      setIsLoggingIn(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!regEmail || !regPassword || !regConfirmPassword || !fullName) {
      setRegError("Please fill in all required fields")
      return
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match")
      return
    }

    if (userType === "ngo" && !organizationName) {
      setRegError("Organization name is required for NGO accounts")
      return
    }

    setIsRegistering(true)
    setRegError("")

    try {
      // In a real implementation, this would be an API call
      // const response = await apiService.post('/auth/register', {
      //   email: regEmail,
      //   password: regPassword,
      //   fullName,
      //   userType,
      //   organizationName: userType === 'ngo' ? organizationName : undefined
      // });

      // For demo purposes, simulate a successful registration
      setTimeout(() => {
        // Redirect to dashboard based on user type
        if (userType === "lawyer") {
          window.location.href = "/lawyer-dashboard"
        } else if (userType === "ngo") {
          window.location.href = "/ngo-dashboard"
        } else if (userType === "donor") {
          window.location.href = "/donor-dashboard"
        } else {
          window.location.href = "/bounty-discovery"
        }
      }, 1000)
    } catch (error) {
      console.error("Registration error:", error)
      setRegError("Registration failed. Please try again.")
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">HAKI Platform</h1>
          <p className="text-muted-foreground mt-2">Connecting lawyers with human rights cases</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Login to your account to continue</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Password</label>
                      <a href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Join the HAKI platform to make a difference</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  {regError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{regError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="John Doe"
                        className="pl-10"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Account Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={userType === "lawyer" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-20"
                        onClick={() => setUserType("lawyer")}
                      >
                        <Briefcase className="h-6 w-6 mb-1" />
                        <span>Lawyer</span>
                      </Button>
                      <Button
                        type="button"
                        variant={userType === "ngo" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-20"
                        onClick={() => setUserType("ngo")}
                      >
                        <Building className="h-6 w-6 mb-1" />
                        <span>NGO</span>
                      </Button>
                      <Button
                        type="button"
                        variant={userType === "donor" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-20"
                        onClick={() => setUserType("donor")}
                      >
                        <User className="h-6 w-6 mb-1" />
                        <span>Donor</span>
                      </Button>
                    </div>
                  </div>

                  {userType === "ngo" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Organization Name</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Organization Name"
                          className="pl-10"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isRegistering}>
                    {isRegistering ? "Creating account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default LoginPage

