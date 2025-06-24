"use client"

import { useState, useEffect } from "react"
import { offlineStorage } from "@/lib/offline-storage"

interface OfflineState {
  isOnline: boolean
  isOfflineReady: boolean
  pendingSyncCount: number
  lastSyncTime: number | null
}

export function useOffline() {
  const [state, setState] = useState<OfflineState>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    isOfflineReady: false,
    pendingSyncCount: 0,
    lastSyncTime: null,
  })

  useEffect(() => {
    // Initialize offline storage
    const initOfflineStorage = async () => {
      try {
        await offlineStorage.init()
        const pendingSync = await offlineStorage.getPendingSync()
        const lastSync = await offlineStorage.getLastSync("general")

        setState((prev) => ({
          ...prev,
          isOfflineReady: true,
          pendingSyncCount: pendingSync.length,
          lastSyncTime: lastSync || null,
        }))
      } catch (error) {
        console.error("Failed to initialize offline storage:", error)
      }
    }

    initOfflineStorage()

    // Listen for online/offline events
    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOnline: true }))
      syncPendingData()
    }

    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOnline: false }))
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const syncPendingData = async () => {
    try {
      const pendingSync = await offlineStorage.getPendingSync()

      for (const item of pendingSync) {
        try {
          if (item.type === "attendance") {
            const response = await fetch("/api/attendance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item.data),
            })

            if (response.ok && item.id) {
              await offlineStorage.clearPendingSync("attendance", item.id)
            }
          } else if (item.type === "member_update") {
            const url = item.memberId ? `/api/members/${item.memberId}` : "/api/members"
            const response = await fetch(url, {
              method: item.method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item.data),
            })

            if (response.ok && item.id) {
              await offlineStorage.clearPendingSync("member_update", item.id)
            }
          }
        } catch (error) {
          console.error("Failed to sync item:", error)
        }
      }

      // Update pending count
      const remainingSync = await offlineStorage.getPendingSync()
      setState((prev) => ({
        ...prev,
        pendingSyncCount: remainingSync.length,
        lastSyncTime: Date.now(),
      }))
    } catch (error) {
      console.error("Error syncing pending data:", error)
    }
  }

  const cacheDataForOffline = async (type: "members" | "events", data: any[]) => {
    try {
      if (type === "members") {
        await offlineStorage.saveMembers(data)
      } else if (type === "events") {
        await offlineStorage.saveEvents(data)
      }
    } catch (error) {
      console.error(`Error caching ${type} for offline:`, error)
    }
  }

  const getOfflineData = async (type: "members" | "events") => {
    try {
      if (type === "members") {
        return await offlineStorage.getMembers()
      } else if (type === "events") {
        return await offlineStorage.getEvents()
      }
      return []
    } catch (error) {
      console.error(`Error getting offline ${type}:`, error)
      return []
    }
  }

  const addPendingSync = async (
    type: "attendance" | "member_update",
    data: any,
    method?: "POST" | "PUT" | "DELETE",
    memberId?: string,
  ) => {
    try {
      if (type === "attendance") {
        await offlineStorage.addPendingAttendance(data)
      } else if (type === "member_update") {
        await offlineStorage.addPendingMemberUpdate(data, method!, memberId)
      }

      const pendingSync = await offlineStorage.getPendingSync()
      setState((prev) => ({
        ...prev,
        pendingSyncCount: pendingSync.length,
      }))
    } catch (error) {
      console.error("Error adding pending sync:", error)
    }
  }

  return {
    ...state,
    syncPendingData,
    cacheDataForOffline,
    getOfflineData,
    addPendingSync,
  }
}
