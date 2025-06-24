import { AIClient } from "./ai-client"
import { z } from "zod"

export interface Song {
  id: string
  title: string
  artist: string
  key: string
  tempo: "slow" | "medium" | "fast"
  theme: string[]
  lyrics?: string
  chords?: string
  difficulty: "easy" | "medium" | "hard"
  language: "pt" | "en" | "fr"
  category: "worship" | "praise" | "hymn" | "contemporary" | "gospel"
}

export interface WorshipSet {
  id: string
  date: string
  theme: string
  songs: Song[]
  totalDuration: number
  flow: ("opening" | "worship" | "message_prep" | "response" | "closing")[]
  key_progression: string[]
  notes: string
}

const WorshipSetSchema = z.object({
  songs: z.array(
    z.object({
      title: z.string(),
      artist: z.string(),
      key: z.string(),
      tempo: z.enum(["slow", "medium", "fast"]),
      category: z.enum(["worship", "praise", "hymn", "contemporary", "gospel"]),
      theme: z.array(z.string()),
    }),
  ),
  flow: z.array(z.enum(["opening", "worship", "message_prep", "response", "closing"])),
  notes: z.string(),
})

export class AIWorshipPlanner {
  private static songDatabase: Song[] = [
    // Portuguese Songs
    {
      id: "pt-1",
      title: "Quão Grande És Tu",
      artist: "Tradicional",
      key: "G",
      tempo: "slow",
      theme: ["adoração", "grandeza de Deus", "criação"],
      difficulty: "easy",
      language: "pt",
      category: "hymn",
    },
    {
      id: "pt-2",
      title: "Eu Me Rendo",
      artist: "Renascer Praise",
      key: "C",
      tempo: "medium",
      theme: ["rendição", "entrega", "adoração"],
      difficulty: "medium",
      language: "pt",
      category: "contemporary",
    },
    {
      id: "pt-3",
      title: "Aleluia",
      artist: "Gabriela Rocha",
      key: "D",
      tempo: "fast",
      theme: ["celebração", "alegria", "louvor"],
      difficulty: "medium",
      language: "pt",
      category: "praise",
    },
    {
      id: "pt-4",
      title: "Espírito Santo",
      artist: "Fernandinho",
      key: "A",
      tempo: "medium",
      theme: ["Espírito Santo", "presença", "adoração"],
      difficulty: "medium",
      language: "pt",
      category: "worship",
    },
    {
      id: "pt-5",
      title: "Tua Graça Me Basta",
      artist: "Fernanda Brum",
      key: "F",
      tempo: "slow",
      theme: ["graça", "suficiência", "confiança"],
      difficulty: "easy",
      language: "pt",
      category: "worship",
    },

    // English Songs
    {
      id: "en-1",
      title: "How Great Thou Art",
      artist: "Traditional",
      key: "G",
      tempo: "slow",
      theme: ["worship", "God's greatness", "creation"],
      difficulty: "easy",
      language: "en",
      category: "hymn",
    },
    {
      id: "en-2",
      title: "Oceans (Where Feet May Fail)",
      artist: "Hillsong United",
      key: "D",
      tempo: "slow",
      theme: ["faith", "trust", "surrender"],
      difficulty: "medium",
      language: "en",
      category: "contemporary",
    },
    {
      id: "en-3",
      title: "What a Beautiful Name",
      artist: "Hillsong Worship",
      key: "A",
      tempo: "medium",
      theme: ["Jesus", "salvation", "worship"],
      difficulty: "medium",
      language: "en",
      category: "worship",
    },
    {
      id: "en-4",
      title: "Good Good Father",
      artist: "Chris Tomlin",
      key: "C",
      tempo: "medium",
      theme: ["God's love", "father", "identity"],
      difficulty: "easy",
      language: "en",
      category: "worship",
    },
    {
      id: "en-5",
      title: "Reckless Love",
      artist: "Cory Asbury",
      key: "F",
      tempo: "medium",
      theme: ["God's love", "grace", "pursuit"],
      difficulty: "medium",
      language: "en",
      category: "contemporary",
    },

    // French Songs
    {
      id: "fr-1",
      title: "Que Ton Nom Soit Élevé",
      artist: "Traditionnel",
      key: "G",
      tempo: "medium",
      theme: ["louange", "élévation", "adoration"],
      difficulty: "easy",
      language: "fr",
      category: "worship",
    },
    {
      id: "fr-2",
      title: "Je Lève Mes Yeux",
      artist: "Hillsong en Français",
      key: "D",
      tempo: "slow",
      theme: ["espoir", "confiance", "secours"],
      difficulty: "medium",
      language: "fr",
      category: "worship",
    },
  ]

