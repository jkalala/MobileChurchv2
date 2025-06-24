import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { chords } = await request.json()

    if (!chords) {
      return NextResponse.json({ error: "Chord progression is required" }, { status: 400 })
    }

    // Parse chord progression
    const chordArray = chords.split(/[\s\-|]+/).filter((c: string) => c.trim())

    // Analyze key signature
    const key = analyzeKey(chordArray)

    // Determine difficulty
    const difficulty = analyzeDifficulty(chordArray)

    // Generate suggestions
    const suggestions = generateSuggestions(chordArray, key)

    // Analyze progression patterns
    const patterns = analyzePatterns(chordArray)

    return NextResponse.json({
      chords: chordArray,
      key,
      difficulty,
      suggestions,
      patterns,
      analysis: {
        totalChords: chordArray.length,
        uniqueChords: [...new Set(chordArray)].length,
        commonProgressions: findCommonProgressions(chordArray),
        keyStability: calculateKeyStability(chordArray, key),
      },
    })
  } catch (error) {
    console.error("Error analyzing chords:", error)
    return NextResponse.json({ error: "Failed to analyze chord progression" }, { status: 500 })
  }
}

function analyzeKey(chords: string[]): string {
  const keySignatures: Record<string, string[]> = {
    C: ["C", "F", "G", "Am", "Dm", "Em"],
    G: ["G", "C", "D", "Em", "Am", "Bm"],
    D: ["D", "G", "A", "Bm", "Em", "F#m"],
    A: ["A", "D", "E", "F#m", "Bm", "C#m"],
    E: ["E", "A", "B", "C#m", "F#m", "G#m"],
    F: ["F", "Bb", "C", "Dm", "Gm", "Am"],
  }

  let bestMatch = "C"
  let maxMatches = 0

  Object.entries(keySignatures).forEach(([key, signature]) => {
    const matches = chords.filter((chord) => signature.includes(chord)).length
    if (matches > maxMatches) {
      maxMatches = matches
      bestMatch = key
    }
  })

  return bestMatch
}

function analyzeDifficulty(chords: string[]): "easy" | "medium" | "hard" {
  const easyChords = ["C", "G", "Am", "F", "D", "Em"]
  const mediumChords = ["Dm", "A", "E", "Bm", "F#m", "Bb", "Gm"]

  const easyCount = chords.filter((c) => easyChords.includes(c)).length
  const mediumCount = chords.filter((c) => mediumChords.includes(c)).length
  const hardCount = chords.length - easyCount - mediumCount

  if (hardCount > chords.length * 0.3) return "hard"
  if (mediumCount > chords.length * 0.4) return "medium"
  return "easy"
}

function generateSuggestions(chords: string[], key: string): string[] {
  const suggestions = []

  // Common substitutions
  const substitutions: Record<string, string[]> = {
    C: ["Cadd9", "Csus4", "C/E"],
    G: ["G/B", "Gsus4", "G/D"],
    Am: ["Am7", "Am/C", "Asus2"],
    F: ["Fmaj7", "F/A", "Fsus2"],
    Dm: ["Dm7", "Dm/F", "Dsus2"],
    Em: ["Em7", "Em/G", "Esus4"],
  }

  chords.forEach((chord) => {
    if (substitutions[chord]) {
      suggestions.push(`Try ${substitutions[chord].join(" or ")} instead of ${chord}`)
    }
  })

  // Key-specific suggestions
  if (key === "C") {
    suggestions.push("Consider adding Am7 for a more contemporary sound")
    suggestions.push("Try C/E for a smoother bass line")
  }

  return suggestions
}

function analyzePatterns(chords: string[]): string[] {
  const patterns = []

  // Check for common progressions
  const chordString = chords.join("-")

  if (chordString.includes("C-Am-F-G")) {
    patterns.push("vi-IV-I-V progression (very popular in contemporary music)")
  }

  if (chordString.includes("G-D-Em-C")) {
    patterns.push("I-V-vi-IV progression (classic pop progression)")
  }

  if (chordString.includes("Am-F-C-G")) {
    patterns.push("vi-IV-I-V progression (emotional and powerful)")
  }

  return patterns
}

function findCommonProgressions(chords: string[]): string[] {
  const progressions = []

  // Look for 4-chord patterns
  for (let i = 0; i <= chords.length - 4; i++) {
    const pattern = chords.slice(i, i + 4).join("-")

    const commonPatterns: Record<string, string> = {
      "C-Am-F-G": "I-vi-IV-V (Classic)",
      "G-D-Em-C": "I-V-vi-IV (Pop)",
      "Am-F-C-G": "vi-IV-I-V (Emotional)",
      "F-G-Am-Am": "IV-V-vi-vi (Building)",
      "C-G-Am-F": "I-V-vi-IV (Stable)",
    }

    if (commonPatterns[pattern]) {
      progressions.push(commonPatterns[pattern])
    }
  }

  return [...new Set(progressions)]
}

function calculateKeyStability(chords: string[], key: string): number {
  const keySignatures: Record<string, string[]> = {
    C: ["C", "F", "G", "Am", "Dm", "Em"],
    G: ["G", "C", "D", "Em", "Am", "Bm"],
    D: ["D", "G", "A", "Bm", "Em", "F#m"],
    A: ["A", "D", "E", "F#m", "Bm", "C#m"],
    E: ["E", "A", "B", "C#m", "F#m", "G#m"],
    F: ["F", "Bb", "C", "Dm", "Gm", "Am"],
  }

  const keyChords = keySignatures[key] || []
  const inKeyCount = chords.filter((chord) => keyChords.includes(chord)).length

  return Math.round((inKeyCount / chords.length) * 100)
}
