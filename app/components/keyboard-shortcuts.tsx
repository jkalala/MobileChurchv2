"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export default function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Help shortcut: Ctrl/Cmd + ?
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault()
        // Trigger help widget
        const helpButton = document.querySelector("[data-help-trigger]") as HTMLButtonElement
        if (helpButton) {
          helpButton.click()
        } else {
          toast.info("Pressione o botão 'Ajuda' no canto inferior direito para obter ajuda")
        }
      }

      // Quick search: Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault()
        window.location.href = "/dashboard?tab=documentation"
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return null
}
