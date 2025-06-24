import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-client"
import { getUserRoleFromRequest } from "@/lib/auth-helpers"

export async function GET(request: NextRequest) {
  try {
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const supabase = createServerClient()
    let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false })
    if (action) query = query.eq("action", action)
    if (limit) query = query.limit(limit)
    const { data: logs, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ logs })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
} 