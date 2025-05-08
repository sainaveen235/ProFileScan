"use client"

import type { Variants } from "framer-motion"

// Animation variants for smoother transitions
export const pageTransitionVariants: Variants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.96,
  }),
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.4,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
    scale: 0.96,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.3,
    },
  }),
}

// Staggered children animation variants
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

export const staggerItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
}
