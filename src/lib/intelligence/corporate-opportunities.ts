import type { FrictionEvent } from "@/lib/catalog/product-types";
import { seedProducts } from "@/lib/catalog/seed-products";
import { buildMetadataBacklog } from "./demo-catalog-signals";
import { demoInventorySignals } from "./demo-inventory";
import { demoReviewSignals } from "./demo-review-signals";
import { governedActions } from "./governance";

export type OpportunitySourceSystem =
  | "shopify_pim_demo"
  | "netsuite_deposco_demo"
  | "bigquery_demo"
  | "friction_log"
  | "governance";

export type OpportunityCategory =
  | "catalog_readiness"
  | "inventory_risk"
  | "demand_gap"
  | "training_gap"
  | "review_return_theme"
  | "governance";

export type OpportunityPriority = "low" | "medium" | "high";
export type OpportunityGovernanceStatus = "allowed_now" | "requires_review" | "out_of_scope";

export type CorporateOpportunity = {
  id: string;
  sourceSystem: OpportunitySourceSystem;
  category: OpportunityCategory;
  actionTitle: string;
  signal: string;
  businessInterpretation: string;
  suggestedAction: string;
  sourceEvents?: string[];
  priority: OpportunityPriority;
  governanceStatus: OpportunityGovernanceStatus;
};

function slugify(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
}

function buildCatalogReadinessOpportunities(): CorporateOpportunity[] {
  const backlog = buildMetadataBacklog().slice(0, 3);

  return backlog.map((item): CorporateOpportunity => {
    const ratio = item.affectedProductCount / item.totalProductCount;
    const examples = item.exampleProductNames.join(", ");
    const more = item.affectedProductCount > item.exampleProductNames.length ? ", and more" : "";

    return {
      id: `catalog-readiness-${slugify(item.field)}`,
      sourceSystem: "shopify_pim_demo",
      category: "catalog_readiness",
      actionTitle: `Add "${item.field}" metadata`,
      signal: `Shopify/PIM: ${examples}${more} are missing "${item.field}".`,
      businessInterpretation: item.businessImpact,
      suggestedAction: `Open a metadata review ticket to add "${item.field}" to the affected products.`,
      priority: ratio >= 0.5 ? "high" : "medium",
      governanceStatus: "requires_review"
    };
  });
}

function buildInventoryRiskOpportunities(): CorporateOpportunity[] {
  return demoInventorySignals
    .filter((signal) => signal.status === "low_stock" || signal.status === "not_stocked")
    .map((signal): CorporateOpportunity => {
      const product = seedProducts.find((candidate) => candidate.id === signal.productId);
      const productName = product?.name ?? signal.productId;
      const statusLabel = signal.status.replaceAll("_", " ");

      return {
        id: `inventory-risk-${signal.productId}`,
        sourceSystem: "netsuite_deposco_demo",
        category: "inventory_risk",
        actionTitle: signal.substituteProductId
          ? `Surface substitute for ${productName}`
          : `Review replenishment for ${productName}`,
        signal: `NetSuite/Deposco: ${productName} is ${statusLabel} at ${signal.locationLabel}${
          signal.sizeNotes ? ` (${signal.sizeNotes})` : ""
        }.`,
        businessInterpretation: signal.businessImpact,
        suggestedAction: signal.substituteProductId
          ? "Surface the substitute and its tradeoff when this product comes up in a recommendation."
          : "Flag for replenishment review before it affects recommendations.",
        priority: signal.status === "not_stocked" ? "high" : "medium",
        governanceStatus: "allowed_now"
      };
    });
}

function buildDemandAndTrainingOpportunities(events: FrictionEvent[]): CorporateOpportunity[] {
  const opportunities: CorporateOpportunity[] = [];

  const needCounts = new Map<
    string,
    { count: number; eventIds: string[]; reason: FrictionEvent["reason"] }
  >();
  for (const event of events) {
    const existing = needCounts.get(event.extractedNeed);
    if (existing) {
      existing.count += 1;
      existing.eventIds.push(event.id);
    } else {
      needCounts.set(event.extractedNeed, {
        count: 1,
        eventIds: [event.id],
        reason: event.reason
      });
    }
  }

  for (const [need, info] of needCounts) {
    if (info.count > 1 || info.reason === "no_matching_product") {
      opportunities.push({
        id: `demand-gap-${info.eventIds[0]}`,
        sourceSystem: "friction_log",
        category: "demand_gap",
        actionTitle: info.count > 1 ? `Review repeated need: ${need}` : `Review unmatched need: ${need}`,
        signal:
          info.count > 1
            ? `Rep Feedback: this need was logged ${info.count} times.`
            : "Rep Feedback: no catalog product matched this need.",
        businessInterpretation:
          info.count > 1
            ? "A recurring customer need that the current catalog isn't clearly answering. This is a demand signal worth a closer look."
            : "A customer need with no matching product in the current catalog - a potential assortment gap.",
        suggestedAction:
          "Open a metadata or assortment review ticket to confirm whether this need is covered.",
        sourceEvents: info.eventIds,
        priority: info.count > 1 ? "high" : "medium",
        governanceStatus: "requires_review"
      });
    }
  }

  const trainingSeen = new Set<string>();
  for (const event of events) {
    if (event.reason !== "ambiguous_request" && event.reason !== "low_confidence") {
      continue;
    }
    const key = `${event.reason}:${event.extractedNeed}`;
    if (trainingSeen.has(key)) {
      continue;
    }
    trainingSeen.add(key);

    opportunities.push({
      id: `training-gap-${event.id}`,
      sourceSystem: "friction_log",
      category: "training_gap",
      actionTitle: `Create training card: ${event.extractedNeed}`,
      signal: `Rep Feedback: ${event.reason.replaceAll("_", " ")} on "${event.query}".`,
      businessInterpretation:
        event.reason === "ambiguous_request"
          ? "Reps are hitting requests that need clarification before a confident recommendation can be made."
          : "Reps are seeing low-confidence matches for this kind of request - a training opportunity to close the gap.",
      suggestedAction: "Create a training card covering this scenario and the clarifying questions to ask.",
      sourceEvents: [event.id],
      priority: "medium",
      governanceStatus: "requires_review"
    });
  }

  return opportunities;
}

