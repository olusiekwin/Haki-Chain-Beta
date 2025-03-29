"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useApp } from "../../context/AppContext"
import { Button } from "../ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu"
import { Bell, Moon, Settings, Sun, User, Wallet } from "lucide-react"
import { useTheme } from "../theme/ThemeProvider"
import { useFeatures } from "../../hooks/useFeatures"
import tokenContractService from "../../services/web3/tokenContractService"
import { Badge } from "../ui/Badge"

const Navbar: React.FC = () => {
  const { user, logout } = useApp()
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const { isBlockchainEnabled } = useFeatures()
  const [balance, setBalance] = useState<string>("0")

  useEffect(() => {
    const fetchBalance = async () => {
      if (isBlockchainEnabled && user?.wallet_address) {
        try {
          const userBalance = await tokenContractService.balanceOf(user.wallet_address)
          setBalance(userBalance)
        } catch (error) {
          console.error("Error fetching balance:", error)
          setBalance("Error")
        }
      }
    }

    fetchBalance()

    // Set up a refresh interval for the balance
    const intervalId = setInterval(fetchBalance, 30000) // Refresh every 30 seconds

    return () => clearInterval(intervalId)
  }, [isBlockchainEnabled, user?.wallet_address])

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">HakiChain</span>
          </Link>

          <div className="hidden md:flex items-center ml-10 space-x-4">
            <Link
              to="/"
              className={`text-sm font-medium ${
                location.pathname === "/"
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/bounties"
              className={`text-sm font-medium ${
                location.pathname.startsWith("/bounties")
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              Bounties
            </Link>
            <Link
              to="/marketplace"
              className={`text-sm font-medium ${
                location.pathname.startsWith("/marketplace")
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/wallet"
              className={`text-sm font-medium ${
                location.pathname.startsWith("/wallet")
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              Wallet
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isBlockchainEnabled && user?.wallet_address && (
            <div className="hidden md:flex items-center">
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <Wallet className="h-3.5 w-3.5" />
                <span>{balance} HAKI</span>
              </Badge>
            </div>
          )}

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={user?.username || "User"} />
                  <AvatarFallback>{user?.first_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar

