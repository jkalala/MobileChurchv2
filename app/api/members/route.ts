import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
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

export async function GET() {
  try {
    const members = await DatabaseService.getMembers()
    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    // RBAC: Only admin or pastor can create members
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin" && role !== "pastor") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }
    const memberData = await request.json()
    const newMember = await DatabaseService.createMember({ ...memberData, created_by: user.id })
    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error("Error creating member:", error)
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    // RBAC: Only admin can update members
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }
    const { id, ...memberData } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
    }
    const updatedMember = await DatabaseService.updateMember(id, memberData)
    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error("Error updating member:", error)
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    // RBAC: Only admin can delete members
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
    }
    await DatabaseService.deleteMember(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting member:", error)
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 })
  }
}