  static async generateWorshipSet(
    date: string,
    theme: string,
    language: "pt" | "en" | "fr" = "pt",
    duration = 25,
    preferences?: {
      includeHymns?: boolean
      tempoPreference?: "slow" | "medium" | "fast" | "mixed"
      difficultyLevel?: "easy" | "medium" | "hard"
      specificKeys?: string[]
    },
  ): Promise<WorshipSet> {
    try {
      const languageMap = { pt: "Portuguese", en: "English", fr: "French" }

      const systemPrompt = `You are an AI worship planning assistant. Create balanced, engaging worship sets that flow well musically and spiritually. Consider song themes, musical keys, tempo progression, and spiritual flow.`

      const availableSongs = this.songDatabase.filter((song) => song.language === language)
      const songList = availableSongs
        .map(
          (song) =>
            `${song.title} by ${song.artist} (Key: ${song.key}, Tempo: ${song.tempo}, Themes: ${song.theme.join(", ")})`,
        )
        .join("\n")

      const prompt = `
        Create a worship set for ${date} with theme: "${theme}"
        Language: ${languageMap[language]}
        Duration: ${duration} minutes
        
        Available songs:
        ${songList}
        
        Preferences:
        - Include hymns: ${preferences?.includeHymns ? "Yes" : "No"}
        - Tempo preference: ${preferences?.tempoPreference || "mixed"}
        - Difficulty level: ${preferences?.difficultyLevel || "medium"}
        - Specific keys: ${preferences?.specificKeys?.join(", ") || "any"}
        
        Select 4-6 songs that:
        1. Match the theme "${theme}"
        2. Create good musical flow (consider key transitions)
        3. Progress from energetic opening to intimate worship
        4. Prepare hearts for the message
        5. End with response/commitment
        
        Provide:
        1. Selected songs with their details
        2. Worship flow (opening, worship, message_prep, response, closing)
        3. Ministry notes and tips for the worship team
        
        Return structured data matching the schema.
      `

      const result = await AIClient.generateObject(prompt, WorshipSetSchema, systemPrompt)

      // Map AI suggestions to actual songs from database
      const selectedSongs: Song[] = []
      for (const aiSong of result.songs) {
        const matchingSong = availableSongs.find(
          (song) =>
            song.title.toLowerCase().includes(aiSong.title.toLowerCase()) ||
            aiSong.title.toLowerCase().includes(song.title.toLowerCase()),
        )

        if (matchingSong) {
          selectedSongs.push(matchingSong)
        } else {
          // Create new song entry based on AI suggestion
          selectedSongs.push({
            id: `ai-${Date.now()}-${selectedSongs.length}`,
            title: aiSong.title,
            artist: aiSong.artist,
            key: aiSong.key,
            tempo: aiSong.tempo,
            theme: aiSong.theme,
            difficulty: "medium",
            language,
            category: aiSong.category,
          })
        }
      }

      const keyProgression = this.generateKeyProgression(selectedSongs)
      const totalDuration = selectedSongs.length * 4.5

      return {
        id: `worship-set-${Date.now()}`,
        date,
        theme,
        songs: selectedSongs,
        totalDuration,
        flow: result.flow,
        key_progression: keyProgression,
        notes: result.notes,
      }
    } catch (error) {
      console.error("Error generating AI worship set:", error)
      return this.generateFallbackWorshipSet(date, theme, language, duration)
    }
  }

