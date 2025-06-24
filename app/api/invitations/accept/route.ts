import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    if (!token) return NextResponse.json({ valid: false, error: "Missing token" }, { status: 400 })
    const supabase = createServerClient()
    const { data: invitation } = await supabase
      .from("invitations")
      .select("*")
      .eq("token", token)
      .single()
    if (!invitation || invitation.status !== "pending" || new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: "Invalid or expired invitation" }, { status: 400 })
    }
    return NextResponse.json({ valid: true, email: invitation.email, role: invitation.role })
  } catch {
    return NextResponse.json({ valid: false, error: "Failed to validate invitation" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, password, firstName, lastName, phone, department, churchName, profileImage } = await request.json()
    if (!token || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const supabase = createServerClient()
    // Validate invitation
    const { data: invitation } = await supabase
      .from("invitations")
      .select("*")
      .eq("token", token)
      .single()
    if (!invitation || invitation.status !== "pending" || new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 400 })
    }
    // Create user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email: invitation.email,
      password,
      user_metadata: { first_name: firstName, last_name: lastName },
      email_confirm: true,
    })
    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 500 })
    }
    // Update user_profiles with role and extra fields
    await supabase
      .from("user_profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        role: invitation.role,
        phone: phone || null,
        department: department || null,
        church_name: churchName || null,
        profile_image: profileImage || null, // TODO: Store in real storage
      })
      .eq("id", signUpData.user.id)
    // Mark invitation as accepted
    await supabase
      .from("invitations")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", invitation.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to complete signup" }, { status: 500 })
  }
} 