"use client";

import { useEffect, useState } from "react";
import {
  ARTIFACT_STATUS_LABEL,
  ARTIFACT_STATUS_TONE,
  GATE_ITEM_ICON,
  GATE_ITEM_LABEL,
  GATE_ITEM_TONE,
  LIFECYCLE_STEPS,
  PIPELINE_GOVERNANCE_LABEL,
  PIPELINE_GOVERNANCE_TONE,
  RISK_LEVEL_LABEL,
  RISK_LEVEL_TONE,
  STAGE_LABEL,
  STAGE_TONE,
  type GateChecklistItem,
  type GateChecklistStatus,
  type PipelineIdea,
} from "@/lib/intelligence/use-case-pipeline";

const STEP_TONE: Record<number, string> = {
  1: "badge-neutral", 2: "badge-neutral",
  3: "badge-warn",    4: "badge-warn",
  5: "badge-good",   6: "badge-best",
};

const CANCEL_REASONS = [
  "Duplicates existing vendor capability",
  "Not enough business value",
  "Data risk too high",
  "No clear owner",
  "Not a fit for CrewGuide",
];

const STEP_CHECKLIST_LABELS: Record<number, string[]> = {
  1: [
    "Business owner assigned",
    "Problem statement submitted",
    "Audience identified",
    "Duplicate idea check complete",
  ],
  2: [
    "Workflow map drafted",
    "Current vendor contract reviewed",
    "Data sensitivity reviewed",
    "Buy-vs-build criteria written",
    "Decision memo prepared",
  ],
  3: [
    "Prototype scope approved",
    "Test data approved",
    "OSS/dependency review started",
    "No production data used",
    "Demo acceptance criteria drafted",
  ],
  4: [
    "Security review complete",
    "Eval cases defined",
    "Human review path documented",
    "Source-system permissions reviewed",
    "Support owner confirmed",
  ],
  5: [
    "Pilot audience selected",
    "Success metrics defined",
    "Logging/audit path verified",
    "Rollback plan documented",
    "Reviewer sign-off complete",
  ],
  6: [
    "Production owner assigned",
    "Monitoring in place",
    "Support path documented",
    "Governance record archived",
  ],
};

function getChecklistForStep(step: number, idea: PipelineIdea): GateChecklistItem[] {
  if (step === idea.lifecycleStep) return idea.gateChecklist;
  const labels = STEP_CHECKLIST_LABELS[step] ?? [];
  const status: GateChecklistStatus = step < idea.lifecycleStep ? "complete" : "required";
  return labels.map((label) => ({ label, status }));
}

type DemoPerson = {
  id: string;
  name: string;
  role: string;
  initials: string;
};

const DEMO_PEOPLE: DemoPerson[] = [
  { id: "morgan-lee",     name: "Morgan Lee",     role: "Business Ops Lead",        initials: "ML" },
  { id: "alex-chen",     name: "Alex Chen",      role: "CX Lead",                  initials: "AC" },
  { id: "sam-torres",    name: "Sam Torres",     role: "Store Enablement Manager", initials: "ST" },
  { id: "dana-kim",      name: "Dana Kim",       role: "Retail Ops Director",      initials: "DK" },
  { id: "jordan-reyes",  name: "Jordan Reyes",   role: "Product Manager",          initials: "JR" },
  { id: "priya-shah",    name: "Priya Shah",     role: "Data & Analytics Lead",    initials: "PS" },
  { id: "marcus-reed",   name: "Marcus Reed",    role: "Engineering Lead",         initials: "MR" },
  { id: "taylor-brooks", name: "Taylor Brooks",  role: "Store Manager",            initials: "TB" },
];

type UseCaseReviewWorkspaceProps = {
  idea: PipelineIdea;
  onBack: () => void;
};

