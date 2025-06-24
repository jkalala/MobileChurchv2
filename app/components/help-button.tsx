"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HelpCircle, ExternalLink } from "lucide-react"

interface HelpButtonProps {
  title: string
  content: string
  link?: string
  size?: "sm" | "default" | "lg"
}

export default function HelpButton({ title, content, link, size = "sm" }: HelpButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size={size} className="p-1 h-auto text-gray-400 hover:text-gray-600">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-600">{content}</p>
          {link && (
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href={link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Saiba Mais
              </a>
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
