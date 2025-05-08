"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedNLPProcessor } from "@/lib/advanced-nlp-processor"

interface NLPMatchVisualizerProps {
  resumeText: string
  jobDescriptionText: string
}

export default function NLPMatchVisualizer({ resumeText, jobDescriptionText }: NLPMatchVisualizerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null)
  const [jobAnalysis, setJobAnalysis] = useState<any>(null)
  const [semanticMatches, setSemanticMatches] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("skills")

  useEffect(() => {
    async function performAnalysis() {
      setIsLoading(true)

      try {
        // Analyze resume and job description
        const [resumeResults, jobResults] = await Promise.all([
          AdvancedNLPProcessor.processText(resumeText),
          AdvancedNLPProcessor.processText(jobDescriptionText),
        ])

        setResumeAnalysis(resumeResults)
        setJobAnalysis(jobResults)

        // Perform semantic matching
        const matches = await AdvancedNLPProcessor.semanticMatch(resumeText, jobDescriptionText)
        setSemanticMatches(matches)
      } catch (error) {
        console.error("Error in NLP analysis:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (resumeText && jobDescriptionText) {
      performAnalysis()
    }
  }, [resumeText, jobDescriptionText])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p>Performing advanced NLP analysis...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!resumeAnalysis || !jobAnalysis || !semanticMatches) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No analysis results available. Please provide both resume and job description.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced NLP Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Overall Match Score</h3>
            <span className="text-2xl font-bold">{semanticMatches.overallMatchScore}%</span>
          </div>
          <Progress value={semanticMatches.overallMatchScore} className="h-2" />
        </div>

        <Tabs defaultValue="skills" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="missing">Gaps</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            <h3 className="font-medium">Matched Skills</h3>
            <div className="flex flex-wrap gap-2">
              {semanticMatches.matches
                .filter((match: any) => match.matchType === "skill" || match.matchType === "technical")
                .map((match: any, index: number) => (
                  <div key={index} className="border rounded-lg p-2 flex flex-col">
                    <div className="flex items-center gap-2">
                      <Badge variant={match.matchType === "exact" ? "default" : "outline"}>
                        {match.matchType === "exact" ? "Exact" : "Semantic"}
                      </Badge>
                      <span className="text-sm">{Math.round(match.confidence * 100)}%</span>
                    </div>
                    <p className="mt-1">
                      <strong>Resume:</strong> {match.resumeText}
                    </p>
                    <p>
                      <strong>Job:</strong> {match.jobText}
                    </p>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <h3 className="font-medium">Relevant Experience</h3>
            <div className="space-y-3">
              {semanticMatches.relevantExperiences.map((exp: string, index: number) => (
                <div key={index} className="border rounded-lg p-3">
                  <p>{exp}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <h3 className="font-medium">Education & Certifications</h3>
            <div className="space-y-3">
              {resumeAnalysis.educationDetails?.map((edu: any, index: number) => (
                <div key={index} className="border rounded-lg p-3">
                  <p>
                    <strong>{edu.degree}</strong> - {edu.institution}
                  </p>
                  {edu.date && <p className="text-sm text-gray-600">{edu.date}</p>}
                </div>
              ))}

              {resumeAnalysis.certifications?.map((cert: any, index: number) => (
                <div key={index} className="border rounded-lg p-3">
                  <p>
                    <strong>Certification:</strong> {cert.name}
                  </p>
                  {cert.issuer && <p className="text-sm text-gray-600">{cert.issuer}</p>}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="missing" className="space-y-4">
            <h3 className="font-medium">Missing Requirements</h3>
            <div className="space-y-3">
              {semanticMatches.missingRequirements.map((req: string, index: number) => (
                <div key={index} className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                  <p>{req}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
