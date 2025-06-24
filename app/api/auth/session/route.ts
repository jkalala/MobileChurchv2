import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  try {
    // Extract the access token from cookies
    const cookieHeader = request.headers.get("cookie") || ""
    const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=')
      return [k, decodeURIComponent(v.join('='))]
    }))
    const accessToken = cookies["sb-access-token"] || cookies["access_token"]

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Create Supabase server client
    const supabase = createServerClient()
    // Validate the session
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)

    if (error || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }

    // Return user session info
    return NextResponse.json({
      user_id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      provider: user.app_metadata?.provider || "email",
      role: user.role || "authenticated",
      session_id: accessToken,
    })
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json(
      {
        error: "Failed to get session information",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: "Method not implemented",
    },
    { status: 501 },
  )
}
