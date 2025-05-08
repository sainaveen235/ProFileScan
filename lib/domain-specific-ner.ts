"use client"

import { generateText } from "@/lib/gemini-client"

export class DomainSpecificNER {
  // Extract domain-specific entities from text
  static async extractEntities(
    text: string,
    domain: string,
  ): Promise<{
    entities: Array<{
      text: string
      type: string
      confidence: number
    }>
  }> {
    try {
      const prompt = `Extract domain-specific entities from the following text, focusing on the ${domain} domain.
      For each entity, provide:
      1. The entity text
      2. The entity type (e.g., "skill", "tool", "methodology", "certification")
      3. A confidence score between 0 and 1
      
      Text: ${text}
      
      Return a JSON object with an "entities" array containing objects with "text", "type", and "confidence" fields.`

      const response = await generateText(prompt, 0.3)
      const result = JSON.parse(response)
      
      return {
        entities: Array.isArray(result.entities) ? result.entities : []
      }
    } catch (error) {
      console.error("Error extracting entities:", error)
      return { entities: [] }
    }
  }

  // Get domain-specific entity types for a given domain
  static getDomainEntityTypes(domain: string): string[] {
    const commonTypes = ["Technical Terms", "Methodologies", "Tools", "Metrics", "Roles"]

    // Add domain-specific entity types
    switch (domain.toLowerCase()) {
      case "software development":
        return [...commonTypes, "Programming Languages", "Frameworks", "Design Patterns", "Development Methodologies"]
      case "data science":
        return [...commonTypes, "Algorithms", "Statistical Methods", "Data Sources", "Visualization Techniques"]
      case "healthcare":
        return [...commonTypes, "Medical Terms", "Procedures", "Regulations", "Patient Care"]
      case "finance":
        return [...commonTypes, "Financial Instruments", "Regulations", "Market Terms", "Risk Metrics"]
      case "marketing":
        return [...commonTypes, "Channels", "Campaign Types", "Audience Segments", "Conversion Metrics"]
      default:
        return commonTypes
    }
  }

  // Extract domain-specific achievements
  static async extractAchievements(
    text: string,
    domain: string,
  ): Promise<Array<{ achievement: string; impact: string; metrics: string; confidence: number }>> {
    try {
      const { text: achievementsJson } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Extract domain-specific achievements from the following text for the ${domain} domain.
        
        Focus on:
        1. Concrete accomplishments
        2. Measurable impact
        3. Domain-specific metrics and KPIs
        4. Technical or business challenges overcome
        
        Text:
        ${text}
        
        Return a JSON array of objects with "achievement", "impact", "metrics", and "confidence" properties.`,
        temperature: 0.1,
        maxTokens: 2000,
      })

      return JSON.parse(achievementsJson)
    } catch (error) {
      console.error("Error extracting domain-specific achievements:", error)
      return []
    }
  }

  // Analyze domain-specific competency
  static async analyzeCompetency(
    resumeText: string,
    jobDescriptionText: string,
    domain: string,
  ): Promise<{
    overallScore: number
    strengths: string[]
    gaps: string[]
    recommendations: string[]
  }> {
    try {
      const { text: analysisJson } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze domain-specific competency for the ${domain} domain by comparing the resume to the job description.
        
        Resume:
        ${resumeText}
        
        Job Description:
        ${jobDescriptionText}
        
        Evaluate:
        1. Overall domain competency score (0-100)
        2. Domain-specific strengths
        3. Domain-specific gaps
        4. Recommendations for improving domain-specific competency
        
        Return a JSON object with "overallScore", "strengths", "gaps", and "recommendations" properties.`,
        temperature: 0.2,
        maxTokens: 2000,
      })

      return JSON.parse(analysisJson)
    } catch (error) {
      console.error("Error analyzing domain-specific competency:", error)
      return {
        overallScore: 0,
        strengths: [],
        gaps: [],
        recommendations: [],
      }
    }
  }

  // Extract relationships between entities
  static async extractRelationships(text: string, domain: string): Promise<{
    relationships: Array<{
      source: string
      target: string
      type: string
      confidence: number
    }>
  }> {
    try {
      const prompt = `Extract relationships between entities in the following text, focusing on the ${domain} domain.
      For each relationship, provide:
      1. Source entity
      2. Target entity
      3. Relationship type (e.g., "uses", "requires", "enhances")
      4. A confidence score between 0 and 1
      
      Text: ${text}
      
      Return a JSON object with a "relationships" array containing objects with "source", "target", "type", and "confidence" fields.`

      const response = await generateText(prompt, 0.3)
      const result = JSON.parse(response)
      
      return {
        relationships: Array.isArray(result.relationships) ? result.relationships : []
      }
    } catch (error) {
      console.error("Error extracting relationships:", error)
      return { relationships: [] }
    }
  }
}
