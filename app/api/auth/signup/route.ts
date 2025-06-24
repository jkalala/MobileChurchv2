import { type NextRequest, NextResponse } from "next/server"
import EmailService from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const signupData = await request.json()

    // Validate required fields
    if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if role requires approval
    const rolesRequiringApproval = ["volunteer", "ministry_leader", "worship_leader", "pastor", "admin"]
    const requiresApproval = rolesRequiringApproval.includes(signupData.role)

    // In a real implementation, you would:
    // 1. Create user account in database
    // 2. Set status to "pending" if approval required
    // 3. Send confirmation email to user

    console.log("📝 Processing signup request:", {
      name: `${signupData.firstName} ${signupData.lastName}`,
      email: signupData.email,
      role: signupData.role,
      requiresApproval,
    })

    // Send notification to admin if approval required
    if (requiresApproval) {
      const emailSent = await EmailService.sendSignupNotification(signupData)

      if (emailSent) {
        return NextResponse.json({
          success: true,
          message: "Signup request submitted successfully. Admin has been notified.",
          requiresApproval: true,
          status: "pending_approval",
        })
      } else {
        return NextResponse.json({
          success: true,
          message: "Account created but admin notification failed. Please contact administrator.",
          requiresApproval: true,
          status: "pending_approval",
        })
      }
    } else {
      // Member role - immediate access
      return NextResponse.json({
        success: true,
        message: "Account created successfully! You can now sign in.",
        requiresApproval: false,
        status: "approved",
      })
    }
  } catch (error) {
    console.error("Signup API error:", error)
    return NextResponse.json({ error: "Failed to process signup request" }, { status: 500 })
  }
}
