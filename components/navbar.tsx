"use client"

import Link from "next/link"
import { FileText, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showStickyNav, setShowStickyNav] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null) // Initialize analysisResult state

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      setShowStickyNav(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="container px-4 md:px-6 flex h-16 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              scroll={false}
              className="group flex items-center space-x-2"
              onClick={(e) => {
                e.preventDefault()
                // First navigate to homepage if not already there
                if (pathname !== "/") {
                  window.location.href = "/"
                } else {
                  // If already on homepage, just scroll to top
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
              }}
            >
              <div className="relative overflow-hidden rounded-full border border-white/10 p-1.5 bg-white/5 interactive-dots">
                <FileText className="h-5 w-5" />
                <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </div>
              <span className="font-medium tracking-tight text-lg">
                <span className="font-bold">ProFile</span>Scan
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              scroll={true}
              replace
              className={`relative text-sm transition-colors hover:text-white ${
                pathname === "/" ? "text-white" : "text-white/60"
              }`}
            >
              <span>Home</span>
              {pathname === "/" && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
            <Link
              href="/analyzer"
              scroll={true}
              replace
              className={`relative text-sm transition-colors hover:text-white ${
                pathname === "/analyzer" ? "text-white" : "text-white/60"
              }`}
            >
              <span>Analyzer</span>
              {pathname === "/analyzer" && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
            <div className="flex items-center gap-2 ml-6">
              <Link href="/analyzer" scroll={true} replace>
                <Button
                  size="sm"
                  className="rounded-full px-4 bg-gradient-to-r from-white to-white/90 text-black hover:from-white/95 hover:to-white/85 interactive-dots"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>

          <button
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 interactive-dots"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Sticky Navigation for long pages */}
      <AnimatePresence>
        {showStickyNav && pathname.includes("/analyzer") && (
          <motion.div
            className="fixed bottom-6 left-0 right-0 mx-auto w-fit z-50 bg-black/80 backdrop-blur-lg border border-white/10 rounded-full px-4 py-2 shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-3 py-1 h-auto text-xs"
                onClick={scrollToTop}
              >
                Back to Top
              </Button>
              {analysisResult && (
                <>
                  <div className="h-4 w-px bg-white/20"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-3 py-1 h-auto text-xs"
                    onClick={() => document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    View Results
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 top-16 z-40 bg-[#0a0a0a]/95 backdrop-blur-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <Link
                href="/"
                scroll={true}
                replace
                className={`text-2xl font-medium ${pathname === "/" ? "text-white" : "text-white/60"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/analyzer"
                scroll={true}
                replace
                className={`text-2xl font-medium ${pathname === "/analyzer" ? "text-white" : "text-white/60"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analyzer
              </Link>
              <div className="flex flex-col space-y-4 mt-8 w-full max-w-xs">
                <Link href="/analyzer" scroll={true} replace onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="rounded-full py-6 bg-gradient-to-r from-white to-white/90 text-black hover:from-white/95 hover:to-white/85 interactive-dots w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
