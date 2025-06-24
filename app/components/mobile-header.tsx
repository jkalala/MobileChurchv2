"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Search, Settings, User, LogOut, ChevronDown, Wifi, WifiOff } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { useTranslation } from "@/lib/i18n"
import { toast } from "@/hooks/use-toast"
import type { Language } from "@/lib/i18n"

interface MobileHeaderProps {
  title?: string
  showBackButton?: boolean
  language?: string
}

export default function MobileHeader({ title, showBackButton = false, language }: MobileHeaderProps) {
  const router = useRouter()
  const { user, userProfile, signOut, language: currentLanguage, setLanguage } = useAuth()
  const { t } = useTranslation((language || currentLanguage) as Language)
  const [isOnline, setIsOnline] = useState(true)

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: t("signedOutSuccessfully"),
        description: t("redirectingToAuth"),
      })
      router.push("/auth")
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: t("authenticationFailed"),
        description: t("verificationFailed"),
        variant: "destructive",
      })
    }
  }

  const getUserDisplayName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`
    }
    if (userProfile?.first_name) {
      return userProfile.first_name
    }
    return user?.email || t("user")
  }

  const getUserInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`
    }
    if (userProfile?.first_name) {
      return userProfile.first_name.charAt(0).toUpperCase()
    }
    return user?.email?.charAt(0).toUpperCase() || "U"
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 md:hidden pt-safe pb-2">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Image src="/images/semente-bendita-logo.png" alt="Connectus" width={32} height={32} />
          <div>
            <h1 className="text-lg font-bold text-gray-900">{title || userProfile?.church_name || "Connectus"}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {userProfile?.role || t("member")}
              </Badge>
              <div className="flex items-center gap-1">
                {isOnline ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-red-500" />}
                <span className="text-xs text-gray-500">{isOnline ? t("online") : t("offline")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <Select value={currentLanguage} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="w-16 h-8 text-xs border-0 bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">🇵🇹</SelectItem>
              <SelectItem value="en">🇺🇸</SelectItem>
              <SelectItem value="fr">🇫🇷</SelectItem>
            </SelectContent>
          </Select>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-8 w-8 relative">
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
            >
              3
            </Badge>
          </Button>

          {/* Search */}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-1 h-8" onClick={(e) => e.stopPropagation()}>
                <Avatar className="h-6 w-6 ring-1 ring-gray-200">
                  <AvatarImage
                    src={userProfile?.profile_image || "/placeholder.svg?height=24&width=24"}
                    alt={getUserDisplayName()}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48" sideOffset={5}>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/dashboard?tab=profile")
                }}
              >
                <User className="mr-2 h-4 w-4" />
                {t("common.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/dashboard?tab=settings")
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                {t("common.settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  handleLogout()
                }}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("auth.signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
