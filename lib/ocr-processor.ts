"use client"

import { createWorker } from "tesseract.js"

// Initialize Tesseract worker properly
let workerPromise: Promise<any> | null = null

const getWorker = async () => {
  if (!workerPromise) {
    workerPromise = (async () => {
      const worker = await createWorker()
      await worker.loadLanguage("eng")
      await worker.initialize("eng")
      return worker
    })()
  }
  return workerPromise
}

export async function extractTextFromImage(file: File): Promise<string> {
  try {
    // Only initialize in browser environment
    if (typeof window === "undefined") {
      throw new Error("OCR processing is only available in browser environment")
    }

    // Get worker
    const worker = await getWorker()

    // Convert file to image URL
    const imageUrl = URL.createObjectURL(file)

    // Recognize text
    const { data } = await worker.recognize(imageUrl)

    // Revoke object URL to free memory
    URL.revokeObjectURL(imageUrl)

    return data.text
  } catch (error) {
    console.error("Error extracting text from image:", error)
    return ""
  }
}

// Cleanup function to terminate worker when needed
export async function cleanupOCR() {
  if (workerPromise) {
    try {
      const worker = await workerPromise
      await worker.terminate()
      workerPromise = null
    } catch (error) {
      console.error("Error terminating OCR worker:", error)
    }
  }
}
