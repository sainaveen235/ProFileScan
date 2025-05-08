"use client"

import { useState } from "react"
import { extractTextFromPDF } from "@/lib/pdf-extractor"
import { extractTextFromDOCX } from "@/lib/docx-extractor"
import { extractTextWithoutPdfJs } from "../utils"

export function useFileHandling() {
  const [file, setFile] = useState<File | null>(null)
  const [fileText, setFileText] = useState("")
  const [usePdfFallback, setUsePdfFallback] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (file: File) => {
    setFile(file)
    setError(null)
    setUsePdfFallback(false)

    try {
      let text = ""

      if (file.type === "application/pdf") {
        try {
          text = await extractTextFromPDF(file)
        } catch (pdfError) {
          console.error("PDF.js extraction failed, trying fallback method:", pdfError)
          // Set fallback viewer flag
          setUsePdfFallback(true)
          // Try fallback method for PDF
          text = await extractTextWithoutPdfJs(file)
        }
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        text = await extractTextFromDOCX(file)
      } else if (file.type === "text/plain") {
        text = await file.text()
      } else {
        throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.")
      }

      if (!text || text.trim().length === 0) {
        throw new Error("Could not extract text from the file. Please check the file and try again.")
      }

      setFileText(text)
    } catch (err: any) {
      console.error("Error extracting text from file:", err)
      setError(`Error extracting text from file: ${err.message}`)
      // If we failed to extract text, use the fallback viewer
      if (file.type === "application/pdf") {
        setUsePdfFallback(true)
      }
    }
  }

  return {
    file,
    setFile,
    fileText,
    setFileText,
    usePdfFallback,
    error,
    setError,
    handleFileChange,
  }
}
