"use client"

import { useState, useEffect, useRef } from "react"
import { analyzeResume } from "@/lib/analyze-resume"
import { STEPS } from "../constants"

export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate progress during analysis
  useEffect(() => {
    if (isAnalyzing) {
      setProgress(0)

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Create new interval to update progress
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            return 90
          }
          return prev + 5
        })
      }, 500)
    } else if (progress > 0 && progress < 100) {
      // Set to 100% when analysis is complete
      setProgress(100)
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isAnalyzing]) // Remove progress from dependency array

  const handleAnalyze = async (
    jobDescription: string,
    resumeText: string,
    setCurrentStep: (step: number) => void,
    setError: (error: string | null) => void,
  ) => {
    if (!resumeText) {
      setError("Could not extract text from the resume file. Please check the file and try again.")
      return
    }

    if (!jobDescription) {
      setError("Please enter a job description.")
      return
    }

    setIsAnalyzing(true)
    setCurrentStep(STEPS.ANALYSIS)
    setError(null)

    try {
      const result = await analyzeResume(jobDescription, resumeText)
      setAnalysisResult(result)
      setProgress(100) // Ensure progress reaches 100% when complete
      setCurrentStep(STEPS.RESULTS)
    } catch (err: any) {
      console.error("Error analyzing resume:", err)
      setError(`Error analyzing resume: ${err.message}`)
      setCurrentStep(STEPS.UPLOAD_RESUME)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return {
    isAnalyzing,
    analysisResult,
    setAnalysisResult,
    progress,
    handleAnalyze,
  }
}
