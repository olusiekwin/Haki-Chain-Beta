"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useFeatures } from "../../hooks/use-features"
import { cn } from "../../lib/utils"
import { Home, Briefcase, Wallet, ShoppingBag, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { isBlockchainEnabled } = useFeatures()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/bounties", label: "Bounties", icon: <Briefcase size={20} /> },
    { path: "/wallet", label: "Wallet", icon: <Wallet size={20} />, requiresBlockchain: true },
    { path: "/marketplace", label: "Marketplace", icon: <ShoppingBag size={20} /> },
    { path: "/community", label: "Community", icon: <Users size={20} /> },
  ]

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <aside
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <Link to="/" className="text-xl font-bold text-primary">
              HakiChain
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-full">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              // Skip blockchain-dependent items if blockchain is not enabled
              if (item.requiresBlockchain && !isBlockchainEnabled) {
                return null
              }

              const isActive = location.pathname === item.path

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mx-2",
                      isActive && "bg-primary/10 text-primary dark:bg-primary/20",
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="text-xs text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} HakiChain</div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

