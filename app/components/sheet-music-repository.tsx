"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Music, Search, Download, Play, Pause, Calendar, Plus, Volume2, Star, BookOpen } from "lucide-react"
import { DatabaseService } from "@/lib/database"
import { toast } from "sonner"

interface SheetMusic {
  id: string
  title: string
  composer: string
  arranger?: string
  category_id: string
  category_name?: string
  key_signature: string
  time_signature?: string
  difficulty_level: string
  voice_parts: string[]
  tempo_marking?: string
  duration_minutes?: number
  sheet_music_url: string
  audio_url?: string
  lyrics?: string
  notes?: string
  copyright_info?: string
  is_public_domain: boolean
  tags: string[]
  created_at: string
}

interface MusicCategory {
  id: string
  name: string
  description: string
  color: string
}

interface PracticeSession {
  id: string
  sheet_music_id: string
  session_date: string
  notes: string
  attendees: string[]
  duration_minutes: number
}

export default function SheetMusicRepository() {
  const [sheetMusic, setSheetMusic] = useState<SheetMusic[]>([])
  const [categories, setCategories] = useState<MusicCategory[]>([])
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedKey, setSelectedKey] = useState<string>("all")
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [selectedMusic, setSelectedMusic] = useState<SheetMusic | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load sheet music, categories, and practice sessions
      const [musicData, categoriesData, sessionsData] = await Promise.all([
        loadSheetMusic(),
        loadCategories(),
        loadPracticeSessions(),
      ])

      setSheetMusic(musicData)
      setCategories(categoriesData)
      setPracticeSessions(sessionsData)
    } catch (error) {
      console.error("Error loading sheet music data:", error)
      toast.error("Failed to load sheet music data")
    } finally {
      setLoading(false)
    }
  }

  const loadSheetMusic = async (): Promise<SheetMusic[]> => {
    try {
      const client = await DatabaseService.getClient()
      const { data, error } = await client
        .from("sheet_music")
        .select(`
          *,
          music_categories (
            name,
            color
          )
        `)
        .order("title")

      if (error) throw error

      return (
        data?.map((item) => ({
          ...item,
          category_name: item.music_categories?.name,
        })) || []
      )
    } catch (error) {
      console.error("Error loading sheet music:", error)
      return getDemoSheetMusic()
    }
  }

  const loadCategories = async (): Promise<MusicCategory[]> => {
    try {
      const client = await DatabaseService.getClient()
      const { data, error } = await client.from("music_categories").select("*").order("name")

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error loading categories:", error)
      return getDemoCategories()
    }
  }

  const loadPracticeSessions = async (): Promise<PracticeSession[]> => {
    try {
      const client = await DatabaseService.getClient()
      const { data, error } = await client
        .from("practice_sessions")
        .select("*")
        .order("session_date", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error loading practice sessions:", error)
      return []
    }
  }

  const filteredMusic = sheetMusic.filter((music) => {
    const matchesSearch =
      music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      music.composer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      music.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || music.category_name === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || music.difficulty_level === selectedDifficulty
    const matchesKey = selectedKey === "all" || music.key_signature === selectedKey

    return matchesSearch && matchesCategory && matchesDifficulty && matchesKey
  })

  const uniqueKeys = [...new Set(sheetMusic.map((m) => m.key_signature))].sort()
  const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"]

  const handlePlayAudio = (musicId: string, audioUrl?: string) => {
    if (!audioUrl) {
      toast.error("Audio file not available")
      return
    }

    if (currentlyPlaying === musicId) {
      setCurrentlyPlaying(null)
      // Stop audio playback
    } else {
      setCurrentlyPlaying(musicId)
      // Start audio playback
      toast.success("Playing audio preview")
    }
  }

  const handleDownloadSheet = (sheetUrl: string, title: string) => {
    // In a real app, this would download the actual file
    toast.success(`Downloading sheet music for "${title}"`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-orange-100 text-orange-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName)
    return category?.color || "#3B82F6"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sheet Music Repository</h1>
          <p className="text-gray-600">Manage and access your church's music collection</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Music
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Music className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Songs</p>
                <p className="text-2xl font-bold text-gray-900">{sheetMusic.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Practice Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{practiceSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Public Domain</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sheetMusic.filter((m) => m.is_public_domain).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, composer, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedKey} onValueChange={setSelectedKey}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Key" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Keys</SelectItem>
                {uniqueKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Music Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMusic.map((music) => (
          <Card key={music.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{music.title}</CardTitle>
                  <CardDescription>by {music.composer}</CardDescription>
                </div>
                <Badge style={{ backgroundColor: getCategoryColor(music.category_name || "") }} className="text-white">
                  {music.category_name}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Key: {music.key_signature}</span>
                  <Badge className={getDifficultyColor(music.difficulty_level)}>{music.difficulty_level}</Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {music.voice_parts.slice(0, 3).map((part) => (
                    <Badge key={part} variant="outline" className="text-xs">
                      {part}
                    </Badge>
                  ))}
                  {music.voice_parts.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{music.voice_parts.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {music.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {music.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{music.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadSheet(music.sheet_music_url, music.title)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    {music.audio_url && (
                      <Button size="sm" variant="outline" onClick={() => handlePlayAudio(music.id, music.audio_url)}>
                        {currentlyPlaying === music.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setSelectedMusic(music)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{music.title}</DialogTitle>
                        <DialogDescription>
                          Composed by {music.composer}
                          {music.arranger && ` • Arranged by ${music.arranger}`}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Key:</strong> {music.key_signature}
                          </div>
                          <div>
                            <strong>Difficulty:</strong> {music.difficulty_level}
                          </div>
                          <div>
                            <strong>Voice Parts:</strong> {music.voice_parts.join(", ")}
                          </div>
                          <div>
                            <strong>Duration:</strong> {music.duration_minutes || "N/A"} min
                          </div>
                        </div>

                        {music.lyrics && (
                          <div>
                            <strong>Lyrics:</strong>
                            <ScrollArea className="h-32 w-full border rounded p-2 mt-1">
                              <p className="text-sm whitespace-pre-line">{music.lyrics}</p>
                            </ScrollArea>
                          </div>
                        )}

                        {music.notes && (
                          <div>
                            <strong>Notes:</strong>
                            <p className="text-sm text-gray-600 mt-1">{music.notes}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {music.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-2 pt-4">
                          <Button
                            onClick={() => handleDownloadSheet(music.sheet_music_url, music.title)}
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Sheet
                          </Button>

                          {music.audio_url && (
                            <Button
                              variant="outline"
                              onClick={() => handlePlayAudio(music.id, music.audio_url)}
                              className="flex-1"
                            >
                              <Volume2 className="h-4 w-4 mr-2" />
                              Play Audio
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMusic.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No music found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add new sheet music to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // Demo data functions
  function getDemoSheetMusic(): SheetMusic[] {
    return [
      {
        id: "demo-1",
        title: "Amazing Grace",
        composer: "John Newton",
        category_id: "hymns",
        category_name: "Hymns",
        key_signature: "G Major",
        difficulty_level: "Beginner",
        voice_parts: ["Soprano", "Alto", "Tenor", "Bass"],
        sheet_music_url: "/music/sheets/amazing-grace.pdf",
        audio_url: "/music/audio/amazing-grace.mp3",
        lyrics: "Amazing grace how sweet the sound, that saved a wretch like me...",
        is_public_domain: true,
        tags: ["grace", "salvation", "classic"],
        created_at: new Date().toISOString(),
      },
    ]
  }

  function getDemoCategories(): MusicCategory[] {
    return [
      { id: "hymns", name: "Hymns", description: "Traditional church hymns", color: "#8B5CF6" },
      { id: "contemporary", name: "Contemporary", description: "Modern worship songs", color: "#10B981" },
    ]
  }
}
