"use client"

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react"
import { apiService } from "../services/core/api-service"
import { useRouter } from "next/router"

// User type definition
export interface User {
  id: string
  name: string
  email: string
  role: string
  profilePicture?: string
  [key: string]: any // Additional role-specific fields
}

// Auth context type
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  updateProfile: (profileData: any) => Promise<boolean>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check for token
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setUser(null)
        return
      }

      // Get user profile
      const userData = await apiService.getUserProfile()
      setUser(userData)
    } catch (err) {
      console.error("Auth check failed:", err)
      // Clear invalid token
      localStorage.removeItem("auth_token")
      setUser(null)
      setError(err instanceof Error ? err : new Error("Authentication check failed"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiService.login({ email, password })

      // Save token
      localStorage.setItem("auth_token", response.token)

      // Get user profile
      const userData = await apiService.getUserProfile()
      setUser(userData)

      return true
    } catch (err) {
      console.error("Login failed:", err)
      setError(err instanceof Error ? err : new Error("Login failed"))
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Register function
  const register = useCallback(async (userData: any) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiService.register(userData)

      // Save token if registration also logs in
      if (response.token) {
        localStorage.setItem("auth_token", response.token)

        // Get user profile
        const userProfile = await apiService.getUserProfile()
        setUser(userProfile)
      }

      return true
    } catch (err) {
      console.error("Registration failed:", err)
      setError(err instanceof Error ? err : new Error("Registration failed"))
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/login")
  }, [router])

  // Update profile function
  const updateProfile = useCallback(async (profileData: any) => {
    try {
      setIsLoading(true)
      setError(null)

      const updatedProfile = await apiService.updateUserProfile(profileData)
      setUser((prev) => (prev ? { ...prev, ...updatedProfile } : null))

      return true
    } catch (err) {
      console.error("Profile update failed:", err)
      setError(err instanceof Error ? err : new Error("Profile update failed"))
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

