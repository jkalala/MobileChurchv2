import { DatabaseService } from "./database"
import { AIClient } from "./ai-client"

export interface EmailTemplate {
  id: string
  type: "pastoral_care" | "welcome" | "follow_up" | "event_invitation" | "newsletter" | "birthday"
  subject: string
  content: string
  variables: string[]
  tone: "formal" | "casual" | "warm" | "professional"
}

export interface GeneratedEmail {
  to: string
  subject: string
  content: string
  type: string
  personalizations: Record<string, string>
}

export class AIEmailService {
  static async generatePersonalizedEmail(
    memberId: string,
    emailType: EmailTemplate["type"],
    customContext?: Record<string, string>,
  ): Promise<GeneratedEmail> {
    try {
      const member = await DatabaseService.getMemberById(memberId)
      const churchInfo = await DatabaseService.getChurchInfo()

      if (!member) {
        throw new Error("Member not found")
      }

      const systemPrompt = `You are an AI assistant helping to write personalized church emails. Write warm, caring, and appropriate emails for church members. Match the tone to the email type and make it personal but professional.`

      const memberContext = `
        Member: ${member.first_name} ${member.last_name}
        Email: ${member.email}
        Member Status: ${member.member_status}
        Join Date: ${member.join_date}
        Church: ${churchInfo.name}
        Pastor: ${churchInfo.pastor_name}
      `

      let prompt = ""
      let subject = ""

      switch (emailType) {
        case "pastoral_care":
          subject = `We Miss You at ${churchInfo.name}`
          prompt = `Write a caring pastoral email to ${member.first_name} who hasn't been attending church recently. Express that they are missed, offer support, and invite them back warmly. Include upcoming events if relevant. Keep it personal and non-judgmental.`
          break

        case "welcome":
          subject = `Welcome to the ${churchInfo.name} Family!`
          prompt = `Write a warm welcome email to ${member.first_name} who just joined our church. Express joy about them joining, provide next steps for getting connected, mention new member orientation, and suggest ministries they might enjoy.`
          break

        case "birthday":
          subject = `Birthday Blessings for You, ${member.first_name}!`
          prompt = `Write a heartfelt birthday email to ${member.first_name}. Include birthday wishes, a blessing or prayer, mention how they contribute to the church community, and include an inspirational Bible verse.`
          break

        case "event_invitation":
          subject = `Special Invitation for You, ${member.first_name}`
          prompt = `Write an inviting email to ${member.first_name} about an upcoming church event. Make it personal, explain why they would enjoy it, and include event details. Make them feel specially invited.`
          break

        case "follow_up":
          subject = `Following Up with You`
          prompt = `Write a gentle follow-up email to ${member.first_name}. Check on their wellbeing, ask if they need any support, and remind them they are valued in the church community.`
          break

        default:
          subject = `A Message from ${churchInfo.name}`
          prompt = `Write a general church communication email to ${member.first_name}. Keep it warm and informative.`
      }

      const fullPrompt = `
        ${memberContext}
        
        Email Type: ${emailType}
        Custom Context: ${JSON.stringify(customContext || {})}
        
        ${prompt}
        
        Write a complete email with:
        1. Appropriate greeting
        2. Main message (2-3 paragraphs)
        3. Call to action or next steps
        4. Warm closing
        5. Signature from Pastor ${churchInfo.pastor_name}
        
        Keep it between 150-300 words. Make it personal and caring.
      `

      const emailContent = await AIClient.generateText(fullPrompt, systemPrompt)

      // Generate subject line if needed
      if (!subject || customContext?.subject) {
        const subjectPrompt = `Generate a warm, personal email subject line for this ${emailType} email to ${member.first_name}. Keep it under 50 characters and make it engaging.`
        subject = customContext?.subject || (await AIClient.generateText(subjectPrompt, systemPrompt))
      }

      return {
        to: member.email,
        subject: subject.replace(/"/g, "").trim(),
        content: emailContent,
        type: emailType,
        personalizations: {
          first_name: member.first_name,
          church_name: churchInfo.name,
          pastor_name: churchInfo.pastor_name,
          ...customContext,
        },
      }
    } catch (error) {
      console.error("Error generating personalized email:", error)
      throw error
    }
  }

  static async generateBulkEmails(
    memberIds: string[],
    emailType: EmailTemplate["type"],
    customContext?: Record<string, string>,
  ): Promise<GeneratedEmail[]> {
    const emails: GeneratedEmail[] = []

    for (const memberId of memberIds) {
      try {
        const email = await this.generatePersonalizedEmail(memberId, emailType, customContext)
        emails.push(email)

        // Add small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error generating email for member ${memberId}:`, error)
      }
    }

    return emails
  }

  static async generateNewsletterContent(theme: string, events: any[], announcements: string[] = []) {
    try {
      const systemPrompt = `You are an AI assistant helping to write church newsletters. Create engaging, informative, and spiritually uplifting content that connects with the congregation.`

      const prompt = `
        Create a church newsletter section with theme: "${theme}"
        
        Upcoming Events:
        ${events.map((e) => `- ${e.title} on ${new Date(e.event_date).toLocaleDateString()}: ${e.description}`).join("\n")}
        
        Announcements:
        ${announcements.join("\n")}
        
        Write a newsletter section that includes:
        1. Opening message related to the theme
        2. Event highlights with engaging descriptions
        3. Community announcements
        4. Inspirational closing thought
        5. Call to action for engagement
        
        Keep it warm, informative, and around 300-400 words.
      `

      return await AIClient.generateText(prompt, systemPrompt)
    } catch (error) {
      console.error("Error generating newsletter content:", error)
      return "Newsletter content unavailable. Please check back later."
    }
  }
}
