"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Loader2, Download } from "lucide-react"
import { exportAnalysisToCSV, downloadCSV } from "@/lib/csv-exporter"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type AnalysisResult = any

interface CSVExportButtonProps {
  result: AnalysisResult
  resumeName: string
}

export function CSVExportButton({ result, resumeName }: CSVExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleExportCSV = () => {
    if (!result) return

    setIsExporting(true)
    try {
      const csvContent = exportAnalysisToCSV(result, resumeName)
      downloadCSV(csvContent, `Resume_Analysis_${resumeName}.csv`)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error("Error exporting to CSV:", error)
      alert("Failed to export to CSV. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isExporting}
              className="border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 rounded-full gap-1.5 interactive-dots"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>CSV</span>
                </>
              )}
            </Button>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80 whitespace-nowrap border border-white/10"
              >
                <Download className="h-3 w-3 inline-block mr-1" />
                CSV downloaded
              </motion.div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Export analysis as CSV spreadsheet</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
