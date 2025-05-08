"use client"

import { createReport } from "docx-templates"

type ResumeData = {
  name: string
  email: string
  phone: string
  summary: string
  skills: string[]
  experience: {
    title: string
    company: string
    date: string
    description: string[]
  }[]
  education: {
    degree: string
    institution: string
    date: string
  }[]
}

export async function generateResumeFromTemplate(templateUrl: string, data: ResumeData): Promise<Blob> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      throw new Error("Resume generation is only available in browser environment")
    }

    // Fetch the template
    const templateResponse = await fetch(templateUrl)
    const templateBuffer = await templateResponse.arrayBuffer()

    // Generate the report
    const report = await createReport({
      template: templateBuffer,
      data: {
        ...data,
        skillsString: data.skills.join(", "),
        currentDate: new Date().toLocaleDateString(),
      },
      cmdDelimiter: ["{", "}"], // Default delimiters
    })

    // Convert to Blob
    return new Blob([report], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })
  } catch (error) {
    console.error("Error generating resume from template:", error)
    throw error
  }
}

export function downloadResume(blob: Blob, fileName: string) {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()

  URL.revokeObjectURL(url)
}
