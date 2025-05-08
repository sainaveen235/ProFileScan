"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables, type ChartConfiguration } from "chart.js"
import { motion } from "framer-motion"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Register Chart.js components only in browser environment
if (typeof window !== "undefined") {
  Chart.register(...registerables)
}

type CategoryResult = {
  score: number
  maxScore: number
}

type ScoreChartProps = {
  technicalSkills: CategoryResult
  experience: CategoryResult
  education: CategoryResult
  formatting: CategoryResult
  softSkills: CategoryResult
}

const categoryDescriptions = {
  technicalSkills: "Assessment of technical skills mentioned in your resume against job requirements",
  experience: "Evaluation of your work experience relevance and presentation",
  education: "Analysis of your educational background and qualifications",
  formatting: "Assessment of resume structure, readability, and ATS compatibility",
  softSkills: "Evaluation of communication, teamwork, and other soft skills",
}

export function ScoreChart({ technicalSkills, experience, education, formatting, softSkills }: ScoreChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (!chartRef.current || typeof window === "undefined") return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Calculate percentages
    const technicalPercentage = (technicalSkills.score / technicalSkills.maxScore) * 100
    const experiencePercentage = (experience.score / experience.maxScore) * 100
    const educationPercentage = (education.score / education.maxScore) * 100
    const formattingPercentage = (formatting.score / formatting.maxScore) * 100
    const softSkillsPercentage = (softSkills.score / softSkills.maxScore) * 100

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      const config: ChartConfiguration = {
        type: "radar",
        data: {
          labels: ["Technical Skills", "Experience", "Education", "Formatting", "Soft Skills"],
          datasets: [
            {
              label: "Resume Score (%)",
              data: [0, 0, 0, 0, 0], // Start with zeros for animation
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "rgba(255, 255, 255, 0.8)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(255, 255, 255, 1)",
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBorderWidth: 2,
              pointHoverBorderWidth: 3,
              pointHoverBackgroundColor: "rgba(255, 255, 255, 1)",
              pointHoverBorderColor: "rgba(255, 255, 255, 1)",
            },
          ],
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20,
                color: "rgba(255, 255, 255, 0.5)",
                backdropColor: "transparent",
                font: {
                  size: 10,
                  family: "'Inter', sans-serif",
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              angleLines: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              pointLabels: {
                color: "rgba(255, 255, 255, 0.7)",
                font: {
                  size: 11,
                  family: "'Inter', sans-serif",
                  weight: "500",
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => `Score: ${context.raw}%`,
              },
              backgroundColor: "rgba(10, 11, 13, 0.8)",
              titleColor: "rgba(255, 255, 255, 1)",
              bodyColor: "rgba(255, 255, 255, 1)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              titleFont: {
                size: 12,
                family: "'Inter', sans-serif",
                weight: "bold",
              },
              bodyFont: {
                size: 12,
                family: "'Inter', sans-serif",
              },
            },
          },
          animation: {
            duration: 1500,
            easing: "easeOutQuart",
          },
        },
      }

      chartInstance.current = new Chart(ctx, config)

      // Animate the chart after a short delay
      setTimeout(() => {
        if (chartInstance.current) {
          chartInstance.current.data.datasets[0].data = [
            technicalPercentage,
            experiencePercentage,
            educationPercentage,
            formattingPercentage,
            softSkillsPercentage,
          ]
          chartInstance.current.update()
          setIsAnimated(true)
        }
      }, 500)
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [technicalSkills, experience, education, formatting, softSkills])

  return (
    <div className="w-full h-full relative">
      <canvas ref={chartRef} />

      <TooltipProvider>
        <div className="absolute top-0 right-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-white/60 hover:text-white">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">This radar chart shows your resume's score across five key categories</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4">
        {isAnimated && (
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.8 }}
          >
            <div className="w-2 h-2 rounded-full bg-white/80"></div>
            <span className="text-xs text-white/60">Score Percentages</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
