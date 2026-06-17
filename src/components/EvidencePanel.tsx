import * as Tooltip from "@radix-ui/react-tooltip";
import { confidenceLabel, confidencePercent } from "@/lib/retrieval/confidence";
import { formatBootHeight, formatLabel } from "@/lib/formatting";
import type { AskResponse } from "./types";

type EvidencePanelProps = {
  response: AskResponse;
};

const CONSTRAINT_LABELS: Record<string, string> = {
  waterproof: "Waterproof",
  safetyToe: "Safety toe",
  height: "Boot height",
  sole: "Sole",
  pullOn: "Pull-on",
  welted: "Welted construction",
  maxPrice: "Budget",
  useCases: "Use cases",
  comparisonNames: "Comparing",
  mentionsWeight: "Weight mentioned",
  asksForSafety: "Safety toe requested"
};

function formatConstraintValue(key: string, value: unknown): string {
  if (key === "maxPrice") {
    return `under $${value}`;
  }

  if (key === "height" && typeof value === "string") {
    return formatBootHeight(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "yes" : "no";
  }

  if (typeof value === "string") {
    return formatLabel(value);
  }

  return String(value);
}

export function EvidencePanel({ response }: EvidencePanelProps) {
  const percent = confidencePercent(response.result);

  return (
    <aside className="panel evidence-panel">
      <div>
        <p className="eyebrow">Evidence Panel</p>
        <h2>
          {confidenceLabel(response.result)} confidence
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span className="info-dot" aria-label="How confidence is calculated">
                ?
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="tooltip-content" sideOffset={6}>
                Confidence blends attribute match (55%), keyword overlap (25%), and use-case
                relevance (20%), then adjusts for how far ahead the top result is from the runner
                up.
                <Tooltip.Arrow className="tooltip-arrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </h2>
      </div>
      <div className="confidence">
        <div className="confidence-track" aria-label={`Confidence ${percent}%`}>
          <div className="confidence-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="notice">{percent}% retrieval confidence</p>
      </div>

      {response.result.fallback ? (
        <div className="fallback">
          <p className="small-label">Fallback triggered</p>
          <p className="summary">{response.result.fallbackReason}</p>
          <p className="notice">
            This is intentional. The assistant did not find enough approved product evidence to
            answer safely, so it asks a clarifying question instead of guessing.
          </p>
        </div>
      ) : null}

      <div>
        <p className="small-label">Extracted needs</p>
        <div className="tag-row">
          {Object.entries(response.result.constraints)
            .filter(([, value]) => {
              if (Array.isArray(value)) {
                return value.length > 0;
              }

              return value !== undefined && value !== false;
            })
            .map(([key, value]) => (
              <span className="tag" key={key}>
                {CONSTRAINT_LABELS[key] ?? key}: {formatConstraintValue(key, value)}
              </span>
            ))}
        </div>
      </div>

      <div>
        <p className="small-label">Product records used</p>
        {response.citations.map((citation) => (
          <div className="evidence-item" key={citation.productId}>
            <strong>{citation.productName}</strong>
            <p className="notice">{citation.evidenceText}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
