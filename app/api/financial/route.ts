import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
import { createServerClient } from "@/lib/supabase-client"
import { getUserRoleFromRequest } from "@/lib/auth-helpers"

// Helper to extract access token from cookies
function getAccessToken(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
    const [k, ...v] = c.trim().split('=')
    return [k, decodeURIComponent(v.join('='))]
  }))
  return cookies["sb-access-token"] || cookies["access_token"]
}

export async function GET() {
  try {
    const [summary, transactions] = await Promise.all([
      DatabaseService.getFinancialSummary(),
      DatabaseService.getFinancialTransactions(),
    ])

    return NextResponse.json({
      summary,
      transactions: transactions.slice(0, 10), // Latest 10 transactions
    })
  } catch (error) {
    console.error("Error fetching financial data:", error)
    return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    // RBAC: Only admin or treasurer can create transactions
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin" && role !== "treasurer") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }
    const transactionData = await request.json()
    const newTransaction = await DatabaseService.createFinancialTransaction({ ...transactionData, created_by: user.id })
    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    // RBAC: Only admin or treasurer can update transactions
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin" && role !== "treasurer") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }
    const { id, ...transactionData } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }
    const updatedTransaction = await DatabaseService.updateFinancialTransaction(id, transactionData)
    return NextResponse.json(updatedTransaction)
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request)
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    // RBAC: Only admin or treasurer can delete transactions
    const role = await getUserRoleFromRequest(request)
    if (role !== "admin" && role !== "treasurer") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }
    await DatabaseService.deleteFinancialTransaction(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
}
