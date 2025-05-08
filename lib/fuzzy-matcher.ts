"use client"

import Fuse from "fuse.js"

export function findFuzzyMatches(source: string[], target: string[]): { [key: string]: string[] } {
  const fuse = new Fuse(source, {
    includeScore: true,
    threshold: 0.6, // Lower threshold means more strict matching
    minMatchCharLength: 3,
  })

  const matches: { [key: string]: string[] } = {}

  // Find matches for each target string
  target.forEach((item) => {
    const results = fuse.search(item)

    // Get the matched items
    const matchedItems = results.map((result) => result.item)

    // Add to matches object
    matches[item] = matchedItems
  })

  return matches
}

export function scoreSkillMatch(
  resumeText: string,
  skills: string[],
): {
  matched: string[]
  partial: string[]
  missing: string[]
} {
  // Ensure resumeText is a string
  const safeResumeText = typeof resumeText === "string" ? resumeText : String(resumeText || "")

  const result = {
    matched: [] as string[],
    partial: [] as string[],
    missing: [] as string[],
  }

  const resumeLower = safeResumeText.toLowerCase()

  // Create a Fuse instance for fuzzy matching
  const fuse = new Fuse([resumeLower], {
    includeScore: true,
    threshold: 0.6,
    minMatchCharLength: 3,
  })

  skills.forEach((skill) => {
    const skillLower = skill.toLowerCase()

    // Check for exact match first
    if (resumeLower.includes(skillLower)) {
      result.matched.push(skill)
    }
    // Then try fuzzy matching
    else {
      const searchResult = fuse.search(skillLower)

      if (searchResult.length > 0 && searchResult[0].score && searchResult[0].score < 0.4) {
        result.partial.push(skill)
      } else {
        result.missing.push(skill)
      }
    }
  })

  return result
}
