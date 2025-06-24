import { AIClient } from "./ai-client"
import { z } from "zod"

export interface SermonOutline {
  id: string
  title: string
  theme: string
  mainText: string
  supportingTexts: string[]
  outline: {
    introduction: string
    points: {
      title: string
      scripture: string
      explanation: string
      application: string
    }[]
    conclusion: string
  }
  illustrations: string[]
  applicationQuestions: string[]
  language: "pt" | "en" | "fr"
  estimatedDuration: number
}

const SermonSchema = z.object({
  title: z.string(),
  mainText: z.string(),
  supportingTexts: z.array(z.string()),
  introduction: z.string(),
  points: z.array(
    z.object({
      title: z.string(),
      scripture: z.string(),
      explanation: z.string(),
      application: z.string(),
    }),
  ),
  conclusion: z.string(),
  illustrations: z.array(z.string()),
  applicationQuestions: z.array(z.string()),
})

export class AISermonAssistant {
  private static bibleVerses: BibleVerse[] = [
    // Portuguese verses
    {
      reference: "João 3:16",
      text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
      version: "ARA",
      language: "pt",
      theme: ["amor de Deus", "salvação", "vida eterna", "sacrifício"],
    },
    {
      reference: "Romanos 8:28",
      text: "Sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto.",
      version: "ARA",
      language: "pt",
      theme: ["propósito", "soberania", "esperança", "confiança"],
    },
    {
      reference: "Filipenses 4:13",
      text: "Posso todas as coisas naquele que me fortalece.",
      version: "ARA",
      language: "pt",
      theme: ["força", "capacitação", "vitória", "dependência de Deus"],
    },
    {
      reference: "Salmos 23:1",
      text: "O Senhor é o meu pastor; nada me faltará.",
      version: "ARA",
      language: "pt",
      theme: ["cuidado", "provisão", "proteção", "confiança"],
    },
    {
      reference: "Jeremias 29:11",
      text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
      version: "ARA",
      language: "pt",
      theme: ["esperança", "futuro", "planos de Deus", "paz"],
    },

    // English verses
    {
      reference: "John 3:16",
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      version: "NIV",
      language: "en",
      theme: ["God's love", "salvation", "eternal life", "sacrifice"],
    },
    {
      reference: "Romans 8:28",
      text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
      version: "NIV",
      language: "en",
      theme: ["purpose", "sovereignty", "hope", "trust"],
    },
    {
      reference: "Philippians 4:13",
      text: "I can do all this through him who gives me strength.",
      version: "NIV",
      language: "en",
      theme: ["strength", "empowerment", "victory", "dependence on God"],
    },
    {
      reference: "Psalm 23:1",
      text: "The Lord is my shepherd, I lack nothing.",
      version: "NIV",
      language: "en",
      theme: ["care", "provision", "protection", "trust"],
    },
    {
      reference: "Jeremiah 29:11",
      text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
      version: "NIV",
      language: "en",
      theme: ["hope", "future", "God's plans", "peace"],
    },

    // French verses
    {
      reference: "Jean 3:16",
      text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
      version: "LSG",
      language: "fr",
      theme: ["amour de Dieu", "salut", "vie éternelle", "sacrifice"],
    },
    {
      reference: "Romains 8:28",
      text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.",
      version: "LSG",
      language: "fr",
      theme: ["dessein", "souveraineté", "espoir", "confiance"],
    },
  ]

  static async generateSermonOutline(
    theme: string,
    targetAudience: "general" | "youth" | "children" | "seniors" = "general",
    language: "pt" | "en" | "fr" = "pt",
    duration = 30,
  ): Promise<SermonOutline> {
    try {
      const languageMap = {
        pt: "Portuguese",
        en: "English",
        fr: "French",
      }

      const systemPrompt = `You are an AI assistant helping pastors create sermon outlines. Generate biblically sound, engaging, and practical sermon content that connects with the congregation and provides clear spiritual guidance.`

      const prompt = `
        Create a complete sermon outline with the following specifications:
        
        Theme: ${theme}
        Target Audience: ${targetAudience}
        Language: ${languageMap[language]}
        Duration: ${duration} minutes
        
        Generate a sermon outline that includes:
        
        1. Compelling sermon title related to the theme
        2. Main biblical text (primary scripture reference)
        3. 2-3 supporting scripture references
        4. Introduction (hook, context, preview - 2-3 sentences)
        5. 3 main points, each with:
           - Point title
           - Supporting scripture
           - Explanation (2-3 sentences)
           - Practical application (2-3 sentences)
        6. Conclusion (summary, call to action - 2-3 sentences)
        7. 3-4 illustration ideas (stories, analogies, examples)
        8. 4-5 application questions for reflection
        
        Make it appropriate for ${targetAudience} audience and write in ${languageMap[language]}.
        Ensure biblical accuracy and practical relevance.
        
        Return as structured JSON matching the schema.
      `

      const result = await AIClient.generateObject(prompt, SermonSchema, systemPrompt)

      return {
        id: `sermon-${Date.now()}`,
        title: result.title,
        theme,
        mainText: result.mainText,
        supportingTexts: result.supportingTexts,
        outline: {
          introduction: result.introduction,
          points: result.points,
          conclusion: result.conclusion,
        },
        illustrations: result.illustrations,
        applicationQuestions: result.applicationQuestions,
        language,
        estimatedDuration: duration,
      }
    } catch (error) {
      console.error("Error generating sermon outline:", error)
      return this.generateFallbackSermon(theme, language, duration)
    }
  }

