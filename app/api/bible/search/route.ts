import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY)

// Expanded Bible verses database with more comprehensive coverage
const bibleVerses = [
  // Love & Salvation
  {
    verse:
      "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16",
    book: "John",
    chapter: 3,
    verse_number: 16,
    testament: "New",
    themes: ["love", "salvation", "eternal life", "sacrifice", "belief", "faith"],
    keywords: ["god", "loved", "world", "son", "believes", "eternal", "life", "perish", "salvation"],
    language: "English",
  },
  {
    verse: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
    reference: "Romans 5:8",
    book: "Romans",
    chapter: 5,
    verse_number: 8,
    testament: "New",
    themes: ["love", "grace", "sacrifice", "redemption", "sin"],
    keywords: ["god", "demonstrates", "love", "sinners", "christ", "died", "grace", "mercy"],
    language: "English",
  },
  {
    verse: "Greater love has no one than this: to lay down one's life for one's friends.",
    reference: "John 15:13",
    book: "John",
    chapter: 15,
    verse_number: 13,
    testament: "New",
    themes: ["love", "sacrifice", "friendship", "selflessness"],
    keywords: ["greater", "love", "lay", "down", "life", "friends", "sacrifice", "selfless"],
    language: "English",
  },

  // Trust & Faith
  {
    verse:
      "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    book: "Proverbs",
    chapter: 3,
    verse_number: 5,
    testament: "Old",
    themes: ["trust", "wisdom", "guidance", "surrender", "faith"],
    keywords: ["trust", "lord", "heart", "understanding", "submit", "paths", "straight", "guidance"],
    language: "English",
  },
  {
    verse: "Now faith is confidence in what we hope for and assurance about what we do not see.",
    reference: "Hebrews 11:1",
    book: "Hebrews",
    chapter: 11,
    verse_number: 1,
    testament: "New",
    themes: ["faith", "hope", "confidence", "assurance", "belief"],
    keywords: ["faith", "confidence", "hope", "assurance", "see", "believe", "trust"],
    language: "English",
  },
  {
    verse:
      "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    book: "Joshua",
    chapter: 1,
    verse_number: 9,
    testament: "Old",
    themes: ["courage", "strength", "presence", "encouragement", "fear", "faith"],
    keywords: ["strong", "courageous", "afraid", "discouraged", "lord", "god", "with", "wherever"],
    language: "English",
  },

  // Comfort & Peace
  {
    verse: "The Lord is my shepherd, I lack nothing.",
    reference: "Psalm 23:1",
    book: "Psalms",
    chapter: 23,
    verse_number: 1,
    testament: "Old",
    themes: ["trust", "provision", "guidance", "comfort", "peace"],
    keywords: ["lord", "shepherd", "lack", "nothing", "provision", "care", "guide"],
    language: "English",
  },
  {
    verse:
      "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
    reference: "Psalm 23:4",
    book: "Psalms",
    chapter: 23,
    verse_number: 4,
    testament: "Old",
    themes: ["comfort", "protection", "presence", "fear", "courage"],
    keywords: ["walk", "darkest", "valley", "fear", "evil", "with", "rod", "staff", "comfort"],
    language: "English",
  },
  {
    verse:
      "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    reference: "John 14:27",
    book: "John",
    chapter: 14,
    verse_number: 27,
    testament: "New",
    themes: ["peace", "comfort", "fear", "anxiety", "heart"],
    keywords: ["peace", "leave", "give", "world", "hearts", "troubled", "afraid", "calm"],
    language: "English",
  },
  {
    verse: "Come to me, all you who are weary and burdened, and I will give you rest.",
    reference: "Matthew 11:28",
    book: "Matthew",
    chapter: 11,
    verse_number: 28,
    testament: "New",
    themes: ["rest", "comfort", "burden", "weariness", "relief"],
    keywords: ["come", "weary", "burdened", "give", "rest", "tired", "heavy", "relief"],
    language: "English",
  },

  // Strength & Perseverance
  {
    verse: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    book: "Philippians",
    chapter: 4,
    verse_number: 13,
    testament: "New",
    themes: ["strength", "perseverance", "faith", "empowerment", "ability"],
    keywords: ["can", "do", "all", "through", "him", "gives", "strength", "power", "able"],
    language: "English",
  },
  {
    verse:
      "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31",
    book: "Isaiah",
    chapter: 40,
    verse_number: 31,
    testament: "Old",
    themes: ["strength", "hope", "renewal", "endurance", "perseverance"],
    keywords: ["hope", "lord", "renew", "strength", "soar", "wings", "eagles", "run", "weary", "walk", "faint"],
    language: "English",
  },
  {
    verse:
      "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.",
    reference: "Zephaniah 3:17",
    book: "Zephaniah",
    chapter: 3,
    verse_number: 17,
    testament: "Old",
    themes: ["presence", "strength", "love", "joy", "salvation"],
    keywords: ["lord", "god", "with", "mighty", "warrior", "saves", "delight", "love", "rejoice", "singing"],
    language: "English",
  },

  // Hope & Purpose
  {
    verse:
      "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28",
    book: "Romans",
    chapter: 8,
    verse_number: 28,
    testament: "New",
    themes: ["sovereignty", "purpose", "hope", "trust", "good"],
    keywords: ["know", "all", "things", "god", "works", "good", "love", "called", "purpose"],
    language: "English",
  },
  {
    verse:
      "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    reference: "Jeremiah 29:11",
    book: "Jeremiah",
    chapter: 29,
    verse_number: 11,
    testament: "Old",
    themes: ["hope", "future", "plans", "prosperity", "purpose"],
    keywords: ["know", "plans", "declares", "lord", "prosper", "harm", "hope", "future"],
    language: "English",
  },
  {
    verse:
      "Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.",
    reference: "Philippians 1:6",
    book: "Philippians",
    chapter: 1,
    verse_number: 6,
    testament: "New",
    themes: ["confidence", "completion", "work", "perseverance", "faith"],
    keywords: ["confident", "began", "good", "work", "carry", "completion", "day", "christ", "jesus"],
    language: "English",
  },

  // Forgiveness & Grace
  {
    verse:
      "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.",
    reference: "1 John 1:9",
    book: "1 John",
    chapter: 1,
    verse_number: 9,
    testament: "New",
    themes: ["forgiveness", "confession", "purification", "grace", "sin"],
    keywords: ["confess", "sins", "faithful", "just", "forgive", "purify", "unrighteousness"],
    language: "English",
  },
  {
    verse: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
    reference: "Ephesians 4:32",
    book: "Ephesians",
    chapter: 4,
    verse_number: 32,
    testament: "New",
    themes: ["kindness", "compassion", "forgiveness", "grace", "relationships"],
    keywords: ["kind", "compassionate", "forgiving", "each", "other", "christ", "god", "forgave"],
    language: "English",
  },

  // Wisdom & Understanding
  {
    verse:
      "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
    reference: "James 1:5",
    book: "James",
    chapter: 1,
    verse_number: 5,
    testament: "New",
    themes: ["wisdom", "asking", "generosity", "understanding", "knowledge"],
    keywords: ["lacks", "wisdom", "ask", "god", "gives", "generously", "fault", "given"],
    language: "English",
  },
  {
    verse: "The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.",
    reference: "Proverbs 9:10",
    book: "Proverbs",
    chapter: 9,
    verse_number: 10,
    testament: "Old",
    themes: ["wisdom", "fear", "knowledge", "understanding", "reverence"],
    keywords: ["fear", "lord", "beginning", "wisdom", "knowledge", "holy", "one", "understanding"],
    language: "English",
  },

  // Prayer & Communication
  {
    verse:
      "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reference: "Philippians 4:6",
    book: "Philippians",
    chapter: 4,
    verse_number: 6,
    testament: "New",
    themes: ["anxiety", "prayer", "thanksgiving", "requests", "peace"],
    keywords: ["anxious", "anything", "situation", "prayer", "petition", "thanksgiving", "present", "requests", "god"],
    language: "English",
  },
  {
    verse:
      "And pray in the Spirit on all occasions with all kinds of prayers and requests. With this in mind, be alert and always keep on praying for all the Lord's people.",
    reference: "Ephesians 6:18",
    book: "Ephesians",
    chapter: 6,
    verse_number: 18,
    testament: "New",
    themes: ["prayer", "spirit", "requests", "alertness", "perseverance"],
    keywords: [
      "pray",
      "spirit",
      "occasions",
      "kinds",
      "prayers",
      "requests",
      "alert",
      "keep",
      "praying",
      "lords",
      "people",
    ],
    language: "English",
  },

  // Joy & Celebration
  {
    verse: "Rejoice in the Lord always. I will say it again: Rejoice!",
    reference: "Philippians 4:4",
    book: "Philippians",
    chapter: 4,
    verse_number: 4,
    testament: "New",
    themes: ["joy", "celebration", "rejoicing", "happiness", "praise"],
    keywords: ["rejoice", "lord", "always", "say", "again", "joy", "celebrate"],
    language: "English",
  },
  {
    verse: "This is the day the Lord has made; we will rejoice and be glad in it.",
    reference: "Psalm 118:24",
    book: "Psalms",
    chapter: 118,
    verse_number: 24,
    testament: "Old",
    themes: ["joy", "celebration", "gratitude", "present", "gladness"],
    keywords: ["day", "lord", "made", "rejoice", "glad", "celebrate", "today"],
    language: "English",
  },

  // Service & Love for Others
  {
    verse: "Serve one another humbly in love.",
    reference: "Galatians 5:13",
    book: "Galatians",
    chapter: 5,
    verse_number: 13,
    testament: "New",
    themes: ["service", "humility", "love", "relationships", "community"],
    keywords: ["serve", "one", "another", "humbly", "love", "service", "help"],
    language: "English",
  },
  {
    verse: "Above all, love each other deeply, because love covers over a multitude of sins.",
    reference: "1 Peter 4:8",
    book: "1 Peter",
    chapter: 4,
    verse_number: 8,
    testament: "New",
    themes: ["love", "relationships", "forgiveness", "community", "grace"],
    keywords: ["above", "all", "love", "each", "other", "deeply", "covers", "multitude", "sins"],
    language: "English",
  },
]

