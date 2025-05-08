"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, FileText, FileArchive, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface FileUploaderProps {
  onFileChange: (file: File) => void
  acceptedFileTypes?: Record<string, string[]>
}

export function FileUploader({ onFileChange, acceptedFileTypes }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        setError("Please upload a supported file type (PDF or DOCX).")
        return
      }

      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      setIsDragging(false)
      setError(null)

      // Simulate upload progress
      setUploadProgress(0)
      setIsProcessing(true)
      setIsComplete(false)

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 100)

      // Simulate processing time
      setTimeout(() => {
        clearInterval(interval)
        setUploadProgress(100)
        setIsProcessing(false)
        setIsComplete(true)
        onFileChange(selectedFile)
      }, 1200)
    },
    [onFileChange],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  // Handle file rejection
  useEffect(() => {
    if (fileRejections.length > 0) {
      setError("File type not supported. Please upload a PDF or DOCX file.")
    }
  }, [fileRejections])

  const removeFile = () => {
    setFile(null)
    setUploadProgress(0)
    setIsComplete(false)
    setError(null)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FileText className="h-8 w-8 text-white" />
    if (fileType.includes("word") || fileType.includes("document")) return <File className="h-8 w-8 text-white" />
    return <FileArchive className="h-8 w-8 text-white" />
  }

  // Reset progress when file is removed
  useEffect(() => {
    if (!file) {
      setUploadProgress(0)
      setIsProcessing(false)
      setIsComplete(false)
    }
  }, [file])

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive || isDragging
              ? "border-white bg-white/5 scale-[1.02]"
              : "border-white/20 hover:border-white/40 hover:bg-white/[0.03]"
          }`}
        >
          <input {...getInputProps()} />

          <AnimatePresence>
            {isDragActive || isDragging ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl"
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-white mb-3 animate-bounce" />
                  <p className="text-lg font-medium">Drop your file here</p>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-white/10 rounded-full blur-md opacity-50"></div>
                  <div className="relative bg-white/5 rounded-full p-4 border border-white/20 interactive-dots">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                </div>

                <p className="text-base font-medium mt-4 mb-1">
                  {isDragActive ? "Drop the file here..." : "Drag and drop your resume"}
                </p>
                <p className="text-sm text-white/60 mb-4">or click to browse files</p>

                <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
                  <span className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/70 border border-white/10">
                    PDF
                  </span>
                  <span className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/70 border border-white/10">
                    DOCX
                  </span>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2 text-sm text-red-400"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-xl p-6 bg-white/[0.03] border-white/10 backdrop-blur-sm gradient-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-white/5 rounded-full blur-md opacity-30"></div>
                <div className="relative bg-white/5 rounded-full p-3 border border-white/10 interactive-dots">
                  {getFileIcon(file.type)}
                </div>
              </div>
              <div>
                <p className="text-base font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-sm text-white/50 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
              className="rounded-full hover:bg-white/5 h-8 w-8 interactive-dots"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>

          <div className="mt-4">
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-white/60">Uploading...</span>
                    <span className="text-white/60">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60 flex items-center">
                  {isComplete ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1 text-white/80" />
                      Ready to analyze
                    </>
                  ) : (
                    "Processing file..."
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-full px-3 py-1 h-auto interactive-dots"
                >
                  Replace
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
