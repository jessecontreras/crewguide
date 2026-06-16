import { NextResponse } from "next/server";
import type { FrictionEvent } from "@/lib/catalog/product-types";
import { getFrictionEvents } from "@/lib/telemetry/friction-log";

/**
 * Feedback and telemetry read endpoint.
 *
 * Returns the full friction event log plus a server-side theme roll-up.
 * The response feeds the AI Operations and Catalog Readiness views.
 * Events are read from `data/friction-events.json`; when the file is
 * absent or empty, the three seeded demo events are returned instead.
 *
 * No request body required. Returns `FeedbackPayload`
 * (`{ events, themes }`).
 */
export async function GET() {
  const events = await getFrictionEvents();
  return NextResponse.json({
    events,
    themes: buildThemes(events)
  });
}

function buildThemes(events: FrictionEvent[]) {
  const reasonCounts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.reason] = (acc[event.reason] ?? 0) + 1;
    return acc;
  }, {});

  return {
    reasonCounts,
    topUnansweredQuestions: events.slice(0, 5).map((event) => event.query),
    missingAttributes: [
      "weight",
      "outsole",
      "insulation",
      "ASTM/safety standard",
      "jobsite use case"
    ],
    suggestedImprovements: [
      "Add structured weight and comfort metadata.",
      "Normalize outsole and heel style across boot records.",
      "Add safety standard fields that reps can cite.",
      "Attach jobsite use cases like ladder work, mud, electrical, warehouse, and farm."
    ],
    businessSignals: buildBusinessSignals(events)
  };
}

type BusinessSignal = {
  category:
    | "Repeated customer need"
    | "Missing catalog metadata"
    | "Training opportunity"
    | "Potential merchandising signal";
  detail: string;
};

const SIGNAL_CATEGORY_BY_REASON: Record<FrictionEvent["reason"], BusinessSignal["category"]> = {
  missing_attribute: "Missing catalog metadata",
  conflicting_product_data: "Missing catalog metadata",
  no_matching_product: "Potential merchandising signal",
  ambiguous_request: "Training opportunity",
  low_confidence: "Training opportunity"
};

function buildBusinessSignals(events: FrictionEvent[]): BusinessSignal[] {
  if (events.length === 0) {
    return [];
  }

  const signals: BusinessSignal[] = [];

  const needCounts = new Map<string, number>();
  for (const event of events) {
    needCounts.set(event.extractedNeed, (needCounts.get(event.extractedNeed) ?? 0) + 1);
  }
  for (const [need, count] of needCounts) {
    if (count > 1) {
      signals.push({
        category: "Repeated customer need",
        detail: `"${need}" has come up ${count} times in logged questions. Consider a saved answer or a merchandising callout.`
      });
    }
  }

  const seen = new Set<string>();
  for (const event of events) {
    const key = `${event.reason}:${event.extractedNeed}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    signals.push({
      category: SIGNAL_CATEGORY_BY_REASON[event.reason],
      detail: `"${event.query}" -> ${event.extractedNeed}`
    });
  }

  return signals.slice(0, 6);
}
