import { type NextRequest, NextResponse } from "next/server"

// Bible verses database (simplified for demo)
const bibleVerses = [
  {
    id: "1",
    book: "John",
    chapter: 3,
    verse: 16,
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16",
  },
  {
    id: "2",
    book: "Romans",
    chapter: 8,
    verse: 28,
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28",
  },
  {
    id: "3",
    book: "Philippians",
    chapter: 4,
    verse: 13,
    text: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
  },
  {
    id: "4",
    book: "Jeremiah",
    chapter: 29,
    verse: 11,
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    reference: "Jeremiah 29:11",
  },
  {
    id: "5",
    book: "Psalm",
    chapter: 23,
    verse: 1,
    text: "The Lord is my shepherd, I lack nothing.",
    reference: "Psalm 23:1",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const book = searchParams.get("book")
    const chapter = searchParams.get("chapter")
    const verse = searchParams.get("verse")

    let filteredVerses = bibleVerses

    if (book) {
      filteredVerses = filteredVerses.filter((v) => v.book.toLowerCase().includes(book.toLowerCase()))
    }

    if (chapter) {
      filteredVerses = filteredVerses.filter((v) => v.chapter === Number.parseInt(chapter))
    }

    if (verse) {
      filteredVerses = filteredVerses.filter((v) => v.verse === Number.parseInt(verse))
    }

    return NextResponse.json({
      verses: filteredVerses,
      total: filteredVerses.length,
    })
  } catch (error) {
    console.error("Error fetching Bible verses:", error)
    return NextResponse.json({ error: "Failed to fetch Bible verses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 10 } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Simple search implementation
    const searchResults = bibleVerses
      .filter(
        (verse) =>
          verse.text.toLowerCase().includes(query.toLowerCase()) ||
          verse.reference.toLowerCase().includes(query.toLowerCase()) ||
          verse.book.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, limit)

    return NextResponse.json({
      verses: searchResults,
      total: searchResults.length,
      query,
    })
  } catch (error) {
    console.error("Error searching Bible verses:", error)
    return NextResponse.json({ error: "Failed to search Bible verses" }, { status: 500 })
  }
}
