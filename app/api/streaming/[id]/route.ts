import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const streamId = params.id

    // Mock stream data - in production, fetch from streaming service
    const streamData = {
      id: streamId,
      title: "Culto Dominical - Manhã",
      description: "Celebração dominical com louvor, palavra e comunhão",
      status: "live",
      startTime: new Date().toISOString(),
      viewerCount: 145,
      peakViewers: 189,
      duration: "01:23:45",
      quality: "1080p",
      streamKey: "sk_live_123456789",
      rtmpUrl: "rtmp://live.church.com/live",
      chatEnabled: true,
      recordingEnabled: true,
      hybridMode: true,
      inPersonAttendance: 150,
    }

    return NextResponse.json(streamData)
  } catch (error) {
    console.error("Error fetching stream:", error)
    return NextResponse.json({ error: "Failed to fetch stream" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const streamId = params.id
    const updates = await request.json()

    // Mock stream update - in production, update streaming service
    const updatedStream = {
      id: streamId,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedStream)
  } catch (error) {
    console.error("Error updating stream:", error)
    return NextResponse.json({ error: "Failed to update stream" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const streamId = params.id

    // Mock stream deletion - in production, delete from streaming service
    return NextResponse.json({ message: "Stream deleted successfully" })
  } catch (error) {
    console.error("Error deleting stream:", error)
    return NextResponse.json({ error: "Failed to delete stream" }, { status: 500 })
  }
}
