"use client"

import { generateText } from "@/lib/gemini-client"
import { openai } from "@ai-sdk/openai"

export class EducationAnalyzer {
  // Common degree types and their relevance to different fields
  private static degreeRelevanceMap: Record<string, Record<string, number>> = {
    "cyber security": {
      "cyber security": 1.0,
      "information security": 0.95,
      "computer science": 0.9,
      "information technology": 0.85,
      "computer engineering": 0.8,
      "software engineering": 0.75,
      "information systems": 0.75,
      "network security": 0.9,
      it: 0.7,
      engineering: 0.6,
      mathematics: 0.7,
      physics: 0.5,
      "business information systems": 0.7,
      "electrical engineering": 0.6,
      electronics: 0.6,
      telecommunications: 0.7,
      "criminal justice": 0.5, // Some cyber security roles involve digital forensics
      "business administration": 0.4,
      "management information systems": 0.7,
    },
    "software development": {
      "computer science": 1.0,
      "software engineering": 1.0,
      "computer engineering": 0.9,
      "information technology": 0.8,
      "information systems": 0.8,
      "web development": 0.9,
      mathematics: 0.7,
      "electrical engineering": 0.6,
      physics: 0.5,
      engineering: 0.6,
      "game development": 0.8,
      "artificial intelligence": 0.8,
      "data science": 0.7,
    },
    "data science": {
      "data science": 1.0,
      statistics: 0.95,
      mathematics: 0.9,
      "computer science": 0.85,
      physics: 0.8,
      engineering: 0.7,
      economics: 0.7,
      "business analytics": 0.8,
      "information systems": 0.7,
      "artificial intelligence": 0.9,
      "machine learning": 0.95,
      "computational linguistics": 0.7,
      bioinformatics: 0.7,
    },
    // Add more job fields as needed
  }

