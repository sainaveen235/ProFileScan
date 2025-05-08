import AnalyzerClientPage from "./AnalyzerClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume Analyzer | Scanlance",
  description: "Upload your resume and job description to get a detailed analysis and actionable improvements.",
}

export default function AnalyzerPage() {
  return <AnalyzerClientPage />
}
