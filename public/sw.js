const CACHE_NAME = "church-app-v1"
const STATIC_CACHE = "church-app-static-v1"
const DYNAMIC_CACHE = "church-app-dynamic-v1"

// Resources to cache immediately
const STATIC_ASSETS = [
  "/",
  "/app",
  "/dashboard",
  "/auth",
  "/offline",
  "/manifest.json",
  "/placeholder.svg",
  "/images/semente-bendita-logo.png",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached response when offline
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Return offline fallback for API requests
            return new Response(
              JSON.stringify({
                error: "Offline",
                message: "This data is not available offline",
                offline: true,
              }),
              {
                status: 503,
                statusText: "Service Unavailable",
                headers: { "Content-Type": "application/json" },
              },
            )
          })
        }),
    )
    return
  }

  // Handle page requests
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response.ok) {
            return response
          }

          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/offline")
          }
          throw new Error("Network request failed")
        })
    }),
  )
})

// Background sync for when connection is restored
self.addEventListener("sync", (event) => {
  console.log("Background sync triggered:", event.tag)

  if (event.tag === "sync-attendance") {
    event.waitUntil(syncAttendanceData())
  }

  if (event.tag === "sync-member-updates") {
    event.waitUntil(syncMemberUpdates())
  }

  if (event.tag === "sync-event-updates") {
    event.waitUntil(syncEventUpdates())
  }
})

// Sync attendance data when back online
async function syncAttendanceData() {
  try {
    const db = await openDB()
    const transaction = db.transaction(["pendingAttendance"], "readonly")
    const store = transaction.objectStore("pendingAttendance")
    const pendingRecords = await store.getAll()

    for (const record of pendingRecords) {
      try {
        const response = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record.data),
        })

        if (response.ok) {
          // Remove from pending queue
          const deleteTransaction = db.transaction(["pendingAttendance"], "readwrite")
          const deleteStore = deleteTransaction.objectStore("pendingAttendance")
          await deleteStore.delete(record.id)
        }
      } catch (error) {
        console.error("Failed to sync attendance record:", error)
      }
    }
  } catch (error) {
    console.error("Error syncing attendance data:", error)
  }
}

// Sync member updates when back online
async function syncMemberUpdates() {
  try {
    const db = await openDB()
    const transaction = db.transaction(["pendingMemberUpdates"], "readonly")
    const store = transaction.objectStore("pendingMemberUpdates")
    const pendingUpdates = await store.getAll()

    for (const update of pendingUpdates) {
      try {
        const response = await fetch(`/api/members${update.memberId ? `/${update.memberId}` : ""}`, {
          method: update.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update.data),
        })

        if (response.ok) {
          // Remove from pending queue
          const deleteTransaction = db.transaction(["pendingMemberUpdates"], "readwrite")
          const deleteStore = deleteTransaction.objectStore("pendingMemberUpdates")
          await deleteStore.delete(update.id)
        }
      } catch (error) {
        console.error("Failed to sync member update:", error)
      }
    }
  } catch (error) {
    console.error("Error syncing member updates:", error)
  }
}

// Add syncEventUpdates function
async function syncEventUpdates() {
  try {
    const db = await openDB()
    const transaction = db.transaction(["pendingEventUpdates"], "readonly")
    const store = transaction.objectStore("pendingEventUpdates")
    const pendingUpdates = await store.getAll()

    for (const update of pendingUpdates) {
      try {
        let url = "/api/events"
        if (update.eventId) url += `/${update.eventId}`
        const response = await fetch(url, {
          method: update.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update.data),
        })
        if (response.ok) {
          // Remove from pending queue
          const deleteTransaction = db.transaction(["pendingEventUpdates"], "readwrite")
          const deleteStore = deleteTransaction.objectStore("pendingEventUpdates")
          await deleteStore.delete(update.id)
        }
      } catch (error) {
        console.error("Failed to sync event update:", error)
      }
    }
  } catch (error) {
    console.error("Error syncing event updates:", error)
  }
}

// Helper function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ChurchAppDB", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Create object stores
      if (!db.objectStoreNames.contains("members")) {
        db.createObjectStore("members", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("events")) {
        db.createObjectStore("events", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("pendingAttendance")) {
        db.createObjectStore("pendingAttendance", { keyPath: "id", autoIncrement: true })
      }

      if (!db.objectStoreNames.contains("pendingMemberUpdates")) {
        db.createObjectStore("pendingMemberUpdates", { keyPath: "id", autoIncrement: true })
      }

      if (!db.objectStoreNames.contains("pendingEventUpdates")) {
        db.createObjectStore("pendingEventUpdates", { keyPath: "id", autoIncrement: true })
      }
    }
  })
}
