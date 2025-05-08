"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { HybridNLPProcessor } from "@/lib/hybrid-nlp-processor"

interface ConfidenceScoreVisualizationProps {
  text: string
}

export default function ConfidenceScoreVisualization({ text }: ConfidenceScoreVisualizationProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [confidenceScores, setConfidenceScores] = useState<any>(null)
  const [entities, setEntities] = useState<any>(null)

  useEffect(() => {
    async function analyzeConfidence() {
      setIsLoading(true)

      try {
        // Process text using hybrid approach
        const results = await HybridNLPProcessor.processText(text)
        setConfidenceScores(results.confidenceScores || {})
        setEntities(results)
      } catch (error) {
        console.error("Error analyzing confidence scores:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (text) {
      analyzeConfidence()
    }
  }, [text])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p>Analyzing confidence scores...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!confidenceScores) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No confidence scores available.</p>
        </CardContent>
      </Card>
    )
  }

  // Get entity types with confidence scores
  const entityTypes = Object.keys(confidenceScores).filter((type) => type !== "overall")

  // Get confidence color based on score
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "bg-green-500"
    if (score >= 0.6) return "bg-blue-500"
    if (score >= 0.4) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NLP Confidence Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium">Overall Confidence</span>
            <span className="font-bold">{Math.round((confidenceScores.overall || 0) * 100)}%</span>
          </div>
          <Progress
            value={(confidenceScores.overall || 0) * 100}
            className={`h-2.5 ${getConfidenceColor(confidenceScores.overall || 0)}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entityTypes.map((entityType) => {
            // Skip if not an object (entity -> confidence map)
            if (typeof confidenceScores[entityType] !== "object") {
              return (
                <div key={entityType} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize">{entityType}</span>
                    <span className="font-medium">{Math.round((confidenceScores[entityType] || 0) * 100)}%</span>
                  </div>
                  <Progress
                    value={(confidenceScores[entityType] || 0) * 100}
                    className={`h-2 ${getConfidenceColor(confidenceScores[entityType] || 0)}`}
                  />
                </div>
              )
            }

            // If it's an entity -> confidence map, show top entities
            const entityScores = confidenceScores[entityType]
            const topEntities = Object.entries(entityScores)
              .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
              .slice(0, 5)

            return (
              <div key={entityType} className="space-y-4">
                <h3 className="font-medium capitalize">{entityType}</h3>
                {topEntities.map(([entity, score]: [string, any], index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="truncate max-w-[200px]">{entity}</span>
                      <span>{Math.round(score * 100)}%</span>
                    </div>
                    <Progress value={score * 100} className={`h-1.5 ${getConfidenceColor(score)}`} />
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <div className="mt-8">
          <h3 className="font-medium mb-4">Entity Count by Confidence Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["High", "Medium", "Low", "Very Low"].map((level, index) => {
              const threshold = [0.8, 0.6, 0.4, 0][index]
              const nextThreshold = [1, 0.8, 0.6, 0.4][index]

              // Count entities in this confidence range
              let count = 0
              for (const entityType in confidenceScores) {
                if (entityType === "overall") continue
                if (typeof confidenceScores[entityType] === "number") {
                  if (confidenceScores[entityType] >= threshold && confidenceScores[entityType] < nextThreshold) {
                    count++
                  }
                } else if (typeof confidenceScores[entityType] === "object") {
                  for (const entity in confidenceScores[entityType]) {
                    if (
                      confidenceScores[entityType][entity] >= threshold &&
                      confidenceScores[entityType][entity] < nextThreshold
                    ) {
                      count++
                    }
                  }
                }
              }

              return (
                <div key={level} className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-500">{level} Confidence</div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
