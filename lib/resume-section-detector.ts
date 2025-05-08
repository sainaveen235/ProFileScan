"use client"

import { keywordExtractor } from "./keyword-extractor"
import { generateText } from "@/lib/gemini-client"
import { openai } from "@ai-sdk/openai"

export class ResumeSectionDetector {
  // Detect sections in a resume
  static async detectSections(text: string): Promise<{
    sections: {
      type: string
      title: string
      content: string
      startIndex: number
      endIndex: number
    }[]
    unclassified: string[]
  }> {
    try {
      const prompt = `Analyze the following resume text and identify its sections. 
      For each section, provide:
      1. The section type (e.g., "Education", "Experience", "Skills", etc.)
      2. The start and end line numbers
      3. A confidence score between 0 and 1
      
      Resume text:
      ${text}
      
      Return the result as a JSON array of objects with the following structure:
      {
        "type": "string",
        "startLine": number,
        "endLine": number,
        "confidence": number
      }`

      const response = await generateText(prompt, 0.3)
      const sections = JSON.parse(response)
      
      return {
        sections: sections.map((section: any) => ({
          type: section.type,
          title: "",
          content: "",
          startIndex: section.startLine,
          endIndex: section.endLine
        })),
        unclassified: []
      }
    } catch (error) {
      console.error("Error detecting resume sections:", error)

      // Fall back to basic section detection
      return this.detectSectionsBasic(text)
    }
  }

  // Basic section detection as fallback
  private static detectSectionsBasic(text: string): {
    sections: {
      type: string
      title: string
      content: string
      startIndex: number
      endIndex: number
    }[]
    unclassified: string[]
  } {
    const sections = []
    const lines = text.split("\n")
    let currentSection = null
    let currentContent = []
    let startIndex = 0
    let currentSectionIndex = 0 // Declare currentSectionIndex
    let currentSectionStartIndex = 0 // Declare currentSectionStartIndex

    // Common section headers
    const sectionPatterns = [
      { type: "contact", regex: /^\s*(contact|personal)\s*(information|details|info)?\s*:?\s*$/i },
      { type: "summary", regex: /^\s*(summary|profile|objective|about me|professional summary)\s*:?\s*$/i },
      {
        type: "experience",
        regex: /^\s*(experience|work experience|employment|work history|professional experience)\s*:?\s*$/i,
      },
      {
        type: "education",
        regex: /^\s*(education|academic background|qualifications|academic qualifications)\s*:?\s*$/i,
      },
      { type: "skills", regex: /^\s*(skills|technical skills|core competencies|key skills|expertise)\s*:?\s*$/i },
      { type: "projects", regex: /^\s*(projects|personal projects|key projects)\s*:?\s*$/i },
      { type: "certifications", regex: /^\s*(certifications|certificates|professional certifications)\s*:?\s*$/i },
      { type: "languages", regex: /^\s*(languages|language proficiency)\s*:?\s*$/i },
      { type: "interests", regex: /^\s*(interests|hobbies|activities)\s*:?\s*$/i },
      { type: "references", regex: /^\s*(references|professional references)\s*:?\s*$/i },
    ]

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineStartIndex = text.indexOf(line, startIndex)
      const lineEndIndex = lineStartIndex + line.length

      // Check if this line is a section header
      let isSectionHeader = false
      let sectionType = ""

      for (const pattern of sectionPatterns) {
        if (pattern.regex.test(line)) {
          isSectionHeader = true
          sectionType = pattern.type
          break
        }
      }

      // If we found a section header
      if (isSectionHeader) {
        // Save the previous section if it exists
        if (currentSection) {
          sections.push({
            type: currentSection,
            title: lines[currentSection === "unclassified" ? 0 : currentSectionIndex],
            content: currentContent.join("\n"),
            startIndex: currentSectionStartIndex,
            endIndex: lineStartIndex,
          })
        }

        // Start a new section
        currentSection = sectionType
        currentContent = []
        currentSectionIndex = i
        currentSectionStartIndex = lineStartIndex
      } else {
        // Add this line to the current section content
        currentContent.push(line)
      }

      startIndex = lineEndIndex
    }

