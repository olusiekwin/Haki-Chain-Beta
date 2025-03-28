"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "../contexts/auth-context"
import { EnvironmentIndicator } from "./environment-indicator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "./ui/sheet"
import {
  Menu,
  User,
  LogOut,
  Settings,
  Briefcase,
  Home,
  Search,
  Shield,
  DollarSign,
  Wallet,
  Award,
  BarChart2,
} from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Token Marketplace", href: "/token-marketplace" },
  ]

  const userSpecificLinks = () => {
    if (!user) return []

    const links = [{ name: "Dashboard", href: "/dashboard", icon: <BarChart2 className="h-4 w-4 mr-2" /> }]

    if (user.role === "lawyer") {
      links.push({
        name: "Lawyer Dashboard",
        href: "/lawyer-dashboard",
        icon: <Briefcase className="h-4 w-4 mr-2" />,
      })
    } else if (user.role === "admin") {
      links.push({
        name: "Admin Dashboard",
        href: "/admin/dashboard",
        icon: <Shield className="h-4 w-4 mr-2" />,
      })
    }

    links.push({
      name: "Wallet",
      href: "/wallet",
      icon: <Wallet className="h-4 w-4 mr-2" />,
    })

    return links
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Haki Logo" className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                HAKI
              </span>
            </Link>
            <nav className="hidden md:flex ml-10 space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <EnvironmentIndicator />

            {user ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userSpecificLinks().map((link) => (
                      <DropdownMenuItem key={link.name} asChild>
                        <Link to={link.href} className="flex items-center">
                          {link.icon}
                          {link.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>   Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="flex items-center text-red-500">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center">
                      <img src="/logo.svg" alt="Haki Logo" className="h-8 w-8 mr-2" />
                      <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                        HAKI
                      </span>
                    </div>
                  </SheetTitle>
                  <SheetDescription>
                    Legal bounties on the blockchain
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.name}>
                        <Link
                          to={link.href}
                          className={`flex items-center px-2 py-1 rounded-md transition-colors hover:bg-primary/10 ${
                            location.pathname === link.href
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.name === "Home" ? (
                            <Home className="h-4 w-4 mr-2" />
                          ) : link.name === "Marketplace" ? (
                            <Search className="h-4 w-4 mr-2" />
                          ) : link.name === "Token Marketplace" ? (
                            <Award className="h-4 w-4 mr-2" />
                          ) : (
                            <DollarSign className="h-4 w-4 mr-2" />
                          )}
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}

                    {user && (
                      <>
                        <div className="h-px bg-border my-2" />
                        {userSpecificLinks().map((link) => (
                          <SheetClose asChild key={link.name}>
                            <Link
                              to={link.href}
                              className="flex items-center px-2 py-1 rounded-md transition-colors hover:bg-primary/10 text-muted-foreground"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {link.icon}
                              {link.name}
                            </Link>
                          </SheetClose>
                        ))}
                        <SheetClose asChild>
                          <Link
                            to="/profile"
                            className="flex items-center px-2 py-1 rounded-md transition-colors hover:bg-primary/10 text-muted-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                        </SheetClose>
                        <div className="h-px bg-border my-2" />
                        <button
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center px-2 py-1 rounded-md transition-colors hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </>
                    )}

                    {!user && (
                      <>
                        <div className="h-px bg-border my-2" />
                        <SheetClose asChild>
                          <Link
                            to="/login"
                            className="flex items-center px-2 py-1 rounded-md transition-colors hover:bg-primary/10 text-muted-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Login
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            to="/register"
                            className="flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Register
                          </Link>
                        </SheetClose>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
  </header>
  )
}

