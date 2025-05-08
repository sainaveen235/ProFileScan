"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, AlertCircle } from "lucide-react"

interface PDFFallbackViewerProps {
  file: File
}

export function PDFFallbackViewer({ file }: PDFFallbackViewerProps) {
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return

    // For PDF files, we'll just show basic info since we can't render them
    if (file.type === "application/pdf") {
      setFilePreview(null)
    }
  }, [file])

  return (
    <div className="pdf-fallback-viewer w-full border border-white/10 rounded-lg p-6 bg-white/[0.02]">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 p-4 bg-white/5 rounded-full">
          <FileText className="h-10 w-10 text-white/70" />
        </div>
        <h3 className="text-lg font-medium mb-2">{file.name}</h3>
        <p className="text-sm text-white/60 mb-4">
          {(file.size / 1024).toFixed(1)} KB • {file.type || "Unknown file type"}
        </p>

        <div className="flex flex-col items-center mt-2 text-white/60 text-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 text-white/60" />
            <span>PDF preview is not available, but the file will still be analyzed</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-white/10 hover:bg-white/5 rounded-full px-4"
            onClick={() => {
              // Create a temporary URL for the file
              const url = URL.createObjectURL(file)
              // Open the file in a new tab
              window.open(url, "_blank")
              // Clean up the URL
              URL.revokeObjectURL(url)
            }}
          >
            Open in new tab
          </Button>
        </div>
      </div>
    </div>
  )
}
