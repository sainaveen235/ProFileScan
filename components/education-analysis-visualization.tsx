"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { EducationAnalyzer } from "@/lib/education-analyzer"

interface EducationAnalysisVisualizationProps {
  resumeText: string
  jobTitle: string
  jobDescription: string
}

export default function EducationAnalysisVisualization({
  resumeText,
  jobTitle,
  jobDescription,
}: EducationAnalysisVisualizationProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [educationInfo, setEducationInfo] = useState<any>(null)
  const [relevanceAssessment, setRelevanceAssessment] = useState<any>(null)
  const [degreeRequirements, setDegreeRequirements] = useState<any>(null)

  useEffect(() => {
    async function analyzeEducation() {
      setIsLoading(true)

      try {
        // Extract education information
        const education = await EducationAnalyzer.extractEducation(resumeText)
        setEducationInfo(education)

        // Assess relevance to the job
        const relevance = await EducationAnalyzer.assessEducationRelevance(education, jobTitle, jobDescription)
        setRelevanceAssessment(relevance)

        // Get common degree requirements
        const requirements = await EducationAnalyzer.getCommonDegreeRequirements(jobTitle)
        setDegreeRequirements(requirements)
      } catch (error) {
        console.error("Error analyzing education:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (resumeText && jobTitle && jobDescription) {
      analyzeEducation()
    }
  }, [resumeText, jobTitle, jobDescription])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p>Analyzing education qualifications...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!educationInfo) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No education analysis available.</p>
        </CardContent>
      </Card>
    )
  }

  // Get badge color based on relevance
  const getRelevanceBadgeColor = (status: string) => {
    switch (status) {
      case "Yes":
        return "bg-green-100 text-green-800"
      case "Partial":
        return "bg-yellow-100 text-yellow-800"
      case "No":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Education Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Education Summary</h3>

          {educationInfo.degrees.length === 0 && educationInfo.certifications.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                No formal education information was detected in your resume. If you have educational qualifications,
                consider adding them to strengthen your application.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Degrees */}
              {educationInfo.degrees.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Degrees</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {educationInfo.degrees.map((degree: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 bg-blue-50">
                        <p className="font-bold">{degree.degree}</p>
                        <p>
                          {degree.field} - {degree.institution}
                        </p>
                        <p className="text-sm text-gray-600">{degree.graduationDate}</p>
                        {degree.gpa && <p className="text-sm">GPA: {degree.gpa}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {educationInfo.certifications.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Certifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {educationInfo.certifications.map((cert: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 bg-green-50">
                        <p className="font-bold">{cert.name}</p>
                        <p>{cert.issuer}</p>
                        <p className="text-sm text-gray-600">{cert.date}</p>
                        {cert.expirationDate && <p className="text-sm">Expires: {cert.expirationDate}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Continuing Education */}
              {educationInfo.continuingEducation.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Continuing Education</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {educationInfo.continuingEducation.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Relevance Assessment */}
        {relevanceAssessment && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Relevance to {jobTitle}</h3>

            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Education Relevance</span>
              <div className="flex items-center gap-2">
                <Badge className={getRelevanceBadgeColor(relevanceAssessment.hasRelevantDegree)}>
                  {relevanceAssessment.hasRelevantDegree}
                </Badge>
                <span className="font-bold">{relevanceAssessment.relevanceScore}%</span>
              </div>
            </div>
            <Progress
              value={relevanceAssessment.relevanceScore}
              className={`h-2 ${
                relevanceAssessment.relevanceScore >= 70
                  ? "bg-green-500"
                  : relevanceAssessment.relevanceScore >= 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />

            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p>{relevanceAssessment.relevanceExplanation}</p>
            </div>

            {relevanceAssessment.recommendations.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {relevanceAssessment.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Degree Requirements */}
        {degreeRequirements && (
          <div>
            <h3 className="text-lg font-medium mb-4">Typical Requirements for {jobTitle}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Required Degrees */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Typically Required</h4>
                {degreeRequirements.requiredDegrees.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {degreeRequirements.requiredDegrees.map((degree: string, index: number) => (
                      <li key={index}>{degree}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No specific degrees typically required</p>
                )}
              </div>

              {/* Preferred Degrees */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Typically Preferred</h4>
                {degreeRequirements.preferredDegrees.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {degreeRequirements.preferredDegrees.map((degree: string, index: number) => (
                      <li key={index}>{degree}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No specific preferred degrees</p>
                )}
              </div>

              {/* Alternative Paths */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Alternative Paths</h4>
                {degreeRequirements.alternativePaths.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {degreeRequirements.alternativePaths.map((path: string, index: number) => (
                      <li key={index}>{path}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No common alternative paths identified</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
