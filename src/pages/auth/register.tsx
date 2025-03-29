"use client"

import { useEffect } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { AuthLayout } from "@/layouts/AuthLayout"
import { useNavigate, useLocation } from "react-router-dom"

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // If we have a "register" query param, we'll automatically switch to the register tab
  useEffect(() => {
    const tabElement = document.querySelector('[value="register"]') as HTMLElement
    if (tabElement) {
      tabElement.click()
    }
  }, [])

  return (
    <AuthLayout>
      <div className="flex items-center justify-center min-h-screen">
        <AuthForm />
      </div>
    </AuthLayout>
  )
}

