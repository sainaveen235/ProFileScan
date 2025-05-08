"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { STEPS } from "./constants"
import { pageTransitionVariants } from "./animations"
import { initPdfJs } from "./utils"
import { StepProgress } from "./components/StepProgress"
import { JobDetailsForm } from "./components/JobDetailsForm"
import { ResumeUploader } from "./components/ResumeUploader"
import { AnalysisProgress } from "./components/AnalysisProgress"
import { ResultsDisplay } from "./components/ResultsDisplay"
// import { BackToTop } from "./components/BackToTop"
import { useFileHandling } from "./hooks/useFileHandling"
import { useAnalysis } from "./hooks/useAnalysis"
import { useStepNavigation } from "./hooks/useStepNavigation"
// import { useScrollHandling } from "./hooks/useScrollHandling"

// Initialize PDF.js
// initPdfJs()

export default function AnalyzerClientPage() {
  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [direction, setDirection] = useState(0)
  const [isPdfJsInitialized, setIsPdfJsInitialized] = useState(false)

  const { file, setFile, fileText, setFileText, usePdfFallback, error, setError, handleFileChange } = useFileHandling()

  const { isAnalyzing, analysisResult, setAnalysisResult, progress, handleAnalyze } = useAnalysis()

  const { currentStep, setCurrentStep, nextStep, prevStep, goToStep } = useStepNavigation()

  // const { showScrollTop, scrollToTop, scrollToElement } = useScrollHandling()
  const { showScrollTop, scrollToTop } = { showScrollTop: false, scrollToTop: () => {} }

  const resultsRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  // Scroll progress for animations
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  })

  // Transform scroll progress for various animations
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])

  const scrollToElement = (elementRef: React.RefObject<HTMLElement>) => {
    // Only scroll if explicitly requested by user action
    // This prevents automatic scrolling
  }

  // Scroll to results when they're ready - REMOVED to prevent automatic scrolling
  // useEffect(() => {
  //   if (analysisResult && resultsRef.current) {
  //     setTimeout(() => {
  //       scrollToElement(resultsRef)
  //     }, 500)
  //   }
  // }, [analysisResult, scrollToElement])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation when not in a form field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === "ArrowRight" || e.key === "Enter") {
        handleNextStep()
      } else if (e.key === "ArrowLeft") {
        prevStep()
      } else if (e.key === "Home") {
        scrollToTop()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, jobDescription, file, prevStep, scrollToTop])

  const handleNextStep = () => {
    if (currentStep === STEPS.JOB_DETAILS) {
      if (!jobDescription) {
        setError("Please enter a job description.")
        return
      }
      nextStep()
    } else if (currentStep === STEPS.UPLOAD_RESUME) {
      if (!fileText) {
        setError("Could not extract text from the resume file. Please check the file and try again.")
        return
      }
      handleAnalyze(jobDescription, fileText, setCurrentStep, setError)
    }
  }

  const resetAnalysis = () => {
    setDirection(-1)
    setCurrentStep(STEPS.JOB_DETAILS)
    setFile(null)
    setJobDescription("")
    setJobTitle("")
    setAnalysisResult(null)
    setError(null)
  }

  // Initialize PDF.js when component mounts
  useEffect(() => {
    const initializePdfJs = async () => {
      try {
        await initPdfJs()
        setIsPdfJsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize PDF.js:", error)
        // Continue without PDF.js, will use fallback
      }
    }

    initializePdfJs()
  }, [])

  return (
    <div id="top-of-analyzer" className="min-h-screen" ref={mainRef}>
      <Navbar />
      <main className="flex-1 py-4 md:py-6">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ opacity, scale }}
        >
          <div className="inline-flex items-center justify-center px-3 py-1 mb-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="text-xs font-medium text-white/80">AI-Powered Analysis</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Resume Analyzer</h1>
          <p className="text-white/70 mt-1 max-w-2xl text-sm md:text-base">
            Upload your resume and job description to get a detailed analysis and actionable improvements
          </p>
        </motion.div>

        {/* Progress Steps */}
        <StepProgress currentStep={currentStep} />

        <div className="mt-4">
          {/* Step Content */}
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === STEPS.JOB_DETAILS && (
              <motion.div
                key="job-details"
                custom={direction}
                variants={pageTransitionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full px-2 sm:px-4 md:max-w-3xl mx-auto"
              >
                <JobDetailsForm
                  jobTitle={jobTitle}
                  setJobTitle={setJobTitle}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                  nextStep={handleNextStep}
                />
              </motion.div>
            )}

            {currentStep === STEPS.UPLOAD_RESUME && (
              <motion.div
                key="upload-resume"
                custom={direction}
                variants={pageTransitionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full px-2 sm:px-4 md:max-w-3xl mx-auto"
              >
                <ResumeUploader
                  file={file}
                  handleFileChange={handleFileChange}
                  usePdfFallback={!isPdfJsInitialized || usePdfFallback}
                  error={error}
                  prevStep={prevStep}
                  nextStep={handleNextStep}
                />
              </motion.div>
            )}

            {currentStep === STEPS.ANALYSIS && (
              <motion.div
                key="analysis"
                custom={direction}
                variants={pageTransitionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full px-2 sm:px-4 md:max-w-3xl mx-auto"
              >
                <AnalysisProgress progress={progress} file={file} jobTitle={jobTitle} />
              </motion.div>
            )}

            {currentStep === STEPS.RESULTS && (
              <motion.div
                key="results"
                custom={direction}
                variants={pageTransitionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                ref={resultsRef}
                className="w-full px-2 sm:px-4"
              >
                <ResultsDisplay
                  analysisResult={analysisResult}
                  file={file}
                  jobTitle={jobTitle}
                  resetAnalysis={resetAnalysis}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back to Top Button */}
        {/* <BackToTop showScrollTop={showScrollTop} scrollToTop={scrollToTop} /> */}
      </main>
      <Footer />
    </div>
  )
}
