"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { keywordExtractor } from "@/lib/keyword-extractor"
import { categorizeSkills } from "@/lib/skill-taxonomy"
import { SemanticMatcher } from "@/lib/semantic-matcher"

interface KeywordMatchVisualizationProps {
  resumeText: string
  jobDescriptionText: string
}

export default function KeywordMatchVisualization({ resumeText, jobDescriptionText }: KeywordMatchVisualizationProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [resumeKeywords, setResumeKeywords] = useState<any>(null)
  const [jobKeywords, setJobKeywords] = useState<any>(null)
  const [matches, setMatches] = useState<any>(null)

  useEffect(() => {
    async function analyzeKeywords() {
      setIsLoading(true)

      try {
        // Extract keywords from resume and job description
        const [resumeResults, jobResults] = await Promise.all([
          keywordExtractor.extractKeywordsAdvanced(resumeText, "resume"),
          keywordExtractor.extractKeywordsAdvanced(jobDescriptionText, "job"),
        ])

        setResumeKeywords(resumeResults)
        setJobKeywords(jobResults)

        // Find semantic matches between resume skills and job requirements
        const technicalMatches = await SemanticMatcher.matchSkillsToRequirements(
          resumeResults.technicalTerms,
          jobResults.technicalTerms,
        )

        // Find semantic matches between domain-specific terms
        const domainMatches = await SemanticMatcher.matchSkillsToRequirements(
          resumeResults.domainSpecificTerms,
          jobResults.domainSpecificTerms,
        )

        // Combine matches
        setMatches({
          technical: technicalMatches,
          domain: domainMatches,
        })
      } catch (error) {
        console.error("Error analyzing keywords:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (resumeText && jobDescriptionText) {
      analyzeKeywords()
    }
  }, [resumeText, jobDescriptionText])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p>Analyzing keywords...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!resumeKeywords || !jobKeywords || !matches) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No keyword analysis results available.</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate match percentages
  const technicalMatchPercentage =
    resumeKeywords.technicalTerms.length > 0
      ? (matches.technical.matches.length / resumeKeywords.technicalTerms.length) * 100
      : 0

  const domainMatchPercentage =
    resumeKeywords.domainSpecificTerms.length > 0
      ? (matches.domain.matches.length / resumeKeywords.domainSpecificTerms.length) * 100
      : 0

  // Categorize technical skills
  const categorizedSkills = categorizeSkills(resumeKeywords.technicalTerms)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Technical Skills Match</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-900">
                    {Math.round(technicalMatchPercentage)}% Match
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block">
                    {matches.technical.matches.length} of {resumeKeywords.technicalTerms.length} skills matched
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div
                  style={{ width: `${technicalMatchPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
            </div>

            <h4 className="font-medium mt-4 mb-2">Matched Technical Skills</h4>
            <div className="grid grid-cols-2 gap-2">
              {matches.technical.matches.map((match: any, index: number) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded p-2 text-sm">
                  <div className="font-medium">{match.skill}</div>
                  <div className="text-xs text-gray-600">Matches: {match.requirement}</div>
                  <div className="text-xs text-gray-600">Similarity: {Math.round(match.similarity * 100)}%</div>
                </div>
              ))}
            </div>

            {matches.technical.unmatchedRequirements.length > 0 && (
              <>
                <h4 className="font-medium mt-4 mb-2">Missing Technical Skills</h4>
                <div className="grid grid-cols-2 gap-2">
                  {matches.technical.unmatchedRequirements.map((skill: string, index: number) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                      {skill}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Domain Knowledge Match</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-900">
                    {Math.round(domainMatchPercentage)}% Match
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block">
                    {matches.domain.matches.length} of {resumeKeywords.domainSpecificTerms.length} terms matched
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${domainMatchPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>

            <h4 className="font-medium mt-4 mb-2">Skills by Category</h4>
            <div className="space-y-3">
              {Object.entries(categorizedSkills)
                .filter(([_, skills]) => skills.length > 0)
                .map(([category, skills]) => (
                  <div key={category} className="border rounded p-3">
                    <h5 className="font-medium mb-2">{category}</h5>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
