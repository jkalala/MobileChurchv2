import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-client"
import { getUserRoleFromRequest } from "@/lib/auth-helpers"
import { randomBytes } from "crypto"
import { sendInvitationEmail } from "../../lib/invitation-email"

function generateToken() {
  return randomBytes(32).toString("hex")
}

export async function POST(request: NextRequest) {
  try {
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const { email, role: inviteRole } = await request.json()
    if (!email || !inviteRole) {
      return NextResponse.json({ error: "Missing email or role" }, { status: 400 })
    }
    const token = generateToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    const supabase = createServerClient()
    const { error } = await supabase
      .from("invitations")
      .insert({ email, role: inviteRole, token, expires_at: expiresAt })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    await sendInvitationEmail(email, token, inviteRole)
    // TODO: Send invitation email with token
    return NextResponse.json({ success: true, token })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
  }
} 