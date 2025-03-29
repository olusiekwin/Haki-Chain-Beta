"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../utils/cn"
import { Button } from "../ui/Button"
import {
  LayoutDashboard,
  Briefcase,
  ShoppingBag,
  Wallet,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Bounties",
      href: "/bounties",
      icon: Briefcase,
      exact: false,
    },
    {
      name: "Marketplace",
      href: "/marketplace",
      icon: ShoppingBag,
      exact: false,
    },
    {
      name: "Wallet",
      href: "/wallet",
      icon: Wallet,
      exact: false,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      exact: false,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      exact: false,
    },
  ]

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) {
      return location.pathname === item.href
    }
    return location.pathname.startsWith(item.href)
  }

  return (
    <div
      className={cn(
        "hidden md:flex h-screen flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <Link to="/" className="text-xl font-bold text-primary">
            HakiChain
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                isActive(item)
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                collapsed && "justify-center",
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mx-0" : "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar

