import type { RecommendationResult } from "@/lib/catalog/product-types";
import { synthesizeWithMockProvider } from "./mock-provider";

export type CrewGuideAnswer = {
  summary: string;
  bestMatch: string;
  alternatives: string[];
  whyThisFits: string[];
  tradeoffs: string[];
  whatToAskNext: string[];
  evidenceUsed: string[];
};

export type AiProvider = {
  synthesize: (result: RecommendationResult) => Promise<CrewGuideAnswer>;
};

/**
 * Returns the active AI provider for synthesizing Rep Assistant answers.
 *
 * Currently always returns the mock provider, which is deterministic and
 * makes no external API calls. The mock builds `CrewGuideAnswer` from the
 * `RecommendationResult` using template logic seeded from the product catalog.
 *
 * This is the single switch point for real providers. When OpenAI or Gemini
 * integration is ready, add an environment-variable check here (e.g.
 * `process.env.AI_PROVIDER`) and return the appropriate provider. The
 * provider stubs in `openai-provider.ts` and `gemini-provider.ts` exist
 * as placeholders for that wiring.
 *
 * @returns An `AiProvider` whose `synthesize` method accepts a
 *   `RecommendationResult` and returns a `CrewGuideAnswer`.
 */
export function getAiProvider(): AiProvider {
  return {
    synthesize: synthesizeWithMockProvider
  };
}
