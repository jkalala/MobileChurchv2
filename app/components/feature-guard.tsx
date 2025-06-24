"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

interface FeatureGuardProps {
  feature: string
  children: React.ReactNode
}

export default function FeatureGuard({ feature, children }: FeatureGuardProps) {
  const { userProfile } = useAuth()
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/features")
      .then(res => res.json())
      .then(data => {
        const f = (data.features || []).find((f: any) => f.name === feature)
        if (!f) return setEnabled(false)
        if (f.roles && f.roles.length > 0 && userProfile && !f.roles.includes(userProfile.role)) {
          setEnabled(false)
        } else {
          setEnabled(!!f.enabled)
        }
      })
      .finally(() => setLoading(false))
  }, [feature, userProfile])

  if (loading) return null
  return enabled ? <>{children}</> : null
}

// Hook version for conditional rendering
export function useFeatureGuard(permission?: string, role?: string) {
  const { userProfile, hasPermission, isAdmin } = useAuth()

  const canAccess = (!role || userProfile?.role === role || isAdmin()) && (!permission || hasPermission(permission))

  return {
    canAccess,
    isAdmin: isAdmin(),
    userRole: userProfile?.role,
    hasPermission: permission ? hasPermission(permission) : true,
  }
}
