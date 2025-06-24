import { type NextRequest, NextResponse } from "next/server"
import EmailService from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, userName, role, approved } = await request.json()

    // Validate admin permissions (in real implementation)
    // const currentUser = await getCurrentUser()
    // if (!currentUser || currentUser.role !== 'admin') {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    // }

    if (approved) {
      // Update user status in database
      // await updateUserStatus(userId, 'approved')

      // Send approval email to user
      const emailSent = await EmailService.sendApprovalConfirmation(userEmail, userName, role)

      console.log(`✅ User ${userName} (${userEmail}) approved for role: ${role}`)

      return NextResponse.json({
        success: true,
        message: `User ${userName} has been approved and notified.`,
        emailSent,
      })
    } else {
      // Handle rejection
      // await updateUserStatus(userId, 'rejected')

      console.log(`❌ User ${userName} (${userEmail}) rejected for role: ${role}`)

      return NextResponse.json({
        success: true,
        message: `User ${userName} has been rejected.`,
      })
    }
  } catch (error) {
    console.error("User approval API error:", error)
    return NextResponse.json({ error: "Failed to process user approval" }, { status: 500 })
  }
}
