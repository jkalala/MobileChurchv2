"use client"

import { useOffline } from "@/hooks/use-offline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff, Wifi, RefreshCw, Clock, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function OfflineIndicator() {
  const { isOnline, isOfflineReady, pendingSyncCount, lastSyncTime, syncPendingData } = useOffline()
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await syncPendingData()
    } finally {
      setIsSyncing(false)
    }
  }

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return "Never"

    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    return "Just now"
  }

  if (!isOfflineReady) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Connection Status Badge */}
      <div className="mb-2">
        <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-2 px-3 py-1">
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              Offline
            </>
          )}
        </Badge>
      </div>

      {/* Sync Status Card (only show when there's pending data or recently synced) */}
      {(pendingSyncCount > 0 || (!isOnline && lastSyncTime)) && (
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {pendingSyncCount > 0 ? (
                <>
                  <Clock className="h-4 w-4 text-orange-500" />
                  Pending Sync
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Synced
                </>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              {pendingSyncCount > 0
                ? `${pendingSyncCount} item${pendingSyncCount > 1 ? "s" : ""} waiting to sync`
                : `Last synced: ${formatLastSync(lastSyncTime)}`}
            </CardDescription>
          </CardHeader>

          {pendingSyncCount > 0 && (
            <CardContent className="pt-0">
              <Button onClick={handleSync} disabled={!isOnline || isSyncing} size="sm" className="w-full">
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>

              {!isOnline && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Will sync automatically when back online
                </p>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
