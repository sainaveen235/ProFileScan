"use client"

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf"

// Initialize PDF.js worker only on the client side
if (typeof window !== "undefined") {
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${getDocument.version}/pdf.worker.min.js`
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      throw new Error("PDF extraction is only available in browser environment")
    }

    // Use FileReader to read the file as a data URL to prevent ArrayBuffer detachment
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    // Load the PDF document from the data URL
    const pdf = await getDocument({
      url: dataUrl,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${getDocument.version}/cmaps/`,
      cMapPacked: true,
    }).promise

    let fullText = ""

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      fullText += pageText + "\n"
    }

    return fullText
  } catch (error) {
    console.error("Error extracting text from PDF:", error)
    throw error
  }
}
