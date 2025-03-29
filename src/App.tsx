"use client"

import React, { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { useApp } from "./context/app-context"
import config from "./config"

// Import your page components
// These are placeholders - replace with your actual components
const LoginPage = React.lazy(() => import("./pages/auth/login"))
const RegisterPage = React.lazy(() => import("./pages/auth/register"))
const DashboardPage = React.lazy(() => import("./pages/dashboard"))
const WalletPage = React.lazy(() => import("./pages/wallet"))
const BountyDiscoveryPage = React.lazy(() => import("./pages/bounties"))
const TokenMarketplacePage = React.lazy(() => import("./pages/token-marketplace-page"))
const BountyDetail = React.lazy(() => import("./pages/bounty-detail"))
const Profile = React.lazy(() => import("./pages/profile"))
const Messages = React.lazy(() => import("./pages/messages"))

// Layout components
import MainLayout from "./components/layout"
import AuthLayout from "./components/layout/auth-layout"
import LoadingSpinner from "./components/common/loading-spinner"
import { Toaster } from "./components/ui/toaster"

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useApp()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const App: React.FC = () => {
  useEffect(() => {
    document.title = config.appName
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <TokenMarketplacePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bounties/:id"
              element={
                <ProtectedRoute>
                  <BountyDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
      <Toaster />
    </ThemeProvider>
  )
}

export default App

