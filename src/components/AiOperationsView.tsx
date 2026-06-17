"use client";

import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { seedProducts } from "@/lib/catalog/seed-products";
import { buildMetadataBacklog } from "@/lib/intelligence/demo-catalog-signals";
import {
  buildCorporateOpportunities,
  type CorporateOpportunity
} from "@/lib/intelligence/corporate-opportunities";
import { demoInventorySignals } from "@/lib/intelligence/demo-inventory";
import { demoReviewSignals } from "@/lib/intelligence/demo-review-signals";
import { governedActions } from "@/lib/intelligence/governance";
import {
  GOVERNANCE_SHORT_LABEL,
  GOVERNANCE_TONE,
  PRIORITY_LABEL,
  PRIORITY_TONE,
  SENTIMENT_TONE,
  SOURCE_SYSTEM_SHORT_LABEL,
  groupRepeatedQuestions
} from "./intelligence/shared";
import { formatLabel } from "@/lib/formatting";
import { OpportunityDetailModal } from "./OpportunityDetailModal";
import type { ActiveView, FeedbackPayload } from "./types";

const PAGE_SIZE = 5;

const CATEGORY_ACTION: Record<
  CorporateOpportunity["category"],
  { rowLabel: string; kind: "view"; view: ActiveView } | { rowLabel: string; kind: "section" }
> = {
  catalog_readiness:  { rowLabel: "Review source issue", kind: "view",    view: "catalog-readiness" },
  inventory_risk:     { rowLabel: "Review source issue", kind: "view",    view: "inventory-signals" },
  review_return_theme:{ rowLabel: "Review source issue", kind: "section" },
  training_gap:       { rowLabel: "Review source issue", kind: "section" },
  demand_gap:         { rowLabel: "Review source issue", kind: "section" },
  governance:         { rowLabel: "Review governance item", kind: "view", view: "governance"        },
};

type AiOperationsViewProps = {
  feedback: FeedbackPayload | null;
  loading: boolean;
  missingCount: number;
  onRefresh: () => Promise<void>;
  onNavigate: (view: ActiveView) => void;
};

