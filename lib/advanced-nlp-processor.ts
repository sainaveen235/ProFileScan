"use client"

import { generateText } from "./gemini-client"
import { extractEntities } from "./nlp-processor"

// Advanced NLP processor that uses more sophisticated models
export class AdvancedNLPProcessor {
  // Process text with advanced NLP techniques
  static async processText(text: string) {
    // First use the basic processor for quick results
    const basicResults = extractEntities(text)

    // Then enhance with more sophisticated analysis
    const enhancedResults = await this.enhanceWithAI(text, basicResults)

    return enhancedResults
  }

  // Enhance basic results with AI-powered analysis
  private static async enhanceWithAI(text: string, basicResults: any) {
    try {
      // Use Gemini to generate enhanced analysis
      const { text: enhancedAnalysis } = await generateText({
        prompt: this.createEnhancementPrompt(text, basicResults),
        temperature: 0.2,
        maxTokens: 1500,
      })

      // Parse the enhanced analysis
      const enhancedData = JSON.parse(enhancedAnalysis)

      // Merge with basic results, preferring enhanced data
      return {
        ...basicResults,
        ...enhancedData,
        skills: [...new Set([...basicResults.skills, ...enhancedData.skills])],
        jobTitles: [...new Set([...basicResults.jobTitles, ...enhancedData.jobTitles])],
        organizations: [...new Set([...basicResults.organizations, ...enhancedData.organizations])],
        // Add new fields from enhanced analysis
        softSkills: enhancedData.softSkills || [],
        technicalSkills: enhancedData.technicalSkills || [],
        achievements: enhancedData.achievements || [],
        educationDetails: enhancedData.educationDetails || [],
        certifications: enhancedData.certifications || [],
        // Add confidence scores
        confidenceScores: enhancedData.confidenceScores || {},
      }
    } catch (error) {
      console.error("Error enhancing with AI:", error)
      // Fall back to basic results if AI enhancement fails
      return {
        ...basicResults,
        softSkills: [],
        technicalSkills: basicResults.skills,
        achievements: [],
        educationDetails: [],
        certifications: [],
        confidenceScores: {},
      }
    }
  }

  // Create prompt for AI enhancement
  private static createEnhancementPrompt(text: string, basicResults: any): string {
    return `Analyze the following resume text and enhance the basic entity extraction results.
    Consider:
    1. Implicit skills and experiences
    2. Soft skills demonstrated through achievements
    3. Technical skills implied by project descriptions
    4. Educational achievements and certifications
    5. Industry-specific terminology
    
    Resume text:
    ${text}
    
    Basic results:
    ${JSON.stringify(basicResults, null, 2)}
    
    Return a JSON object with enhanced analysis including:
    1. Additional skills (both technical and soft)
    2. Achievements with metrics
    3. Education details
    4. Certifications
    5. Confidence scores for each extracted entity`
  }

  // Extract semantic relationships between entities
  static async extractRelationships(text: string) {
    try {
      const { text: relationshipsJson } = await generateText({
        prompt: `Analyze the following resume text and extract semantic relationships between entities.
        For example:
        - Person X worked at Company Y from Date Z
        - Person X used Technology Y on Project Z
        - Person X reported to Person Y
        - Person X earned Degree Y from Institution Z
        
        Resume text:
        ${text}
        
        Return the relationships as a JSON array of objects with "subject", "predicate", "object", and "confidence" properties.`,
        temperature: 0.2,
        maxTokens: 1000,
      })

      return JSON.parse(relationshipsJson)
    } catch (error) {
      console.error("Error extracting relationships:", error)
      return []
    }
  }

  // Perform semantic matching between resume and job description
  static async semanticMatch(resumeText: string, jobDescriptionText: string) {
    try {
      const { text: matchingJson } = await generateText({
        prompt: `Compare the following resume and job description using semantic understanding.
        Identify matches beyond exact keyword matching, considering:
        - Semantic similarity of skills and experiences
        - Equivalent technologies and tools
        - Transferable skills and experiences
        - Implicit qualifications
        
        Resume:
        ${resumeText}
        
        Job Description:
        ${jobDescriptionText}
        
        Return a JSON object with:
        1. "matches": Array of matched items with "resumeText", "jobText", "matchType" (exact, semantic, partial), and "confidence"
        2. "missingRequirements": Array of job requirements not found in the resume
        3. "relevantExperiences": Array of resume experiences relevant to the job
        4. "overallMatchScore": A score from 0-100 representing semantic match quality`,
        temperature: 0.2,
        maxTokens: 2000,
      })

      return JSON.parse(matchingJson)
    } catch (error) {
      console.error("Error performing semantic matching:", error)
      return {
        matches: [],
        missingRequirements: [],
        relevantExperiences: [],
        overallMatchScore: 0,
      }
    }
  }
}

// Export a singleton instance for easy imports
export const advancedNLPProcessor = new AdvancedNLPProcessor()
