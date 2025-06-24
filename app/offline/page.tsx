"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, Database, Calendar, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useOffline } from "@/hooks/use-offline"

export default function OfflinePage() {
  const router = useRouter()
  const { isOnline, isOfflineReady } = useOffline()

  const handleRetry = () => {
    if (isOnline) {
      router.back()
    } else {
      window.location.reload()
    }
  }

  const offlineFeatures = [
    {
      icon: Users,
      title: "Member Directory",
      description: "View member information and contact details",
      available: true,
    },
    {
      icon: Calendar,
      title: "Events Calendar",
      description: "Check upcoming events and schedules",
      available: true,
    },
    {
      icon: Database,
      title: "Attendance Recording",
      description: "Record attendance (will sync when online)",
      available: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Main Offline Card */}
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <WifiOff className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle>You're Offline</CardTitle>
            <CardDescription>
              No internet connection detected. Don't worry, you can still access some features!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>

        {/* Available Features */}
        {isOfflineReady && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Offline</CardTitle>
              <CardDescription>These features work without an internet connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {offlineFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/app")} className="flex-1">
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push("/app/members")} className="flex-1">
            View Members
          </Button>
        </div>
      </div>
    </div>
  )
}
