"use client"

import type React from "react"
import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // If the user is already authenticated, redirect to the dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center">
      <div className="absolute top-4 left-4">
        <a href="/" className="text-2xl font-bold text-primary">
          HakiChain
        </a>
      </div>

      <Outlet />
    </div>
  )
}

export default AuthLayout