  static async suggestSongsForTheme(theme: string, language: "pt" | "en" | "fr" = "pt", limit = 10): Promise<Song[]> {
    try {
      const systemPrompt = `You are an AI worship planning assistant. Suggest songs that match specific themes and create meaningful worship experiences.`

      const availableSongs = this.songDatabase.filter((song) => song.language === language)
      const songList = availableSongs.map((song) => `${song.title} - Themes: ${song.theme.join(", ")}`).join("\n")

      const prompt = `
        From this song list, suggest the ${limit} best songs for the theme: "${theme}"
        
        Available songs:
        ${songList}
        
        Consider:
        1. How well song themes match "${theme}"
        2. Variety in tempo and style
        3. Worship flow potential
        4. Congregational engagement
        
        Return the song titles that best match, in order of relevance.
      `

      const suggestionsText = await AIClient.generateText(prompt, systemPrompt)
      const suggestedTitles = suggestionsText
        .split("\n")
        .filter((line) => line.trim())
        .map((line) =>
          line
            .replace(/^\d+\.?\s*/, "")
            .replace(/^-\s*/, "")
            .trim(),
        )
        .slice(0, limit)

      const suggestedSongs: Song[] = []
      for (const title of suggestedTitles) {
        const song = availableSongs.find(
          (s) =>
            s.title.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(s.title.toLowerCase()),
        )
        if (song) suggestedSongs.push(song)
      }

      return suggestedSongs.slice(0, limit)
    } catch (error) {
      console.error("Error suggesting songs for theme:", error)
      return this.songDatabase.filter((song) => song.language === language).slice(0, limit)
    }
  }

  static async generateSetlistForSeries(
    seriesTheme: string,
    numberOfWeeks: number,
    language: "pt" | "en" | "fr" = "pt",
  ): Promise<WorshipSet[]> {
    const sets: WorshipSet[] = []

    for (let week = 1; week <= numberOfWeeks; week++) {
      const weekDate = new Date()
      weekDate.setDate(weekDate.getDate() + week * 7)

      const weeklyTheme = `${seriesTheme} - Week ${week}`
      const set = await this.generateWorshipSet(weekDate.toISOString().split("T")[0], weeklyTheme, language)

      sets.push(set)

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    return sets
  }

  private static generateKeyProgression(songs: Song[]): string[] {
    const keys = songs.map((song) => song.key)
    const progression: string[] = []

    for (let i = 0; i < keys.length - 1; i++) {
      const currentKey = keys[i]
      const nextKey = keys[i + 1]

      if (this.areKeysCompatible(currentKey, nextKey)) {
        progression.push(`${currentKey} → ${nextKey} (smooth transition)`)
      } else {
        progression.push(`${currentKey} → ${nextKey} (modulation needed)`)
      }
    }

    return progression
  }

  private static areKeysCompatible(key1: string, key2: string): boolean {
    const compatibleKeys: Record<string, string[]> = {
      C: ["F", "G", "Am", "Dm"],
      G: ["C", "D", "Em", "Am"],
      D: ["G", "A", "Bm", "Em"],
      A: ["D", "E", "F#m", "Bm"],
      F: ["C", "Bb", "Dm", "Gm"],
    }
    return compatibleKeys[key1]?.includes(key2) || false
  }

  private static generateFallbackWorshipSet(
    date: string,
    theme: string,
    language: "pt" | "en" | "fr",
    duration: number,
  ): WorshipSet {
    const availableSongs = this.songDatabase.filter((song) => song.language === language)
    const selectedSongs = availableSongs.slice(0, 4)

    return {
      id: `fallback-worship-set-${Date.now()}`,
      date,
      theme,
      songs: selectedSongs,
      totalDuration: duration,
      flow: ["opening", "worship", "message_prep", "response"],
      key_progression: this.generateKeyProgression(selectedSongs),
      notes: `Worship set for ${theme}. AI generation unavailable - using curated selection.`,
    }
  }

  static getSongDatabase(): Song[] {
    return this.songDatabase
  }

  static addSong(song: Omit<Song, "id">): Song {
    const newSong: Song = { ...song, id: `custom-${Date.now()}` }
    this.songDatabase.push(newSong)
    return newSong
  }
}
