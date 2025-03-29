"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false)
  }, [location.pathname])

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Token Marketplace", path: "/token-marketplace" },
    { name: "AI Assistant", path: "/ai-assistant" },
  ]

  const authLinks = isAuthenticated
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Profile", path: "/profile" },
        { name: "Create Bounty", path: "/create-bounty" },
      ]
    : []

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-md"></div>
              <div className="absolute inset-1 bg-background rounded-sm flex items-center justify-center text-primary font-bold">
                H
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Haki
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  location.pathname === link.path
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && authLinks.length > 0 && (
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50">
                  Account <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 z-10 invisible px-2 py-2 mt-1 space-y-1 bg-background rounded-md shadow-lg opacity-0 min-w-[180px] group-hover:visible group-hover:opacity-100 transition-all duration-200 border border-border">
                  {authLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {isAuthenticated ? (
              <>
                <div className="text-sm font-medium">
                  <span className="text-muted-foreground">Hello, </span>
                  <span>{user?.name || "User"}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="p-2 md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="container px-4 py-4 mx-auto">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      location.pathname === link.path
                        ? "text-primary font-medium bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {isAuthenticated &&
                  authLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        location.pathname === link.path
                          ? "text-primary font-medium bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                <div className="h-px my-2 bg-border" />

                {isAuthenticated ? (
                  <Button variant="ghost" size="sm" onClick={logout} className="justify-start">
                    Logout
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="ghost" size="sm" className="justify-start">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild variant="default" size="sm" className="justify-start">
                      <Link to="/register">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

