import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { verse, reference, studyType = "general", language = "English" } = await request.json()

    if (!verse || !reference) {
      return NextResponse.json({ error: "Verse and reference are required" }, { status: 400 })
    }

    let studyPrompt = ""

    switch (studyType) {
      case "historical":
        studyPrompt = `
          Provide historical context and background for this Bible verse:
          
          Verse: ${verse}
          Reference: ${reference}
          
          Include:
          - Historical setting and time period
          - Cultural context
          - Author background
          - Circumstances of writing
          - Significance in biblical history
          
          Write in ${language}. Keep it informative but accessible.
        `
        break

      case "theological":
        studyPrompt = `
          Provide theological analysis and interpretation for this Bible verse:
          
          Verse: ${verse}
          Reference: ${reference}
          
          Include:
          - Key theological themes
          - Doctrinal significance
          - Cross-references to related passages
          - Theological implications
          - How it fits in God's overall plan
          
          Write in ${language}. Make it deep but understandable.
        `
        break

      case "practical":
        studyPrompt = `
          Provide practical application and life lessons from this Bible verse:
          
          Verse: ${verse}
          Reference: ${reference}
          
          Include:
          - Practical life applications
          - How to apply this in daily life
          - Modern-day relevance
          - Action steps for believers
          - Personal reflection points
          
          Write in ${language}. Focus on practical, actionable insights.
        `
        break

      default:
        studyPrompt = `
          Provide a comprehensive Bible study analysis for this verse:
          
          Verse: ${verse}
          Reference: ${reference}
          
          Include:
          - Context and background
          - Key themes and meanings
          - Practical applications
          - Spiritual insights
          - Discussion questions
          
          Write in ${language}. Make it suitable for personal or group study.
        `
    }

    const { text: studyContent } = await generateText({
      model: openai("gpt-4o"),
      prompt: studyPrompt,
    })

    // Generate related verses
    const { text: relatedVersesText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Suggest 3-5 related Bible verses that connect to the themes in:
        
        Verse: ${verse}
        Reference: ${reference}
        
        For each related verse, provide:
        - The verse text
        - Reference
        - Brief explanation of how it relates
        
        Format as JSON array with objects containing: verse, reference, connection
      `,
    })

    let relatedVerses = []
    try {
      relatedVerses = JSON.parse(relatedVersesText)
    } catch {
      relatedVerses = []
    }

    return NextResponse.json({
      verse,
      reference,
      studyType,
      studyContent,
      relatedVerses,
      language,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Bible study generation error:", error)
    return NextResponse.json({ error: "Failed to generate Bible study" }, { status: 500 })
  }
}
