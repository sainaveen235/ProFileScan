"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { MultilingualNLPProcessor } from "@/lib/multilingual-nlp-processor"
import NLPMatchVisualizer from "./nlp-match-visualizer"
import KeywordMatchVisualization from "./keyword-match-visualization"
import NamedEntityRecognition from "./named-entity-recognition"
import ContextualSkillExtractor from "./contextual-skill-extractor"
import DomainSpecificEntityVisualization from "./domain-specific-entity-visualization"
import ConfidenceScoreVisualization from "./confidence-score-visualization"
import KeywordDensityChart from "./keyword-density-chart"
import HighlightedText from "./highlighted-text"

interface AdvancedResumeAnalyzerProps {
  resumeText: string
  jobDescriptionText: string
}

export default function AdvancedResumeAnalyzer({ resumeText, jobDescriptionText }: AdvancedResumeAnalyzerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [resumeLanguage, setResumeLanguage] = useState<any>(null)
  const [jobLanguage, setJobLanguage] = useState<any>(null)
  const [translatedResume, setTranslatedResume] = useState<string | null>(null)
  const [translatedJobDescription, setTranslatedJobDescription] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("semantic")

  useEffect(() => {
    async function detectLanguages() {
      setIsLoading(true)

      try {
        // Detect languages of resume and job description
        const [resumeLang, jobLang] = await Promise.all([
          MultilingualNLPProcessor.detectLanguage(resumeText),
          MultilingualNLPProcessor.detectLanguage(jobDescriptionText),
        ])

        setResumeLanguage(resumeLang)
        setJobLanguage(jobLang)

        // Translate if not in English
        if (resumeLang.languageCode !== "en") {
          const translated = await MultilingualNLPProcessor.translateToEnglish(resumeText, resumeLang.languageCode)
          setTranslatedResume(translated)
        }

        if (jobLang.languageCode !== "en") {
          const translated = await MultilingualNLPProcessor.translateToEnglish(jobDescriptionText, jobLang.languageCode)
          setTranslatedJobDescription(translated)
        }
      } catch (error) {
        console.error("Error detecting languages:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (resumeText && jobDescriptionText) {
      detectLanguages()
    }
  }, [resumeText, jobDescriptionText])

  // Use translated text if available, otherwise use original
  const effectiveResumeText = translatedResume || resumeText
  const effectiveJobDescriptionText = translatedJobDescription || jobDescriptionText

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p>Analyzing resume and job description...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Language detection info */}
      {(resumeLanguage?.languageCode !== "en" || jobLanguage?.languageCode !== "en") && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm">
                {resumeLanguage?.languageCode !== "en" && (
                  <span>Resume detected as {resumeLanguage?.language} (translated to English for analysis)</span>
                )}
              </p>
              <p className="text-sm">
                {jobLanguage?.languageCode !== "en" && (
                  <span>Job description detected as {jobLanguage?.language} (translated to English for analysis)</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="semantic" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="semantic">Semantic Match</TabsTrigger>
          <TabsTrigger value="entities">Entity Recognition</TabsTrigger>
          <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="semantic" className="space-y-8">
          <NLPMatchVisualizer resumeText={effectiveResumeText} jobDescriptionText={effectiveJobDescriptionText} />
          <KeywordMatchVisualization
            resumeText={effectiveResumeText}
            jobDescriptionText={effectiveJobDescriptionText}
          />
        </TabsContent>

        <TabsContent value="entities" className="space-y-8">
          <NamedEntityRecognition text={effectiveResumeText} />
          <Card>
            <CardHeader>
              <CardTitle>Resume Text with Highlighted Entities</CardTitle>
            </CardHeader>
            <CardContent>
              <HighlightedText text={effectiveResumeText} maxLength={2000} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-8">
          <ContextualSkillExtractor resumeText={effectiveResumeText} />
          <KeywordDensityChart text={effectiveResumeText} title="Resume" />
          <KeywordDensityChart text={effectiveJobDescriptionText} title="Job Description" />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-8">
          <DomainSpecificEntityVisualization
            resumeText={effectiveResumeText}
            jobDescriptionText={effectiveJobDescriptionText}
          />
          <ConfidenceScoreVisualization text={effectiveResumeText} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
