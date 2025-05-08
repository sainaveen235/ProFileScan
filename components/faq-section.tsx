"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"

export function FAQSection() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = (itemValue: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Open the item
    setOpenItem(itemValue)
  }

  const handleMouseLeave = () => {
    // Set a timeout to close the item after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setOpenItem(null)
    }, 2000)
  }

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        <motion.div
          className="mx-auto w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Everything you need to know about Scanlance and our resume analysis service.
            </p>
          </div>

          <div className="bg-[#0a0a0a]/50 border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>

            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
              <AccordionItem
                value="item-1"
                className="border-white/10 px-2"
                onMouseEnter={() => handleMouseEnter("item-1")}
                onMouseLeave={handleMouseLeave}
              >
                <AccordionTrigger className="text-lg font-medium py-4 hover:text-white/90 hover:no-underline">
                  What is Scanlance?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  Scanlance is an AI-powered resume analysis tool that helps job seekers optimize their resumes for
                  specific job descriptions. Our platform uses advanced natural language processing to compare your
                  resume against job requirements, providing actionable insights and recommendations to improve your
                  chances of landing interviews.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border-white/10 px-2"
                onMouseEnter={() => handleMouseEnter("item-2")}
                onMouseLeave={handleMouseLeave}
              >
                <AccordionTrigger className="text-lg font-medium py-4 hover:text-white/90 hover:no-underline">
                  How does Scanlance work?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  Simply upload your resume and paste a job description you're interested in. Our AI will analyze both
                  documents, identifying keyword matches, missing skills, and opportunities for improvement. You'll
                  receive a detailed analysis with a match score and specific recommendations to tailor your resume for
                  that particular job.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border-white/10 px-2"
                onMouseEnter={() => handleMouseEnter("item-3")}
                onMouseLeave={handleMouseLeave}
              >
                <AccordionTrigger className="text-lg font-medium py-4 hover:text-white/90 hover:no-underline">
                  Is my resume stored on your servers?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  No, your privacy is our priority. Your resume is processed entirely in your browser and is never
                  stored on our servers. We use client-side processing to ensure your personal information and resume
                  content remain private and secure.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="border-white/10 px-2"
                onMouseEnter={() => handleMouseEnter("item-4")}
                onMouseLeave={handleMouseLeave}
              >
                <AccordionTrigger className="text-lg font-medium py-4 hover:text-white/90 hover:no-underline">
                  Is Scanlance free to use?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  Yes, Scanlance is completely free to use. We believe everyone should have access to tools that help
                  them advance their careers. There are no hidden fees, subscriptions, or premium features that require
                  payment.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="border-white/10 px-2"
                onMouseEnter={() => handleMouseEnter("item-5")}
                onMouseLeave={handleMouseLeave}
              >
                <AccordionTrigger className="text-lg font-medium py-4 hover:text-white/90 hover:no-underline">
                  Do I need to create an account?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  No, you don't need to create an account or sign up to use Scanlance. We've designed our platform to be
                  as frictionless as possible. Simply visit the site, upload your resume, enter the job description, and
                  get your analysis instantly.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-6"
                className="border-white/10 px-2"
                onMouseEnter={() => handleMouseEnter("item-6")}
                onMouseLeave={handleMouseLeave}
              >
                <AccordionTrigger className="text-lg font-medium py-4 hover:text-white/90 hover:no-underline">
                  What file formats are supported?
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  Scanlance supports the most common resume file formats including PDF, DOCX (Microsoft Word). We
                  recommend using PDF format for the most accurate analysis, as it preserves your resume's formatting.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
