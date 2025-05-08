"use client"

import { useState, useEffect } from "react"
// Use the standard import path instead of webpack-specific
import { Document, Page } from "react-pdf"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import { pdfjs } from "react-pdf"

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFViewerBasicProps {
  file: File | string
}

export function PDFViewerBasic({ file }: PDFViewerBasicProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [fileData, setFileData] = useState<string | ArrayBuffer | null>(null)

  // Convert File to data URL to prevent ArrayBuffer detachment
  useEffect(() => {
    if (file instanceof File) {
      const reader = new FileReader()
      reader.onload = () => {
        setFileData(reader.result)
      }
      reader.onerror = (e) => {
        console.error("Error reading file:", e)
        setError(new Error("Failed to read PDF file"))
      }
      reader.readAsDataURL(file)
    } else {
      setFileData(file)
    }
  }, [file])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error)
    setError(error)
    setIsLoading(false)
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset
      return Math.max(1, Math.min(newPageNumber, numPages || 1))
    })
  }

  const previousPage = () => changePage(-1)
  const nextPage = () => changePage(1)

  return (
    <div className="pdf-viewer-basic w-full">
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-500">
          <p>Error loading PDF. Please check the file and try again.</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      )}

      {fileData && (
        <Document
          file={fileData}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="flex justify-center"
          options={{
            cMapUrl: "https://unpkg.com/pdfjs-dist@5.2.133/cmaps/",
            cMapPacked: true,
          }}
        >
          <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} width={450} />
        </Document>
      )}

      {numPages && numPages > 0 && (
        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" size="sm" onClick={previousPage} disabled={pageNumber <= 1}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>

          <Button variant="outline" size="sm" onClick={nextPage} disabled={pageNumber >= (numPages || 1)}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
