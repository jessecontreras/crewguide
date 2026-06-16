import { Fragment } from "react";
import { governedActions } from "@/lib/intelligence/governance";
import {
  GOVERNANCE_TONE,
  GOVERNED_STATUS_LABEL,
  GOVERNED_STATUS_ORDER,
  SOURCE_SYSTEM_LABEL
} from "./intelligence/shared";

const productionMapping: Array<{ demo: string; target: string }> = [
  { demo: "Seeded catalog (12 boots)", target: "Shopify / PIM product data" },
  { demo: "Static price + attributes", target: "NetSuite & Deposco inventory and fulfillment" },
  { demo: "File-backed friction log", target: "BigQuery semantic + analytics layer" },
  { demo: "Local dev environment", target: "GCP sandbox" },
  { demo: "Deterministic mock provider", target: "Vertex AI / Gemini or Claude Enterprise" },
  { demo: "Manual run + 5 eval cases", target: "Terraform infra, evals, monitoring, audit logs" }
];

export function GovernanceView() {
  return (
    <section className="stack" aria-label="Governance">
      <div className="page-header">
        <p className="page-eyebrow">Business Ops</p>
        <h1 className="page-title">Governance</h1>
        <p className="page-description">What this assistant can do, what needs review, and what&apos;s out of scope.</p>
      </div>

      <div className="panel stack">
        <p className="notice">
          Read-only first. These are the actions this assistant can take today, which would
          need human review, and which stay out of scope entirely.
        </p>
        <div className="governance-table">
          <div className="governance-table-head" aria-hidden="true">
            <span>Action</span>
            <span>Source</span>
            <span>Status</span>
            <span>Reason</span>
          </div>
          {GOVERNED_STATUS_ORDER.map((status) => {
            const actionsForStatus = governedActions.filter((action) => action.status === status);
            return (
              <Fragment key={status}>
                <p className="governance-group-label small-label">
                  {GOVERNED_STATUS_LABEL[status]} ({actionsForStatus.length})
                </p>
                {actionsForStatus.map((action) => (
                  <div className="governance-row" key={action.label}>
                    <span className="governance-action">{action.label}</span>
                    <span className="tag governance-source">
                      {SOURCE_SYSTEM_LABEL[action.sourceSystem] ?? action.sourceSystem}
                    </span>
                    <span className={`badge ${GOVERNANCE_TONE[status]} governance-status`}>
                      {GOVERNED_STATUS_LABEL[status]}
                    </span>
                    <span className="notice governance-reason">{action.reason}</span>
                  </div>
                ))}
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="panel stack" aria-label="From demo to production">
        <div>
          <p className="eyebrow">Grounding contract</p>
          <h3>Catalog first. Model second.</h3>
          <p className="notice">
            The mock provider only synthesizes from retrieved demo product evidence. Low
            confidence turns into a clarifying question and a logged corporate signal.
          </p>
        </div>
        <div className="mapping-section">
          <p className="small-label">Production path</p>
          <ul className="mapping-list">
            {productionMapping.map((row) => (
              <li className="mapping-row" key={row.demo}>
                <span className="mapping-demo">{row.demo}</span>
                <span className="mapping-target">&rarr; {row.target}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
