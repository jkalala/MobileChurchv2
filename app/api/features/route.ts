import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-client"
import { getUserRoleFromRequest } from "@/lib/auth-helpers"

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data: features, error } = await supabase.from("features").select("*").order("name")
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ features })
  } catch {
    return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const { name, enabled, roles, description } = await request.json()
    if (!name) return NextResponse.json({ error: "Missing feature name" }, { status: 400 })
    const supabase = createServerClient()
    const { error } = await supabase
      .from("features")
      .update({ enabled, roles, description, updated_at: new Date().toISOString() })
      .eq("name", name)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update feature" }, { status: 500 })
  }
} 