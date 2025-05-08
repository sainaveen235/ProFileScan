"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { staggerContainerVariants, staggerItemVariants } from "../animations"

interface AnalysisProgressProps {
  progress: number
  file: File | null
  jobTitle: string
}

export function AnalysisProgress({ progress, file, jobTitle }: AnalysisProgressProps) {
  return (
    <Card className="border-white/10 bg-[#0a0a0a]/50 overflow-hidden gradient-border">
      <CardHeader className="pb-2 pt-4">
        <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
          <motion.div variants={staggerItemVariants}>
            <CardTitle className="text-xl">Analyzing Your Resume</CardTitle>
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <CardDescription className="text-white/60 text-sm">
              Please wait while our AI analyzes your resume against the job description
            </CardDescription>
          </motion.div>
        </motion.div>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-8">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          <motion.div variants={staggerItemVariants} className="relative mb-6">
            <motion.div
              className="absolute -inset-1 bg-white/10 rounded-full blur-md opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            ></motion.div>
            <div className="relative bg-white/5 rounded-full p-5 border border-white/20">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </div>
          </motion.div>

          <motion.div variants={staggerItemVariants} className="w-full max-w-md mb-3">
            <Progress value={progress} className="h-1.5" />
          </motion.div>

          <motion.div variants={staggerItemVariants} className="text-center">
            <h3 className="text-lg font-medium mb-1.5">Analyzing Resume</h3>
            <p className="text-white/70 text-center max-w-md text-sm">
              Our AI is comparing your resume to the job description and generating personalized recommendations.
            </p>
          </motion.div>

          <motion.div variants={staggerItemVariants} className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs font-medium text-white/60 mb-0.5">Resume</div>
              <div className="text-base font-bold">{file?.name || "Your Resume"}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-white/60 mb-0.5">Job</div>
              <div className="text-base font-bold">{jobTitle || "Target Position"}</div>
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
