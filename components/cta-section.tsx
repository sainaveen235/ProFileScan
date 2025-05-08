"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        <motion.div
          className="mx-auto max-w-4xl bg-[#0a0a0a]/50 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden gradient-border floating-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-50"></div>

          <div className="asymmetrical-grid">
            <div className="asymmetrical-grid-item-large text-center md:text-left relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to optimize your resume?</h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto md:mx-0">
                Start analyzing your resume against job descriptions and get actionable insights today.
              </p>

              <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
                <Link href="/analyzer" scroll={true} replace>
                  <Button
                    size="lg"
                    className="gap-2 rounded-full px-8 py-6 text-base bg-gradient-to-r from-white to-white/90 text-black hover:from-white/95 hover:to-white/85 group interactive-dots"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 rounded-full px-8 py-6 text-base border-white/10 hover:bg-white/5 interactive-dots"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="asymmetrical-grid-item-small hidden md:block">
              <div className="h-full flex items-center justify-center">
                <div className="bg-white/[0.03] rounded-xl p-6 border border-white/10 backdrop-blur-sm w-full">
                  <h3 className="text-lg font-bold mb-4">Why Choose Us</h3>
                  <ul className="space-y-3">
                    <motion.li
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/80">AI-powered analysis</span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <CheckCircle className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/80">Detailed scoring system</span>
                    </motion.li>
                    <motion.li
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <CheckCircle className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/80">Actionable recommendations</span>
                    </motion.li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
