export interface UserProfile {
  id: string
  email: string
  full_name?: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  role?: "admin" | "pastor" | "leader" | "member"
  department_id?: string
  date_of_birth?: string
  address?: string
  emergency_contact?: string
  emergency_phone?: string
  membership_status?: "active" | "inactive" | "pending"
  joined_date?: string
  created_at: string
  updated_at: string
}

export interface CreateProfileRequest {
  full_name?: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  role?: "admin" | "pastor" | "leader" | "member"
  department_id?: string
  date_of_birth?: string
  address?: string
  emergency_contact?: string
  emergency_phone?: string
  membership_status?: "active" | "inactive" | "pending"
  joined_date?: string
}

export interface UpdateProfileRequest {
  full_name?: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  role?: "admin" | "pastor" | "leader" | "member"
  department_id?: string
  date_of_birth?: string
  address?: string
  emergency_contact?: string
  emergency_phone?: string
  membership_status?: "active" | "inactive" | "pending"
  joined_date?: string
}
