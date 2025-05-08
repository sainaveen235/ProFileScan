"use client"

import html2canvas from "html2canvas"

export async function captureElementAsImage(element: HTMLElement): Promise<string> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      throw new Error("Screenshot capture is only available in browser environment")
    }

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false, // Disable logging
      backgroundColor: "#ffffff", // White background
    })

    return canvas.toDataURL("image/png")
  } catch (error) {
    console.error("Error capturing screenshot:", error)
    throw error
  }
}

export function downloadImage(dataUrl: string, fileName: string) {
  // Only run in browser environment
  if (typeof window === "undefined") return

  const link = document.createElement("a")
  link.href = dataUrl
  link.download = fileName
  link.click()
}

export async function shareScreenshot(dataUrl: string, title: string, text: string) {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return false
    }

    // Convert data URL to Blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()

    // Check if Web Share API is available
    if (navigator.share) {
      const file = new File([blob], "resume-analysis.png", { type: "image/png" })

      await navigator.share({
        title,
        text,
        files: [file],
      })

      return true
    } else {
      // Fallback to download
      downloadImage(dataUrl, "resume-analysis.png")
      return false
    }
  } catch (error) {
    console.error("Error sharing screenshot:", error)
    return false
  }
}
