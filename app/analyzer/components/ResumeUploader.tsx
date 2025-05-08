"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { PDFViewerBasic } from "@/components/pdf-viewer-basic"
import { PDFFallbackViewer } from "@/components/pdf-fallback-viewer"
import { staggerContainerVariants, staggerItemVariants } from "../animations"

interface ResumeUploaderProps {
  file: File | null
  handleFileChange: (file: File) => void
  usePdfFallback: boolean
  error: string | null
  prevStep: () => void
  nextStep: () => void
}

export function ResumeUploader({
  file,
  handleFileChange,
  usePdfFallback,
  error,
  prevStep,
  nextStep,
}: ResumeUploaderProps) {
  return (
    <Card className="border-white/10 bg-[#0a0a0a]/50 overflow-hidden gradient-border floating-card">
      <CardHeader className="pb-2 pt-4">
        <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
          <motion.div variants={staggerItemVariants}>
            <CardTitle className="text-xl">Upload Resume</CardTitle>
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <CardDescription className="text-white/60 text-sm">
              Upload a resume to analyze (PDF or DOCX)
            </CardDescription>
          </motion.div>
        </motion.div>
      </CardHeader>
      <CardContent className="pb-4">
        <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
          <motion.div variants={staggerItemVariants}>
            <FileUploader
              onFileChange={handleFileChange}
              acceptedFileTypes={{
                "application/pdf": [".pdf"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                "application/msword": [".doc"],
              }}
            />
          </motion.div>

          {file && file.type === "application/pdf" && (
            <motion.div
              className="mt-4 border border-white/10 rounded-lg overflow-hidden"
              variants={staggerItemVariants}
            >
              {usePdfFallback ? <PDFFallbackViewer file={file} /> : <PDFViewerBasic file={file} />}
            </motion.div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-4 p-3 bg-white/[0.03] border border-white/10 text-white/80 rounded-lg flex items-start gap-2.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <AlertCircle className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-0.5 text-sm">Error</p>
                  <p className="text-xs text-white/60">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={staggerItemVariants} className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              className="gap-1.5 px-4 py-1.5 rounded-full border-white/10 hover:bg-white/5 interactive-dots text-sm h-9"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={!file}
              className="gap-1.5 px-5 py-1.5 rounded-full bg-gradient-to-r from-white to-white/90 text-black hover:from-white/95 hover:to-white/85 interactive-dots text-sm h-9"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Analyze Resume
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
