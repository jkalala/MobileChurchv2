import { EmailService } from "@/lib/email-service"

export async function sendInvitationEmail(email: string, token: string, role: string) {
  const signupUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/onboarding/accept?token=${token}`
  const subject = "You're invited to join MobileChurch!"
  const html = `
    <h2>Welcome to MobileChurch</h2>
    <p>You have been invited to join as a <b>${role}</b>.</p>
    <p>Click the link below to set up your account:</p>
    <a href="${signupUrl}">${signupUrl}</a>
    <p>This link will expire in 7 days.</p>
  `
  await EmailService.sendEmail({ to: email, subject, html, text: `Signup link: ${signupUrl}` })
} 