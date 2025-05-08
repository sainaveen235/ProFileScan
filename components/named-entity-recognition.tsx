"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedNLPProcessor } from "@/lib/advanced-nlp-processor"

interface NamedEntityRecognitionProps {
  text: string
}

export default function NamedEntityRecognition({ text }: NamedEntityRecognitionProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [entities, setEntities] = useState<any>(null)
  const [relationships, setRelationships] = useState<any>(null)

  useEffect(() => {
    async function extractEntities() {
      setIsLoading(true)

      try {
        // Process text to extract entities
        const extractedEntities = await AdvancedNLPProcessor.processText(text)
        setEntities(extractedEntities)

        // Extract relationships between entities
        const extractedRelationships = await AdvancedNLPProcessor.extractRelationships(text)
        setRelationships(extractedRelationships)
      } catch (error) {
        console.error("Error extracting entities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (text) {
      extractEntities()
    }
  }, [text])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p>Extracting entities...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!entities) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No entities found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Named Entity Recognition</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="skills">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="dates">Dates</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {entities.technicalSkills?.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {entities.softSkills?.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="organizations">
            <h3 className="text-lg font-medium mb-2">Organizations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entities.organizations?.map((org: string, index: number) => (
                <div key={index} className="border rounded-lg p-3 bg-purple-50">
                  <p>{org}</p>
                  {entities.confidenceScores?.organizations?.[org] && (
                    <p className="text-xs text-gray-500">
                      Confidence: {Math.round(entities.confidenceScores.organizations[org] * 100)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="people">
            <h3 className="text-lg font-medium mb-2">People</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entities.people?.map((person: string, index: number) => (
                <div key={index} className="border rounded-lg p-3 bg-yellow-50">
                  <p>{person}</p>
                  {entities.confidenceScores?.people?.[person] && (
                    <p className="text-xs text-gray-500">
                      Confidence: {Math.round(entities.confidenceScores.people[person] * 100)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dates">
            <h3 className="text-lg font-medium mb-2">Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entities.dates?.map((date: string, index: number) => (
                <div key={index} className="border rounded-lg p-3 bg-orange-50">
                  <p>{date}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="relationships">
            <h3 className="text-lg font-medium mb-2">Entity Relationships</h3>
            <div className="space-y-3">
              {relationships?.map((rel: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center">
                    <span className="font-medium text-blue-800 px-2 py-1 bg-blue-100 rounded">{rel.subject}</span>
                    <span className="mx-2 text-gray-500">{rel.predicate}</span>
                    <span className="font-medium text-purple-800 px-2 py-1 bg-purple-100 rounded">{rel.object}</span>
                  </div>
                  {rel.confidence && (
                    <p className="text-xs text-gray-500 mt-1">Confidence: {Math.round(rel.confidence * 100)}%</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
