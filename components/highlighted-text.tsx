"use client"

import { useState, useEffect } from "react"
import { AdvancedNLPProcessor } from "@/lib/advanced-nlp-processor"

interface HighlightedTextProps {
  text: string
  maxLength?: number
}

export default function HighlightedText({ text, maxLength = 1000 }: HighlightedTextProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [entities, setEntities] = useState<any>(null)
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    async function processText() {
      setIsLoading(true)

      try {
        // Process the text with advanced NLP
        const processedEntities = await AdvancedNLPProcessor.processText(text)
        setEntities(processedEntities)

        // Truncate text if needed
        setDisplayText(text.length > maxLength ? text.substring(0, maxLength) + "..." : text)
      } catch (error) {
        console.error("Error processing text for highlighting:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (text) {
      processText()
    }
  }, [text, maxLength])

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-40 rounded"></div>
  }

  if (!entities) {
    return <div className="whitespace-pre-wrap">{displayText}</div>
  }

  // Function to highlight entities in text
  const highlightEntities = () => {
    let result = displayText

    // Create a map of all entities to highlight
    const allEntities: { [key: string]: string } = {}

    // Add technical skills
    if (entities.technicalSkills) {
      entities.technicalSkills.forEach((skill: string) => {
        allEntities[skill] = "bg-blue-100 text-blue-800 rounded px-1"
      })
    }

    // Add organizations
    if (entities.organizations) {
      entities.organizations.forEach((org: string) => {
        allEntities[org] = "bg-purple-100 text-purple-800 rounded px-1"
      })
    }

    // Add job titles
    if (entities.jobTitles) {
      entities.jobTitles.forEach((title: string) => {
        allEntities[title] = "bg-green-100 text-green-800 rounded px-1"
      })
    }

    // Add dates
    if (entities.dates) {
      entities.dates.forEach((date: string) => {
        allEntities[date] = "bg-yellow-100 text-yellow-800 rounded px-1"
      })
    }

    // Replace entities with highlighted versions
    // Sort by length (descending) to avoid partial replacements
    const sortedEntities = Object.keys(allEntities).sort((a, b) => b.length - a.length)

    for (const entity of sortedEntities) {
      const className = allEntities[entity]
      const regex = new RegExp(`\\b${entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi")
      result = result.replace(regex, `<span class="${className}">$&</span>`)
    }

    return { __html: result }
  }

  return (
    <div className="relative">
      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={highlightEntities()}></div>

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-blue-100 mr-1 rounded"></span>
          <span className="text-xs">Technical Skills</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-purple-100 mr-1 rounded"></span>
          <span className="text-xs">Organizations</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-100 mr-1 rounded"></span>
          <span className="text-xs">Job Titles</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-yellow-100 mr-1 rounded"></span>
          <span className="text-xs">Dates</span>
        </div>
      </div>
    </div>
  )
}
