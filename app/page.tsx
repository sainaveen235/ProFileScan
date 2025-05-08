"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { FeaturesSection } from "@/components/features-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { TestimonialsSection } from "@/components/testimonials-section"
import { useEffect } from "react"

export default function Home() {
  // Add smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-2 sm:px-4">
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
