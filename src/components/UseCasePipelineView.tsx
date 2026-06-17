"use client";

import { useState } from "react";
import {
  ACTION_MODE_LABEL,
  APPROVED_WORKFLOWS,
  PIPELINE_IDEAS,
  RISK_LEVEL_LABEL,
  RISK_LEVEL_TONE,
  STAGE_LABEL,
  STAGE_TONE,
  WORKFLOW_STATUS_LABEL,
  WORKFLOW_STATUS_TONE,
  type PipelineIdea,
} from "@/lib/intelligence/use-case-pipeline";
import { UseCaseReviewWorkspace } from "./UseCaseReviewWorkspace";

const CHECKLIST_ITEMS = [
  "Clear business owner",
  "Source systems identified",
  "Data sensitivity reviewed",
  "Read-only or write-action scope defined",
  "Acceptance criteria written",
  "Eval set or test cases defined",
  "OSS / dependency review complete",
  "Logging / audit path defined",
  "Human review required for risky actions",
  "GCP production path identified",
];

export function UseCasePipelineView() {
  const [selectedIdea, setSelectedIdea] = useState<PipelineIdea | null>(null);

  if (selectedIdea) {
    return (
      <UseCaseReviewWorkspace
        idea={selectedIdea}
        onBack={() => setSelectedIdea(null)}
      />
    );
  }

  return (
    <div className="stack">
      <div className="page-header">
        <p className="page-eyebrow">Business Ops</p>
        <h1 className="page-title">Use Case Pipeline</h1>
        <p className="page-description">
          Review, test, and graduate internal AI ideas into governed CrewGuide
          workflows.
        </p>
      </div>

      <section
        className="panel stack"
        aria-label="Approved CrewGuide workflows"
      >
        <div>
          <h3>Approved CrewGuide Workflows</h3>
          <p className="notice">
            These are the baseline workflows that have cleared review,
            source-system mapping, and governance sign-off.
          </p>
        </div>
        <div
          className="pipeline-workflow-table"
          role="table"
          aria-label="Approved workflows"
        >
          <div className="pipeline-workflow-head" role="row" aria-hidden="true">
            <span>Workflow</span>
            <span>Audience</span>
            <span>Mode</span>
            <span>Risk</span>
            <span>Status</span>
          </div>
          {APPROVED_WORKFLOWS.map((workflow) => (
            <div key={workflow.id} className="pipeline-workflow-row" role="row">
              <div>
                <p className="pipeline-cell-name">{workflow.name}</p>
                <p className="notice pipeline-cell-purpose">
                  {workflow.purpose}
                </p>
                <div className="tag-row">
                  {workflow.sourceSystems.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <span className="pipeline-cell-text">{workflow.audience}</span>
              <span className="pipeline-cell-text">
                {ACTION_MODE_LABEL[workflow.actionMode]}
              </span>
              <span>
                <span
                  className={`badge ${RISK_LEVEL_TONE[workflow.riskLevel]}`}
                >
                  {RISK_LEVEL_LABEL[workflow.riskLevel]}
                </span>
              </span>
              <span>
                <span
                  className={`badge ${WORKFLOW_STATUS_TONE[workflow.status]}`}
                >
                  {WORKFLOW_STATUS_LABEL[workflow.status]}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel stack" aria-label="AI idea pipeline">
        <div>
          <h3>AI Idea Pipeline</h3>
          <p className="notice">
            Ideas at various stages of review. Click View to see the full
            detail, including acceptance criteria, eval requirements, and
            governance notes.
          </p>
        </div>
        <div
          className="pipeline-idea-table"
          role="table"
          aria-label="AI idea pipeline"
        >
          <div className="pipeline-idea-head" role="row" aria-hidden="true">
            <span>Use case</span>
            <span>Owner</span>
            <span>Stage</span>
            <span>Risk</span>
            <span>Source systems</span>
            <span>Next gate</span>
            <span aria-hidden="true" />
          </div>
          {PIPELINE_IDEAS.map((idea) => (
            <div key={idea.id} className="pipeline-idea-row" role="row">
              <span className="pipeline-cell-name">{idea.useCase}</span>
              <div>
                <p className="pipeline-cell-name" style={{ margin: 0 }}>
                  {idea.pointPerson.name}
                </p>
                <p className="pipeline-cell-secondary">
                  {idea.pointPerson.role}
                </p>
              </div>
              <span>
                <span className={`badge ${STAGE_TONE[idea.stage]}`}>
                  {STAGE_LABEL[idea.stage]}
                </span>
              </span>
              <span>
                <span className={`badge ${RISK_LEVEL_TONE[idea.risk]}`}>
                  {RISK_LEVEL_LABEL[idea.risk]}
                </span>
              </span>
              <span className="pipeline-cell-sources">
                {idea.sourceSystems.join(", ")}
              </span>
              <span className="pipeline-cell-text pipeline-cell-gate">
                {idea.nextGate}
              </span>
              <span>
                <button
                  type="button"
                  className="queue-cta queue-cta-primary"
                  onClick={() => setSelectedIdea(idea)}
                >
                  View
                </button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="panel stack"
        aria-label="Sandbox-to-production standards"
      >
        <div>
          <h3>Sandbox-to-Production Standards</h3>
          <p className="notice">
            Claude Code prototypes can start anywhere. Workflows that live in
            CrewGuide must share the same review path, source-system mapping,
            eval expectations, and governance sign-off. No Frankenstein('s
            monster) stacks.
          </p>
        </div>
        <ul className="checklist">
          {CHECKLIST_ITEMS.map((item) => (
            <li key={item} className="checklist-item">
              <span className="checklist-icon" aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
