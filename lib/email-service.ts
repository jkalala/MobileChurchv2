interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  churchName?: string
  department?: string
  bio?: string
  experience?: string
  references?: string
}

interface EmailTemplate {
  to: string
  subject: string
  html: string
  text: string
}

export class EmailService {
  private static ADMIN_EMAIL = "joaquim.kalala@gmail.com"
  private static CHURCH_NAME = "Igreja Semente Bendita"

  static async sendSignupNotification(signupData: SignupRequest): Promise<boolean> {
    try {
      const template = this.generateSignupNotificationTemplate(signupData)

      // In a real implementation, you would use a service like:
      // - Resend
      // - SendGrid
      // - Nodemailer with SMTP
      // - AWS SES

      // For now, we'll simulate the email sending
      console.log("📧 Sending signup notification email...")
      console.log("To:", template.to)
      console.log("Subject:", template.subject)
      console.log("HTML Content:", template.html)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In production, replace this with actual email service
      const emailSent = await this.mockEmailSend(template)

      if (emailSent) {
        console.log("✅ Signup notification sent successfully to admin")
        return true
      } else {
        console.error("❌ Failed to send signup notification")
        return false
      }
    } catch (error) {
      console.error("Error sending signup notification:", error)
      return false
    }
  }

  static async sendApprovalConfirmation(userEmail: string, userName: string, role: string): Promise<boolean> {
    try {
      const template = this.generateApprovalTemplate(userEmail, userName, role)

      console.log("📧 Sending approval confirmation email...")
      console.log("To:", template.to)
      console.log("Subject:", template.subject)

      const emailSent = await this.mockEmailSend(template)

      if (emailSent) {
        console.log("✅ Approval confirmation sent successfully")
        return true
      } else {
        console.error("❌ Failed to send approval confirmation")
        return false
      }
    } catch (error) {
      console.error("Error sending approval confirmation:", error)
      return false
    }
  }

