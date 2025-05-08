"use client"

import nlp from "compromise"
import { generateText } from "@/lib/gemini-client"

export class KeywordExtractor {
  // Cache for extracted keywords
  private keywordCache: Map<string, string[]> = new Map()

  // Extract keywords from text using compromise.js
  extractKeywordsBasic(text: string): string[] {
    // Check cache first
    if (this.keywordCache.has(text)) {
      return this.keywordCache.get(text)!
    }

    const doc = nlp(text)

    // Extract nouns and noun phrases
    const nouns = doc.nouns().out("array")

    // Extract verbs
    const verbs = doc.verbs().out("array")

    // Extract adjectives
    const adjectives = doc.adjectives().out("array")

    // Combine and filter
    const keywords = [...new Set([...nouns, ...verbs, ...adjectives])].filter((word) => word.length > 2) // Filter out short words

    // Cache the results
    this.keywordCache.set(text, keywords)

    return keywords
  }

  // Extract keywords with AI enhancement
  async extractKeywordsAdvanced(
    text: string,
    context: "resume" | "job" = "resume",
  ): Promise<{
    keywords: string[]
    technicalTerms: string[]
    domainSpecificTerms: string[]
    actionVerbs: string[]
    metrics: string[]
  }> {
    try {
      const { text: keywordsJson } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Extract important keywords from the following ${context} text.
        Categorize them into:
        1. Technical terms (programming languages, tools, frameworks, etc.)
        2. Domain-specific terms (industry jargon, methodologies, etc.)
        3. Action verbs (achieved, implemented, etc.)
        4. Metrics (percentages, numbers, KPIs, etc.)
        
        Text:
        ${text}
        
        Return a JSON object with arrays for each category.`,
        temperature: 0.1,
        maxTokens: 1000,
      })

      return JSON.parse(keywordsJson)
    } catch (error) {
      console.error("Error extracting advanced keywords:", error)

      // Fall back to basic extraction
      const basicKeywords = this.extractKeywordsBasic(text)
      return {
        keywords: basicKeywords,
        technicalTerms: [],
        domainSpecificTerms: [],
        actionVerbs: [],
        metrics: [],
      }
    }
  }

  // Extract industry-specific terminology
  async extractIndustryTerminology(text: string, industry: string): Promise<string[]> {
    try {
      const { text: termsJson } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Extract industry-specific terminology for the ${industry} industry from the following text.
        Focus on terms that would be recognized by professionals in this field.
        
        Text:
        ${text}
        
        Return a JSON array of strings.`,
        temperature: 0.1,
        maxTokens: 500,
      })

      return JSON.parse(termsJson)
    } catch (error) {
      console.error("Error extracting industry terminology:", error)
      return []
    }
  }

  // Calculate keyword density
  calculateKeywordDensity(text: string, keywords: string[]): Map<string, number> {
    const wordCount = text.split(/\s+/).length
    const densityMap = new Map<string, number>()

    keywords.forEach((keyword) => {
      // Create regex that matches the keyword as a whole word
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      const matches = text.match(regex)
      const count = matches ? matches.length : 0
      const density = count / wordCount

      densityMap.set(keyword, density)
    })

    return densityMap
  }
}

// Export a singleton instance for easy imports
export const keywordExtractor = new KeywordExtractor()

export async function extractKeywords(text: string): Promise<string[]> {
  try {
    const prompt = `Extract key technical skills, tools, technologies, and methodologies from the following text. 
    Return only a JSON array of strings, with each string being a distinct keyword or skill.
    
    Text: ${text}`

    const response = await generateText(prompt, 0.3)
    const keywords = JSON.parse(response)
    
    return Array.isArray(keywords) ? keywords : []
  } catch (error) {
    console.error("Error extracting keywords:", error)
    return []
  }
}

export async function extractIndustryTerms(text: string, industry: string): Promise<string[]> {
  try {
    const prompt = `Extract industry-specific terminology and jargon from the following text, focusing on the ${industry} industry.
    Return only a JSON array of strings, with each string being a distinct industry term.
    
    Text: ${text}`

    const response = await generateText(prompt, 0.3)
    const terms = JSON.parse(response)
    
    return Array.isArray(terms) ? terms : []
  } catch (error) {
    console.error("Error extracting industry terms:", error)
    return []
  }
}