// Enhanced keyword matching with synonyms and semantic understanding
const keywordSynonyms: Record<string, string[]> = {
  // Emotions & States
  afraid: ["scared", "fearful", "terrified", "anxious", "worried", "frightened"],
  sad: ["sorrowful", "grieving", "mourning", "depressed", "heartbroken", "weeping"],
  happy: ["joyful", "glad", "cheerful", "delighted", "blessed", "content"],
  angry: ["mad", "furious", "wrathful", "indignant", "upset", "irritated"],
  worried: ["anxious", "concerned", "troubled", "distressed", "uneasy"],
  lonely: ["alone", "isolated", "abandoned", "forsaken", "solitary"],
  tired: ["weary", "exhausted", "fatigued", "worn out", "drained"],

  // Spiritual Concepts
  god: ["lord", "father", "creator", "almighty", "heavenly father", "jehovah", "yahweh"],
  jesus: ["christ", "savior", "messiah", "son", "lamb", "redeemer"],
  prayer: ["pray", "praying", "petition", "intercession", "supplication"],
  faith: ["belief", "trust", "confidence", "conviction", "reliance"],
  love: ["charity", "affection", "compassion", "care", "devotion"],
  forgiveness: ["forgive", "pardon", "mercy", "grace", "absolution"],
  salvation: ["saved", "redemption", "deliverance", "rescue", "eternal life"],
  peace: ["calm", "tranquility", "serenity", "rest", "stillness"],
  strength: ["power", "might", "force", "energy", "vigor", "fortitude"],
  wisdom: ["knowledge", "understanding", "insight", "discernment", "prudence"],
  hope: ["expectation", "anticipation", "confidence", "optimism", "trust"],
  joy: ["happiness", "gladness", "delight", "bliss", "celebration"],

  // Life Situations
  sick: ["ill", "disease", "illness", "unwell", "suffering", "pain"],
  death: ["dying", "deceased", "passed away", "mortality", "grief"],
  marriage: ["wedding", "spouse", "husband", "wife", "union"],
  money: ["wealth", "riches", "finances", "prosperity", "poverty"],
  work: ["job", "employment", "labor", "career", "occupation"],
  family: ["children", "parents", "relatives", "household", "kin"],
  friends: ["friendship", "companions", "fellowship", "relationships"],

  // Actions & Behaviors
  help: ["assist", "aid", "support", "serve", "minister"],
  give: ["donate", "offer", "provide", "share", "contribute"],
  praise: ["worship", "glorify", "honor", "exalt", "magnify"],
  thank: ["grateful", "thankful", "appreciation", "gratitude"],
  obey: ["follow", "submit", "comply", "surrender", "yield"],
}