export function AiOperationsView({
  feedback,
  loading,
  missingCount,
  onRefresh,
  onNavigate
}: AiOperationsViewProps) {
  const [activeSection, setActiveSection] = useState("opportunities");
  const [page, setPage] = useState(0);
  const [selectedOpportunity, setSelectedOpportunity] = useState<CorporateOpportunity | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);

  useEffect(() => {
    if (!actionToast) return;
    const timer = setTimeout(() => setActionToast(null), 5000);
    return () => clearTimeout(timer);
  }, [actionToast]);

  function handleOpportunityAction(_opportunity: CorporateOpportunity) {
    setActionToast(
      "In production, CrewGuide would route this to the source system or create a governed review task. This demo keeps the action local."
    );
  }

  const events = feedback?.events ?? [];
  const topUnanswered = feedback?.themes.topUnansweredQuestions ?? [];
  const groupedUnanswered = groupRepeatedQuestions(topUnanswered);
  const topReason = Object.entries(feedback?.themes.reasonCounts ?? {}).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const opportunities = buildCorporateOpportunities(events);
  const totalPages = Math.max(1, Math.ceil(opportunities.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(0);
    }
  }, [page, totalPages]);

  const currentPage = Math.min(page, totalPages - 1);
  const pageItems = opportunities.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);
  const operationalPriorities = opportunities.filter((item) => item.priority === "high").slice(0, 3);
  const metadataBacklog = buildMetadataBacklog();
  const topBacklogItem = metadataBacklog[0];
  const inventoryExceptions = demoInventorySignals.filter(
    (signal) => signal.status === "low_stock" || signal.status === "not_stocked"
  );
  const negativeReviewSignals = demoReviewSignals.filter((signal) => signal.sentiment !== "positive");
  const governanceCounts = {
    allowed_now: governedActions.filter((action) => action.status === "allowed_now").length,
    requires_review: governedActions.filter((action) => action.status === "requires_review").length,
    out_of_scope: governedActions.filter((action) => action.status === "out_of_scope").length
  };

  return (
    <section className="stack" aria-label="AI use case operations">
      <div className="page-header">
        <div className="page-header-meta">
          <div>
            <p className="page-eyebrow">Business Ops</p>
            <h1 className="page-title">AI Use Case Operations</h1>
          </div>
          <button className="secondary-button" type="button" onClick={onRefresh}>
            Refresh
          </button>
        </div>
        <p className="page-description">Source-system signals become an operating queue.</p>
      </div>

      <div className="panel stack" aria-label="Operational priorities">
        <div>
          <p className="eyebrow">Operational Priorities</p>
          <h2>What needs attention first.</h2>
        </div>
        {operationalPriorities.length > 0 ? (
          <div className="intel-grid equal-grid">
            {operationalPriorities.map((opportunity) => (
              <article className="card card-flex priority-card" key={`priority-${opportunity.id}`}>
                <div className="priority-card-body">
                  <p className="card-title">{opportunity.actionTitle}</p>
                  <p className="notice card-summary">{opportunity.businessInterpretation}</p>
                </div>
                <div className="tag-row card-meta">
                  <span className="tag">
                    {SOURCE_SYSTEM_SHORT_LABEL[opportunity.sourceSystem] ?? opportunity.sourceSystem}
                  </span>
                  <span className={`badge ${PRIORITY_TONE[opportunity.priority]}`}>
                    {PRIORITY_LABEL[opportunity.priority]}
                  </span>
                  <span className={`badge ${GOVERNANCE_TONE[opportunity.governanceStatus]}`}>
                    {GOVERNANCE_SHORT_LABEL[opportunity.governanceStatus]}
                  </span>
                </div>
                <button
                  type="button"
                  className="queue-cta queue-cta-primary"
                  onClick={() => setSelectedOpportunity(opportunity)}
                >
                  Review source issue →
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="notice">No high-priority items right now.</p>
        )}
      </div>

      <div className="panel stack" aria-label="Signal sources">
        <div>
          <p className="eyebrow">Signal Sources</p>
          <h2>What each system is telling us right now.</h2>
        </div>

        <div className="intel-grid equal-grid">
          <article className="card card-flex">
            <div>
              <p className="small-label">Shopify / PIM</p>
              <p className="card-title">
                {topBacklogItem
                  ? `"${topBacklogItem.field}" missing on ${topBacklogItem.affectedProductCount}/${topBacklogItem.totalProductCount}`
                  : "Catalog complete"}
              </p>
              <p className="notice card-impact">
                {topBacklogItem?.businessImpact ?? "No catalog gaps in this demo set."}
              </p>
            </div>
            <div className="source-card-footer card-meta">
              <span className="tag">{SOURCE_SYSTEM_SHORT_LABEL.shopify_pim_demo}</span>
              <button
                type="button"
                className="card-toggle"
                onClick={() => onNavigate("catalog-readiness")}
              >
                View Catalog Readiness -&gt;
              </button>
            </div>
          </article>

          <article className="card card-flex">
            <div>
              <p className="small-label">NetSuite / Deposco</p>
              <p className="card-title">
                {inventoryExceptions.length} inventory exception
                {inventoryExceptions.length === 1 ? "" : "s"}
              </p>
              <p className="notice card-impact">
                {inventoryExceptions.length
                  ? "Low or no stock on at least one frequently recommended product."
                  : "All seeded products show healthy stock."}
              </p>
            </div>
            <div className="source-card-footer card-meta">
              <span className="tag">{SOURCE_SYSTEM_SHORT_LABEL.netsuite_deposco_demo}</span>
              <button
                type="button"
                className="card-toggle"
                onClick={() => onNavigate("inventory-signals")}
              >
                View Inventory Signals -&gt;
              </button>
            </div>
          </article>

          <article className="card card-flex">
            <div>
              <p className="small-label">BigQuery</p>
              <p className="card-title">
                {negativeReviewSignals.length} theme{negativeReviewSignals.length === 1 ? "" : "s"} need
                attention
              </p>
              <p className="notice card-impact">
                Seeded review and return themes with mixed or negative sentiment.
              </p>
            </div>
            <div className="source-card-footer card-meta">
              <span className="tag">{SOURCE_SYSTEM_SHORT_LABEL.bigquery_demo}</span>
              <button
                type="button"
                className="card-toggle"
                onClick={() => setActiveSection("feedback")}
              >
                View Customer Feedback -&gt;
              </button>
            </div>
          </article>

          <article className="card card-flex">
            <div>
              <p className="small-label">Rep Feedback</p>
              <p className="card-title">
                {events.length} logged event{events.length === 1 ? "" : "s"}
              </p>
              <p className="notice card-impact">
                {missingCount} flagged missing attributes
                {topReason
                  ? ` - top theme: ${formatLabel(topReason[0])} (${topReason[1]})`
                  : ""}
                .
              </p>
            </div>
            <div className="source-card-footer card-meta">
              <span className="tag">{SOURCE_SYSTEM_SHORT_LABEL.friction_log}</span>
              <button
                type="button"
                className="card-toggle"
                onClick={() => setActiveSection("opportunities")}
              >
                View Opportunity Queue -&gt;
              </button>
            </div>
          </article>

          <article className="card card-flex">
            <div>
              <p className="small-label">Governance</p>
              <p className="card-title">{governanceCounts.allowed_now} allowed now</p>
              <p className="notice card-impact">
                {governanceCounts.requires_review} require review, {governanceCounts.out_of_scope} out
                of scope.
              </p>
            </div>
            <div className="source-card-footer card-meta">
              <span className="tag">{SOURCE_SYSTEM_SHORT_LABEL.governance}</span>
              <button type="button" className="card-toggle" onClick={() => onNavigate("governance")}>
                View Governance -&gt;
              </button>
            </div>
          </article>
        </div>

        {loading ? <p className="notice">Loading latest signals...</p> : null}

        {groupedUnanswered.length > 0 ? (
          <div>
            <p className="small-label">Recent unanswered questions</p>
            <ul className="theme-list">
              {groupedUnanswered.map(({ question, count }, index) => (
                <li key={`${question}-${count}-${index}`}>
                  {question}
                  {count > 1 ? ` ×${count}` : null}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="notice">No unanswered questions logged yet.</p>
        )}
      </div>

      <Tabs.Root className="panel stack" value={activeSection} onValueChange={setActiveSection}>
        <Tabs.List className="subtabs" aria-label="AI use case operations sections">
          <Tabs.Trigger className="subtab" value="opportunities">
            Opportunity Queue
          </Tabs.Trigger>
          <Tabs.Trigger className="subtab" value="feedback">
            Customer Feedback
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="opportunities" className="stack">
          <p className="notice">
            Catalog, inventory, review, and rep-feedback signals combined into one prioritized
            queue.
          </p>
          {opportunities.length > 0 ? (
            <>
              <ul className="queue-list">
                {pageItems.map((opportunity) => {
                  const action = CATEGORY_ACTION[opportunity.category];
                  return (
                    <li key={opportunity.id}>
                      <div className="queue-row">
                        <span className={`badge ${PRIORITY_TONE[opportunity.priority]} queue-priority`}>
                          {PRIORITY_LABEL[opportunity.priority]}
                        </span>
                        <span className="queue-title">{opportunity.actionTitle}</span>
                        <span className="tag queue-source">
                          {SOURCE_SYSTEM_SHORT_LABEL[opportunity.sourceSystem] ?? opportunity.sourceSystem}
                        </span>
                        <span className="queue-impact">{opportunity.businessInterpretation}</span>
                        <span
                          className={`badge ${GOVERNANCE_TONE[opportunity.governanceStatus]} queue-governance`}
                        >
                          {GOVERNANCE_SHORT_LABEL[opportunity.governanceStatus]}
                        </span>
                        <div className="queue-actions">
                          <button
                            type="button"
                            className={
                              opportunity.priority === "high"
                                ? "queue-cta queue-cta-primary"
                                : "queue-cta"
                            }
                            onClick={() => handleOpportunityAction(opportunity)}
                            aria-label={`${action.rowLabel} for ${opportunity.actionTitle}`}
                          >
                            {action.rowLabel} &rarr;
                          </button>
                          <button
                            type="button"
                            className="queue-cta queue-cta-secondary"
                            onClick={() => setSelectedOpportunity(opportunity)}
                            aria-label={`View details for ${opportunity.actionTitle}`}
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {totalPages > 1 ? (
                <div className="queue-pagination">
                  <button
                    type="button"
                    className="secondary-button"
                    disabled={currentPage === 0}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    &larr; Previous
                  </button>
                  <p className="notice">
                    Page {currentPage + 1} of {totalPages}
                  </p>
                  <button
                    type="button"
                    className="secondary-button"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next &rarr;
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <p className="notice">
              No opportunities yet - they populate from catalog gaps, inventory exceptions,
              review themes, and rep feedback.
            </p>
          )}
        </Tabs.Content>

        <Tabs.Content value="feedback" className="stack">
          <div>
            <p className="eyebrow">Customer Feedback Intelligence</p>
            <h2>Review and return themes from BigQuery-shaped demo data.</h2>
          </div>
          <p className="notice">
            Seeded demo themes only. In production these signals would be computed in BigQuery
            over reviews, returns, exchanges, and support tickets.
          </p>
          <div className="stack">
            {demoReviewSignals.map((signal, index) => {
              const product = signal.productId
                ? seedProducts.find((candidate) => candidate.id === signal.productId)
                : undefined;
              return (
                <div className="signal-row" key={`${signal.theme}-${index}`}>
                  <div className="actions">
                    <strong>{signal.theme}</strong>
                    <span className={`badge ${SENTIMENT_TONE[signal.sentiment]}`}>
                      {signal.sentiment}
                    </span>
                  </div>
                  {product ? <span className="tag">{product.name}</span> : null}
                  <p className="notice">{signal.evidenceSummary}</p>
                  <p className="notice">{signal.businessImpact}</p>
                </div>
              );
            })}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        events={events}
        onAction={() => {
          if (selectedOpportunity) {
            handleOpportunityAction(selectedOpportunity);
          }
          setSelectedOpportunity(null);
        }}
        onClose={() => setSelectedOpportunity(null)}
      />

      {actionToast && (
        <div className="action-toast" role="status" aria-live="polite">
          <span>{actionToast}</span>
          <button
            type="button"
            className="advance-toast-dismiss"
            aria-label="Dismiss"
            onClick={() => setActionToast(null)}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
