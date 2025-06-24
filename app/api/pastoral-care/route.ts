import { type NextRequest, NextResponse } from "next/server"
import { PastoralCareService } from "@/lib/pastoral-care-service"
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
    const filters = Object.fromEntries(searchParams.entries())

    let data
    switch (type) {
      case "care-records":
        data = await PastoralCareService.getCareRecords(filters)
        break
      case "prayer-requests":
        data = await PastoralCareService.getPrayerRequests(filters)
        break
      case "crisis-alerts":
        data = await PastoralCareService.getCrisisAlerts(filters.status)
        break
      case "care-team":
        data = await PastoralCareService.getCareTeamMembers()
        break
      case "metrics":
        data = await PastoralCareService.getCareMetrics()
        break
      case "insights":
        data = await PastoralCareService.generateCareInsights()
        break
      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Pastoral care API error:", error)
    return NextResponse.json({ error: "Failed to fetch pastoral care data" }, { status: 500 })
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

    let result
    switch (type) {
      case "care-record":
        result = await PastoralCareService.createCareRecord(data)
        break
      case "prayer-request":
        result = await PastoralCareService.createPrayerRequest(data)
        break
      case "crisis-alert":
        result = await PastoralCareService.createCrisisAlert(data)
        break
      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Pastoral care API error:", error)
    return NextResponse.json({ error: "Failed to create pastoral care record" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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
    const { id, type, data } = body

    let result
    switch (type) {
      case "care-record":
        result = await PastoralCareService.updateCareRecord(id, data)
        break
      case "assign-care":
        await PastoralCareService.assignCareRecord(id, data.careTeamMemberId)
        result = { success: true }
        break
      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Pastoral care API error:", error)
    return NextResponse.json({ error: "Failed to update pastoral care record" }, { status: 500 })
  }
}
