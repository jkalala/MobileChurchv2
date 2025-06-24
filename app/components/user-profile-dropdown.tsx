"use client"

import { useState, useEffect } from "react"
import { User, Settings, LogOut, Shield, Clock, Wifi, WifiOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useTranslation } from "@/lib/i18n"
import { useRouter } from "next/navigation"

export default function UserProfileDropdown() {
  const [isOnline, setIsOnline] = useState(true)
  const { user, userProfile, signOut, language } = useAuth()
  const { t } = useTranslation(language)
  const router = useRouter()

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/auth")
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "pastor":
        return "bg-purple-100 text-purple-800"
      case "leader":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  const formatLastSeen = (dateString?: string) => {
    if (!dateString) return t("common.unknown")

    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return t("common.justNow")
    if (diffInMinutes < 60) return t("common.minutesAgo", { count: diffInMinutes })
    if (diffInMinutes < 1440) return t("common.hoursAgo", { count: Math.floor(diffInMinutes / 60) })
    return t("common.daysAgo", { count: Math.floor(diffInMinutes / 1440) })
  }

  if (!user || !userProfile) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={userProfile?.profile_image || "/placeholder-user.jpg"}
              alt={userProfile?.first_name || user.email || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(userProfile?.first_name, userProfile?.last_name, user.email)}
            </AvatarFallback>
          </Avatar>
          {/* Online status indicator */}
          <div
            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={userProfile?.profile_image || "/placeholder-user.jpg"}
                  alt={userProfile?.first_name || user.email || "User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                  {getInitials(userProfile?.first_name, userProfile?.last_name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile?.first_name && userProfile?.last_name
                    ? `${userProfile.first_name} ${userProfile.last_name}`
                    : user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                {userProfile?.role && (
                  <Badge variant="secondary" className={`text-xs mt-1 ${getRoleColor(userProfile.role)}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Church Info */}
            {userProfile?.church_name && (
              <div className="text-xs text-gray-600 bg-gray-50 rounded-md p-2">
                <strong>{t("common.church")}:</strong> {userProfile.church_name}
              </div>
            )}

            {/* Status Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                {isOnline ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-gray-400" />}
                <span>{isOnline ? t("common.online") : t("common.offline")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatLastSeen(user?.last_sign_in_at)}</span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* User Details */}
        <div className="px-2 py-1.5">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>{t("common.role")}:</span>
              <span className="capitalize">{userProfile?.role || "Member"}</span>
            </div>
            {userProfile?.phone && (
              <div className="flex justify-between">
                <span>{t("common.phone")}:</span>
                <span>{userProfile.phone}</span>
              </div>
            )}
            {userProfile?.permissions?.super_admin && (
              <div className="flex justify-between">
                <span>Permissions:</span>
                <Badge variant="outline" className="text-xs">
                  Super Admin
                </Badge>
              </div>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem onClick={() => router.push("/dashboard?tab=profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>{t("common.profile")}</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/dashboard?tab=settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t("common.settings")}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("common.signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
