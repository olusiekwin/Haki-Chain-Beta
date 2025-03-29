"use client"

import type React from "react"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Header from "./header"
import Footer from "./footer"
import { Toaster } from "@/components/ui/toaster"
import EnvironmentIndicator from "./environment-indicator"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
      <Toaster />
      <EnvironmentIndicator />
    </div>
  )
}

