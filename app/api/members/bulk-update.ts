import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
import { createServerClient } from "@/lib/supabase-client"
import { getUserRoleFromRequest } from "@/lib/auth-helpers"

export async function POST(request: NextRequest) {
  try {
    const { memberIds, status, department } = await request.json()
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json({ error: "No member IDs provided" }, { status: 400 })
    }
    if (!status && !department) {
      return NextResponse.json({ error: "No update field provided" }, { status: 400 })
    }
    // RBAC: Only admin can bulk update
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const updates: any = {}
    if (status) updates.member_status = status
    if (department) updates.department = department
    await DatabaseService.bulkUpdateMembers(memberIds, updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Bulk update error:", error)
    return NextResponse.json({ error: "Failed to bulk update members" }, { status: 500 })
  }
} 