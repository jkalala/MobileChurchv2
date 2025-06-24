import { createClient } from "@/lib/supabase"

export interface UserPermissions {
  manage_users: boolean
  manage_finances: boolean
  manage_events: boolean
  manage_members: boolean
  manage_settings: boolean
  view_analytics: boolean
  manage_departments: boolean
  manage_streaming: boolean
  manage_pastoral_care: boolean
  super_admin: boolean
}

export interface UserProfile {
  id: string
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  role: "admin" | "pastor" | "leader" | "member"
  church_name?: string
  phone?: string
  profile_image?: string
  permissions?: UserPermissions
  created_at: string
  updated_at: string
}

// Mock user database for authentication
const MOCK_USERS = [
  {
    id: "admin-user-123",
    email: "joaquim.kalala@gmail.com",
    password: "Angola@2025", // In real app, this would be hashed
    profile: {
      id: "profile-admin-123",
      user_id: "admin-user-123",
      email: "joaquim.kalala@gmail.com",
      first_name: "Joaquim",
      last_name: "Kalala",
      role: "admin" as const,
      church_name: "Igreja Semente Bendita",
      phone: "+244 923 456 789",
      profile_image: "/placeholder-user.jpg",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "member-user-456",
    email: "member@church.com",
    password: "password123",
    profile: {
      id: "profile-member-456",
      user_id: "member-user-456",
      email: "member@church.com",
      first_name: "John",
      last_name: "Doe",
      role: "member" as const,
      church_name: "Igreja Semente Bendita",
      phone: "+244 912 345 678",
      profile_image: "/placeholder-user.jpg",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
]

export class AuthService {
  private static supabase = createClient()
  private static currentSession: { user: any; profile: UserProfile } | null = null

  static async signIn(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: any; profile?: UserProfile; error?: string }> {
    try {
      // Find user in mock database
      const mockUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!mockUser) {
        return { success: false, error: "User not found" }
      }

      // Validate password
      if (mockUser.password !== password) {
        return { success: false, error: "Invalid password" }
      }

      // Get user permissions
      const permissions = await this.getUserPermissions(mockUser.id)

      const userProfile = {
        ...mockUser.profile,
        permissions,
      }

      // Store session
      this.currentSession = {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: "authenticated",
          app_metadata: { provider: "email" },
        },
        profile: userProfile,
      }

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_session", JSON.stringify(this.currentSession))
      }

      return {
        success: true,
        user: this.currentSession.user,
        profile: this.currentSession.profile,
      }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, error: "Authentication failed" }
    }
  }

  static async signOut(): Promise<void> {
    try {
      // Clear session
      this.currentSession = null

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_session")
      }
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  static async getCurrentUser(): Promise<{ user: any; profile: UserProfile | null }> {
    try {
      // Check if we have a current session
      if (this.currentSession) {
        return this.currentSession
      }

      // Try to restore from localStorage
      if (typeof window !== "undefined") {
        const storedSession = localStorage.getItem("auth_session")
        if (storedSession) {
          this.currentSession = JSON.parse(storedSession)
          return this.currentSession!
        }
      }

      return { user: null, profile: null }
    } catch (error) {
      console.error("Error getting current user:", error)
      return { user: null, profile: null }
    }
  }

  static async createUserProfile(user: any): Promise<UserProfile | null> {
    try {
      // Check if this is the admin user
      const isAdmin = user.email === "joaquim.kalala@gmail.com"

      const profileData = {
        user_id: user.id,
        email: user.email,
        first_name: isAdmin ? "Joaquim" : user.user_metadata?.first_name || null,
        last_name: isAdmin ? "Kalala" : user.user_metadata?.last_name || null,
        role: isAdmin ? "admin" : "member",
        church_name: isAdmin ? "Igreja Semente Bendita" : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // In a real app, this would save to database
      console.log("Creating profile:", profileData)

      // If admin, grant all permissions
      if (isAdmin) {
        await this.grantAdminPermissions(user.id)
      }

      return profileData as UserProfile
    } catch (error) {
      console.error("Error creating user profile:", error)
      return null
    }
  }

  static async getUserPermissions(userId: string): Promise<UserPermissions> {
    try {
      // For admin user, return all permissions
      if (userId === "admin-user-123") {
        return {
          manage_users: true,
          manage_finances: true,
          manage_events: true,
          manage_members: true,
          manage_settings: true,
          view_analytics: true,
          manage_departments: true,
          manage_streaming: true,
          manage_pastoral_care: true,
          super_admin: true,
        }
      }

      // For other users, return limited permissions
      return this.getDefaultPermissions()
    } catch (error) {
      console.error("Error getting user permissions:", error)
      return this.getDefaultPermissions()
    }
  }

  static async grantAdminPermissions(userId: string): Promise<void> {
    try {
      console.log("Granting admin permissions to:", userId)
      // In a real app, this would update the database
    } catch (error) {
      console.error("Error granting admin permissions:", error)
    }
  }

  static getDefaultPermissions(): UserPermissions {
    return {
      manage_users: false,
      manage_finances: false,
      manage_events: false,
      manage_members: false,
      manage_settings: false,
      view_analytics: false,
      manage_departments: false,
      manage_streaming: false,
      manage_pastoral_care: false,
      super_admin: false,
    }
  }

  static hasPermission(permissions: UserPermissions, permission: keyof UserPermissions): boolean {
    return permissions[permission] || permissions.super_admin
  }

  static isAdmin(profile: UserProfile | null): boolean {
    return profile?.role === "admin" || profile?.permissions?.super_admin === true
  }
}

export default AuthService
