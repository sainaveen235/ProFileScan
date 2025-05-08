"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function useScrollHandling() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Check scroll position to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToElement = (elementRef: React.RefObject<HTMLElement>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return {
    showScrollTop,
    scrollToTop,
    scrollToElement,
  }
}
