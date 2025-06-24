'use client'

import { useState } from "react"
import { HelpCircle, X } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

const docsLinks = [
  { label: "Overview", href: "/documentation#overview" },
  { label: "AI Tools", href: "/documentation#ai-tools" },
  { label: "Member Management", href: "/documentation#member-management" },
  { label: "Resource Library", href: "/documentation#resource-library" },
  { label: "Streaming & Integrations", href: "/documentation#streaming-integrations" },
]

export default function HelpWidget() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-blue-600 text-white rounded-full shadow-lg p-3 hover:bg-blue-700 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Help"
      >
        {open ? <X className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
      </button>
      {open && (
        <div className="mt-2 w-72 bg-white rounded-xl shadow-2xl p-4 border border-blue-100 animate-fade-in">
          <h3 className="font-bold text-lg mb-2 text-blue-700">Need Help?</h3>
          <ul className="space-y-2 mb-3">
            {docsLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="border-t pt-2 text-sm">
            <span>Still stuck? </span>
            <a href="mailto:support@mobilechurch.com" className="text-blue-600 hover:underline">Contact Support</a>
          </div>
        </div>
      )}
    </div>
  )
}

// ――― Context-aware help popover ─────────────────────────────────────────────

/**
 * A small popover that shows context-specific help.
 * Usage: <ContextualHelp section="members" />
 */
export function ContextualHelp({ section }: { section: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Ajuda sobre ${section}`}>
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-sm">
        <p className="mb-2 text-sm">
          Precisa de ajuda sobre <strong>{section}</strong>?
        </p>
        <Button asChild size="sm" className="w-full">
          <a href={`/documentation?section=${encodeURIComponent(section)}`}>Abrir documentação</a>
        </Button>
      </PopoverContent>
    </Popover>
  )
}
