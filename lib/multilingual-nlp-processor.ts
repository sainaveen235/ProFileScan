"use client"

import { generateText } from "@/lib/gemini-client"
import { AdvancedNLPProcessor } from "./advanced-nlp-processor"

export class MultilingualNLPProcessor {
  // Detect the language of the text
  static async detectLanguage(text: string): Promise<string> {
    try {
      const prompt = `Detect the language of the following text. Return only the ISO 639-1 language code (e.g., 'en' for English, 'es' for Spanish, etc.).

      Text: ${text}`

      const response = await generateText(prompt, 0.1)
      return response.trim().toLowerCase()
    } catch (error) {
      console.error("Error detecting language:", error)
      return "en" // Default to English on error
    }
  }

  // Translate text to English for processing
  static async translateToEnglish(text: string, sourceLanguage: string): Promise<string> {
    if (sourceLanguage === "en") return text

    try {
      const prompt = `Translate the following text to ${sourceLanguage}. Return only the translated text, no explanations.

      Text: ${text}`

      const response = await generateText(prompt, 0.3)
      return response.trim()
    } catch (error) {
      console.error("Error translating text:", error)
      return text // Return original text if translation fails
    }
  }

  // Process text in any language
  static async processText(text: string): Promise<any> {
    try {
      // Detect language
      const language = await this.detectLanguage(text)

      // If not English, translate to English for processing
      let processedText = text
      if (language !== "en") {
        processedText = await this.translateToEnglish(text, language)
      }

      // Process the text with the advanced NLP processor
      const results = await AdvancedNLPProcessor.processText(processedText)

      // Add language information to results
      return {
        ...results,
        language,
      }
    } catch (error) {
      console.error("Error in multilingual processing:", error)
      // Fall back to basic processing
      return AdvancedNLPProcessor.processText(text)
    }
  }

  // Translate results back to original language if needed
  static async translateResults(results: any, targetLanguage: string): Promise<any> {
    if (targetLanguage === "en") return results

    try {
      const { text: translatedJson } = await generateText({
        model: "gpt-4o",
        prompt: `Translate the following JSON object from English to ${targetLanguage}. 
        Only translate string values that represent human-readable text (e.g., summaries, comments, descriptions).
        Do not translate technical terms, names, or identifiers.
        
        ${JSON.stringify(results, null, 2)}
        
        Return the translated JSON object.`,
        temperature: 0.1,
        maxTokens: 4000,
      })

      return JSON.parse(translatedJson)
    } catch (error) {
      console.error("Error translating results:", error)
      return results // Return original results if translation fails
    }
  }
}
