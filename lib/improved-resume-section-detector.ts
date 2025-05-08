"use client"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { ResumeSectionDetector } from "./resume-section-detector"

export class ImprovedResumeSectionDetector extends ResumeSectionDetector {
  // Enhanced detection of education sections
  static async detectEducationSection(text: string): Promise<{
    found: boolean
    content: string
    confidence: number
  }> {
    try {
      // First try to detect sections using the parent class method
      const { sections } = await this.detectSections(text)
      const educationSection = sections.find((section) => section.type === "education")

      if (educationSection) {
        return {
          found: true,
          content: educationSection.content,
          confidence: 0.9, // High confidence since we found a dedicated section
        }
      }

      // If no dedicated section is found, use AI to look for education information anywhere in the text
      const { text: educationJson } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Carefully examine the following resume text and identify ANY education information, even if not in a dedicated "Education" section.

        Look for:
        1. Mentions of degrees (Bachelor's, Master's, Ph.D., etc.)
        2. Educational institutions (universities, colleges, etc.)
        3. Graduation dates
        4. Fields of study
        5. GPA or academic achievements
        6. Certifications or professional education
        
        Resume text:
        ${text}
        
        Return a JSON object with:
        1. "found": Boolean indicating if any education information was found
        2. "content": The text containing education information (if found)
        3. "confidence": A number from 0 to 1 indicating confidence in the extraction`,
        temperature: 0.1,
        maxTokens: 1000,
      })

      return JSON.parse(educationJson)
    } catch (error) {
      console.error("Error detecting education section:", error)
      return {
        found: false,
        content: "",
        confidence: 0,
      }
    }
  }

  // Enhanced detection of all resume sections with better accuracy
  static async detectSectionsImproved(text: string): Promise<{
    sections: {
      type: string
      title: string
      content: string
      startIndex: number
      endIndex: number
      confidence: number
    }[]
    unclassified: string[]
  }> {
    try {
      const { text: sectionsJson } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze the following resume text and identify ALL sections with high accuracy.
        
        For each section, provide:
        1. The section type (e.g., "contact", "summary", "experience", "education", "skills", "projects", etc.)
        2. The exact section title as it appears in the resume
        3. The full content of that section
        4. The start and end character indices of the section in the original text
        5. A confidence score (0-1) for how certain you are about this section classification
        
        IMPORTANT: Be thorough and look for ANY information related to each section type, even if not in a dedicated section.
        For example, education information might be mentioned within experience sections or elsewhere.
        
        Resume text:
        ${text}
        
        Return a JSON object with:
        1. "sections": Array of objects with "type", "title", "content", "startIndex", "endIndex", and "confidence"
        2. "unclassified": Array of strings containing text not belonging to any section`,
        temperature: 0.1,
        maxTokens: 2000,
      })

      return JSON.parse(sectionsJson)
    } catch (error) {
      console.error("Error detecting sections with improved method:", error)
      // Fall back to the original method
      return this.detectSections(text)
    }
  }

  // Detect if text contains education information even without a dedicated section
  static containsEducationInformation(text: string): boolean {
    // Common education-related keywords
    const educationKeywords = [
      "degree",
      "bachelor",
      "master",
      "phd",
      "doctorate",
      "b.s.",
      "m.s.",
      "b.a.",
      "m.a.",
      "university",
      "college",
      "institute",
      "school",
      "gpa",
      "graduated",
      "certification",
      "diploma",
      "education",
      "academic",
      "major",
      "minor",
      "coursework",
      "thesis",
      "dissertation",
    ]

    // Check if any of the keywords are present in the text
    const lowerText = text.toLowerCase()
    return educationKeywords.some((keyword) => lowerText.includes(keyword))
  }
}
