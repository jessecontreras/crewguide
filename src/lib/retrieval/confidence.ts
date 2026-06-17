import type { RecommendationResult } from "@/lib/catalog/product-types";

/**
 * Maps a retrieval result to a human-readable confidence tier.
 *
 * Thresholds: ≥ 0.76 → "High", ≥ 0.60 → "Medium", below 0.60 → "Low".
 * When `result.fallback` is true the label is always "Needs clarification"
 * regardless of the numeric confidence score — the fallback decision
 * already incorporates confidence and the label should reflect the rep's
 * actual next step.
 *
 * Used by `EvidencePanel` to label the confidence meter shown to the rep.
 *
 * @param result - The full recommendation result from `recommendProducts`.
 * @returns "High", "Medium", "Low", or "Needs clarification".
 */
export function confidenceLabel(result: RecommendationResult) {
  if (result.fallback) {
    return "Needs clarification";
  }

  if (result.confidence >= 0.76) {
    return "High";
  }

  if (result.confidence >= 0.6) {
    return "Medium";
  }

  return "Low";
}

export function confidencePercent(result: RecommendationResult) {
  return Math.round(result.confidence * 100);
}
