"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Users,
  Calendar,
  DollarSign,
  Settings,
  Calculator,
  User,
  Menu,
  Home,
  Mic,
  MapPin,
  Building2,
  HelpCircle,
  Radio,
  Bell,
  Search,
  Plus,
  Heart,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useIsMobile } from "@/components/ui/use-mobile"
import { useFeatures } from "@/lib/feature-management"
import { useTranslation, type Language, getCountryLanguage } from "@/lib/i18n"
import { useAuth } from "@/components/auth-provider"
import LanguageSelector from "@/app/components/language-selector"
import UserProfileDropdown from "@/app/components/user-profile-dropdown"

// Import all the components
import MemberManagement from "@/app/components/member-management"
import EventsManager from "@/app/components/events-manager"
import FinancialDashboard from "@/app/components/financial-dashboard"
import ModernBudgetingTools from "@/app/components/modern-budgeting-tools"
import CommunityOutreach from "@/app/components/community-outreach"
import ChoirModule from "@/app/components/choir-module"
import DepartmentHub from "@/app/components/department-hub"
import DocumentationHub from "@/app/components/documentation-hub"
import AIAssistantHub from "@/app/components/ai-assistant-hub"
import LiveStreamingPlatform from "@/app/components/live-streaming-platform"
import FeatureManagementSettings from "@/app/components/feature-management-settings"
import UserProfileSettings from "@/app/components/user-profile-settings"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentLanguage, setCurrentLanguage] = useState<Language>("pt")
  const router = useRouter()
  const isMobile = useIsMobile()
  const { t } = useTranslation(currentLanguage)
  const { user, userProfile, loading, signOut } = useAuth()

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  // Initialize language from localStorage or browser
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as Language
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    } else {
      const detectedLanguage = getCountryLanguage()
      setCurrentLanguage(detectedLanguage)
      localStorage.setItem("preferred-language", detectedLanguage)
    }
  }, [])

  // Get feature flags
  const features = useFeatures([
    "live-streaming",
    "ai-assistant",
    "pastoral-care",
    "outreach-crm",
    "music-ministry",
    "bible-study",
    "department-management",
    "reporting-analytics",
    "communication-tools",
  ])

  const tabsConfig = [
    {
      value: "overview",
      label: t("nav.dashboard"),
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      enabled: true,
      isCore: true,
    },
    {
      value: "members",
      label: t("nav.members"),
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      enabled: true,
      isCore: true,
    },
    {
      value: "events",
      label: t("nav.events"),
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      enabled: true,
      isCore: true,
    },
    {
      value: "financial",
      label: t("nav.financial"),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      enabled: true,
      isCore: true,
    },
    {
      value: "budgeting",
      label: t("nav.budgets"),
      icon: Calculator,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      enabled: features["reporting-analytics"],
      isCore: false,
    },
    {
      value: "outreach",
      label: t("nav.outreach"),
      icon: MapPin,
      color: "text-red-600",
      bgColor: "bg-red-50",
      enabled: features["outreach-crm"],
      isCore: false,
    },
    {
      value: "choir",
      label: t("nav.choir"),
      icon: Mic,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      enabled: features["music-ministry"],
      isCore: false,
    },
    {
      value: "streaming",
      label: t("nav.streaming"),
      icon: Radio,
      color: "text-red-600",
      bgColor: "bg-red-50",
      enabled: features["live-streaming"],
      isCore: false,
    },
    {
      value: "pastoral",
      label: t("nav.pastoral"),
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      enabled: features["pastoral-care"],
      isCore: false,
    },
    {
      value: "tools",
      label: t("nav.tools"),
      icon: Settings,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      enabled: features["ai-assistant"],
      isCore: false,
    },
    {
      value: "departments",
      label: t("nav.departments"),
      icon: Building2,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      enabled: features["department-management"],
      isCore: false,
    },
    {
      value: "documentation",
      label: t("nav.help"),
      icon: HelpCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      enabled: true,
      isCore: true,
    },
    {
      value: "settings",
      label: t("nav.settings"),
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      enabled: true,
      isCore: true,
    },
    {
      value: "profile",
      label: t("nav.profile"),
      icon: User,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      enabled: true,
      isCore: true,
    },
  ]

  // Filter tabs based on enabled features
  const enabledTabs = tabsConfig.filter((tab) => tab.enabled)

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: t("common.success"),
        description: "Signed out successfully",
      })
      router.push("/auth")
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: t("common.error"),
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage)
    localStorage.setItem("preferred-language", newLanguage)
  }

  const currentTab = enabledTabs.find((tab) => tab.value === activeTab)

  // Get quick action tabs (only enabled core tabs)
  const quickActionTabs = enabledTabs.filter((tab) =>
    ["members", "events", "financial", "outreach"].includes(tab.value),
  )

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if no user
  if (!user || !userProfile) {
    return null
  }

  // Mobile Navigation Component
  const MobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 bg-gradient-to-br from-white to-gray-50">
        <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <SheetTitle className="text-left text-white font-bold">Connectus</SheetTitle>
          <SheetDescription className="text-left text-blue-100">Smart Church Management</SheetDescription>
        </SheetHeader>
        <div className="p-4 space-y-2">
          {enabledTabs.map((tab, index) => (
            <div
              key={tab.value}
              className="animate-in slide-in-from-left duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Button
                variant={activeTab === tab.value ? "default" : "ghost"}
                className={`w-full justify-start h-12 transition-all duration-200 hover:scale-[1.02] ${
                  activeTab === tab.value
                    ? `${tab.bgColor} ${tab.color} hover:${tab.bgColor} shadow-md`
                    : "hover:bg-gray-50 hover:shadow-sm"
                } rounded-xl`}
                onClick={() => {
                  setActiveTab(tab.value)
                  document.querySelector('[data-state="open"]')?.click()
                }}
              >
                <div className={`p-2 rounded-lg ${tab.bgColor} mr-3`}>
                  <tab.icon className={`h-5 w-5 ${tab.color}`} />
                </div>
                <span className="font-medium text-gray-900">{tab.label}</span>
              </Button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Modern Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MobileNavigation />
              <div>
                <h1 className="text-lg md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Connectus
                </h1>
                {!isMobile && (
                  <p className="text-gray-600 text-sm md:text-base flex items-center gap-2">
                    <span>Smart Church Management</span>
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Actions for Desktop */}
              {!isMobile && (
                <div className="flex items-center gap-2 mr-4">
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => setActiveTab("members")}>
                    <Plus className="h-4 w-4" />
                    {t("members.actions.addMember")}
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => setActiveTab("events")}>
                    <Calendar className="h-4 w-4" />
                    {t("events.addEvent")}
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-2">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-2">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                  variant="button"
                  size="sm"
                />
              </div>

              {/* User Profile Dropdown */}
              <UserProfileDropdown />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
                  {t("dashboard.welcome")} {userProfile?.first_name || "User"}! 👋
                </h2>
                <p className="text-sm md:text-base text-gray-600">{t("dashboard.subtitle")}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  {t("common.online")}
                </Badge>
                {!isMobile && (
                  <Badge variant="outline" className="text-gray-600">
                    {userProfile?.role?.charAt(0).toUpperCase() + userProfile?.role?.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Tab Navigation */}
          {!isMobile && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-lg">
              <TabsList
                className={`grid w-full gap-1 bg-transparent p-1`}
                style={{ gridTemplateColumns: `repeat(${enabledTabs.length}, minmax(0, 1fr))` }}
              >
                {enabledTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 data-[state=active]:shadow-lg ${
                      activeTab === tab.value
                        ? `${tab.bgColor} ${tab.color} data-[state=active]:${tab.bgColor}`
                        : "hover:bg-white/50"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden lg:inline text-sm font-medium">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          )}

          {/* Mobile Active Tab Indicator */}
          {isMobile && currentTab && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${currentTab.bgColor}`}>
                  <currentTab.icon className={`h-5 w-5 ${currentTab.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{currentTab.label}</h3>
                  <p className="text-sm text-gray-600">Overview</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Contents */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
            <TabsContent value="overview" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Stats Cards - Always show for core features */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700">{t("members.stats.active")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900">247</div>
                    <p className="text-xs text-blue-600 mt-1">+12 new this month</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">{t("financial.monthlyTithes")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900">$45,230</div>
                    <p className="text-xs text-green-600 mt-1">This month</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700">{t("events.upcomingEvents")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-900">8</div>
                    <p className="text-xs text-purple-600 mt-1">This week</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-orange-700">Prayer Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-900">23</div>
                    <p className="text-xs text-orange-600 mt-1">New</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions - Based on enabled tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {t("dashboard.quickActions")}
                  </CardTitle>
                  <CardDescription>{t("dashboard.quickActionsDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActionTabs.map((tab) => (
                      <Button
                        key={tab.value}
                        variant="outline"
                        className="h-20 flex-col gap-2"
                        onClick={() => setActiveTab(tab.value)}
                      >
                        <tab.icon className="h-6 w-6" />
                        <span className="text-sm">
                          {tab.value === "members" && t("members.actions.addMember")}
                          {tab.value === "events" && t("events.addEvent")}
                          {tab.value === "financial" && t("financial.recordDonation")}
                          {tab.value === "outreach" && "New Outreach"}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Core Features - Always Available */}
            <TabsContent value="members" className="p-0">
              <MemberManagement language={currentLanguage} />
            </TabsContent>

            <TabsContent value="events" className="p-0">
              <EventsManager />
            </TabsContent>

            <TabsContent value="financial" className="p-0">
              <FinancialDashboard />
            </TabsContent>

            <TabsContent value="documentation" className="p-0">
              <DocumentationHub />
            </TabsContent>

            <TabsContent value="settings" className="p-0">
              <FeatureManagementSettings />
            </TabsContent>

            <TabsContent value="profile" className="p-0">
              <UserProfileSettings />
            </TabsContent>

            {/* Optional Features - Only show if enabled */}
            {features["reporting-analytics"] && (
              <TabsContent value="budgeting" className="p-0">
                <ModernBudgetingTools />
              </TabsContent>
            )}

            {features["outreach-crm"] && (
              <TabsContent value="outreach" className="p-0">
                <CommunityOutreach />
              </TabsContent>
            )}

            {features["music-ministry"] && (
              <TabsContent value="choir" className="p-0">
                <ChoirModule />
              </TabsContent>
            )}

            {features["live-streaming"] && (
              <TabsContent value="streaming" className="p-0">
                <LiveStreamingPlatform />
              </TabsContent>
            )}

            {features["ai-assistant"] && (
              <TabsContent value="tools" className="p-0">
                <AIAssistantHub />
              </TabsContent>
            )}

            {features["department-management"] && (
              <TabsContent value="departments" className="p-0">
                <DepartmentHub />
              </TabsContent>
            )}

            {features["pastoral-care"] && (
              <TabsContent value="pastoral" className="p-0">
                <div className="p-6">
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("nav.pastoral")}</h3>
                    <p className="text-gray-600 mb-6">Member care and support</p>
                    <Button onClick={() => router.push("/pastoral-care")} className="gap-2">
                      <Heart className="h-4 w-4" />
                      Open Pastoral Care
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  )
}
