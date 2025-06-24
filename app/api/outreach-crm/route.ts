import { type NextRequest, NextResponse } from "next/server"
import { OutreachCRMService } from "@/lib/outreach-crm-service"
import { createServerClient } from "@/lib/supabase-client"

// Helper to extract access token from cookies
function getAccessToken(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
    const [k, ...v] = c.trim().split('=')
    return [k, decodeURIComponent(v.join('='))]
  }))
  return cookies["sb-access-token"] || cookies["access_token"]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    switch (type) {
      case "contacts":
        const contacts = await OutreachCRMService.getCommunityContacts()
        return NextResponse.json({ success: true, data: contacts })

      case "programs":
        const programs = await OutreachCRMService.getOutreachPrograms()
        return NextResponse.json({ success: true, data: programs })

      case "events":
        const events = await OutreachCRMService.getOutreachEvents()
        return NextResponse.json({ success: true, data: events })

      case "volunteers":
        const volunteers = await OutreachCRMService.getVolunteerProfiles()
        return NextResponse.json({ success: true, data: volunteers })

      case "partnerships":
        const partnerships = await OutreachCRMService.getCommunityPartnerships()
        return NextResponse.json({ success: true, data: partnerships })

      case "analytics":
        const analytics = await OutreachCRMService.getOutreachAnalytics()
        return NextResponse.json({ success: true, data: analytics })

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case "contact":
        const contact = await OutreachCRMService.createCommunityContact(data)
        return NextResponse.json({ success: true, data: contact })

      case "program":
        const program = await OutreachCRMService.createOutreachProgram(data)
        return NextResponse.json({ success: true, data: program })

      case "event":
        const event = await OutreachCRMService.createOutreachEvent(data)
        return NextResponse.json({ success: true, data: event })

      case "volunteer":
        const volunteer = await OutreachCRMService.createVolunteerProfile(data)
        return NextResponse.json({ success: true, data: volunteer })

      case "partnership":
        const partnership = await OutreachCRMService.createCommunityPartnership(data)
        return NextResponse.json({ success: true, data: partnership })

      case "interaction":
        const interaction = await OutreachCRMService.recordOutreachInteraction(data)
        return NextResponse.json({ success: true, data: interaction })

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
