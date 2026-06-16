"use client";

import { useEffect, useRef } from "react";
import type { FrictionEvent } from "@/lib/catalog/product-types";
import type { CorporateOpportunity } from "@/lib/intelligence/corporate-opportunities";
import {
  GOVERNANCE_SHORT_LABEL,
  GOVERNANCE_TONE,
  GOVERNED_STATUS_LABEL,
  PRIORITY_LABEL,
  PRIORITY_TONE,
  PRODUCTION_ACTION_LABEL,
  SOURCE_SYSTEM_LABEL,
  SOURCE_SYSTEM_PRODUCTION_LABEL,
  SOURCE_SYSTEM_SHORT_LABEL
} from "./intelligence/shared";

type OpportunityDetailModalProps = {
  opportunity: CorporateOpportunity | null;
  events: FrictionEvent[];
  onAction: () => void;
  onClose: () => void;
};

export function OpportunityDetailModal({
  opportunity,
  events,
  onAction,
  onClose
}: OpportunityDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (opportunity && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!opportunity && dialog.open) {
      dialog.close();
    }
  }, [opportunity]);

  return (
    <dialog
      ref={dialogRef}
      className="detail-modal"
      aria-label={opportunity ? opportunity.actionTitle : "Opportunity details"}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      {opportunity ? (
        <div className="image-modal-body">
          <div className="image-modal-header">
            <h3>{opportunity.actionTitle}</h3>
            <button
              type="button"
              className="image-modal-close"
              aria-label="Close opportunity details"
              ref={closeButtonRef}
              onClick={onClose}
            >
              &times;
            </button>
          </div>

          <div className="tag-row">
            <span className={`badge ${PRIORITY_TONE[opportunity.priority]}`}>
              {PRIORITY_LABEL[opportunity.priority]}
            </span>
            <span className={`badge ${GOVERNANCE_TONE[opportunity.governanceStatus]}`}>
              {GOVERNANCE_SHORT_LABEL[opportunity.governanceStatus]}
            </span>
            <span className="tag">
              {SOURCE_SYSTEM_SHORT_LABEL[opportunity.sourceSystem] ?? opportunity.sourceSystem}
            </span>
          </div>

          <div>
            <p className="small-label">What happened</p>
            <p className="notice">{opportunity.signal}</p>
          </div>

          <div>
            <p className="small-label">Why it matters</p>
            <p>{opportunity.businessInterpretation}</p>
          </div>

          <div>
            <p className="small-label">Recommended action</p>
            <p>{opportunity.suggestedAction}</p>
          </div>

          <div>
            <p className="small-label">Source system</p>
            <div className="tag-row">
              <span className="tag">
                {SOURCE_SYSTEM_LABEL[opportunity.sourceSystem] ?? opportunity.sourceSystem}
              </span>
            </div>
          </div>

          {opportunity.sourceEvents?.length ? (
            <div>
              <p className="small-label">Affected signals</p>
              <div className="stack">
                {opportunity.sourceEvents.map((eventId) => {
                  const event = events.find((candidate) => candidate.id === eventId);
                  if (!event) {
                    return null;
                  }
                  return (
                    <article className="friction-row" key={event.id}>
                      <div className="actions">
                        <span className="badge">{event.reason.replaceAll("_", " ")}</span>
                        <span className="notice">{new Date(event.createdAt).toLocaleString()}</span>
                      </div>
                      <strong>{event.extractedNeed}</strong>
                      <p>{event.query}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div>
            <p className="small-label">Remediation path</p>
            <div className="stack">
              <div className="action-path-row action-path-demo">
                <div>
                  <p className="small-label">Demo action</p>
                  <p className="action-path-title">
                    Route to source system or create a governed review task
                  </p>
                </div>
                <button type="button" className="primary-button" onClick={() => { onAction(); onClose(); }}>
                  Open remediation path →
                </button>
              </div>
              <div className="action-path-row">
                <p className="small-label">Production path</p>
                <p className="action-path-title">{PRODUCTION_ACTION_LABEL[opportunity.category]}</p>
                <p className="notice">
                  Governance: {GOVERNED_STATUS_LABEL[opportunity.governanceStatus]}
                </p>
                <p className="notice">
                  Source: {SOURCE_SYSTEM_PRODUCTION_LABEL[opportunity.sourceSystem] ?? SOURCE_SYSTEM_LABEL[opportunity.sourceSystem]}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
