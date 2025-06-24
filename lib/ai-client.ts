import { generateText, generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// DeepSeek R1 via OpenRouter configuration
const deepseek = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "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",
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://smart-church-app.vercel.app",
    "X-Title": "Smart Church App - AI Assistant",
  },
})

export const AI_MODEL = "deepseek/deepseek-r1-0528"

export class AIClient {
  static async generateText(prompt: string, systemPrompt?: string) {
    try {
      const messages = []

      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt })
      }

      messages.push({ role: "user", content: prompt })

      const { text } = await generateText({
        model: deepseek(AI_MODEL),
        messages,
        temperature: 0.7,
        maxTokens: 2000,
      })

      return text
    } catch (error) {
      console.error("AI text generation error:", error)
      throw new Error("Failed to generate AI response")
    }
  }

  static async generateObject<T>(prompt: string, schema: any, systemPrompt?: string): Promise<T> {
    try {
      const messages = []

      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt })
      }

      messages.push({ role: "user", content: prompt })

      const { object } = await generateObject({
        model: deepseek(AI_MODEL),
        messages,
        schema,
        temperature: 0.7,
      })

      return object as T
    } catch (error) {
      console.error("AI object generation error:", error)
      throw new Error("Failed to generate structured AI response")
    }
  }

  static async generateChat(messages: Array<{ role: string; content: string }>) {
    try {
      const { text } = await generateText({
        model: deepseek(AI_MODEL),
        messages,
        temperature: 0.7,
        maxTokens: 1500,
      })

      return text
    } catch (error) {
      console.error("AI chat generation error:", error)
      throw new Error("Failed to generate chat response")
    }
  }

  // Direct fetch method for custom implementations
  static async directFetch(
    messages: Array<{ role: string; content: string }>,
    options?: {
      temperature?: number
      maxTokens?: number
      stream?: boolean
    },
  ) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY || "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"}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://smart-church-app.vercel.app",
          "X-Title": "Smart Church App - AI Assistant",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: messages,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1500,
          stream: options?.stream || false,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || "No response generated"
    } catch (error) {
      console.error("Direct AI fetch error:", error)
      throw new Error("Failed to fetch AI response")
    }
  }
}
