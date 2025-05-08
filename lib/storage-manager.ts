"use client"

import localforage from "localforage"

// Initialize localforage only in browser environment
if (typeof window !== "undefined") {
  localforage.config({
    name: "resume-analyzer",
    storeName: "analysis_results",
  })
}

type AnalysisResult = any

export async function saveAnalysisResult(
  resumeName: string,
  jobTitle: string,
  result: AnalysisResult,
): Promise<string> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      throw new Error("Storage is only available in browser environment")
    }

    // Create a unique key
    const key = `${resumeName}_${jobTitle}_${Date.now()}`

    // Save the analysis with metadata
    await localforage.setItem(key, {
      resumeName,
      jobTitle,
      timestamp: new Date().toISOString(),
      result,
    })

    return key
  } catch (error) {
    console.error("Error saving analysis result:", error)
    throw error
  }
}

export async function getAnalysisHistory(): Promise<any[]> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return []
    }

    const history: any[] = []

    // Iterate through all items
    await localforage.iterate((value, key) => {
      history.push({
        id: key,
        ...value,
      })
    })

    // Sort by timestamp (newest first)
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error("Error getting analysis history:", error)
    return []
  }
}

export async function getAnalysisById(id: string): Promise<any | null> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return null
    }

    return await localforage.getItem(id)
  } catch (error) {
    console.error("Error getting analysis by ID:", error)
    return null
  }
}

export async function deleteAnalysisById(id: string): Promise<void> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return
    }

    await localforage.removeItem(id)
  } catch (error) {
    console.error("Error deleting analysis:", error)
    throw error
  }
}
