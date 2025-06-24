"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import type { Language } from "@/lib/i18n"

interface LanguageSelectorProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
  variant?: "button" | "select"
  size?: "sm" | "md" | "lg"
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  variant = "select",
  size = "md",
}: LanguageSelectorProps) {
  const languages = [
    { code: "pt" as Language, name: "Português", flag: "🇦🇴" },
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
  ]

  if (variant === "button") {
    return (
      <div className="flex items-center gap-1">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? "default" : "ghost"}
            size={size === "sm" ? "sm" : "icon"}
            onClick={() => onLanguageChange(lang.code)}
            className={`${size === "sm" ? "h-8 px-2" : "h-10 w-10"}`}
          >
            <span className="text-sm">{lang.flag}</span>
            {size !== "sm" && <span className="sr-only">{lang.name}</span>}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <Select value={currentLanguage} onValueChange={(value: Language) => onLanguageChange(value)}>
      <SelectTrigger className={`w-auto ${size === "sm" ? "h-8" : "h-10"}`}>
        <div className="flex items-center gap-2">
          <Globe className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"}`} />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
