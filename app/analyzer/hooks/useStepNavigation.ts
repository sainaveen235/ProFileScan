"use client"

import { useState } from "react"
import { STEPS } from "../constants"

export function useStepNavigation() {
  const [currentStep, setCurrentStep] = useState(STEPS.JOB_DETAILS)
  const [direction, setDirection] = useState(0)

  const nextStep = (validateFn?: () => boolean, onNextStep?: () => void) => {
    if (validateFn && !validateFn()) {
      return
    }

    if (currentStep < STEPS.RESULTS) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
      if (onNextStep) onNextStep()
    }
  }

  const prevStep = () => {
    if (currentStep > STEPS.JOB_DETAILS) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1)
    setCurrentStep(step)
  }

  return {
    currentStep,
    setCurrentStep,
    direction,
    nextStep,
    prevStep,
    goToStep,
  }
}
