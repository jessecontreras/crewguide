import type { ProductScore } from "@/lib/catalog/product-types";

/**
 * Projects scored products into the citation array returned by `/api/ask`.
 *
 * Strips internal scoring numerics and retains only the data the UI and
 * caller need: product identity, evidence text, and attribute match/gap
 * label strings. Called once per ask request, after `scoreProducts`
 * completes, to populate the `AskResponse.citations` field shown in the
 * Evidence Panel.
 *
 * @param scores - Ranked `ProductScore` objects from `scoreProducts`.
 * @returns One citation record per scored product, preserving rank order.
 */
export function buildEvidenceCitations(scores: ProductScore[]) {
  return scores.map((score) => ({
    productId: score.product.id,
    productName: score.product.name,
    evidenceText: score.product.evidenceText,
    matchedAttributes: score.matchedAttributes,
    missingAttributes: score.missingAttributes,
    tradeoffs: score.tradeoffs
  }));
}
