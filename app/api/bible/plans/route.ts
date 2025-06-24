import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")

    // Demo study plans
    const studyPlans = [
      {
        id: "plan-1",
        title: "The Life of Jesus",
        description: "A comprehensive study through the Gospels",
        duration: "8 weeks",
        difficulty: "beginner",
        category: "theology",
        lessons: 24,
        participants: 1247,
        rating: 4.8,
        createdBy: "Pastor John",
        createdAt: "2024-01-15",
      },
      {
        id: "plan-2",
        title: "Psalms of Praise",
        description: "Discovering worship through the Psalms",
        duration: "6 weeks",
        difficulty: "intermediate",
        category: "devotional",
        lessons: 18,
        participants: 892,
        rating: 4.6,
        createdBy: "Dr. Sarah",
        createdAt: "2024-02-01",
      },
      {
        id: "plan-3",
        title: "Paul's Prison Letters",
        description: "Study Ephesians, Philippians, Colossians, and Philemon",
        duration: "10 weeks",
        difficulty: "advanced",
        category: "theology",
        lessons: 30,
        participants: 634,
        rating: 4.9,
        createdBy: "Rev. Michael",
        createdAt: "2024-01-20",
      },
    ]

    let filteredPlans = studyPlans

    if (category && category !== "all") {
      filteredPlans = filteredPlans.filter((plan) => plan.category === category)
    }

    if (difficulty && difficulty !== "all") {
      filteredPlans = filteredPlans.filter((plan) => plan.difficulty === difficulty)
    }

    return NextResponse.json({
      plans: filteredPlans,
      total: filteredPlans.length,
    })
  } catch (error) {
    console.error("Error fetching study plans:", error)
    return NextResponse.json({ error: "Failed to fetch study plans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const planData = await request.json()

    // Validate required fields
    if (!planData.title || !planData.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Create new study plan
    const newPlan = {
      id: `plan-${Date.now()}`,
      ...planData,
      participants: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      plan: newPlan,
      message: "Study plan created successfully",
    })
  } catch (error) {
    console.error("Error creating study plan:", error)
    return NextResponse.json({ error: "Failed to create study plan" }, { status: 500 })
  }
}
