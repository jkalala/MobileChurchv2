import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // During build time, return empty search results
    if (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV) {
      return NextResponse.json({
        results: [],
        total: 0,
        build_time: true,
      })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    // Mock search results for build
    const mockResults = {
      results: [
        {
          id: "1",
          type: "member",
          title: "John Doe",
          description: "Church member",
          url: "/members/1",
        },
      ],
      total: query ? 1 : 0,
      query,
      build_time: true,
    }

    return NextResponse.json(mockResults)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({
      results: [],
      total: 0,
      error: "Search failed",
      build_time: true,
    })
  }
}
