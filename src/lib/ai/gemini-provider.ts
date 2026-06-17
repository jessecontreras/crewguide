import type { RecommendationResult } from "@/lib/catalog/product-types";
import type { CrewGuideAnswer } from "./provider";
import { synthesizeWithMockProvider } from "./mock-provider";

/**
 * Placeholder for a future Gemini-backed answer synthesizer.
 *
 * Currently delegates to `synthesizeWithMockProvider`. To activate: wire
 * in Gemini credentials and prompt logic here, then update `getAiProvider`
 * in `provider.ts` to select this function via an environment variable
 * (e.g. `process.env.AI_PROVIDER === "gemini"`).
 */
export async function synthesizeWithGeminiProvider(
  result: RecommendationResult
): Promise<CrewGuideAnswer> {
  // Placeholder for production wiring. The demo intentionally avoids real secrets.
  return synthesizeWithMockProvider(result);
}
