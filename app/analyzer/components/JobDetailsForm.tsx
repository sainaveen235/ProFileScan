"use client"

import { motion } from "framer-motion"
import { ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { staggerContainerVariants, staggerItemVariants } from "../animations"

interface JobDetailsFormProps {
  jobTitle: string
  setJobTitle: (value: string) => void
  jobDescription: string
  setJobDescription: (value: string) => void
  nextStep: () => void
}

export function JobDetailsForm({
  jobTitle,
  setJobTitle,
  jobDescription,
  setJobDescription,
  nextStep,
}: JobDetailsFormProps) {
  return (
    <Card className="border-white/10 bg-[#0a0a0a]/50 overflow-hidden gradient-border floating-card">
      <CardHeader className="pb-2 pt-4">
        <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
          <motion.div variants={staggerItemVariants}>
            <CardTitle className="text-xl">Job Details</CardTitle>
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <CardDescription className="text-white/60 text-sm">
              Enter the job details to compare against the resume
            </CardDescription>
          </motion.div>
        </motion.div>
      </CardHeader>
      <CardContent className="pb-4">
        <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible" className="space-y-4">
          <motion.div variants={staggerItemVariants} className="space-y-1.5">
            <Label htmlFor="jobTitle" className="text-white/80 text-sm">
              Job Title
            </Label>
            <Input
              id="jobTitle"
              placeholder="e.g. Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="bg-white/[0.03] border-white/10 focus-visible:ring-white/30 rounded-lg interactive-dots h-9"
            />
          </motion.div>

          <motion.div variants={staggerItemVariants} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="jobDescription" className="text-white/80 text-sm">
                Job Description
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-white/60 hover:text-white">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Paste the full job description for best results</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here..."
              className="min-h-[150px] bg-white/[0.03] border-white/10 focus-visible:ring-white/30 rounded-lg interactive-dots"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </motion.div>

          <motion.div variants={staggerItemVariants} className="mt-6 flex justify-end">
            <Button
              onClick={nextStep}
              disabled={!jobDescription}
              className="gap-1.5 px-5 py-1.5 rounded-full bg-gradient-to-r from-white to-white/90 text-black hover:from-white/95 hover:to-white/85 interactive-dots text-sm h-9"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Next Step
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
