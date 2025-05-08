"use client"

import { generateEmbedding } from "./gemini-client"

export class SemanticMatcher {
  // Cache for embeddings to avoid redundant API calls
  private static embeddingCache: Map<string, number[]> = new Map()

  // Generate embedding for text
  static async getEmbedding(text: string): Promise<number[]> {
    // Check cache first
    if (this.embeddingCache.has(text)) {
      return this.embeddingCache.get(text)!
    }

    try {
      // Generate embedding using Gemini
      const embedding = await generateEmbedding(text)

      // Cache the result
      this.embeddingCache.set(text, embedding)

      return embedding
    } catch (error) {
      console.error("Error generating embedding:", error)
      // Return empty embedding in case of error
      return []
    }
  }

  // Calculate cosine similarity between two embeddings
  static calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length === 0 || embedding2.length === 0) return 0

    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0)
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0))
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0))

    return dotProduct / (magnitude1 * magnitude2)
  }

  // Compare two texts semantically
  static async compareTexts(text1: string, text2: string): Promise<number> {
    const embedding1 = await this.getEmbedding(text1)
    const embedding2 = await this.getEmbedding(text2)

    return this.calculateSimilarity(embedding1, embedding2)
  }

  // Find semantic matches between two lists of items
  static async findSemanticMatches(
    sourceItems: string[],
    targetItems: string[],
    similarityThreshold = 0.75,
  ): Promise<Array<{ source: string; target: string; similarity: number }>> {
    const matches: Array<{ source: string; target: string; similarity: number }> = []

    // Generate embeddings for all items
    const sourceEmbeddings: number[][] = await Promise.all(sourceItems.map((item) => this.getEmbedding(item)))

    const targetEmbeddings: number[][] = await Promise.all(targetItems.map((item) => this.getEmbedding(item)))

    // Find matches
    for (let i = 0; i < sourceItems.length; i++) {
      for (let j = 0; j < targetItems.length; j++) {
        const similarity = this.calculateSimilarity(sourceEmbeddings[i], targetEmbeddings[j])

        if (similarity >= similarityThreshold) {
          matches.push({
            source: sourceItems[i],
            target: targetItems[j],
            similarity,
          })
        }
      }
    }

    // Sort by similarity (highest first)
    return matches.sort((a, b) => b.similarity - a.similarity)
  }

  // Match resume skills to job requirements using semantic similarity
  static async matchSkillsToRequirements(
    resumeSkills: string[],
    jobRequirements: string[],
  ): Promise<{
    matches: Array<{ skill: string; requirement: string; similarity: number }>
    unmatchedSkills: string[]
    unmatchedRequirements: string[]
  }> {
    const matches = await this.findSemanticMatches(resumeSkills, jobRequirements, 0.6)

    // Find unmatched skills and requirements
    const matchedSkills = new Set(matches.map((m) => m.source))
    const matchedRequirements = new Set(matches.map((m) => m.target))

    const unmatchedSkills = resumeSkills.filter((skill) => !matchedSkills.has(skill))
    const unmatchedRequirements = jobRequirements.filter((req) => !matchedRequirements.has(req))

    return {
      matches: matches.map((m) => ({ skill: m.source, requirement: m.target, similarity: m.similarity })),
      unmatchedSkills,
      unmatchedRequirements,
    }
  }
}