export function UseCaseReviewWorkspace({ idea, onBack }: UseCaseReviewWorkspaceProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [demoStep, setDemoStep] = useState(idea.lifecycleStep);
  const [advanceToast, setAdvanceToast] = useState<string | null>(null);
  const [addingAssignee, setAddingAssignee] = useState(false);
  const [assignees, setAssignees] = useState<DemoPerson[]>(() => {
    const match = DEMO_PEOPLE.find((p) => p.name === idea.pointPerson.name);
    return match ? [match] : [{ id: "primary", ...idea.pointPerson }];
  });

  useEffect(() => {
    if (!advanceToast) return;
    const timer = setTimeout(() => setAdvanceToast(null), 4000);
    return () => clearTimeout(timer);
  }, [advanceToast]);

  const stepsCleared = demoStep - 1;
  const atMaxStep = demoStep >= LIFECYCLE_STEPS.length;
  const stepLabel = LIFECYCLE_STEPS[demoStep - 1].label;
  const checklistItems = getChecklistForStep(demoStep, idea);
  const availablePeople = DEMO_PEOPLE.filter((p) => !assignees.some((a) => a.id === p.id));

  function handleAdvance() {
    if (isCancelled || atMaxStep) return;
    const nextStep = demoStep + 1;
    setDemoStep(nextStep);
    setAdvanceToast(`Advanced to ${LIFECYCLE_STEPS[nextStep - 1].label}. Demo state only.`);
  }

  return (
    <div className="stack">
      {isCancelled && (
        <div className="cancelled-banner" role="status">
          <span className="badge badge-bad">Cancelled</span>
          <span>
            {cancelReason}. Cancelled ideas stay in the pipeline record for audit history.
          </span>
        </div>
      )}

      <header className="review-header panel">
        <div className="review-header-meta">
          <button type="button" className="secondary-button" onClick={onBack}>
            ← Back to pipeline
          </button>
          <span className={`badge ${STEP_TONE[demoStep]}`}>{stepLabel}</span>
          <span className={`badge ${RISK_LEVEL_TONE[idea.risk]}`}>
            {RISK_LEVEL_LABEL[idea.risk]} risk
          </span>
          {assignees.map((person) => (
            <span key={person.id} className="owner-chip">
              <span className="owner-chip-avatar" aria-hidden="true">
                {person.initials}
              </span>
              {person.name}
            </span>
          ))}
        </div>
        <h2 style={{ margin: "8px 0 4px" }}>{idea.useCase}</h2>
        <p className="notice" style={{ margin: 0 }}>Next gate: {idea.nextGate}</p>
        <div className="review-header-actions">
          <div className="advance-btn-wrapper">
            <button
              type="button"
              className="primary-button"
              disabled={isCancelled || atMaxStep}
              onClick={handleAdvance}
            >
              {atMaxStep ? "Graduated" : "Advance to next gate"}
            </button>
            <p className="notice" style={{ fontSize: "0.78rem", margin: 0 }}>
              Demo only. Production would require checklist completion and reviewer approval.
            </p>
          </div>
          {isCancelled ? (
            <span className="badge badge-bad" style={{ alignSelf: "center" }}>
              Cancelled
            </span>
          ) : (
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowCancelConfirm((v) => !v)}
            >
              Cancel use case
            </button>
          )}
        </div>
      </header>

      {showCancelConfirm && !isCancelled && (
        <div className="cancel-confirm-panel">
          <p className="small-label" style={{ marginBottom: "10px" }}>
            Select a reason to confirm cancellation
          </p>
          <div className="cancel-reason-list">
            {CANCEL_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                className={`cancel-reason-option${cancelReason === reason ? " selected" : ""}`}
                onClick={() => setCancelReason(reason)}
              >
                {cancelReason === reason && <span aria-hidden="true">✓ </span>}
                {reason}
              </button>
            ))}
          </div>
          <div className="review-header-actions" style={{ marginTop: "12px" }}>
            <button
              type="button"
              className="primary-button"
              disabled={cancelReason === ""}
              onClick={() => {
                setIsCancelled(true);
                setShowCancelConfirm(false);
              }}
            >
              Confirm cancellation
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setShowCancelConfirm(false);
                setCancelReason("");
              }}
            >
              Never mind
            </button>
          </div>
        </div>
      )}

      <div className="review-layout">
        <div className="stack">
          <section className="panel stack" aria-label="Lifecycle progress">
            <div>
              <h3>Progress</h3>
              <p className="notice">
                Step {demoStep} of {LIFECYCLE_STEPS.length} ·{" "}
                {stepsCleared} gate{stepsCleared === 1 ? "" : "s"} cleared
              </p>
            </div>
            <div className="lifecycle review-lifecycle">
              {LIFECYCLE_STEPS.map((step, index) => {
                const stepNumber = index + 1;
                const state =
                  stepNumber < demoStep
                    ? "done"
                    : stepNumber === demoStep
                      ? "active"
                      : "idle";
                return (
                  <button
                    key={step.id}
                    type="button"
                    className="lifecycle-step"
                    data-state={state}
                    disabled={isCancelled}
                    aria-label={`Go to step ${stepNumber}: ${step.label}`}
                    aria-current={stepNumber === demoStep ? "step" : undefined}
                    onClick={() => {
                      if (isCancelled) return;
                      setDemoStep(stepNumber);
                      setAdvanceToast(null);
                    }}
                  >
                    <span className="lifecycle-index">{stepNumber}</span>
                    <p className="lifecycle-label">{step.label}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="panel stack gate-checklist-panel" aria-label="Current gate checklist">
            <div>
              <h3>Gate {demoStep}: {stepLabel}</h3>
              <p className="small-label">
                {demoStep === idea.lifecycleStep
                  ? `Next gate: ${idea.nextGate}`
                  : "Demo state: checklist reflects step template"}
              </p>
            </div>
            <ul className="gate-checklist">
              {checklistItems.map((item) => (
                <li key={item.label} className="gate-item">
                  <span
                    className="gate-item-icon"
                    data-status={item.status}
                    aria-hidden="true"
                  >
                    {GATE_ITEM_ICON[item.status]}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span className={`badge ${GATE_ITEM_TONE[item.status]}`}>
                    {GATE_ITEM_LABEL[item.status]}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel stack" aria-label="Artifacts and documentation">
            <h3>Artifacts &amp; Documentation</h3>
            <div className="artifact-table">
              <div className="artifact-head" aria-hidden="true">
                <span>Document</span>
                <span>Type</span>
                <span>Status</span>
                <span>Owner</span>
                <span>Updated</span>
                <span>Action</span>
              </div>
              {idea.artifacts.map((artifact) => (
                <div key={artifact.name} className="artifact-row">
                  <span className="artifact-cell-name">{artifact.name}</span>
                  <span className="artifact-cell-secondary">{artifact.type}</span>
                  <span>
                    <span className={`badge ${ARTIFACT_STATUS_TONE[artifact.status]}`}>
                      {ARTIFACT_STATUS_LABEL[artifact.status]}
                    </span>
                  </span>
                  <span className="artifact-cell-secondary">{artifact.owner}</span>
                  <span className="artifact-cell-secondary">{artifact.lastUpdated}</span>
                  <span>
                    {artifact.status === "not_started" || artifact.status === "required" ? (
                      <button type="button" className="queue-cta" disabled>
                        {artifact.status === "required" ? "Required" : "Not started"}
                      </button>
                    ) : (
                      <button type="button" className="queue-cta queue-cta-primary" disabled>
                        View
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel stack" aria-label="Review details">
            <h3>Review Details</h3>

            <div className="review-detail-group">
              <p className="small-label review-detail-group-label">Overview</p>
              <div className="stack" style={{ gap: "10px" }}>
                <div>
                  <p className="small-label">Problem statement</p>
                  <p className="notice">{idea.problemStatement}</p>
                </div>
                <div>
                  <p className="small-label">Intended users</p>
                  <p className="notice">{idea.intendedUsers}</p>
                </div>
              </div>
            </div>

            <div className="review-detail-group">
              <p className="small-label review-detail-group-label">Data &amp; Permissions</p>
              <div className="stack" style={{ gap: "10px" }}>
                <div>
                  <p className="small-label">Source systems</p>
                  <div className="tag-row">
                    {idea.sourceSystems.map((s) => (
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="small-label">Data sensitivity</p>
                  <p className="notice">{idea.dataSensitivity}</p>
                </div>
                <div>
                  <p className="small-label">Action permissions</p>
                  <p className="notice">{idea.actionPermissions}</p>
                </div>
              </div>
            </div>

            <div className="review-detail-group">
              <p className="small-label review-detail-group-label">Technical</p>
              <div className="stack" style={{ gap: "10px" }}>
                <div>
                  <p className="small-label">Dependency / OSS review</p>
                  <p className="notice">{idea.dependencyReview}</p>
                </div>
                <div>
                  <p className="small-label">Eval requirements</p>
                  <p className="notice">{idea.evalRequirements}</p>
                </div>
              </div>
            </div>

            <div className="review-detail-group">
              <p className="small-label review-detail-group-label">Path to Production</p>
              <div className="stack" style={{ gap: "10px" }}>
                <div>
                  <p className="small-label">Acceptance criteria</p>
                  <ul className="detail-list">
                    {idea.acceptanceCriteria.map((criterion) => (
                      <li key={criterion}>{criterion}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="small-label">Production path</p>
                  <p className="notice">{idea.productionPath}</p>
                </div>
                <div>
                  <p className="small-label">Governance notes</p>
                  <p className="notice">{idea.governanceNotes}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="review-rail">
          <div className="panel stack">
            <div className="rail-section">
              <p className="small-label">Assignees</p>
              <div className="assignee-chip-list">
                {assignees.length === 0 ? (
                  <p className="assignee-empty">No assignee selected</p>
                ) : (
                  assignees.map((person) => (
                    <div key={person.id} className="assignee-chip-row">
                      <span className="owner-chip">
                        <span className="owner-chip-avatar" aria-hidden="true">
                          {person.initials}
                        </span>
                        {person.name}
                      </span>
                      <button
                        type="button"
                        className="assignee-remove"
                        aria-label={`Remove ${person.name}`}
                        onClick={() =>
                          setAssignees((prev) => prev.filter((a) => a.id !== person.id))
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
              {availablePeople.length > 0 && (
                <div className="assignee-add-wrapper">
                  {addingAssignee ? (
                    <div className="assignee-dropdown">
                      {availablePeople.map((person) => (
                        <button
                          key={person.id}
                          type="button"
                          className="assignee-option"
                          onClick={() => {
                            setAssignees((prev) => [...prev, person]);
                            setAddingAssignee(false);
                          }}
                        >
                          <span className="owner-chip-avatar" aria-hidden="true">
                            {person.initials}
                          </span>
                          <span>
                            {person.name}
                            <span className="notice" style={{ display: "block", fontSize: "0.76rem" }}>
                              {person.role}
                            </span>
                          </span>
                        </button>
                      ))}
                      <button
                        type="button"
                        className="assignee-cancel"
                        onClick={() => setAddingAssignee(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="assignee-add-btn"
                      onClick={() => setAddingAssignee(true)}
                    >
                      + Add person
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="rail-section">
              <p className="small-label">Stage</p>
              <span
                className={`badge ${STAGE_TONE[idea.stage]}`}
                style={{ marginTop: "4px", display: "inline-flex" }}
              >
                {STAGE_LABEL[idea.stage]}
              </span>
            </div>
            <div className="rail-section">
              <p className="small-label">Risk</p>
              <span
                className={`badge ${RISK_LEVEL_TONE[idea.risk]}`}
                style={{ marginTop: "4px", display: "inline-flex" }}
              >
                {RISK_LEVEL_LABEL[idea.risk]}
              </span>
            </div>
            <div className="rail-section">
              <p className="small-label">Next gate</p>
              <p className="notice" style={{ marginTop: "4px" }}>{idea.nextGate}</p>
            </div>
            <div className="rail-section">
              <p className="small-label">Data sensitivity</p>
              <p className="notice" style={{ marginTop: "4px", fontSize: "0.82rem" }}>
                {idea.dataSensitivity}
              </p>
            </div>
            <div className="rail-section">
              <p className="small-label">Action permissions</p>
              <p className="notice" style={{ marginTop: "4px", fontSize: "0.82rem" }}>
                {idea.actionPermissions}
              </p>
            </div>
            <div className="rail-section">
              <p className="small-label">Production path</p>
              <p className="notice" style={{ marginTop: "4px", fontSize: "0.82rem" }}>
                {idea.productionPath}
              </p>
            </div>
            <div className="rail-section">
              <p className="small-label">Last reviewed</p>
              <p className="notice" style={{ marginTop: "4px" }}>{idea.lastReviewed}</p>
            </div>
            <div className="rail-section">
              <p className="small-label">Governance</p>
              <span
                className={`badge ${PIPELINE_GOVERNANCE_TONE[idea.governanceStatus]}`}
                style={{ marginTop: "4px", display: "inline-flex" }}
              >
                {PIPELINE_GOVERNANCE_LABEL[idea.governanceStatus]}
              </span>
            </div>
          </div>
        </aside>
      </div>

      {advanceToast && (
        <div className="advance-toast" role="status" aria-live="polite">
          <span>{advanceToast}</span>
          <button
            type="button"
            className="advance-toast-dismiss"
            aria-label="Dismiss"
            onClick={() => setAdvanceToast(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
