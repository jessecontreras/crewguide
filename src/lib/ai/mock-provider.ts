import type { RecommendationResult } from "@/lib/catalog/product-types";
import type { CrewGuideAnswer } from "./provider";

/**
 * Builds a `CrewGuideAnswer` from a scored `RecommendationResult` using
 * template logic. This is the current active AI provider — deterministic,
 * no external model or API is called.
 *
 * Two branches:
 * - **Fallback path** (`result.fallback === true` or no best product):
 *   surfaces the `clarifyingQuestion`, describes why evidence was weak,
 *   and provides next-step prompts for the rep. The `summary` is the
 *   clarifying question itself.
 * - **Normal path**: generates a confidence summary from the best product
 *   name, maps `matchedAttributes` to "Matches X" bullets for `whyThisFits`,
 *   and surfaces scored tradeoffs plus missing catalog fields.
 *
 * `evidenceUsed` always contains all top products' `evidenceText` strings
 * regardless of branch.
 *
 * @param result - Full retrieval result from `recommendProducts`.
 * @returns A `CrewGuideAnswer` ready to surface in the Rep Assistant UI.
 */
export async function synthesizeWithMockProvider(
  result: RecommendationResult
): Promise<CrewGuideAnswer> {
  const [best, ...alternatives] = result.topProducts;

  if (!best || result.fallback) {
    return {
      summary:
        result.clarifyingQuestion ??
        "I do not have enough catalog evidence to make a grounded recommendation.",
      bestMatch: best?.product.name ?? "No grounded match",
      alternatives: alternatives.map((item) => item.product.name),
      whyThisFits: best?.matchedAttributes.length
        ? best.matchedAttributes.map((match) => `Evidence supports ${match}.`)
        : ["The catalog evidence is incomplete for the request."],
      tradeoffs: [
        ...(best?.tradeoffs ?? []),
        ...(best?.missingAttributes.map((field) => `Missing ${field}.`) ?? [])
      ],
      whatToAskNext: [
        result.clarifyingQuestion ?? "Ask which product requirement is the must-have.",
        "For safety-sensitive needs, confirm exact jobsite requirements."
      ],
      evidenceUsed: result.topProducts.map((item) => item.product.evidenceText)
    };
  }

  return {
    summary: `${best.product.name} is the best first pick from the demo catalog. It has the strongest evidence match for the customer's requested attributes, with ${alternatives.length} nearby alternatives to compare.`,
    bestMatch: best.product.name,
    alternatives: alternatives.map((item) => item.product.name),
    whyThisFits: best.matchedAttributes.length
      ? best.matchedAttributes.map((match) => `Matches ${match}.`)
      : ["The product is a general catalog match, but the rep should confirm required attributes."],
    tradeoffs: [
      ...(best.tradeoffs.length ? best.tradeoffs : ["No major tradeoff found in the scored demo metadata."]),
      ...best.missingAttributes.map((field) => `Catalog is missing ${field}.`)
    ],
    whatToAskNext: [
      "Confirm whether safety toe, sole style, or budget is the deciding factor.",
      "For safety-sensitive requirements, confirm exact jobsite requirements.",
      "Ask whether comfort preferences like weight or break-in matter, since this demo catalog has limited comfort metadata."
    ],
    evidenceUsed: result.topProducts.map((item) => item.product.evidenceText)
  };
}
