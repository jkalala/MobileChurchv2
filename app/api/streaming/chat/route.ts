import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const streamId = searchParams.get("streamId")

    // Mock chat messages - in production, fetch from real-time database
    const chatMessages = [
      {
        id: "msg-1",
        userId: "user-1",
        userName: "Maria Silva",
        message: "Glória a Deus! 🙏",
        timestamp: new Date().toISOString(),
        type: "message",
      },
      {
        id: "msg-2",
        userId: "user-2",
        userName: "João Santos",
        message: "Amém! Palavra poderosa!",
        timestamp: new Date().toISOString(),
        type: "message",
      },
      {
        id: "msg-3",
        userId: "user-3",
        userName: "Ana Costa",
        message: "Orando pela família Silva",
        timestamp: new Date().toISOString(),
        type: "prayer",
      },
    ]

    return NextResponse.json({ messages: chatMessages })
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return NextResponse.json({ error: "Failed to fetch chat messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const messageData = await request.json()

    // Mock message creation - in production, save to real-time database
    const newMessage = {
      id: `msg-${Date.now()}`,
      ...messageData,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error("Error sending chat message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
