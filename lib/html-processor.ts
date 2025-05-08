"use client"

import { convert } from "html-to-text"

export function cleanHtmlContent(htmlContent: string): string {
  // Ensure htmlContent is a string
  const safeHtmlContent = typeof htmlContent === "string" ? htmlContent : String(htmlContent || "")

  return convert(safeHtmlContent, {
    wordwrap: 130,
    selectors: [
      { selector: "a", format: "inline" },
      { selector: "img", format: "skip" },
    ],
  })
}
