"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { DomainSpecificNER } from "@/lib/domain-specific-ner"

interface DomainSpecificEntityVisualizationProps {
  resumeText: string
  jobDescriptionText: string
}

export default function DomainSpecificEntityVisualization({
  resumeText,
  jobDescriptionText,
}: DomainSpecificEntityVisualizationProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDomain, setSelectedDomain] = useState("software development")
  const [resumeEntities, setResumeEntities] = useState<any>(null)
  const [jobEntities, setJobEntities] = useState<any>(null)
  const [competencyAnalysis, setCompetencyAnalysis] = useState<any>(null)
  const [achievements, setAchievements] = useState<any>(null)

  const domains = [
    "software development",
    "data science",
    "healthcare",
    "finance",
    "marketing",
    "human resources",
    "project management",
    "sales",
    "customer service",
    "legal",
  ]

  useEffect(() => {
    async function analyzeDomainSpecificEntities() {
      setIsLoading(true)

      try {
        // Extract domain-specific entities from resume and job description
        const [resumeResults, jobResults, achievementsResults, competencyResults] = await Promise.all([
          DomainSpecificNER.extractEntities(resumeText, selectedDomain),
          DomainSpecificNER.extractEntities(jobDescriptionText, selectedDomain),
          DomainSpecificNER.extractAchievements(resumeText, selectedDomain),
          DomainSpecificNER.analyzeCompetency(resumeText, jobDescriptionText, selectedDomain),
        ])

        setResumeEntities(resumeResults)
        setJobEntities(jobResults)
        setAchievements(achievementsResults)
        setCompetencyAnalysis(competencyResults)
      } catch (error) {
        console.error("Error analyzing domain-specific entities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (resumeText && jobDescriptionText) {
      analyzeDomainSpecificEntities()
    }
  }, [resumeText, jobDescriptionText, selectedDomain])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p>Analyzing domain-specific entities...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!resumeEntities || !jobEntities) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No domain-specific entities found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Domain-Specific Analysis</CardTitle>
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain.charAt(0).toUpperCase() + domain.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {competencyAnalysis && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Domain Competency</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Overall Score</span>
              <span className="font-bold">{competencyAnalysis.overallScore}%</span>
            </div>
            <Progress value={competencyAnalysis.overallScore} className="h-2 mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-medium mb-2">Domain Strengths</h4>
                <ul className="space-y-1">
                  {competencyAnalysis.strengths.map((strength: string, index: number) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Domain Gaps</h4>
                <ul className="space-y-1">
                  {competencyAnalysis.gaps.map((gap: string, index: number) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="entities">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="entities">Domain Entities</TabsTrigger>
            <TabsTrigger value="achievements">Domain Achievements</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="entities">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Resume Entities</h3>
                {Object.entries(resumeEntities.entities).map(([entityType, entities]: [string, any]) => (
                  <div key={entityType} className="mb-4">
                    <h4 className="font-medium mb-2">{entityType}</h4>
                    <div className="flex flex-wrap gap-2">
                      {entities.map((entity: string, index: number) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-800"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Job Description Entities</h3>
                {Object.entries(jobEntities.entities).map(([entityType, entities]: [string, any]) => (
                  <div key={entityType} className="mb-4">
                    <h4 className="font-medium mb-2">{entityType}</h4>
                    <div className="flex flex-wrap gap-2">
                      {entities.map((entity: string, index: number) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-100 rounded-full px-3 py-1 text-sm font-semibold text-purple-800"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <h3 className="text-lg font-medium mb-4">Domain-Specific Achievements</h3>
            <div className="space-y-4">
              {achievements?.map((achievement: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium">{achievement.achievement}</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Impact:</p>
                      <p className="text-sm">{achievement.impact}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Metrics:</p>
                      <p className="text-sm">{achievement.metrics}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Confidence: {Math.round(achievement.confidence * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <h3 className="text-lg font-medium mb-4">Domain-Specific Recommendations</h3>
            <div className="space-y-3">
              {competencyAnalysis?.recommendations.map((recommendation: string, index: number) => (
                <div key={index} className="border rounded-lg p-3 bg-blue-50">
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
