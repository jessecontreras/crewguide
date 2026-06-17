import type {
  OpportunityCategory,
  OpportunityGovernanceStatus,
  OpportunityPriority,
  OpportunitySourceSystem
} from "@/lib/intelligence/corporate-opportunities";
import type { InventoryStatus } from "@/lib/intelligence/demo-inventory";
import type { ReviewSentiment } from "@/lib/intelligence/demo-review-signals";
import type { GovernedActionStatus } from "@/lib/intelligence/governance";

export const PRIORITY_TONE: Record<OpportunityPriority, string> = {
  high: "badge-bad",
  medium: "badge-warn",
  low: "badge-neutral"
};

export const PRIORITY_LABEL: Record<OpportunityPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low"
};

export const GOVERNANCE_TONE: Record<OpportunityGovernanceStatus, string> = {
  allowed_now: "badge-good",
  requires_review: "badge-warn",
  out_of_scope: "badge-bad"
};

export const GOVERNANCE_SHORT_LABEL: Record<OpportunityGovernanceStatus, string> = {
  allowed_now: "Allowed",
  requires_review: "Review",
  out_of_scope: "Blocked"
};

export const INVENTORY_TONE: Record<InventoryStatus, string> = {
  in_stock: "badge-good",
  low_stock: "badge-warn",
  not_stocked: "badge-bad",
  unknown: "badge-neutral"
};

export const INVENTORY_LABEL: Record<InventoryStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  not_stocked: "Not stocked",
  unknown: "Availability unknown"
};

export const SENTIMENT_TONE: Record<ReviewSentiment, string> = {
  positive: "badge-good",
  mixed: "badge-warn",
  negative: "badge-bad"
};

export const SOURCE_SYSTEM_LABEL: Record<string, string> = {
  shopify_pim_demo: "Shopify/PIM",
  netsuite_deposco_demo: "NetSuite/Deposco",
  bigquery_demo: "BigQuery",
  friction_log: "Rep Feedback",
  governance: "Governance",
  jira_ai_council_demo: "Jira/AI Council",
  internal: "Internal"
};

export const SOURCE_SYSTEM_SHORT_LABEL: Record<OpportunitySourceSystem, string> = {
  shopify_pim_demo: "Shopify/PIM",
  netsuite_deposco_demo: "NetSuite/Deposco",
  bigquery_demo: "BigQuery",
  friction_log: "Rep Feedback",
  governance: "Governance"
};

export const SOURCE_SYSTEM_PRODUCTION_LABEL: Record<OpportunitySourceSystem, string> = {
  shopify_pim_demo: "Shopify / PIM product data",
  netsuite_deposco_demo: "NetSuite & Deposco inventory and fulfillment",
  bigquery_demo: "BigQuery semantic + analytics layer",
  friction_log: "Rep feedback logging in this assistant",
  governance: "Jira / AI Council governance queue"
};

export const CATEGORY_LABEL: Record<OpportunityCategory, string> = {
  catalog_readiness: "Catalog readiness",
  inventory_risk: "Inventory risk",
  demand_gap: "Demand gap",
  training_gap: "Training gap",
  review_return_theme: "Review/return theme",
  governance: "Governance"
};

export const PRODUCTION_ACTION_LABEL: Record<OpportunityCategory, string> = {
  catalog_readiness: "Draft metadata review ticket",
  inventory_risk: "Flag inventory exception",
  review_return_theme: "Open review/return follow-up ticket",
  training_gap: "Publish training card",
  demand_gap: "Open assortment review ticket",
  governance: "Submit to AI Council governance queue"
};

export const GOVERNED_STATUS_LABEL: Record<GovernedActionStatus, string> = {
  allowed_now: "Allowed now",
  requires_review: "Requires review",
  out_of_scope: "Out of scope"
};

export const GOVERNED_STATUS_ORDER: GovernedActionStatus[] = [
  "allowed_now",
  "requires_review",
  "out_of_scope"
];

/**
 * Deduplicates a flat question list into ordered question-count pairs.
 *
 * Preserves first-seen order — the order in which each unique question
 * first appeared in the input. Used by `AiOperationsView` to render the
 * "Recent unanswered questions" list with repeat counts shown inline
 * (e.g. "Can I get it in wide width? ×3").
 *
 * @param questions - Array of question strings, possibly with duplicates.
 * @returns Unique questions in first-seen order, each paired with its
 *   total occurrence count.
 */
export function groupRepeatedQuestions(
  questions: string[]
): Array<{ question: string; count: number }> {
  const order: string[] = [];
  const counts = new Map<string, number>();

  for (const question of questions) {
    if (!counts.has(question)) {
      order.push(question);
    }
    counts.set(question, (counts.get(question) ?? 0) + 1);
  }

  return order.map((question) => ({ question, count: counts.get(question)! }));
}
