"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Users, Calendar, DollarSign, Menu, Plus } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { Language } from "@/lib/i18n"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import MobileNavigation from "./mobile-navigation"

interface MobileBottomNavProps {
  language?: string
}

export default function MobileBottomNav({ language }: MobileBottomNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation((language || "pt") as Language)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const mainNavItems = [
    {
      id: "dashboard",
      title: t("home"),
      icon: Home,
      route: "/dashboard",
      badge: null,
    },
    {
      id: "members",
      title: t("members"),
      icon: Users,
      route: "/dashboard?tab=members",
      badge: "247",
    },
    {
      id: "events",
      title: t("events"),
      icon: Calendar,
      route: "/dashboard?tab=events",
      badge: "8",
    },
    {
      id: "finance",
      title: t("finance"),
      icon: DollarSign,
      route: "/dashboard?tab=financial",
      badge: null,
    },
  ]

  const handleNavigation = (route: string) => {
    router.push(route)
  }

  const isActive = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/app"
    }
    return pathname.includes(route.split("?")[0])
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 pb-safe">
        <div className="grid grid-cols-5 h-16 min-w-0 overflow-x-auto">
          {mainNavItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`h-full rounded-none flex-col gap-1 relative ${
                isActive(item.route) ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => handleNavigation(item.route)}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {item.badge.length > 2 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium truncate">{item.title}</span>
              {isActive(item.route) && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full" />
              )}
            </Button>
          ))}

          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="h-full rounded-none flex-col gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs font-medium">{t("menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <MobileNavigation onClose={() => setIsMenuOpen(false)} language={language} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 md:hidden z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={() => router.push("/dashboard?tab=members&action=add")}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </>
  )
}
