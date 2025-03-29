"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      // In a real app, you would validate the token with your backend
      setIsAuthenticated(true)
      // Mock user data
      setUser({
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "lawyer",
      })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to your backend
      // This is just a mock implementation
      if (email && password) {
        // Mock successful login
        const mockUser = {
          id: "1",
          name: "John Doe",
          email,
          role: "lawyer",
        }

        // Store token in localStorage
        localStorage.setItem("token", "mock-jwt-token")

        setUser(mockUser)
        setIsAuthenticated(true)

        toast({
          title: "Login successful",
          description: "Welcome back to Haki Platform!",
        })
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to your backend
      // This is just a mock implementation
      if (userData.email && userData.password) {
        // Mock successful registration
        toast({
          title: "Registration successful",
          description: "Your account has been created",
        })
        return
      } else {
        throw new Error("Invalid user data")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "Could not create your account",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

