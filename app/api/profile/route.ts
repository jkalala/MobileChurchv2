import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-client"
import { getUserRoleFromRequest } from "@/lib/auth-helpers"

// Helper to extract access token from cookies
function getAccessToken(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
    const [k, ...v] = c.trim().split('=')
    return [k, decodeURIComponent(v.join('='))]
  }))
  return cookies["sb-access-token"] || cookies["access_token"]
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const all = searchParams.get("all")
    if (all === "true") {
      // RBAC: Only admin can list all users
      const role = await getUserRoleFromRequest(request)
      if (role !== "admin") {
        return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
      }
      const { data: users, error: usersError } = await supabase
        .from("user_profiles")
        .select("id, first_name, last_name, email, role")
      if (usersError) {
        return NextResponse.json({ error: usersError.message }, { status: 500 })
      }
      return NextResponse.json({ users })
    }
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }
    return NextResponse.json(profile)
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json({ error: "Failed to get profile information" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }
    const body = await request.json()
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .insert({ ...body, user_id: user.id, email: user.email })
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(profile)
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }
    const body = await request.json()
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(profile)
  } catch (error) {
    console.error("Profile API error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
