"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedNLPProcessor } from "@/lib/advanced-nlp-processor"
import { ResumeSectionDetector } from "@/lib/resume-section-detector"
import { estimateSkillLevel, SkillLevel } from "@/lib/skill-taxonomy"

interface ContextualSkillExtractorProps {
  resumeText: string
}

export default function ContextualSkillExtractor({ resumeText }: ContextualSkillExtractorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [sections, setSections] = useState<any>(null)
  const [contextualSkills, setContextualSkills] = useState<any>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  useEffect(() => {
    async function extractContextualSkills() {
      setIsLoading(true)

      try {
        // Detect resume sections
        const detectedSections = await ResumeSectionDetector.detectSections(resumeText)
        setSections(detectedSections.sections)

        // Process each section to extract skills in context
        const skillsBySection: Record<string, any> = {}

        for (const section of detectedSections.sections) {
          // Skip sections that are unlikely to contain skills
          if (["contact", "references"].includes(section.type)) continue

          // Extract entities from this section
          const sectionEntities = await AdvancedNLPProcessor.processText(section.content)

          // For each technical skill, estimate the skill level based on the context
          const skillLevels: Record<string, SkillLevel> = {}

          if (sectionEntities.technicalSkills) {
            for (const skill of sectionEntities.technicalSkills) {
              skillLevels[skill] = await estimateSkillLevel(skill, section.content)
            }
          }

          skillsBySection[section.type] = {
            title: section.title,
            entities: sectionEntities,
            skillLevels,
          }
        }

        setContextualSkills(skillsBySection)

        // Set the default selected section to "experience" or the first available section
        if (skillsBySection.experience) {
          setSelectedSection("experience")
        } else if (Object.keys(skillsBySection).length > 0) {
          setSelectedSection(Object.keys(skillsBySection)[0])
        }
      } catch (error) {
        console.error("Error extracting contextual skills:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (resumeText) {
      extractContextualSkills()
    }
  }, [resumeText])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p>Extracting contextual skills...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!sections || !contextualSkills || Object.keys(contextualSkills).length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No contextual skills found.</p>
        </CardContent>
      </Card>
    )
  }

  // Get skill level badge color
  const getSkillLevelColor = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.BEGINNER:
        return "bg-blue-100 text-blue-800"
      case SkillLevel.INTERMEDIATE:
        return "bg-green-100 text-green-800"
      case SkillLevel.ADVANCED:
        return "bg-purple-100 text-purple-800"
      case SkillLevel.EXPERT:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contextual Skill Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.keys(contextualSkills).map((sectionType) => (
            <Button
              key={sectionType}
              variant={selectedSection === sectionType ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSection(sectionType)}
            >
              {contextualSkills[sectionType].title}
            </Button>
          ))}
        </div>

        {selectedSection && contextualSkills[selectedSection] && (
          <div>
            <h3 className="text-lg font-medium mb-4">Skills in {contextualSkills[selectedSection].title}</h3>

            <Tabs defaultValue="technical">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="technical">Technical Skills</TabsTrigger>
                <TabsTrigger value="soft">Soft Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="technical">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contextualSkills[selectedSection].entities.technicalSkills?.map((skill: string, index: number) => {
                    const skillLevel = contextualSkills[selectedSection].skillLevels[skill] || SkillLevel.INTERMEDIATE
                    return (
                      <div key={index} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{skill}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getSkillLevelColor(skillLevel)}`}>
                            {skillLevel}
                          </span>
                        </div>
                        {contextualSkills[selectedSection].entities.confidenceScores?.technicalSkills?.[skill] && (
                          <p className="text-xs text-gray-500 mt-1">
                            Confidence:{" "}
                            {Math.round(
                              contextualSkills[selectedSection].entities.confidenceScores.technicalSkills[skill] * 100,
                            )}
                            %
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="soft">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contextualSkills[selectedSection].entities.softSkills?.map((skill: string, index: number) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <p className="font-medium">{skill}</p>
                      {contextualSkills[selectedSection].entities.confidenceScores?.softSkills?.[skill] && (
                        <p className="text-xs text-gray-500 mt-1">
                          Confidence:{" "}
                          {Math.round(
                            contextualSkills[selectedSection].entities.confidenceScores.softSkills[skill] * 100,
                          )}
                          %
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
