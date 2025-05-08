"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, UserCheck, Shield, Gift } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <div className="relative pt-4 pb-20 md:pt-6 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Geometric shapes */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full border border-white/5 opacity-20"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full border border-white/5 opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border border-white/5 opacity-20"></div>
      </div>

      <div className="container px-4 md:px-6 relative">
        <div className="asymmetrical-grid">
          <motion.div
            className="asymmetrical-grid-item-large mx-auto text-center md:text-left md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm interactive-dots">
              <span className="text-xs font-medium text-white/80">AI-Powered Resume Analysis</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-6">
              <span className="text-gradient">Optimize your resume</span>
              <br />
              <span className="relative">
                with <span className="ai-text-gradient">AI precision</span>
                <svg
                  className="absolute -bottom-4 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ bottom: "-12px" }}
                >
                  <path
                    d="M1 5.5C32.3333 1.16667 132.8 -3.4 299 10.5"
                    stroke="white"
                    strokeOpacity="0.3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-draw-line"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-lg text-white/70 max-w-2xl">
              Scanlance analyzes your resume against job descriptions to help you land interviews and advance your
              career.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
              <Link href="/analyzer" scroll={true} replace>
                <Button
                  size="lg"
                  className="gap-2 rounded-full px-8 py-6 text-base bg-gradient-to-r from-white to-white/90 text-black hover:from-white/95 hover:to-white/85 group interactive-dots"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="asymmetrical-grid-item-small hidden md:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-white/[0.02] rounded-2xl border border-white/10 gradient-border floating-card"></div>
              <div className="relative z-10 p-6 text-center">
                <div className="text-4xl font-bold mb-2 text-gradient">93%</div>
                <p className="text-sm text-white/70">of users improved their interview callback rates</p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-white/80" />
                    <span className="text-sm text-white/80">ATS-optimized format</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-white/80" />
                    <span className="text-sm text-white/80">Keyword matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-white/80" />
                    <span className="text-sm text-white/80">Actionable feedback</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Responsive feature grid */}
        <div className="mt-20 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 w-full max-w-4xl">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="feature-icon-container icon-purple"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(139, 92, 246, 0.2)",
                    "0 0 20px rgba(139, 92, 246, 0.4)",
                    "0 0 10px rgba(139, 92, 246, 0.2)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  },
                }}
              >
                <UserCheck className="h-7 w-7 text-white" />
              </motion.div>
              <p className="font-semibold text-base tracking-wide text-white text-center mt-2">
                No signup required <span className="text-lg">👍</span>
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.div
                className="feature-icon-container icon-blue"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(56, 189, 248, 0.5)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(56, 189, 248, 0.2)",
                    "0 0 20px rgba(56, 189, 248, 0.4)",
                    "0 0 10px rgba(56, 189, 248, 0.2)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 0.7,
                  },
                }}
              >
                <Shield className="h-7 w-7 text-white" />
              </motion.div>
              <p className="font-semibold text-base tracking-wide text-white text-center max-w-[180px] leading-tight mt-2">
                Your Resumes Processed Locally, Privacy Without Compromise <span className="text-lg">☺️</span>
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <motion.div
                className="feature-icon-container icon-pink"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(244, 114, 182, 0.5)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(244, 114, 182, 0.2)",
                    "0 0 20px rgba(244, 114, 182, 0.4)",
                    "0 0 10px rgba(244, 114, 182, 0.2)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 1.4,
                  },
                }}
              >
                <Gift className="h-7 w-7 text-white" />
              </motion.div>
              <p className="font-semibold text-base tracking-wide text-white text-center mt-2">
                Its Totally Free <span className="text-lg">🥳</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated dots */}
      <div className="absolute top-1/4 left-10 h-2 w-2 rounded-full bg-white/40 animate-pulse-slow"></div>
      <div
        className="absolute top-3/4 right-10 h-2 w-2 rounded-full bg-white/40 animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 h-2 w-2 rounded-full bg-white/40 animate-pulse-slow"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 h-2 w-2 rounded-full bg-white/40 animate-pulse-slow"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <style jsx global>{`
        .feature-icon-container {
          display: flex;
          height: 4.5rem;
          width: 4.5rem;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
          backdrop-filter: blur(8px);
        }
        
        .icon-purple {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(139, 92, 246, 0.25) 100%);
          border: 1px solid rgba(139, 92, 246, 0.4);
        }
        
        .icon-blue {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(56, 189, 248, 0.25) 100%);
          border: 1px solid rgba(56, 189, 248, 0.4);
        }
        
        .icon-pink {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.25) 100%);
          border: 1px solid rgba(244, 114, 182, 0.4);
        }
        
        .feature-icon-container::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 9999px;
          padding: 2px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.8;
          z-index: -1;
        }
        
        .feature-icon-container::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), transparent 70%);
          z-index: 1;
          pointer-events: none;
        }
        
        .icon-purple svg, .icon-blue svg, .icon-pink svg {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
          position: relative;
          z-index: 2;
        }

        .animate-draw-line {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: drawLine 1.5s ease-in-out forwards;
          animation-delay: 1s;
        }

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .ai-text-gradient {
          background: linear-gradient(to right, #00FFFF, #0080FF, #FF00FF);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}
