"use client"

import Papa from "papaparse"

type AnalysisResult = {
  overallScore: number
  technicalSkills: CategoryResult
  experience: CategoryResult
  education: CategoryResult
  formatting: CategoryResult
  softSkills: CategoryResult
  improvementSuggestions: string[]
}

type CategoryResult = {
  score: number
  maxScore: number
  criteria: {
    name: string
    status: "Yes" | "No" | "Partial"
    comments: string
  }[]
  summary: string
}

export function exportAnalysisToCSV(result: AnalysisResult, resumeName: string): string {
  // Prepare data for CSV
  const data = [
    // Header row
    ["Resume", "Category", "Criteria", "Status", "Comments", "Score", "Max Score"],

    // Technical Skills
    ...result.technicalSkills.criteria.map((criterion) => [
      resumeName,
      "Technical Skills",
      criterion.name,
      criterion.status,
      criterion.comments,
      result.technicalSkills.score,
      result.technicalSkills.maxScore,
    ]),

    // Experience
    ...result.experience.criteria.map((criterion) => [
      resumeName,
      "Experience",
      criterion.name,
      criterion.status,
      criterion.comments,
      result.experience.score,
      result.experience.maxScore,
    ]),

    // Education
    ...result.education.criteria.map((criterion) => [
      resumeName,
      "Education",
      criterion.name,
      criterion.status,
      criterion.comments,
      result.education.score,
      result.education.maxScore,
    ]),

    // Formatting
    ...result.formatting.criteria.map((criterion) => [
      resumeName,
      "Formatting",
      criterion.name,
      criterion.status,
      criterion.comments,
      result.formatting.score,
      result.formatting.maxScore,
    ]),

    // Soft Skills
    ...result.softSkills.criteria.map((criterion) => [
      resumeName,
      "Soft Skills",
      criterion.name,
      criterion.status,
      criterion.comments,
      result.softSkills.score,
      result.softSkills.maxScore,
    ]),

    // Overall Score
    [resumeName, "Overall", "", "", "", result.overallScore, 100],
  ]

  // Convert to CSV using Papa Parse
  return Papa.unparse(data)
}

export function downloadCSV(csvContent: string, fileName: string) {
  // Only run in browser environment
  if (typeof window === "undefined") return

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", fileName)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL
  URL.revokeObjectURL(url)
}
