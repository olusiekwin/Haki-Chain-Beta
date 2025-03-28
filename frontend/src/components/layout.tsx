import type React from "react"
import { Header } from "./header"
import { Footer } from "./footer"
import { EnvironmentIndicator } from "./environment-indicator"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <EnvironmentIndicator />
    </div>
  )
}