  static async sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
    // For now, use mockEmailSend
    await this.mockEmailSend({ to, subject, html, text: text || "" })
    return true
  }

  private static generateSignupNotificationTemplate(data: SignupRequest): EmailTemplate {
    const roleInfo = this.getRoleInfo(data.role)

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Signup Request - ${this.CHURCH_NAME}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 8px 0 0; opacity: 0.9; }
          .content { padding: 30px; }
          .role-badge { display: inline-block; background: ${roleInfo.color}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
          .info-grid { display: grid; gap: 15px; margin: 20px 0; }
          .info-item { border-left: 4px solid #3b82f6; padding-left: 15px; }
          .info-label { font-weight: 600; color: #374151; font-size: 14px; margin-bottom: 4px; }
          .info-value { color: #6b7280; }
          .section { margin: 25px 0; padding: 20px; background: #f8fafc; border-radius: 8px; }
          .section h3 { margin: 0 0 15px; color: #374151; font-size: 16px; }
          .actions { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; padding: 12px 24px; margin: 0 8px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; }
          .btn-approve { background: #10b981; color: white; }
          .btn-review { background: #6b7280; color: white; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Signup Request</h1>
            <p>${this.CHURCH_NAME} - Admin Notification</p>
          </div>
          
          <div class="content">
            <div class="role-badge">${roleInfo.name}</div>
            
            <p>A new user has signed up and is requesting access to the church management system.</p>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Full Name</div>
                <div class="info-value">${data.firstName} ${data.lastName}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Email Address</div>
                <div class="info-value">${data.email}</div>
              </div>
              
              ${
                data.phone
                  ? `
              <div class="info-item">
                <div class="info-label">Phone Number</div>
                <div class="info-value">${data.phone}</div>
              </div>
              `
                  : ""
              }
              
              <div class="info-item">
                <div class="info-label">Requested Role</div>
                <div class="info-value">${roleInfo.name}</div>
              </div>
              
              ${
                data.department
                  ? `
              <div class="info-item">
                <div class="info-label">Department/Ministry</div>
                <div class="info-value">${data.department}</div>
              </div>
              `
                  : ""
              }
              
              ${
                data.churchName
                  ? `
              <div class="info-item">
                <div class="info-label">Church Name</div>
                <div class="info-value">${data.churchName}</div>
              </div>
              `
                  : ""
              }
            </div>
            
            ${
              data.bio
                ? `
            <div class="section">
              <h3>📝 Bio</h3>
              <p>${data.bio}</p>
            </div>
            `
                : ""
            }
            
            ${
              data.experience
                ? `
            <div class="section">
              <h3>💼 Experience</h3>
              <p>${data.experience}</p>
            </div>
            `
                : ""
            }
            
            ${
              data.references
                ? `
            <div class="section">
              <h3>👥 References</h3>
              <p>${data.references}</p>
            </div>
            `
                : ""
            }
            
            <div class="section">
              <h3>🔐 Role Permissions</h3>
              <ul>
                ${roleInfo.permissions.map((permission) => `<li>${permission}</li>`).join("")}
              </ul>
            </div>
            
            <div class="actions">
              <a href="mailto:${data.email}?subject=Account%20Approved%20-%20${this.CHURCH_NAME}&body=Dear%20${data.firstName},%0A%0AYour%20account%20has%20been%20approved!%20You%20can%20now%20access%20the%20church%20management%20system.%0A%0ABlessings,%0AAdministrator" class="btn btn-approve">
                ✅ Approve & Email User
              </a>
              <a href="https://your-church-app.com/admin/users" class="btn btn-review">
                👀 Review in Admin Panel
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>This notification was sent from ${this.CHURCH_NAME} Church Management System</p>
            <p>Received: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
New Signup Request - ${this.CHURCH_NAME}

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ""}
Role: ${roleInfo.name}
${data.department ? `Department: ${data.department}` : ""}
${data.churchName ? `Church: ${data.churchName}` : ""}

${data.bio ? `Bio: ${data.bio}` : ""}
${data.experience ? `Experience: ${data.experience}` : ""}
${data.references ? `References: ${data.references}` : ""}

Role Permissions:
${roleInfo.permissions.map((p) => `- ${p}`).join("\n")}

Please review and approve this request in the admin panel.
    `

    return {
      to: this.ADMIN_EMAIL,
      subject: `🔔 New ${roleInfo.name} Signup Request - ${data.firstName} ${data.lastName}`,
      html,
      text,
    }
  }

  private static generateApprovalTemplate(userEmail: string, userName: string, role: string): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Approved - ${this.CHURCH_NAME}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 30px; text-align: center; }
          .btn { display: inline-block; padding: 15px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Account Approved!</h1>
          </div>
          
          <div class="content">
            <h2>Welcome to ${this.CHURCH_NAME}!</h2>
            <p>Dear ${userName},</p>
            <p>Great news! Your account has been approved and you now have access to our church management system as a <strong>${role}</strong>.</p>
            
            <a href="https://your-church-app.com/auth" class="btn">Sign In to Your Account</a>
            
            <p>If you have any questions, please don't hesitate to reach out.</p>
            <p>Blessings,<br>Administrator</p>
          </div>
          
          <div class="footer">
            <p>${this.CHURCH_NAME} Church Management System</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
Account Approved - ${this.CHURCH_NAME}

Dear ${userName},

Great news! Your account has been approved and you now have access to our church management system as a ${role}.

You can sign in at: https://your-church-app.com/auth

If you have any questions, please don't hesitate to reach out.

Blessings,
Administrator

${this.CHURCH_NAME} Church Management System
    `

    return {
      to: userEmail,
      subject: `🎉 Account Approved - Welcome to ${this.CHURCH_NAME}!`,
      html,
      text,
    }
  }

  private static getRoleInfo(roleId: string) {
    const roles: Record<string, { name: string; color: string; permissions: string[] }> = {
      member: {
        name: "Member",
        color: "#3b82f6",
        permissions: ["View events", "Join groups", "Access resources", "Submit prayer requests"],
      },
      volunteer: {
        name: "Volunteer",
        color: "#10b981",
        permissions: [
          "Member permissions",
          "Volunteer for events",
          "Access volunteer resources",
          "Join ministry teams",
        ],
      },
      ministry_leader: {
        name: "Ministry Leader",
        color: "#8b5cf6",
        permissions: [
          "Volunteer permissions",
          "Manage ministry members",
          "Create ministry events",
          "Access ministry analytics",
        ],
      },
      worship_leader: {
        name: "Worship Leader",
        color: "#ec4899",
        permissions: ["Ministry permissions", "Manage worship sets", "Schedule musicians", "Access music library"],
      },
      pastor: {
        name: "Pastor/Elder",
        color: "#6366f1",
        permissions: ["Leadership permissions", "Pastoral care access", "Sermon management", "Member counseling"],
      },
      admin: {
        name: "Administrator",
        color: "#ef4444",
        permissions: ["All permissions", "User management", "System settings", "Financial management"],
      },
    }

    return roles[roleId] || roles.member
  }

  private static async mockEmailSend(template: EmailTemplate): Promise<boolean> {
    // In production, replace this with actual email service
    // Example with Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const { data, error } = await resend.emails.send({
      from: 'noreply@your-church.com',
      to: template.to,
      subject: template.subject,
      html: template.html,
    })
    
    return !error
    */

    // Mock implementation
    return Math.random() > 0.1 // 90% success rate for demo
  }
}

export default EmailService
