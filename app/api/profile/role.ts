import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-client"
import { getUserRoleFromRequest } from "@/lib/auth-helpers"

export async function POST(request: NextRequest) {
  try {
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const { userId, role: newRole } = await request.json()
    if (!userId || !newRole) {
      return NextResponse.json({ error: "Missing userId or role" }, { status: 400 })
    }
    const supabase = createServerClient()
    // Fetch old role for audit log
    const { data: oldProfile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", userId)
      .single()
    // Update role
    const { error } = await supabase
      .from("user_profiles")
      .update({ role: newRole })
      .eq("id", userId)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    // Insert audit log
    await supabase.from("audit_logs").insert({
      user_id: role,
      action: "update_role",
      target_id: userId,
      target_type: "user",
      details: { oldRole: oldProfile?.role, newRole },
      created_at: new Date().toISOString(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
} 