"use client"

import mammoth from "mammoth"

export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      throw new Error("DOCX extraction is only available in browser environment")
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Extract text from DOCX
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  } catch (error) {
    console.error("Error extracting text from DOCX:", error)
    // Fallback to basic extraction if mammoth fails
    return file.text()
  }
}
