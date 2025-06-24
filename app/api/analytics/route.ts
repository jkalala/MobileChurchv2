import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
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
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }

    // Aggregate analytics
    const [attendanceStats, financialSummary, members, events] = await Promise.all([
      DatabaseService.getAttendanceStats(),
      DatabaseService.getFinancialSummary(),
      DatabaseService.getMembers(),
      DatabaseService.getEvents(),
    ])

    // Example engagement stats
    const activeMembers = members.filter((m: any) => m.member_status === "active").length
    const inactiveMembers = members.filter((m: any) => m.member_status === "inactive").length
    const newMembers = members.filter((m: any) => {
      const joinDate = new Date(m.join_date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return joinDate > thirtyDaysAgo
    }).length

    // Parse date range from query
    const { searchParams } = new URL(request.url)
    const start = searchParams.get("start")
    const end = searchParams.get("end")
    const startDate = start ? new Date(start) : null
    const endDate = end ? new Date(end) : null
    const eventType = searchParams.get("eventType")
    const memberStatus = searchParams.get("memberStatus") || undefined

    // Helper to check if a date is in range
    function inRange(dateStr: string) {
      const d = new Date(dateStr)
      if (startDate && d < startDate) return false
      if (endDate && d > endDate) return false
      return true
    }

    // Fetch all attendance and financial records for trends
    const [allAttendanceRecords, allFinancialTransactions] = await Promise.all([
      DatabaseService.getAttendanceRecords(),
      DatabaseService.getFinancialTransactions(),
    ])

    // Filter by date range
    const filteredAttendance = allAttendanceRecords.filter((r: any) => inRange(r.recorded_at))
    const filteredFinancial = allFinancialTransactions.filter((t: any) => inRange(t.transaction_date))
    const filteredMembers = members.filter((m: any) => inRange(m.join_date))
    let filteredEvents = events.filter((e: any) => inRange(e.event_date))
    if (eventType) {
      filteredEvents = filteredEvents.filter((e: any) => e.event_type === eventType)
    }

    // Fetch member stats
    let memberQuery = supabase.from("members").select("id, status, created_at")
    if (memberStatus && memberStatus !== "") {
      if (memberStatus === "new") {
        // New: joined within the last 30 days
        const newSince = new Date()
        newSince.setDate(newSince.getDate() - 30)
        memberQuery = memberQuery.gte("created_at", newSince.toISOString())
      } else {
        memberQuery = memberQuery.eq("status", memberStatus)
      }
    }
    const { data: filteredMembersFromSupabase, error: memberError } = await memberQuery
    if (memberError) throw new Error(memberError.message)
    // Replace member count and trend logic to use filtered members
    const memberCount = filteredMembersFromSupabase.length

    // Attendance trend (last 12 weeks)
    let attendanceTrend: { week: string; count: number }[] = []
    if (Array.isArray(filteredAttendance)) {
      const now = new Date()
      for (let i = 11; i >= 0; i--) {
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay() - i * 7)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`
        const count = filteredAttendance.filter((r: any) => {
          const d = new Date(r.recorded_at)
          return d >= weekStart && d <= weekEnd
        }).length
        attendanceTrend.push({ week: weekLabel, count })
      }
    }

    // Financial trend (last 12 months)
    let financialTrend: { month: string; total: number }[] = []
    if (Array.isArray(filteredFinancial)) {
      const now = new Date()
      for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthLabel = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`
        const total = filteredFinancial.filter((t: any) => {
          const d = new Date(t.transaction_date)
          return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth()
        }).reduce((sum: number, t: any) => sum + Number(t.amount), 0)
        financialTrend.push({ month: monthLabel, total })
      }
    }

    // New members per month (last 12 months)
    let newMembersTrend: { month: string; count: number }[] = []
    {
      const now = new Date()
      for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthLabel = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`
        const count = filteredMembers.filter((m: any) => {
          const d = new Date(m.join_date)
          return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth()
        }).length
        newMembersTrend.push({ month: monthLabel, count })
      }
    }

    // Event participation trend (last 12 months)
    let eventParticipationTrend: { month: string; count: number }[] = []
    {
      const now = new Date()
      for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthLabel = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`
        const count = filteredEvents.filter((e: any) => {
          const d = new Date(e.event_date)
          return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth()
        }).length
        eventParticipationTrend.push({ month: monthLabel, count })
      }
    }

    // Predictive analytics (simple linear projection)
    function linearForecast(trend: { count?: number; total?: number }[], key: 'count' | 'total') {
      if (!trend.length) return 0
      const values = trend.map((t) => t[key] ?? 0)
      if (values.length < 2) return values[values.length - 1] || 0
      const diffs = values.slice(1).map((v, i) => v - values[i])
      const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length
      return Math.round((values[values.length - 1] || 0) + avgDiff)
    }

    const attendancePrediction = linearForecast(attendanceTrend, 'count')
    const givingPrediction = linearForecast(financialTrend, 'total')
    const memberGrowthPrediction = linearForecast(newMembersTrend, 'count')

    return NextResponse.json({
      attendance: attendanceStats,
      financial: financialSummary,
      members: {
        total: memberCount,
        active: activeMembers,
        inactive: inactiveMembers,
        newThisMonth: newMembers,
      },
      events: {
        total: events.length,
        upcoming: events.filter((e: any) => new Date(e.event_date) > new Date()).length,
        past: events.filter((e: any) => new Date(e.event_date) <= new Date()).length,
      },
      trends: {
        attendance: attendanceTrend,
        financial: financialTrend,
        newMembers: newMembersTrend,
        eventParticipation: eventParticipationTrend,
      },
      predictions: {
        nextWeekAttendance: attendancePrediction,
        nextMonthGiving: givingPrediction,
        nextMonthMemberGrowth: memberGrowthPrediction,
      },
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
} 