"use client"

import nlp from "compromise"
import { AdvancedNLPProcessor } from "./advanced-nlp-processor"
import { MultilingualNLPProcessor } from "./multilingual-nlp-processor"
import { ResumeSectionDetector } from "./resume-section-detector"
import { keywordExtractor } from "./keyword-extractor"

export class HybridNLPProcessor {
  // Process text using a hybrid approach
  static async processText(text: string): Promise<any> {
    try {
      // Step 1: Use rule-based approach for quick initial analysis
      const ruleBasedResults = this.processWithRules(text)

      // Step 2: Use ML-based approach for deeper analysis
      const mlBasedResults = await AdvancedNLPProcessor.processText(text)

      // Step 3: Merge results, preferring ML results when available
      const mergedResults = this.mergeResults(ruleBasedResults, mlBasedResults)

      // Step 4: Add confidence scores
      mergedResults.confidenceScores = {
        ...mlBasedResults.confidenceScores,
        overall: this.calculateOverallConfidence(mergedResults),
      }

      return mergedResults
    } catch (error) {
      console.error("Error in hybrid NLP processing:", error)
      // Fall back to rule-based approach if ML approach fails
      return this.processWithRules(text)
    }
  }

  // Process text using rule-based approach
  private static processWithRules(text: string): any {
    // Use compromise.js for basic NLP
    const doc = nlp(text)

    // Extract entities
    const people = doc.people().out("array")
    const organizations = doc.organizations().out("array")
    const dates = doc.dates().out("array")
    const emails = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || []
    const phones = text.match(/\b(?:\+\d{1,3}[-\s]?)?(?:$$\d{3}$$|\d{3})[-\s.]?\d{3}[-\s.]?\d{4}\b/g) || []
    const urls = text.match(/\bhttps?:\/\/[^\s]+\b/g) || []

    // Extract skills using keyword extractor
    const skills = keywordExtractor.extractKeywordsBasic(text)

    // Extract job titles using patterns
    const jobTitles = this.extractJobTitles(text)

    return {
      people,
      organizations,
      dates,
      emails,
      phones,
      urls,
      skills,
      jobTitles,
      // Add rule-based confidence scores (lower than ML-based)
      confidenceScores: {
        people: this.createConfidenceMap(people, 0.7),
        organizations: this.createConfidenceMap(organizations, 0.7),
        skills: this.createConfidenceMap(skills, 0.6),
        jobTitles: this.createConfidenceMap(jobTitles, 0.6),
        overall: 0.65,
      },
    }
  }

  // Extract job titles using patterns
  private static extractJobTitles(text: string): string[] {
    const jobTitlePatterns = [
      /\b(?:Senior|Junior|Lead|Principal|Staff|Chief|Head|Director)\s+(?:Software|Systems|Data|Frontend|Backend|Full Stack|DevOps|Cloud|Mobile|UI\/UX|Product|Project)\s+(?:Engineer|Developer|Architect|Designer|Manager|Analyst|Scientist|Consultant)\b/gi,
      /\b(?:Software|Systems|Data|Frontend|Backend|Full Stack|DevOps|Cloud|Mobile|UI\/UX|Product|Project)\s+(?:Engineer|Developer|Architect|Designer|Manager|Analyst|Scientist|Consultant)\b/gi,
      /\b(?:CTO|CEO|CIO|CFO|COO|VP|Director)\s+(?:of|,)?\s+(?:Engineering|Technology|Product|Operations|Finance|Marketing|Sales)\b/gi,
    ]

    const jobTitles = []

    for (const pattern of jobTitlePatterns) {
      const matches = text.match(pattern)
      if (matches) {
        jobTitles.push(...matches)
      }
    }

    return [...new Set(jobTitles)]
  }

  // Create a confidence map for entities
  private static createConfidenceMap(entities: string[], defaultConfidence: number): Record<string, number> {
    const confidenceMap: Record<string, number> = {}
    entities.forEach((entity) => {
      confidenceMap[entity] = defaultConfidence
    })
    return confidenceMap
  }

  // Merge results from rule-based and ML-based approaches
  private static mergeResults(ruleBasedResults: any, mlBasedResults: any): any {
    const merged: any = { ...mlBasedResults }

    // For each entity type in rule-based results
    for (const entityType in ruleBasedResults) {
      if (entityType === "confidenceScores") continue

      // If ML results don't have this entity type, use rule-based
      if (!merged[entityType]) {
        merged[entityType] = ruleBasedResults[entityType]
      }
      // If both have this entity type, combine and deduplicate
      else if (Array.isArray(ruleBasedResults[entityType]) && Array.isArray(merged[entityType])) {
        merged[entityType] = [...new Set([...merged[entityType], ...ruleBasedResults[entityType]])]
      }
    }

    return merged
  }

  // Calculate overall confidence score
  private static calculateOverallConfidence(results: any): number {
    // Get all confidence scores
    const scores = []
    if (results.confidenceScores) {
      for (const entityType in results.confidenceScores) {
        if (entityType === "overall") continue

        if (typeof results.confidenceScores[entityType] === "number") {
          scores.push(results.confidenceScores[entityType])
        } else if (typeof results.confidenceScores[entityType] === "object") {
          // If it's a map of entity -> confidence, get the average
          const entityScores = Object.values(results.confidenceScores[entityType]) as number[]
          if (entityScores.length > 0) {
            scores.push(entityScores.reduce((sum, score) => sum + score, 0) / entityScores.length)
          }
        }
      }
    }

    // Calculate average confidence score
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0.5
  }

  // Process multilingual text
  static async processMultilingualText(text: string): Promise<any> {
    return MultilingualNLPProcessor.processText(text)
  }

  // Process resume with section detection
  static async processResumeWithSections(text: string): Promise<any> {
    try {
      // Detect sections
      const { sections, unclassified } = await ResumeSectionDetector.detectSections(text)

      // Process each section
      const processedSections = await Promise.all(
        sections.map(async (section) => {
          const processed = await this.processText(section.content)
          return {
            ...section,
            entities: processed,
          }
        }),
      )

      return {
        sections: processedSections,
        unclassified,
      }
    } catch (error) {
      console.error("Error processing resume with sections:", error)
      // Fall back to processing the entire text
      const processed = await this.processText(text)
      return {
        sections: [
          {
            type: "full",
            title: "Full Resume",
            content: text,
            startIndex: 0,
            endIndex: text.length,
            entities: processed,
          },
        ],
        unclassified: [],
      }
    }
  }
}
