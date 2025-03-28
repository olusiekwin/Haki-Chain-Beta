import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/auth-context"
import { WalletProvider } from "./contexts/wallet-context"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { Layout } from "./components/layout"
import { Home } from "./pages/home"
import { Login } from "./pages/login"
import { Register } from "./pages/register"
import { Dashboard } from "./pages/dashboard"
import { LawyerVerification } from "./pages/lawyer-verification"
import { BountyList } from "./pages/bounty-list"
import { BountyDetail } from "./pages/bounty-detail"
import { CreateBounty } from "./pages/create-bounty"
import { Profile } from "./pages/profile"
import { AdminDashboard } from "./pages/admin-dashboard"
import { ProtectedRoute } from "./components/protected-route"
import { NotFound } from "./pages/not-found"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="haki-theme">
      <AuthProvider>
        <WalletProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/lawyer-verification"
                  element={
                    <ProtectedRoute roleRequired="lawyer">
                      <LawyerVerification />
                    </ProtectedRoute>
                  }
                />

                <Route path="/bounties" element={<BountyList />} />
                <Route path="/bounties/:id" element={<BountyDetail />} />

                <Route
                  path="/create-bounty"
                  element={
                    <ProtectedRoute roleRequired="ngo">
                      <CreateBounty />
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
                  path="/admin"
                  element={
                    <ProtectedRoute roleRequired="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
          <Toaster />
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