function expandKeywords(keywords: string[]): string[] {
  const expanded = new Set(keywords)

  keywords.forEach((keyword) => {
    const synonyms = keywordSynonyms[keyword.toLowerCase()]
    if (synonyms) {
      synonyms.forEach((synonym) => expanded.add(synonym))
    }
  })

  return Array.from(expanded)
}

function advancedLocalAnalysis(query: string) {
  const queryLower = query.toLowerCase()
  const words = queryLower.split(/\s+/).filter((word) => word.length > 2)

  // Extract themes based on keyword presence
  const detectedThemes: string[] = []
  const detectedEmotions: string[] = []
  const detectedConcepts: string[] = []

  // Emotion detection
  if (queryLower.match(/\b(afraid|scared|fear|anxious|worry)\b/)) {
    detectedEmotions.push("fear", "anxiety")
    detectedThemes.push("courage", "trust", "peace")
  }
  if (queryLower.match(/\b(sad|sorrow|grief|mourn|cry|weep)\b/)) {
    detectedEmotions.push("sadness", "grief")
    detectedThemes.push("comfort", "hope", "healing")
  }
  if (queryLower.match(/\b(happy|joy|glad|celebrate|praise)\b/)) {
    detectedEmotions.push("joy", "happiness")
    detectedThemes.push("celebration", "praise", "thanksgiving")
  }
  if (queryLower.match(/\b(angry|mad|furious|upset)\b/)) {
    detectedEmotions.push("anger")
    detectedThemes.push("forgiveness", "peace", "patience")
  }
  if (queryLower.match(/\b(lonely|alone|isolated|abandon)\b/)) {
    detectedEmotions.push("loneliness")
    detectedThemes.push("presence", "friendship", "community")
  }
  if (queryLower.match(/\b(tired|weary|exhaust|drain)\b/)) {
    detectedEmotions.push("weariness")
    detectedThemes.push("rest", "strength", "renewal")
  }

  // Concept detection
  if (queryLower.match(/\b(god|lord|jesus|christ|holy)\b/)) {
    detectedConcepts.push("deity", "divine")
  }
  if (queryLower.match(/\b(pray|prayer|petition|intercession)\b/)) {
    detectedConcepts.push("prayer", "communication")
  }
  if (queryLower.match(/\b(love|compassion|care|affection)\b/)) {
    detectedConcepts.push("love", "relationships")
  }
  if (queryLower.match(/\b(forgive|mercy|grace|pardon)\b/)) {
    detectedConcepts.push("forgiveness", "grace")
  }
  if (queryLower.match(/\b(faith|belief|trust|confidence)\b/)) {
    detectedConcepts.push("faith", "trust")
  }

  // Intent detection
  let intent = "general"
  if (detectedEmotions.includes("fear") || detectedEmotions.includes("anxiety")) {
    intent = "comfort"
  } else if (detectedEmotions.includes("sadness") || detectedEmotions.includes("grief")) {
    intent = "comfort"
  } else if (queryLower.includes("how") || queryLower.includes("what") || queryLower.includes("why")) {
    intent = "study"
  } else if (queryLower.includes("help") || queryLower.includes("guide")) {
    intent = "guidance"
  } else if (detectedEmotions.includes("joy") || detectedEmotions.includes("happiness")) {
    intent = "celebration"
  }

  return {
    themes: [...new Set([...detectedThemes, ...words])],
    emotions: detectedEmotions,
    concepts: detectedConcepts,
    intent,
    keywords: expandKeywords(words),
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, language = "English", searchType = "semantic" } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Enhanced local analysis as fallback
    let analysis = advancedLocalAnalysis(query)

    if (hasOpenAIKey) {
      try {
        const { text: searchAnalysis } = await generateText({
          model: openai("gpt-4o"),
          prompt: `
            Analyze this Bible search query and extract key themes, emotions, and concepts: "${query}"
            
            Return a JSON object with:
            - themes: array of main themes/topics
            - emotions: array of emotions expressed
            - concepts: array of theological concepts
            - intent: the user's likely intent (study, comfort, guidance, etc.)
            - keywords: relevant search keywords
          `,
        })
        const aiAnalysis = JSON.parse(searchAnalysis)
        // Merge AI analysis with local analysis
        analysis = {
          themes: [...new Set([...analysis.themes, ...(aiAnalysis.themes || [])])],
          emotions: [...new Set([...analysis.emotions, ...(aiAnalysis.emotions || [])])],
          concepts: [...new Set([...analysis.concepts, ...(aiAnalysis.concepts || [])])],
          intent: aiAnalysis.intent || analysis.intent,
          keywords: [...new Set([...analysis.keywords, ...(aiAnalysis.keywords || [])])],
        }
      } catch (err) {
        console.warn("OpenAI analysis failed – using enhanced local analysis:", err)
      }
    }

    // Enhanced search with better scoring
    const searchResults = bibleVerses
      .map((verse) => {
        let relevanceScore = 0

        // Theme matching (high weight)
        analysis.themes?.forEach((theme: string) => {
          if (verse.themes.some((t) => t.toLowerCase().includes(theme.toLowerCase()))) {
            relevanceScore += 35
          }
        })

        // Keyword matching in verse text (medium weight)
        analysis.keywords?.forEach((keyword: string) => {
          if (verse.verse.toLowerCase().includes(keyword.toLowerCase())) {
            relevanceScore += 25
          }
          // Also check verse keywords
          if (verse.keywords.some((k) => k.toLowerCase().includes(keyword.toLowerCase()))) {
            relevanceScore += 20
          }
        })

        // Direct query matching (high weight)
        if (verse.verse.toLowerCase().includes(query.toLowerCase())) {
          relevanceScore += 50
        }

        // Concept matching (medium weight)
        analysis.concepts?.forEach((concept: string) => {
          if (verse.themes.some((t) => t.toLowerCase().includes(concept.toLowerCase()))) {
            relevanceScore += 30
          }
        })

        // Emotion-based matching
        analysis.emotions?.forEach((emotion: string) => {
          if (
            verse.themes.some((t) => {
              // Map emotions to themes
              const emotionThemeMap: Record<string, string[]> = {
                fear: ["courage", "trust", "peace", "strength"],
                anxiety: ["peace", "trust", "comfort"],
                sadness: ["comfort", "hope", "joy"],
                grief: ["comfort", "hope", "healing"],
                joy: ["celebration", "praise", "thanksgiving"],
                loneliness: ["presence", "friendship", "love"],
                weariness: ["rest", "strength", "renewal"],
              }
              return emotionThemeMap[emotion]?.some((theme) => t.toLowerCase().includes(theme))
            })
          ) {
            relevanceScore += 25
          }
        })

        return {
          ...verse,
          relevanceScore,
          matchedThemes: verse.themes.filter((theme) =>
            analysis.themes?.some((t: string) => t.toLowerCase().includes(theme.toLowerCase())),
          ),
          matchedKeywords: verse.keywords.filter((keyword) =>
            analysis.keywords?.some((k: string) => k.toLowerCase().includes(keyword.toLowerCase())),
          ),
        }
      })
      .filter((verse) => verse.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 15) // Increased results

    // Generate AI commentary for top results
    let resultsWithCommentary: typeof searchResults

    if (hasOpenAIKey) {
      try {
        resultsWithCommentary = await Promise.all(
          searchResults.slice(0, 5).map(async (result) => {
            // Increased commentary count
            const { text: commentary } = await generateText({
              model: openai("gpt-4o"),
              prompt: `
                Provide a brief, encouraging commentary (2-3 sentences) for this Bible verse in the context of the user's search: "${query}"
                
                Verse: ${result.verse}
                Reference: ${result.reference}
                
                Focus on practical application and spiritual encouragement. Keep it concise and uplifting.
              `,
            })
            return { ...result, aiCommentary: commentary }
          }),
        )
      } catch (err) {
        console.warn("OpenAI commentary failed – omitting commentary:", err)
        resultsWithCommentary = searchResults.slice(0, 5).map((r) => ({ ...r, aiCommentary: null }))
      }
    } else {
      resultsWithCommentary = searchResults.slice(0, 5).map((r) => ({ ...r, aiCommentary: null }))
    }

    // Add remaining results without commentary
    const allResults = [
      ...resultsWithCommentary,
      ...searchResults.slice(5).map((result) => ({ ...result, aiCommentary: null })),
    ]

    return NextResponse.json({
      query,
      analysis,
      results: allResults,
      totalResults: allResults.length,
      searchType,
      language,
      enhancedFeatures: {
        synonymsUsed: true,
        emotionDetection: true,
        conceptMapping: true,
        expandedDataset: true,
      },
    })
  } catch (error) {
    console.error("Bible search error:", error)
    return NextResponse.json({ error: "Failed to search Bible verses" }, { status: 500 })
  }
}