function buildReviewReturnOpportunities(): CorporateOpportunity[] {
  return demoReviewSignals
    .filter((signal) => signal.sentiment !== "positive")
    .map((signal): CorporateOpportunity => {
      const product = signal.productId
        ? seedProducts.find((candidate) => candidate.id === signal.productId)
        : undefined;
      const verb = signal.sentiment === "negative" ? "Review" : "Monitor";
      const subject = product ? `${signal.theme} (${product.name})` : signal.theme;

      return {
        id: `review-return-${slugify(signal.theme)}`,
        sourceSystem: "bigquery_demo",
        category: "review_return_theme",
        actionTitle: `${verb} theme: ${subject}`,
        signal: `BigQuery: ${signal.evidenceSummary}`,
        businessInterpretation: signal.businessImpact,
        suggestedAction:
          signal.sentiment === "negative"
            ? "Open a metadata review ticket if this ties to a catalog gap, and note it for rep awareness."
            : "Monitor - mixed sentiment, not yet a clear action item.",
        priority: signal.sentiment === "negative" ? "high" : "low",
        governanceStatus: "allowed_now"
      };
    });
}

function buildGovernanceOpportunity(): CorporateOpportunity {
  const reviewItems = governedActions.filter((action) => action.status === "requires_review");

  return {
    id: "governance-review-queue",
    sourceSystem: "governance",
    category: "governance",
    actionTitle: `Review ${reviewItems.length} governance item${reviewItems.length === 1 ? "" : "s"}`,
    signal: `Jira/AI Council: ${reviewItems.map((item) => item.label).join(", ")}.`,
    businessInterpretation:
      "These actions are drafted by this assistant but require human sign-off before they take effect.",
    suggestedAction: "Review and approve or reject each item in the governance queue.",
    priority: reviewItems.length > 0 ? "medium" : "low",
    governanceStatus: "requires_review"
  };
}

const PRIORITY_RANK: Record<OpportunityPriority, number> = {
  high: 0,
  medium: 1,
  low: 2
};

/**
 * Aggregates business intelligence signals into a prioritized opportunity list
 * for the AI Operations queue.
 *
 * Combines five independent opportunity categories:
 * - **Catalog readiness** — top 3 metadata gaps by affected product count,
 *   derived from seeded `missingFields` in the product catalog.
 * - **Inventory risk** — low-stock and not-stocked items with substitute
 *   signals, derived from seeded `demoInventorySignals`.
 * - **Demand and training gaps** — recurring or unmatched customer needs and
 *   ambiguous queries, derived from live friction events in the telemetry log.
 * - **Review and return themes** — non-positive sentiment themes derived from
 *   seeded `demoReviewSignals`.
 * - **Governance** — a single item counting actions that require human
 *   sign-off, derived from the seeded `governedActions` list.
 *
 * Data boundaries: catalog, inventory, review, and governance sources are all
 * seeded demo data. The `events` parameter is the only live input — it comes
 * from the friction log written by real rep queries.
 *
 * @param events - Friction events from `getFrictionEvents()`. An empty array
 *   is valid; demand and training opportunity categories will simply be empty.
 * @returns All opportunities sorted by priority descending (high → medium →
 *   low). IDs are stable slugs derived from source identifiers.
 */
export function buildCorporateOpportunities(events: FrictionEvent[]): CorporateOpportunity[] {
  const opportunities: CorporateOpportunity[] = [
    ...buildCatalogReadinessOpportunities(),
    ...buildInventoryRiskOpportunities(),
    ...buildDemandAndTrainingOpportunities(events),
    ...buildReviewReturnOpportunities(),
    buildGovernanceOpportunity()
  ];

  return opportunities.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
}
