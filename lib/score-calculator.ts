// lib/score-calculator.ts

// This file contains functions for calculating scores based on various criteria.

/**
 * Calculates a score based on a set of input values.
 *
 * @param {number} value1 - The first input value.
 * @param {number} value2 - The second input value.
 * @param {number} weight1 - The weight to apply to the first value.
 * @param {number} weight2 - The weight to apply to the second value.
 * @returns {number} The calculated score.
 */
export function calculateScore(value1: number, value2: number, weight1: number, weight2: number): number {
  const weightedValue1 = value1 * weight1
  const weightedValue2 = value2 * weight2
  const totalScore = weightedValue1 + weightedValue2
  return totalScore
}

/**
 * Calculates an adjusted score based on a base score and an adjustment factor.
 *
 * @param {number} baseScore - The initial score.
 * @param {number} adjustmentFactor - The factor to adjust the score by.
 * @returns {number} The adjusted score.
 */
export function adjustScore(baseScore: number, adjustmentFactor: number): number {
  return baseScore * adjustmentFactor
}

// Verify that the scoring logic remains unchanged
// We should not have modified any of the scoring algorithms or weights
