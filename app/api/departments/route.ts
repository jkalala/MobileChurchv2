import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET() {
  try {
    const departments = await DatabaseService.getDepartments()
    const names = departments.map((d: any) => d.name)
    return NextResponse.json({ departments: names })
  } catch (error) {
    return NextResponse.json({ departments: [] })
  }
} 