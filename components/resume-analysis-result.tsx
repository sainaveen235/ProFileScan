"use client"

import { useState } from "react"
import { motion } from "framer-motion"
// import { Download } from 'lucide-react' // Removed
// import { generatePDF } from "@/lib/pdf-generator-client" // Removed

type AnalysisResult = {
  overallScore: number
  technicalSkills: CategoryResult
  experience: CategoryResult
  education: CategoryResult
  formatting: CategoryResult
  softSkills: CategoryResult
  improvementSuggestions: string[]
}

type CategoryResult = {
  score: number
  maxScore: number
  criteria: {
    name: string
    status: "Yes" | "No" | "Partial"
    comments: string
  }[]
  summary: string
}

interface ResumeAnalysisResultProps {
  result: AnalysisResult
  resumeName: string
  jobTitle: string
}

export function ResumeAnalysisResult({ result, resumeName, jobTitle }: ResumeAnalysisResultProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  // const [isGeneratingPDF, setIsGeneratingPDF] = useState(false) // Removed

  // Function to determine color based on score percentage
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "#4ade80" // Green
    if (percentage >= 60) return "#fbbf24" // Amber
    return "#fb7185" // Rose
  }

  // Function to determine glow intensity based on score percentage
  const getGlowIntensity = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "0 0 15px rgba(74, 222, 128, 0.5), 0 0 30px rgba(74, 222, 128, 0.3)"
    if (percentage >= 60) return "0 0 15px rgba(251, 191, 36, 0.5), 0 0 30px rgba(251, 191, 36, 0.3)"
    return "0 0 15px rgba(251, 113, 133, 0.5), 0 0 30px rgba(251, 113, 133, 0.3)"
  }

  // const handleDownloadReport = async () => { // Removed
  //   setIsGeneratingPDF(true)
  //   try {
  //     await generatePDF(result, resumeName, jobTitle)
  //     // Optional: Add a success notification here if you have a toast system
  //   } catch (error) {
  //     console.error("Error generating PDF:", error)
  //     // Show an error message to the user
  //     alert("Failed to generate PDF. Please try again.")
  //   } finally {
  //     setIsGeneratingPDF(false)
  //   }
  // }

  const categories = [
    { key: "technicalSkills", name: "Technical Skills", icon: "💻", data: result.technicalSkills },
    { key: "experience", name: "Work Experience", icon: "📈", data: result.experience },
    { key: "education", name: "Education", icon: "🎓", data: result.education },
    { key: "formatting", name: "ATS Formatting", icon: "📄", data: result.formatting },
    { key: "softSkills", name: "Soft Skills", icon: "🤝", data: result.softSkills },
  ]

  return (
    <div className="relative w-full">
      {/* Cosmic background with animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505] opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10"></div>
        <div className="cosmic-particles"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8">
        {/* Header with holographic effect */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-6 py-2 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-sm holographic"
          >
            <span className="text-sm font-medium text-white">Resume Analysis</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          >
            Talent Profile Analysis
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/60 mb-6"
          >
            Analysis for {resumeName} against {jobTitle}
          </motion.p>

          {/* Overall score with glowing effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center justify-center"
          >
            <div
              className="relative flex items-center justify-center w-32 h-32 rounded-full"
              style={{
                background: `conic-gradient(${getScoreColor(result.overallScore, 100)} ${result.overallScore}%, transparent 0%)`,
                boxShadow: getGlowIntensity(result.overallScore, 100),
              }}
            >
              <div className="absolute inset-2 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                <div>
                  <div className="text-3xl font-bold" style={{ color: getScoreColor(result.overallScore, 100) }}>
                    {result.overallScore}
                  </div>
                  <div className="text-xs text-white/60">Overall Score</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium square card layout for categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {categories.map((category, index) => {
            const scorePercentage = (category.data.score / category.data.maxScore) * 100
            const scoreColor = getScoreColor(category.data.score, category.data.maxScore)

            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category.key)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div
                  className="premium-card bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden"
                  style={{
                    boxShadow:
                      hoveredCategory === category.key
                        ? getGlowIntensity(category.data.score, category.data.maxScore)
                        : "none",
                  }}
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Card header with icon and score */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-md flex items-center justify-center text-2xl"
                          style={{
                            background: `linear-gradient(135deg, ${scoreColor}20, ${scoreColor}05)`,
                            border: `1px solid ${scoreColor}30`,
                          }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{category.name}</h3>
                          <div className="text-sm font-medium" style={{ color: scoreColor }}>
                            {category.data.score}/{category.data.maxScore}
                          </div>
                        </div>
                      </div>

                      {/* Circular progress indicator */}
                      <div
                        className="relative w-14 h-14 rounded-full"
                        style={{
                          background: `conic-gradient(${scoreColor} ${scorePercentage}%, #1a1a1a 0%)`,
                          boxShadow: `0 0 15px ${scoreColor}40`,
                        }}
                      >
                        <div className="absolute inset-1.5 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                          <span className="text-sm font-bold" style={{ color: scoreColor }}>
                            {Math.round(scorePercentage)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Top criteria section */}
                    <div className="mb-4">
                      <div className="text-xs text-white/60 uppercase tracking-wider mb-2">Top criteria</div>
                      {category.data.criteria.slice(0, 2).map((criterion, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-md flex items-center justify-center"
                            style={{
                              backgroundColor:
                                criterion.status === "Yes" ? `${scoreColor}20` : "rgba(255,255,255,0.05)",
                              border:
                                criterion.status === "Yes"
                                  ? `1px solid ${scoreColor}`
                                  : "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            {criterion.status === "Yes" && (
                              <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: scoreColor }}></div>
                            )}
                          </div>
                          <div className="text-sm text-white/80">{criterion.name}</div>
                        </div>
                      ))}
                    </div>

                    {/* Summary section */}
                    <div className="mt-auto">
                      <div
                        className="h-0.5 w-full mb-3 opacity-30"
                        style={{
                          background: `linear-gradient(to right, ${scoreColor}, transparent)`,
                        }}
                      ></div>
                      <p className="text-sm text-white/70 line-clamp-2">{category.data.summary}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Premium detailed category analysis */}
        <div className="space-y-8 mb-12">
          {categories.map((category, index) => {
            const scoreColor = getScoreColor(category.data.score, category.data.maxScore)

            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="relative"
              >
                <div className="premium-detail-card bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden">
                  <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ background: `linear-gradient(to right, ${scoreColor}80, transparent)` }}
                  ></div>

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center text-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${scoreColor}30, ${scoreColor}05)`,
                          border: `1px solid ${scoreColor}40`,
                          boxShadow: `0 0 20px ${scoreColor}20`,
                        }}
                      >
                        {category.icon}
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold text-white">{category.name}</h3>
                          <div
                            className="text-sm font-medium px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: `${scoreColor}20`,
                              color: scoreColor,
                              border: `1px solid ${scoreColor}40`,
                            }}
                          >
                            {category.data.score}/{category.data.maxScore}
                          </div>
                        </div>

                        <p className="text-sm mt-2" style={{ color: `${scoreColor}CC` }}>
                          {category.data.summary}
                        </p>
                      </div>
                    </div>

                    <div
                      className="w-full h-0.5 mb-6"
                      style={{ background: `linear-gradient(to right, ${scoreColor}40, transparent)` }}
                    ></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.data.criteria.map((criterion, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 rounded-lg"
                          style={{
                            backgroundColor: criterion.status === "Yes" ? `${scoreColor}10` : "rgba(255,255,255,0.03)",
                            border:
                              criterion.status === "Yes"
                                ? `1px solid ${scoreColor}30`
                                : "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <div
                            className="w-5 h-5 mt-0.5 rounded-md flex items-center justify-center"
                            style={{
                              backgroundColor:
                                criterion.status === "Yes" ? `${scoreColor}20` : "rgba(255,255,255,0.05)",
                              border:
                                criterion.status === "Yes"
                                  ? `1px solid ${scoreColor}40`
                                  : "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            {criterion.status === "Yes" && (
                              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: scoreColor }}></div>
                            )}
                          </div>

                          <div>
                            <div className="text-sm font-medium text-white/90">{criterion.name}</div>
                            <div className="text-xs text-white/60 mt-2">{criterion.comments}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Premium improvement suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="relative"
        >
          <div className="premium-suggestions-card bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500/80 to-transparent"></div>

            <div className="p-6">
              {/* Modified Header */}
              <div className="flex items-center mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, rgba(244, 63, 94, 0.3), rgba(244, 63, 94, 0.05))`,
                      border: `1px solid rgba(244, 63, 94, 0.4)`,
                      boxShadow: `0 0 20px rgba(244, 63, 94, 0.2)`,
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Improvement Suggestions</h3>
                    <p className="text-sm text-rose-300/70">Actionable steps to enhance your resume</p>
                  </div>
                </div>
              </div>

              <div
                className="w-full h-0.5 mb-6"
                style={{ background: `linear-gradient(to right, rgba(244, 63, 94, 0.4), transparent)` }}
              ></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.improvementSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-rose-500/5 border border-rose-500/20"
                  >
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-rose-300 text-sm font-medium"
                      style={{
                        background: `linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(244, 63, 94, 0.05))`,
                        border: `1px solid rgba(244, 63, 94, 0.3)`,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="text-sm text-white/80">{suggestion}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CSS for custom styling */}
      <style jsx global>{`
        .cosmic-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(74, 222, 128, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(251, 113, 133, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: particles-animation 20s linear infinite;
        }

        @keyframes particles-animation {
          0% {
            background-position: 0 0, 0 0, 0 0;
          }
          100% {
            background-position: 100px 100px, 100px 100px, 100px 100px;
          }
        }

        .holographic {
          position: relative;
          overflow: hidden;
        }

        .holographic::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          animation: holographic-animation 3s linear infinite;
        }

        @keyframes holographic-animation {
          0% {
            transform: rotate(30deg) translateX(-100%);
          }
          100% {
            transform: rotate(30deg) translateX(100%);
          }
        }

        .neo-brutalism-card {
          background-color: rgba(10, 10, 10, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .neo-brutalism-card:hover {
          background-color: rgba(15, 15, 15, 0.9);
        }

        .premium-card {
          position: relative;
          aspect-ratio: 1 / 1;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .premium-card:hover {
          transform: translateY(-5px);
        }

        .premium-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%);
          pointer-events: none;
        }

        .premium-detail-card {
          position: relative;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .premium-detail-card:hover {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.05);
        }

        .premium-suggestions-card {
          position: relative;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .premium-suggestions-card:hover {
          box-shadow: 0 0 30px rgba(244, 63, 94, 0.1);
        }
      `}</style>
    </div>
  )
}
