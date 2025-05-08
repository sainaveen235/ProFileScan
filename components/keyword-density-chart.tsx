"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { keywordExtractor } from "@/lib/keyword-extractor"

interface KeywordDensityChartProps {
  text: string
  title: string
}

export default function KeywordDensityChart({ text, title }: KeywordDensityChartProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [keywordData, setKeywordData] = useState<any>(null)

  useEffect(() => {
    async function analyzeKeywords() {
      setIsLoading(true)

      try {
        // Extract keywords
        const keywords = await keywordExtractor.extractKeywordsAdvanced(text)

        // Calculate density for technical terms
        const densityMap = keywordExtractor.calculateKeywordDensity(text, [
          ...keywords.technicalTerms,
          ...keywords.domainSpecificTerms,
        ])

        // Convert to array and sort by density
        const densityArray = Array.from(densityMap.entries())
          .map(([keyword, density]) => ({ keyword, density }))
          .sort((a, b) => b.density - a.density)
          .slice(0, 15) // Top 15 keywords

        setKeywordData({
          keywords: keywords,
          density: densityArray,
        })
      } catch (error) {
        console.error("Error analyzing keyword density:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (text) {
      analyzeKeywords()
    }
  }, [text])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p>Analyzing keyword density...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!keywordData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No keyword density data available.</p>
        </CardContent>
      </Card>
    )
  }

  // Find the maximum density for scaling
  const maxDensity = keywordData.density.length > 0 ? keywordData.density[0].density : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} Keyword Density</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keywordData.density.map((item: any, index: number) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{item.keyword}</span>
                <span className="text-sm text-gray-500">{(item.density * 100).toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(item.density / maxDensity) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Technical Terms</h3>
            <div className="flex flex-wrap gap-1">
              {keywordData.keywords.technicalTerms.slice(0, 10).map((term: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 rounded-full px-3 py-1 text-xs font-semibold text-blue-800"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Action Verbs</h3>
            <div className="flex flex-wrap gap-1">
              {keywordData.keywords.actionVerbs.slice(0, 10).map((verb: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-green-100 rounded-full px-3 py-1 text-xs font-semibold text-green-800"
                >
                  {verb}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
