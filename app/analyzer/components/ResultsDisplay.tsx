"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ResumeAnalysisResult } from "@/components/resume-analysis-result"
import { staggerContainerVariants, staggerItemVariants } from "../animations"

interface ResultsDisplayProps {
  analysisResult: any
  file: File | null
  jobTitle: string
  resetAnalysis: () => void
}

export function ResultsDisplay({ analysisResult, file, jobTitle, resetAnalysis }: ResultsDisplayProps) {
  // Add state for feedback popup
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false)
  // Add ref for the feedback section
  const feedbackRef = useRef<HTMLDivElement>(null)

  // Add function to handle feedback button click
  const handleFeedbackClick = () => {
    setShowFeedbackMessage(true)

    // Show message briefly then scroll to feedback section
    setTimeout(() => {
      setShowFeedbackMessage(false)
      // Find the feedback section in the footer and scroll to it
      const feedbackSection = document.querySelector("footer form")
      if (feedbackSection) {
        feedbackSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 2000)
  }

  return (
    <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
      <motion.div variants={staggerItemVariants} className="mb-6">
        <h2 className="text-xl font-bold">Analysis Results</h2>
      </motion.div>

      <motion.div variants={staggerItemVariants}>
        <ResumeAnalysisResult
          result={analysisResult}
          resumeName={file?.name || "Unnamed Resume"}
          jobTitle={jobTitle || "Untitled Job"}
        />
      </motion.div>

      <motion.div variants={staggerItemVariants} className="mt-8 flex justify-center gap-4">
        <Button
          onClick={resetAnalysis}
          className="gap-2 px-6 py-2 text-sm rounded-full bg-gradient-to-r from-white to-white/90 text-black hover:from-white/95 hover:to-white/85 group interactive-dots"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Start New Analysis
        </Button>

        {/* Add the new Loved it? button */}
        <Button
          onClick={handleFeedbackClick}
          className="gap-2 px-6 py-2 text-sm rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-md hover:from-purple-600 hover:to-blue-600 transition-colors duration-200 group interactive-dots"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Loved it?
        </Button>
      </motion.div>

      {/* Add feedback popup message */}
      {showFeedbackMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-white/80 bg-white/10 p-3 rounded-lg border border-white/10 max-w-md mx-auto"
        >
          leave your feedback with us 😊
        </motion.div>
      )}
    </motion.div>
  )
}