  // Extract education information from resume text
  static async extractEducation(text: string): Promise<{
    degrees: Array<{
      degree: string
      field: string
      institution: string
      graduationDate: string
      gpa?: string
      relevantCourses?: string[]
      achievements?: string[]
    }>
    certifications: Array<{
      name: string
      issuer: string
      date: string
      expirationDate?: string
    }>
    continuingEducation: string[]
    hasEducationSection: boolean
  }> {
    try {
      const { text: educationJson } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Extract ALL education information from the following resume text. Be thorough and look for ANY mentions of education, even if not in a dedicated education section.

        Look for:
        1. Formal degrees (Associate's, Bachelor's, Master's, Ph.D., etc.)
        2. Certifications
        3. Professional training
        4. Continuing education
        5. Bootcamps or specialized courses
        6. Self-education mentions
        
        For each degree, extract:
        - Degree type (e.g., Bachelor of Science, Master of Arts)
        - Field of study (e.g., Computer Science, Business Administration)
        - Institution name
        - Graduation date or expected graduation
        - GPA if mentioned
        - Relevant coursework if mentioned
        - Academic achievements if mentioned
        
        For certifications, extract:
        - Certification name
        - Issuing organization
        - Date obtained
        - Expiration date if mentioned
        
        Also determine if the resume has a dedicated education section.
        
        Resume text:
        ${text}
        
        Return a JSON object with:
        1. "degrees": Array of degree objects with "degree", "field", "institution", "graduationDate", and optional "gpa", "relevantCourses", and "achievements"
        2. "certifications": Array of certification objects with "name", "issuer", "date", and optional "expirationDate"
        3. "continuingEducation": Array of strings describing other educational activities
        4. "hasEducationSection": Boolean indicating if the resume has a dedicated education section
        
        If no education information is found, return empty arrays but CAREFULLY check for ANY education mentions before concluding none exists.`,
        temperature: 0.1,
        maxTokens: 2000,
      })

      return JSON.parse(educationJson)
    } catch (error) {
      console.error("Error extracting education information:", error)
      return {
        degrees: [],
        certifications: [],
        continuingEducation: [],
        hasEducationSection: false,
      }
    }
  }

  // Assess education relevance to a specific job field
  static async assessEducationRelevance(
    educationInfo: any,
    jobField: string,
    jobDescription: string,
  ): Promise<{
    relevanceScore: number // 0-100
    hasRelevantDegree: "Yes" | "Partial" | "No"
    relevanceExplanation: string
    recommendations: string[]
  }> {
    try {
      // First try to match the job field to our predefined map
      const normalizedJobField = jobField.toLowerCase()
      let matchedField = ""
      let bestMatchScore = 0

      // Find the best matching field in our map
      for (const field in this.degreeRelevanceMap) {
        const similarity = this.calculateStringSimilarity(normalizedJobField, field)
        if (similarity > bestMatchScore) {
          bestMatchScore = similarity
          matchedField = field
        }
      }

      // If we have a good match, use our predefined relevance map
      if (bestMatchScore > 0.7 && matchedField in this.degreeRelevanceMap) {
        return this.assessEducationRelevanceWithMap(educationInfo, matchedField, jobDescription)
      }

      // Otherwise, use AI to assess relevance
      return this.assessEducationRelevanceWithAI(educationInfo, jobField, jobDescription)
    } catch (error) {
      console.error("Error assessing education relevance:", error)
      return {
        relevanceScore: 50, // Default to medium relevance
        hasRelevantDegree: "Partial",
        relevanceExplanation:
          "Unable to fully assess education relevance. The candidate has some education that may be relevant to the position.",
        recommendations: ["Consider providing more details about your educational background."],
      }
    }
  }

  // Assess education relevance using our predefined map
  private static assessEducationRelevanceWithMap(
    educationInfo: any,
    jobField: string,
    jobDescription: string,
  ): Promise<{
    relevanceScore: number
    hasRelevantDegree: "Yes" | "Partial" | "No"
    relevanceExplanation: string
    recommendations: string[]
  }> {
    const relevanceMap = this.degreeRelevanceMap[jobField]
    const degrees = educationInfo.degrees || []
    const certifications = educationInfo.certifications || []

    // If no education information is found
    if (degrees.length === 0 && certifications.length === 0) {
      return Promise.resolve({
        relevanceScore: 0,
        hasRelevantDegree: "No",
        relevanceExplanation:
          "No formal education or certifications were found in the resume. However, practical experience and skills may compensate for formal education.",
        recommendations: [
          "Add your educational background to your resume, even if it's not directly related to the field.",
          "Consider pursuing relevant certifications to strengthen your qualifications.",
          "Highlight any self-learning, online courses, or workshops you've completed.",
        ],
      })
    }

    // Calculate relevance score for degrees
    let highestRelevance = 0
    let mostRelevantDegree = ""
    let mostRelevantField = ""

    for (const degree of degrees) {
      const degreeType = degree.degree?.toLowerCase() || ""
      const field = degree.field?.toLowerCase() || ""

      // Check for relevance in both degree type and field
      for (const relevantField in relevanceMap) {
        const fieldSimilarity = Math.max(
          this.calculateStringSimilarity(field, relevantField),
          this.calculateStringSimilarity(degreeType, relevantField),
        )

        if (fieldSimilarity * relevanceMap[relevantField] > highestRelevance) {
          highestRelevance = fieldSimilarity * relevanceMap[relevantField]
          mostRelevantDegree = degree.degree
          mostRelevantField = degree.field
        }
      }
    }

    // Add bonus for certifications
    let certificationBonus = 0
    const relevantCertifications: string[] = []

    for (const cert of certifications) {
      const certName = cert.name?.toLowerCase() || ""

      // Check for relevance in certification name
      for (const relevantField in relevanceMap) {
        const certSimilarity = this.calculateStringSimilarity(certName, relevantField)

        if (certSimilarity * relevanceMap[relevantField] > 0.5) {
          certificationBonus += 0.1 // Add 10% bonus for each relevant certification
          relevantCertifications.push(cert.name)
        }
      }
    }

    // Cap certification bonus at 0.3 (30%)
    certificationBonus = Math.min(certificationBonus, 0.3)

    // Calculate final relevance score (0-100)
    const relevanceScore = Math.round((highestRelevance + certificationBonus) * 100)

    // Determine if the candidate has a relevant degree
    let hasRelevantDegree: "Yes" | "Partial" | "No" = "No"
    if (highestRelevance >= 0.8) {
      hasRelevantDegree = "Yes"
    } else if (highestRelevance >= 0.5) {
      hasRelevantDegree = "Partial"
    }

    // Generate explanation and recommendations
    let relevanceExplanation = ""
    const recommendations: string[] = []

    if (hasRelevantDegree === "Yes") {
      relevanceExplanation = `The candidate has a ${mostRelevantDegree} in ${mostRelevantField}, which is highly relevant to the ${jobField} position.`
      if (relevantCertifications.length > 0) {
        relevanceExplanation += ` Additionally, they have relevant certifications in ${relevantCertifications.join(
          ", ",
        )}, which further strengthen their qualifications.`
      }
      recommendations.push("Continue to pursue advanced certifications to stay current in the field.")
    } else if (hasRelevantDegree === "Partial") {
      relevanceExplanation = `The candidate has a ${mostRelevantDegree} in ${mostRelevantField}, which is somewhat relevant to the ${jobField} position. While not directly aligned, this education provides transferable knowledge and skills.`
      if (relevantCertifications.length > 0) {
        relevanceExplanation += ` Their certifications in ${relevantCertifications.join(
          ", ",
        )} help bridge the gap between their formal education and the job requirements.`
      }
      recommendations.push(
        "Consider pursuing certifications or courses specifically related to " + jobField + " to enhance your profile.",
      )
    } else {
      if (degrees.length > 0) {
        relevanceExplanation = `The candidate's education (${degrees
          .map((d: any) => `${d.degree} in ${d.field}`)
          .join(", ")}) is not directly relevant to the ${jobField} position.`
        if (relevantCertifications.length > 0) {
          relevanceExplanation += ` However, they have certifications in ${relevantCertifications.join(
            ", ",
          )}, which demonstrate some relevant knowledge.`
        }
      } else {
        relevanceExplanation = `No formal education information was found in the resume.`
      }
      recommendations.push(
        "Highlight transferable skills from your education that apply to " + jobField + ".",
        "Consider pursuing relevant certifications to demonstrate your knowledge in " + jobField + ".",
      )
    }

    return Promise.resolve({
      relevanceScore,
      hasRelevantDegree,
      relevanceExplanation,
      recommendations,
    })
  }

  // Assess education relevance using AI
  private static async assessEducationRelevanceWithAI(
    educationInfo: any,
    jobField: string,
    jobDescription: string,
  ): Promise<{
    relevanceScore: number
    hasRelevantDegree: "Yes" | "Partial" | "No"
    relevanceExplanation: string
    recommendations: string[]
  }> {
    try {
      const { text: relevanceJson } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Assess the relevance of the candidate's education to a ${jobField} position.

        Education Information:
        ${JSON.stringify(educationInfo, null, 2)}
        
        Job Description:
        ${jobDescription}
        
        Consider:
        1. How directly relevant the degrees are to ${jobField}
        2. Whether the field of study provides transferable skills
        3. The value of any certifications
        4. Whether the education meets typical requirements for ${jobField} positions
        
        IMPORTANT: Be nuanced in your assessment. Many fields don't require specific degrees. For example, in cyber security, computer science, IT, or even other technical degrees can be relevant. Don't penalize candidates just because they don't have a degree specifically named after the job field.
        
        Return a JSON object with:
        1. "relevanceScore": A number from 0-100 representing how relevant the education is
        2. "hasRelevantDegree": "Yes", "Partial", or "No"
        3. "relevanceExplanation": A detailed explanation of the education's relevance
        4. "recommendations": Array of suggestions for improving educational qualifications
        
        If no education is found, acknowledge that practical experience and skills may compensate for formal education.`,
        temperature: 0.2,
        maxTokens: 2000,
      })

      return JSON.parse(relevanceJson)
    } catch (error) {
      console.error("Error assessing education relevance with AI:", error)
      return {
        relevanceScore: 50, // Default to medium relevance
        hasRelevantDegree: "Partial",
        relevanceExplanation:
          "Unable to fully assess education relevance. The candidate has some education that may be relevant to the position.",
        recommendations: ["Consider providing more details about your educational background."],
      }
    }
  }

  // Calculate string similarity (simple Jaccard similarity)
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const set1 = new Set(str1.toLowerCase().split(" "))
    const set2 = new Set(str2.toLowerCase().split(" "))

    const intersection = new Set([...set1].filter((x) => set2.has(x)))
    const union = new Set([...set1, ...set2])

    return intersection.size / union.size
  }

  // Get common degree requirements for a job field
  static async getCommonDegreeRequirements(jobField: string): Promise<{
    requiredDegrees: string[]
    preferredDegrees: string[]
    alternativePaths: string[]
  }> {
    try {
      const { text: requirementsJson } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Provide information about common education requirements for ${jobField} positions.

        Include:
        1. Degrees that are typically required
        2. Degrees that are preferred but not required
        3. Alternative paths (certifications, experience, etc.) that can substitute for formal education
        
        Be realistic and nuanced. Many technical fields value experience and skills over specific degrees.
        
        Return a JSON object with:
        1. "requiredDegrees": Array of degrees commonly required
        2. "preferredDegrees": Array of degrees commonly preferred
        3. "alternativePaths": Array of alternative qualification paths`,
        temperature: 0.2,
        maxTokens: 1000,
      })

      return JSON.parse(requirementsJson)
    } catch (error) {
      console.error("Error getting common degree requirements:", error)
      return {
        requiredDegrees: [],
        preferredDegrees: [],
        alternativePaths: [],
      }
    }
  }

  static async analyzeEducation(text: string): Promise<{
    degree: string
    field: string
    institution: string
    graduationYear: number | null
    gpa: number | null
    relevance: number
  }> {
    try {
      const prompt = `Analyze the following education information and extract:
      1. Degree type
      2. Field of study
      3. Institution name
      4. Graduation year (if available)
      5. GPA (if available)
      6. Relevance score (0-1) based on the quality and prestige of the institution and program
      
      Text: ${text}
      
      Return a JSON object with these fields. Use null for missing values.`

      const response = await generateText(prompt, 0.3)
      const analysis = JSON.parse(response)
      
      return {
        degree: analysis.degree || "",
        field: analysis.field || "",
        institution: analysis.institution || "",
        graduationYear: analysis.graduationYear || null,
        gpa: analysis.gpa || null,
        relevance: analysis.relevance || 0.5
      }
    } catch (error) {
      console.error("Error analyzing education:", error)
      return {
        degree: "",
        field: "",
        institution: "",
        graduationYear: null,
        gpa: null,
        relevance: 0.5
      }
    }
  }
}
