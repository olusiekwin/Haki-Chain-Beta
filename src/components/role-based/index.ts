"use client"

import type { ReactNode } from "react"
import { useAuth } from "../../hooks/use-auth"
import { configService } from "../../services/core/config-service"

interface RoleBasedProps {
  children: ReactNode
  roles: string[]
  fallback?: ReactNode
}

/**
 * Component that conditionally renders content based on user role
 */
export function RoleBased({ children, roles, fallback = null }: RoleBasedProps) {
  const { user } = useAuth()

  if (!user) {
    return fallback
  }

  if (roles.includes(user.role)) {
    return <>{children}</>
  }

  return fallback
}

/**
 * Component that only renders content for admin users
 */
export function AdminOnly({ children, fallback = null }: Omit<RoleBasedProps, "roles">) {
  return (
    <RoleBased roles={configService.getAdminRoles()} fallback={fallback}>
      {children}
    </RoleBased>
  )
}

/**
 * Component that only renders content for lawyer users
 */
export function LawyerOnly({ children, fallback = null }: Omit<RoleBasedProps, "roles">) {
  return (
    <RoleBased roles={configService.getLawyerRoles()} fallback={fallback}>
      {children}
    </RoleBased>
  )
}

/**
 * Component that only renders content for NGO users
 */
export function NgoOnly({ children, fallback = null }: Omit<RoleBasedProps, "roles">) {
  return (
    <RoleBased roles={configService.getNgoRoles()} fallback={fallback}>
      {children}
    </RoleBased>
  )
}

/**
 * Component that only renders content for donor users
 */
export function DonorOnly({ children, fallback = null }: Omit<RoleBasedProps, "roles">) {
  return (
    <RoleBased roles={configService.getDonorRoles()} fallback={fallback}>
      {children}
    </RoleBased>
  )
}

