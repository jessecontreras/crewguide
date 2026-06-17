import type { CrewGuideAnswer } from "@/lib/ai/provider";
import type { FrictionEvent, RecommendationResult } from "@/lib/catalog/product-types";

export type ActiveView =
  | "rep"
  | "use-case-pipeline"
  | "ai-operations"
  | "catalog-readiness"
  | "inventory-signals"
  | "governance";

/**
 * Controls which top-level mode the app is in.
 *
 * `"store"` activates the Rep Assistant view (product recommendation,
 * evidence panel, rep feedback). `"business-ops"` activates the Business
 * Ops suite (use case pipeline, AI operations, catalog readiness, inventory
 * signals, governance). Toggled via `ProfileAccessMenu`.
 */
export type AccessMode = "store" | "business-ops";

export type NavItem = {
  id: ActiveView;
  label: string;
  modes: AccessMode[];
};

/**
 * Full response shape returned by the `/api/ask` POST endpoint.
 *
 * `result` is the raw retrieval output from `recommendProducts`; `answer`
 * is the synthesized Rep Assistant response from the active AI provider;
 * `citations` is the projected scoring breakdown for the Evidence Panel;
 * `frictionEvent` is present only when the result triggered a fallback and
 * was logged to the friction event file.
 */
export type AskResponse = {
  result: RecommendationResult;
  answer: CrewGuideAnswer;
  citations: Array<{
    productId: string;
    productName: string;
    evidenceText: string;
    matchedAttributes: string[];
    missingAttributes: string[];
    tradeoffs: string[];
  }>;
  frictionEvent?: FrictionEvent;
};

export type BusinessSignal = {
  category:
    | "Repeated customer need"
    | "Missing catalog metadata"
    | "Training opportunity"
    | "Potential merchandising signal";
  detail: string;
};

/**
 * Full response shape returned by the `/api/feedback` GET endpoint.
 *
 * `events` is the friction log (live events or seeded demo events when no
 * live events exist). `themes` is a server-side roll-up used by the AI
 * Operations and Catalog Readiness views — it contains reason counts, top
 * unanswered questions, hardcoded missing-attribute gaps, suggested
 * improvements, and deduped business signals derived from the event log.
 */
export type FeedbackPayload = {
  events: FrictionEvent[];
  themes: {
    reasonCounts: Record<string, number>;
    topUnansweredQuestions: string[];
    missingAttributes: string[];
    suggestedImprovements: string[];
    businessSignals: BusinessSignal[];
  };
};
