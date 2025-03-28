import type React from "react"
import { Outlet, Navigate } from "react-router-dom"
import { useApp } from "../../context/app-context"
import LoadingSpinner from "../common/loading-spinner"

const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useApp()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout

