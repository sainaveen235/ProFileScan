"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { STEPS } from "../constants"

interface StepProgressProps {
  currentStep: number
}

export function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between max-w-3xl mx-auto">
        {Object.values(STEPS)
          .filter((step) => typeof step === "number")
          .map((step) => (
            <motion.div
              key={step}
              className={`flex flex-col items-center ${currentStep >= step ? "text-white" : "text-white/40"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: step * 0.1, duration: 0.3 }}
            >
              <motion.div
                className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                  currentStep > step || (currentStep === step && step === STEPS.RESULTS)
                    ? "bg-white text-black"
                    : currentStep === step
                      ? "border-2 border-white bg-white/10"
                      : "border border-white/20 bg-white/5"
                }`}
                animate={{
                  scale: currentStep === step ? [1, 1.1, 1] : 1,
                  transition: {
                    duration: 0.5,
                    repeat: currentStep === step ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                    repeatDelay: 2,
                  },
                }}
              >
                {currentStep > step || (currentStep === step && step === STEPS.RESULTS) ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <span className="text-xs">{step + 1}</span>
                )}
              </motion.div>
              <span className="text-xs hidden md:block">
                {step === STEPS.JOB_DETAILS && "Job Details"}
                {step === STEPS.UPLOAD_RESUME && "Upload Resume"}
                {step === STEPS.ANALYSIS && "Analysis"}
                {step === STEPS.RESULTS && "Results"}
              </span>
            </motion.div>
          ))}
      </div>
      <div className="mt-2 max-w-3xl mx-auto">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={{ width: `${(currentStep / (Object.keys(STEPS).length / 2 - 1)) * 100}%` }}
            animate={{ width: `${(currentStep / (Object.keys(STEPS).length / 2 - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          ></motion.div>
        </div>
      </div>
    </div>
  )
}
