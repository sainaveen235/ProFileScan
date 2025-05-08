"use client"

import nlp from "compromise"

export function extractEntities(text: string) {
  // Ensure text is a string
  const safeText = typeof text === "string" ? text : String(text || "")

  const doc = nlp(safeText)

  return {
    // Extract people names
    people: doc.people().out("array"),

    // Extract organizations
    organizations: doc.organizations().out("array"),

    // Extract dates
    dates: doc.dates().out("array"),

    // Extract skills (custom logic)
    skills: extractSkills(safeText),

    // Extract job titles
    jobTitles: extractJobTitles(safeText),
  }
}

// Custom function to extract potential skills
function extractSkills(text: string): string[] {
  // This is a simplified approach - in a real app, you'd have a more comprehensive skill dictionary
  const commonSkills = [
    "javascript",
    "python",
    "java",
    "c++",
    "react",
    "angular",
    "vue",
    "node",
    "express",
    "mongodb",
    "sql",
    "nosql",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "machine learning",
    "data science",
    "artificial intelligence",
    "nlp",
    "deep learning",
    "project management",
    "agile",
    "scrum",
    "kanban",
    "leadership",
    "communication",
  ]

  const foundSkills: string[] = []
  const lowerText = text.toLowerCase()

  commonSkills.forEach((skill) => {
    if (lowerText.includes(skill)) {
      foundSkills.push(skill)
    }
  })

  return foundSkills
}

// Custom function to extract job titles
function extractJobTitles(text: string): string[] {
  const doc = nlp(text)

  // Look for common job title patterns
  const jobTitles = doc.match(
    "(senior|junior|lead|principal|staff)? #Adjective? (developer|engineer|designer|manager|director|analyst|specialist|consultant)",
  )

  return jobTitles.out("array")
}
