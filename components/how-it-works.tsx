"use client"

import { FileUp, Search, BarChart4, FileCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function HowItWorks() {
  const steps = [
    {
      icon: <FileUp className="h-6 w-6" />,
      title: "Upload",
      description: "Upload your resume in PDF, DOCX, or TXT format",
      delay: 0.1,
      tooltip: "We support all major file formats including PDF, DOCX, and TXT",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Analyze",
      description: "Our AI compares your resume to the job description",
      delay: 0.2,
      tooltip: "Our advanced AI analyzes keyword matches, formatting, and content relevance",
    },
    {
      icon: <BarChart4 className="h-6 w-6" />,
      title: "Score",
      description: "Get a detailed score across key categories",
      delay: 0.3,
      tooltip: "Receive scores for technical skills, experience, education, formatting, and soft skills",
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Improve",
      description: "Receive actionable suggestions to improve your resume",
      delay: 0.4,
      tooltip: "Get specific recommendations to enhance your resume's effectiveness",
    },
  ]

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        <motion.div
          className="asymmetrical-grid mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="asymmetrical-grid-item-small">
            <div className="h-full flex items-center">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm interactive-dots">
                <span className="text-xs font-medium text-white/80">Simple Process</span>
              </div>
            </div>
          </div>
          <div className="asymmetrical-grid-item-large">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-white/70 max-w-2xl">
              Our AI analyzes your resume against job descriptions in four simple steps, providing actionable insights
              to improve your chances of landing interviews.
            </p>
          </div>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-white/5 via-white/20 to-white/5 hidden md:block"></div>

          <TooltipProvider>
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-5xl relative">
              {steps.map((step, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="flex flex-col items-center text-center relative cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: step.delay }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-6 relative z-10 backdrop-blur-sm interactive-dots">
                        {step.icon}
                        <div className="absolute -inset-1 bg-white/5 rounded-full blur opacity-50"></div>
                      </div>
                      <div className="absolute top-8 -left-4 text-5xl font-bold text-white/5 hidden md:block">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-sm text-white/70">{step.description}</p>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{step.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 border border-white/10 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute bottom-1/4 right-10 w-32 h-32 border border-white/10 rounded-full opacity-10 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </section>
  )
}