    // Add the last section
    if (currentSection) {
      sections.push({
        type: currentSection,
        title: lines[currentSection === "unclassified" ? 0 : currentSectionIndex],
        content: currentContent.join("\n"),
        startIndex: currentSectionStartIndex,
        endIndex: text.length,
      })
    }

    // Find unclassified text
    const unclassified = []
    let lastEndIndex = 0

    for (const section of sections) {
      if (section.startIndex > lastEndIndex) {
        unclassified.push(text.substring(lastEndIndex, section.startIndex))
      }
      lastEndIndex = section.endIndex
    }

    if (lastEndIndex < text.length) {
      unclassified.push(text.substring(lastEndIndex))
    }

    return { sections, unclassified }
  }

  // Detect if a section is a contact information section
  static isContactInfo(text: string): boolean {
    // Check for email pattern
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/

    // Check for phone pattern
    const phonePattern = /\b(?:\+\d{1,3}[-\s]?)?(?:$$\d{3}$$|\d{3})[-\s.]?\d{3}[-\s.]?\d{4}\b/

    // Check for address pattern
    const addressPattern =
      /\b\d+\s+[A-Za-z]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl|Terrace|Ter)\b/i

    // Check for LinkedIn or other social media
    const socialPattern = /\b(?:linkedin\.com\/in|github\.com|twitter\.com)\/[A-Za-z0-9_-]+\b/i

    return emailPattern.test(text) || phonePattern.test(text) || addressPattern.test(text) || socialPattern.test(text)
  }

  // Detect if a section is a skills section
  static isSkillsSection(text: string): boolean {
    // Extract keywords from the text
    const keywords = keywordExtractor.extractKeywordsBasic(text)

    // Check if the text has a high density of skills
    const skillDensity = keywords.length / text.split(/\s+/).length

    // Check for bullet points or comma-separated lists
    const hasBulletPoints = /•|\*|-|–|•/.test(text)
    const hasCommaSeparatedList = /\b\w+\b\s*,\s*\b\w+\b/.test(text)

    return skillDensity > 0.15 || hasBulletPoints || hasCommaSeparatedList
  }

  // Detect if a section is an experience section
  static isExperienceSection(text: string): boolean {
    // Check for job titles
    const jobTitlePattern =
      /\b(?:senior|junior|lead|principal|staff)?\s*(?:developer|engineer|designer|manager|director|analyst|specialist|consultant)\b/i

    // Check for company names followed by dates
    const companyDatePattern =
      /\b[A-Z][A-Za-z\s]+\b[\s|]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*(?:-|–|to)\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{0,4}|Present|Current\b/i

    // Check for bullet points with action verbs
    const actionVerbPattern =
      /•|\*|-|–|•\s*\b(?:developed|implemented|created|designed|managed|led|coordinated|achieved|improved|increased|reduced|analyzed|built|maintained|collaborated|established|delivered|generated|launched|produced|provided|resolved|streamlined|transformed)\b/i

    return jobTitlePattern.test(text) || companyDatePattern.test(text) || actionVerbPattern.test(text)
  }

  // Detect if a section is an education section
  static isEducationSection(text: string): boolean {
    // Check for degree names
    const degreePattern =
      /\b(?:Bachelor|Master|PhD|Doctorate|B\.S\.|M\.S\.|B\.A\.|M\.A\.|B\.Eng\.|M\.Eng\.|MBA|Associate|Diploma)\b/i

    // Check for university/college names
    const universityPattern = /\b(?:University|College|Institute|School)\b/i

    // Check for graduation years
    const graduationPattern = /\bClass of \d{4}\b|\bGraduated:? \d{4}\b|\b\d{4} - \d{4}\b|\b\d{4}-\d{4}\b/i

    // Check for GPA
    const gpaPattern = /\bGPA:? \d+\.\d+\b|\bGPA:? \d+\b/i

    return (
      degreePattern.test(text) || universityPattern.test(text) || graduationPattern.test(text) || gpaPattern.test(text)
    )
  }
}
