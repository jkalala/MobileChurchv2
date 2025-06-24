interface OfflineData {
  members: any[]
  events: any[]
  userProfile: any
  lastSync: number
}

interface PendingSync {
  id?: number
  type: "attendance" | "member_update" | "event_update"
  data: any
  timestamp: number
  method?: "POST" | "PUT" | "DELETE"
  memberId?: string
}

class OfflineStorageService {
  private dbName = "ChurchAppDB"
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("members")) {
          db.createObjectStore("members", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("events")) {
          db.createObjectStore("events", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("userProfile")) {
          db.createObjectStore("userProfile", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("pendingAttendance")) {
          db.createObjectStore("pendingAttendance", { keyPath: "id", autoIncrement: true })
        }

        if (!db.objectStoreNames.contains("pendingMemberUpdates")) {
          db.createObjectStore("pendingMemberUpdates", { keyPath: "id", autoIncrement: true })
        }

        if (!db.objectStoreNames.contains("bibleVerses")) {
          db.createObjectStore("bibleVerses", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("appSettings")) {
          db.createObjectStore("appSettings", { keyPath: "key" })
        }

        if (!db.objectStoreNames.contains("pendingEventUpdates")) {
          db.createObjectStore("pendingEventUpdates", { keyPath: "id", autoIncrement: true })
        }
      }
    })
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = "readonly"): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.init()
    }
    const transaction = this.db!.transaction([storeName], mode)
    return transaction.objectStore(storeName)
  }

  // Members
  async saveMembers(members: any[]): Promise<void> {
    const store = await this.getStore("members", "readwrite")

    // Clear existing data
    await store.clear()

    // Add new data
    for (const member of members) {
      await store.add(member)
    }

    // Update last sync time
    await this.updateLastSync("members")
  }

  async getMembers(): Promise<any[]> {
    const store = await this.getStore("members")
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Events
  async saveEvents(events: any[]): Promise<void> {
    const store = await this.getStore("events", "readwrite")

    // Clear existing data
    await store.clear()

    // Add new data
    for (const event of events) {
      await store.add(event)
    }

    await this.updateLastSync("events")
  }

  async getEvents(): Promise<any[]> {
    const store = await this.getStore("events")
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // User Profile
  async saveUserProfile(profile: any): Promise<void> {
    const store = await this.getStore("userProfile", "readwrite")
    await store.put(profile)
    await this.updateLastSync("userProfile")
  }

  async getUserProfile(): Promise<any | null> {
    const store = await this.getStore("userProfile")
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const profiles = request.result
        resolve(profiles.length > 0 ? profiles[0] : null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Bible Verses (for offline Bible access)
  async saveBibleVerses(verses: any[]): Promise<void> {
    const store = await this.getStore("bibleVerses", "readwrite")

    for (const verse of verses) {
      await store.put(verse)
    }
  }

  async getBibleVerses(book?: string, chapter?: number): Promise<any[]> {
    const store = await this.getStore("bibleVerses")
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        let verses = request.result

        if (book) {
          verses = verses.filter((v) => v.book === book)
        }

        if (chapter) {
          verses = verses.filter((v) => v.chapter === chapter)
        }

        resolve(verses)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Pending Sync Operations
  async addPendingAttendance(attendanceData: any): Promise<void> {
    const store = await this.getStore("pendingAttendance", "readwrite")
    await store.add({
      data: attendanceData,
      timestamp: Date.now(),
    })
  }

  async addPendingMemberUpdate(updateData: any, method: "POST" | "PUT" | "DELETE", memberId?: string): Promise<void> {
    const store = await this.getStore("pendingMemberUpdates", "readwrite")
    await store.add({
      data: updateData,
      method,
      memberId,
      timestamp: Date.now(),
    })
  }

  async addPendingEventUpdate(updateData: any, method: "POST" | "PUT" | "DELETE", eventId?: string): Promise<void> {
    const store = await this.getStore("pendingEventUpdates", "readwrite")
    await store.add({
      data: updateData,
      method,
      eventId,
      timestamp: Date.now(),
    })
  }

  async getPendingSync(): Promise<PendingSync[]> {
    const [attendance, memberUpdates, eventUpdates] = await Promise.all([
      this.getStore("pendingAttendance").then(
        (store) =>
          new Promise<any[]>((resolve, reject) => {
            const request = store.getAll()
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
          }),
      ),
      this.getStore("pendingMemberUpdates").then(
        (store) =>
          new Promise<any[]>((resolve, reject) => {
            const request = store.getAll()
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
          }),
      ),
      this.getStore("pendingEventUpdates").then(
        (store) =>
          new Promise<any[]>((resolve, reject) => {
            const request = store.getAll()
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
          }),
      ),
    ])

    return [
      ...attendance.map((item) => ({ ...item, type: "attendance" as const })),
      ...memberUpdates.map((item) => ({ ...item, type: "member_update" as const })),
      ...eventUpdates.map((item) => ({ ...item, type: "event_update" as const })),
    ]
  }

  async clearPendingSync(type: "attendance" | "member_update", id: number): Promise<void> {
    const storeName = type === "attendance" ? "pendingAttendance" : "pendingMemberUpdates"
    const store = await this.getStore(storeName, "readwrite")
    await store.delete(id)
  }

  // Settings
  async saveSetting(key: string, value: any): Promise<void> {
    const store = await this.getStore("appSettings", "readwrite")
    await store.put({ key, value })
  }

  async getSetting(key: string): Promise<any> {
    const store = await this.getStore("appSettings")
    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result?.value)
      request.onerror = () => reject(request.error)
    })
  }

  private async updateLastSync(type: string): Promise<void> {
    await this.saveSetting(`lastSync_${type}`, Date.now())
  }

  async getLastSync(type: string): Promise<number> {
    return (await this.getSetting(`lastSync_${type}`)) || 0
  }

  // Clear all offline data
  async clearAllData(): Promise<void> {
    if (!this.db) return

    const storeNames = ["members", "events", "userProfile", "bibleVerses", "appSettings"]

    for (const storeName of storeNames) {
      const store = await this.getStore(storeName, "readwrite")
      await store.clear()
    }
  }
}

export const offlineStorage = new OfflineStorageService()
