"use client"

import { CheckCircle, Zap, Shield, BarChart4, FileText, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function FeaturesSection() {
  const features = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "ATS Compatibility",
      description: "Ensure your resume passes through Applicant Tracking Systems with flying colors",
      delay: 0.1,
      tooltip: "Our analysis checks for ATS-friendly formatting and keyword optimization",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Skill Matching",
      description: "Identify missing skills and optimize your resume for specific job requirements",
      delay: 0.2,
      tooltip: "We compare your skills against the job description to find gaps and opportunities",
    },
    {
      icon: <BarChart4 className="h-5 w-5" />,
      title: "Detailed Analytics",
      description: "Get comprehensive scores across technical skills, experience, education, and more",
      delay: 0.3,
      tooltip: "Receive a breakdown of your resume's strengths and weaknesses across key categories",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Content Analysis",
      description: "Receive feedback on your resume's content, structure, and formatting",
      delay: 0.4,
      tooltip: "Our AI evaluates the quality and effectiveness of your resume's content",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Industry Insights",
      description: "Get industry-specific recommendations to stand out from other candidates",
      delay: 0.5,
      tooltip: "Receive tailored advice based on industry standards and expectations",
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Action Plan",
      description: "Receive a prioritized list of improvements to make your resume more effective",
      delay: 0.6,
      tooltip: "Get a step-by-step plan to enhance your resume's impact",
    },
  ]

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container px-4 md:px-6 relative">
        <div className="asymmetrical-grid mb-16">
          <motion.div
            className="asymmetrical-grid-item-large"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm interactive-dots">
              <span className="text-xs font-medium text-white/80">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Key Features</h2>
            <p className="mt-4 text-white/70 max-w-2xl">
              Scanlance provides powerful tools to optimize your resume for any job application, helping you stand out
              from the competition.
            </p>
          </motion.div>

          <motion.div
            className="asymmetrical-grid-item-small hidden md:block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="h-full flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-white/[0.02] rounded-full border border-white/10 animate-pulse-slow"></div>
                <div
                  className="absolute inset-4 bg-white/[0.05] rounded-full border border-white/20 animate-pulse-slow"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute inset-8 bg-white/[0.08] rounded-full border border-white/30 animate-pulse-slow"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </motion.div>
        </div>

        <TooltipProvider>
          <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl">
            {features.map((feature, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <motion.div
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: feature.delay }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative p-6 bg-[#0a0a0a]/50 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:bg-[#0a0a0a]/70 hover:border-white/20 gradient-border floating-card">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-4 relative z-10 interactive-dots">
                        {feature.icon}
                      </div>

                      <h3 className="text-lg font-bold mb-2 relative z-10">{feature.title}</h3>
                      <p className="text-sm text-white/70 relative z-10">{feature.description}</p>

                      <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/[0.02] rounded-tl-3xl"></div>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{feature.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  )
}
