export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          church_name: string | null
          role: string | null
          profile_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          church_name?: string | null
          role?: string | null
          profile_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          church_name?: string | null
          role?: string | null
          profile_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      members: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
