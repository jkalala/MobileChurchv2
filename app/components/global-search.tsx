"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, User, Calendar, DollarSign, FileText, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/app/components/auth-provider"

interface SearchResult {
  id: string
  type: "member" | "event" | "financial" | "sermon" | "prayer"
  title: string
  description: string
  content: string
  metadata: Record<string, any>
  score: number
  highlights?: string[]
}

interface GlobalSearchProps {
  onClose?: () => void
  className?: string
}

export default function GlobalSearch({ onClose, className }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useAuth()
  const { t } = useTranslation(language)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load recent searches from localStorage
    try {
      const saved = localStorage.getItem("recent_searches")
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error)
    }
  }, [])

  useEffect(() => {
    // Handle click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Debounced search
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          filters: {},
          limit: 10,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])

        // Save to recent searches
        const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
        setRecentSearches(updated)
        try {
          localStorage.setItem("recent_searches", JSON.stringify(updated))
        } catch (error) {
          console.error("Failed to save recent searches:", error)
        }
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "member":
        return <User className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      case "financial":
        return <DollarSign className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "member":
        return "bg-blue-100 text-blue-800"
      case "event":
        return "bg-purple-100 text-purple-800"
      case "financial":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleResultClick = (result: SearchResult) => {
    // Navigate based on result type
    const baseUrl = "/dashboard"
    switch (result.type) {
      case "member":
        window.location.href = `${baseUrl}?tab=members&id=${result.id}`
        break
      case "event":
        window.location.href = `${baseUrl}?tab=events&id=${result.id}`
        break
      case "financial":
        window.location.href = `${baseUrl}?tab=financial&id=${result.id}`
        break
      default:
        console.log("Navigate to:", result)
    }
    setIsOpen(false)
    onClose?.()
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={t("common.searchEverything")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {query.length <= 2 && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">{t("common.recentSearches")}</span>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.length > 2 && (
              <>
                {results.length > 0 ? (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2">
                      {results.length} {t("common.results")}
                    </div>
                    {results.map((result, index) => (
                      <div key={index}>
                        <button
                          onClick={() => handleResultClick(result)}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">{getTypeIcon(result.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{result.title}</h4>
                                <Badge variant="secondary" className={`text-xs ${getTypeColor(result.type)}`}>
                                  {t(`common.${result.type}`)}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2">{result.description}</p>
                              {result.highlights && result.highlights.length > 0 && (
                                <div className="mt-1">
                                  <p
                                    className="text-xs text-gray-500"
                                    dangerouslySetInnerHTML={{
                                      __html: result.highlights[0].replace(/<\/?em>/g, "<mark>"),
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0 text-xs text-gray-400">{Math.round(result.score * 100)}%</div>
                          </div>
                        </button>
                        {index < results.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                ) : (
                  !isLoading && (
                    <div className="p-8 text-center text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">{t("common.noResults")}</p>
                      <p className="text-xs mt-1">{t("common.tryDifferentKeywords")}</p>
                    </div>
                  )
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