  static async generateSermonSeries(
    seriesTitle: string,
    numberOfSermons: number,
    language: "pt" | "en" | "fr" = "pt",
  ): Promise<SermonOutline[]> {
    try {
      const systemPrompt = `You are an AI assistant helping pastors create sermon series. Generate a cohesive series of sermons that build upon each other and provide comprehensive spiritual teaching.`

      const prompt = `
        Create a ${numberOfSermons}-part sermon series titled "${seriesTitle}".
        
        Generate ${numberOfSermons} related themes that:
        1. Build upon each other logically
        2. Cover different aspects of the main topic
        3. Progress from foundational to practical application
        4. Are suitable for a general church audience
        
        Language: ${language === "pt" ? "Portuguese" : language === "fr" ? "French" : "English"}
        
        Return just the themes as a simple array of strings.
      `

      const themesText = await AIClient.generateText(prompt, systemPrompt)
      const themes = themesText
        .split("\n")
        .filter((line) => line.trim())
        .map((line) =>
          line
            .replace(/^\d+\.?\s*/, "")
            .replace(/^-\s*/, "")
            .trim(),
        )
        .slice(0, numberOfSermons)

      const sermons: SermonOutline[] = []

      for (let i = 0; i < themes.length; i++) {
        const sermon = await this.generateSermonOutline(themes[i], "general", language)
        sermon.title = `${seriesTitle} - Part ${i + 1}: ${sermon.title}`
        sermons.push(sermon)

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      return sermons
    } catch (error) {
      console.error("Error generating sermon series:", error)
      return []
    }
  }

  static async suggestVersesForTopic(topic: string, language: "pt" | "en" | "fr" = "pt", limit = 5): Promise<string[]> {
    try {
      const systemPrompt = `You are a biblical scholar AI assistant. Suggest relevant Bible verses for sermon topics. Provide accurate scripture references and ensure they are appropriate for the topic.`

      const prompt = `
        Suggest ${limit} Bible verses that are most relevant to the topic: "${topic}"
        
        Language: ${language === "pt" ? "Portuguese" : language === "fr" ? "French" : "English"}
        
        Return only the scripture references (e.g., "John 3:16", "Romans 8:28") as a simple list.
        Choose verses that directly relate to the topic and would be suitable for preaching.
      `

      const versesText = await AIClient.generateText(prompt, systemPrompt)
      return versesText
        .split("\n")
        .filter((line) => line.trim())
        .map((line) =>
          line
            .replace(/^\d+\.?\s*/, "")
            .replace(/^-\s*/, "")
            .trim(),
        )
        .slice(0, limit)
    } catch (error) {
      console.error("Error suggesting verses:", error)
      return ["John 3:16", "Romans 8:28", "Philippians 4:13"]
    }
  }

  private static generateFallbackSermon(theme: string, language: "pt" | "en" | "fr", duration: number): SermonOutline {
    const templates = {
      pt: {
        title: `A Importância da ${theme}`,
        mainText: "João 3:16",
        introduction: `Hoje vamos explorar o tema da ${theme} e como isso se aplica às nossas vidas.`,
        conclusion: `Que Deus nos ajude a viver plenamente esta verdade sobre ${theme}.`,
      },
      en: {
        title: `The Importance of ${theme}`,
        mainText: "John 3:16",
        introduction: `Today we will explore the theme of ${theme} and how it applies to our lives.`,
        conclusion: `May God help us to fully live this truth about ${theme}.`,
      },
      fr: {
        title: `L'Importance de ${theme}`,
        mainText: "Jean 3:16",
        introduction: `Aujourd'hui, nous allons explorer le thème de ${theme} et comment cela s'applique à nos vies.`,
        conclusion: `Que Dieu nous aide à vivre pleinement cette vérité sur ${theme}.`,
      },
    }

    const template = templates[language]

    return {
      id: `fallback-sermon-${Date.now()}`,
      title: template.title,
      theme,
      mainText: template.mainText,
      supportingTexts: ["Romans 8:28", "Philippians 4:13"],
      outline: {
        introduction: template.introduction,
        points: [
          {
            title: `Understanding ${theme}`,
            scripture: template.mainText,
            explanation: `This passage teaches us about ${theme}.`,
            application: `We can apply this by living out ${theme} daily.`,
          },
        ],
        conclusion: template.conclusion,
      },
      illustrations: [`Personal story about ${theme}`, `Example from daily life`],
      applicationQuestions: [`How does ${theme} impact your life?`, `What steps can you take this week?`],
      language,
      estimatedDuration: duration,
    }
  }
}

export interface BibleVerse {
  reference: string
  text: string
  version: string
  language: "pt" | "en" | "fr"
  theme: string[]
}
