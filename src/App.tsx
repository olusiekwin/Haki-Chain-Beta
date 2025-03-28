import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useApp } from "./context/app-context"

// Import your page components
// These are placeholders - replace with your actual components
const LoginPage = React.lazy(() => import("./pages/login-page"))
const RegisterPage = React.lazy(() => import("./pages/register-page"))
const DashboardPage = React.lazy(() => import("./pages/dashboard-page"))
const WalletPage = React.lazy(() => import("./pages/wallet-page"))
const BountyDiscoveryPage = React.lazy(() => import("./pages/bounty-discovery-page"))
const TokenMarketplacePage = React.lazy(() => import("./pages/token-marketplace-page"))

// Layout components
import MainLayout from "./components/layout/main-layout"
import AuthLayout from "./components/layout/auth-layout"
import LoadingSpinner from "./components/common/loading-spinner"

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
            path="/marketplace"
            element={
              <ProtectedRoute>
                <TokenMarketplacePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  )
}

export default App

