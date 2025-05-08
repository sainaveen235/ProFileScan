"use client"

/**
 * Utility function to extract text from any file type using a fallback approach
 * This is used when the primary extraction methods fail
 */
export async function extractTextWithFallback(file: File): Promise<string> {
  try {
    // For text files, just return the content
    if (file.type === "text/plain") {
      return await file.text()
    }

    // For PDF files, try to read as text (may not work well but better than nothing)
    if (file.type === "application/pdf") {
      try {
        return await file.text()
      } catch (error) {
        console.error("Error reading PDF as text:", error)
        return "Failed to extract text from PDF. Please try a different file format."
      }
    }

    // For DOCX files, try to read as text (will not work well but better than nothing)
    if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      try {
        return await file.text()
      } catch (error) {
        console.error("Error reading DOCX as text:", error)
        return "Failed to extract text from DOCX. Please try a different file format."
      }
    }

    // For other file types, try to read as text
    try {
      return await file.text()
    } catch (error) {
      console.error("Error reading file as text:", error)
      return "Failed to extract text from file. Please try a different file format."
    }
  } catch (error) {
    console.error("Error in fallback text extraction:", error)
    return "Failed to extract text from file. Please try a different file format."
  }
}
