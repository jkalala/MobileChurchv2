'use client'

import { useState, useEffect } from "react"

const steps = [
  {
    id: "ai-tools",
    selector: "[data-onboarding='ai-tools']",
    title: "AI Tools",
    content: "Explore AI-powered Bible study, sermon prep, and more!",
  },
  {
    id: "member-management",
    selector: "[data-onboarding='member-management']",
    title: "Member Management",
    content: "Add, edit, and organize your church members easily.",
  },
  {
    id: "resource-library",
    selector: "[data-onboarding='resource-library']",
    title: "Resource Library",
    content: "Upload and share sermons, media, and documents.",
  },
  {
    id: "streaming",
    selector: "[data-onboarding='streaming']",
    title: "Streaming & Integrations",
    content: "Connect with Zoom, WhatsApp, and more for live events.",
  },
]

export default function OnboardingTooltips() {
  const [step, setStep] = useState<number | null>(null)

  useEffect(() => {
    const completed = localStorage.getItem("onboarding-complete")
    if (!completed) setStep(0)
  }, [])

  useEffect(() => {
    if (step === null || step >= steps.length) return
    const el = document.querySelector(steps[step].selector)
    if (el) {
      const rect = el.getBoundingClientRect()
      const tooltip = document.createElement("div")
      tooltip.className = "fixed z-50 bg-white border border-blue-200 shadow-xl rounded-lg p-4 w-72 animate-fade-in"
      tooltip.style.top = `${rect.bottom + 8 + window.scrollY}px`
      tooltip.style.left = `${rect.left + window.scrollX}px`
      tooltip.innerHTML = `
        <div class='font-bold text-blue-700 mb-1'>${steps[step].title}</div>
        <div class='text-sm mb-2'>${steps[step].content}</div>
        <button class='bg-blue-600 text-white rounded px-3 py-1 text-xs' id='onboarding-next'>Next</button>
        <button class='ml-2 text-xs text-gray-500 underline' id='onboarding-skip'>Skip</button>
      `
      document.body.appendChild(tooltip)
      document.getElementById("onboarding-next")?.addEventListener("click", () => {
        tooltip.remove()
        setStep((s) => (s !== null ? s + 1 : null))
      })
      document.getElementById("onboarding-skip")?.addEventListener("click", () => {
        tooltip.remove()
        setStep(null)
        localStorage.setItem("onboarding-complete", "1")
      })
      return () => tooltip.remove()
    }
  }, [step])

  useEffect(() => {
    if (step !== null && step >= steps.length) {
      localStorage.setItem("onboarding-complete", "1")
      setStep(null)
    }
  }, [step])

  return null
} 