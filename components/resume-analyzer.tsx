"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
// Use the standard import path instead of webpack-specific
import { Document, Page } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf"
import { analyzeResumeAction } from "@/app/actions"

// Set the worker source with a fixed version number
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js"
}

interface ResumeAnalyzerProps {
  onAnalysisComplete: (analysis: any) => void
}

interface PDFTextItem {
  str: string
}

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pdfText, setPdfText] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Convert File to data URL when file changes
  useEffect(() => {
    if (pdfFile) {
      const reader = new FileReader()
      reader.onload = () => {
        setPdfDataUrl(reader.result as string)
      }
      reader.onerror = () => {
        setErrorMessage("Error reading the PDF file.")
      }
      reader.readAsDataURL(pdfFile)
    } else {
      setPdfDataUrl(null)
    }
  }, [pdfFile])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber: number) => Math.max(1, Math.min(prevPageNumber + offset, numPages || 1)))
  }

  const previousPage = () => changePage(-1)

  const nextPage = () => changePage(1)

  const extractTextFromPDF = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      let fullText = ""

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: PDFTextItem) => item.str).join(" ")
        fullText += pageText + "\n"
      }

      setPdfText(fullText)
      handleAnalyze(fullText)
    } catch (error) {
      console.error("Error extracting text from PDF:", error)
      setErrorMessage("Error extracting text from PDF. Please ensure it is a valid PDF file.")
    }
  }

  const handleAnalyze = async (text: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const result = await analyzeResumeAction(text);
      
      if (result.success && result.analysis) {
        onAnalysisComplete(result.analysis);
      } else {
        setErrorMessage("Failed to analyze resume. Please try again.");
      }
    } catch (error: any) {
      console.error("Error analyzing resume:", error);
      setErrorMessage(error.message || "Failed to analyze resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      setPdfFile(file)
      setPageNumber(1)
      setNumPages(null)
      extractTextFromPDF(file)
    },
    [extractTextFromPDF],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  })

  return (
    <div className="resume-analyzer">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop a PDF resume here, or click to select a file</p>
        )}
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {pdfFile && pdfDataUrl && (
        <div className="pdf-viewer">
          <Document
            file={pdfDataUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error("Error loading PDF:", error)
              setErrorMessage("Error loading PDF. Please ensure it is a valid PDF file.")
            }}
            options={{
              cMapUrl: "https://unpkg.com/pdfjs-dist@3.4.120/cmaps/",
              cMapPacked: true,
            }}
          >
            <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
          <div className="pdf-navigation">
            <button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
              Previous
            </button>
            <span>
              Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            </span>
            <button type="button" disabled={pageNumber >= (numPages || 1)} onClick={nextPage}>
              Next
            </button>
          </div>
        </div>
      )}

      {isLoading && <div className="loading-indicator">Analyzing Resume...</div>}
    </div>
  )
}

export default ResumeAnalyzer
