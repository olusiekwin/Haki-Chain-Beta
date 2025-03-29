"use client"

import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"

// Layouts
import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"
import LoadingSpinner from "./components/ui/LoadingSpinner"

// Pages
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import WalletPage from "./pages/wallet/WalletPage"
import BountyDiscoveryPage from "./pages/bounties/BountyDiscoveryPage"
import BountyDetailPage from "./pages/bounties/BountyDetailPage"
import CreateBountyPage from "./pages/bounties/CreateBountyPage"
import TokenMarketplacePage from "./pages/marketplace/TokenMarketplacePage"
import ProfilePage from "./pages/profile/ProfilePage"
import SettingsPage from "./pages/settings/SettingsPage"
import NotFoundPage from "./pages/NotFoundPage"

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bounties"
            element={
              <ProtectedRoute>
                <BountyDiscoveryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bounties/:id"
            element={
              <ProtectedRoute>
                <BountyDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bounties/create"
            element={
              <ProtectedRoute>
                <CreateBountyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <TokenMarketplacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </React.Suspense>
  )
}

export default App

