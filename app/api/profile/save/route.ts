import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate saving profile
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      ok: true,
      message: "Profile saved successfully",
    })
  } catch (error) {
    console.error("Profile save error:", error)
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to save profile",
      },
      { status: 500 },
    )
  }
}
