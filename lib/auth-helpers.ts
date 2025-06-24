import { type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase-client"

export async function getUserRoleFromRequest(request: NextRequest): Promise<string | null> {
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
    const [k, ...v] = c.trim().split('=')
    return [k, decodeURIComponent(v.join('='))]
  }))
  const accessToken = cookies["sb-access-token"] || cookies["access_token"]
  if (!accessToken) return null
  const supabase = createServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
  if (userError || !user) return null
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("user_id", user.id)
    .single()
  if (profileError || !profile) return null
  return profile.role || null
} 