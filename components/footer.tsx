"use client"

import type React from "react"

import Link from "next/link"
import { FileText, Mail, Heart, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendFeedbackAction } from "@/app/actions"

export function Footer() {
  const [feedback, setFeedback] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await sendFeedbackAction({ name, email, feedback })

      if (result.success) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
        setFeedback("")
        setEmail("")
        setName("")
      } else {
        throw new Error("Failed to send feedback")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error sending feedback:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="border-t border-white/10 py-12 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* ProFileScan info */}
          <div className="md:col-span-4">
            <Link href="/" scroll={true} replace className="flex items-center space-x-2 mb-3 group">
              <div className="relative overflow-hidden rounded-full border border-white/10 p-1.5 bg-white/5">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-medium tracking-tight text-xl">
                <span className="font-bold">ProFile</span>Scan
              </span>
            </Link>
            <p className="text-white/70 mb-4 text-base leading-relaxed">
              AI-powered resume analysis to help you land your dream job.
            </p>
          </div>

          {/* Contact Us Section */}
          <div className="md:col-span-3 md:col-start-6 mt-8 md:mt-0">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-white/80" />
              Contact Us
            </h3>
            <div className="space-y-3">
              <p className="text-white/70 text-sm">Have questions or need assistance? Reach out to us directly.</p>
              <p className="text-white/70 text-sm">
                Click the button below to send us an email. We'll get back to you as soon as possible.
              </p>
              <Button
                variant="outline"
                className="mt-2 border-white/20 hover:bg-white/10 hover:text-white transition-colors"
                onClick={() =>
                  (window.location.href = "mailto:sainaveen0981@gmail.com?subject=Inquiry about ProFileScan")
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Us
              </Button>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="md:col-span-4 md:col-start-9 mt-8 md:mt-0">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-white/80" />
              Leave Feedback
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-white/5 border-white/10 focus:border-white/20 text-white h-9"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="bg-white/5 border-white/10 focus:border-white/20 text-white h-9"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="feedback" className="text-sm font-medium">
                  Feedback
                </Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="min-h-[80px] bg-white/5 border-white/10 focus:border-white/20 text-white"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button
                type="submit"
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : submitted ? "Thank you!" : "Submit Feedback"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <p className="text-sm text-white/60 text-center md:text-left">© 2025 ProFileScan. All rights reserved.</p>
          <p className="text-sm text-white/60 flex items-center text-center md:text-right">
            Designed with <Heart className="h-3 w-3 mx-1 text-white/80" /> for job seekers
          </p>
        </div>
      </div>
    </footer>
  )
}
