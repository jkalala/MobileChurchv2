import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET() {
  try {
    const events = await DatabaseService.getEvents()
    const types = Array.from(new Set(events.map((e: any) => e.event_type).filter(Boolean)))
    return NextResponse.json({ eventTypes: types })
  } catch (error) {
    return NextResponse.json({ eventTypes: [] })
  }
} 