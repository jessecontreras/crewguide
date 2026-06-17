import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FrictionEvent, RecommendationResult } from "@/lib/catalog/product-types";

const dataDir = path.join(process.cwd(), "data");
const logPath = path.join(dataDir, "friction-events.json");

const seedEvents: FrictionEvent[] = [
  {
    id: "seed-weight-metadata",
    query: "What product should I recommend for someone who wants durable but not heavy?",
    reason: "missing_attribute",
    extractedNeed: "lightweight durable waterproof boot",
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString()
  },
  {
    id: "seed-ladder-work",
    query: "Compare wedge and 90 degree heel for ladder work.",
    reason: "missing_attribute",
    extractedNeed: "structured ladder guidance and outsole metadata",
    createdAt: new Date(Date.now() - 1000 * 60 * 74).toISOString()
  },
  {
    id: "seed-pull-on-budget",
    query: "Customer wants 10 inch pull-on waterproof soft toe under $160.",
    reason: "conflicting_product_data",
    extractedNeed: "10 inch pull-on waterproof soft toe under 160",
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString()
  }
];

/**
 * Returns all friction events from the local file log, falling back to
 * seeded events when the file does not exist or contains no entries.
 *
 * Reads from `data/friction-events.json` at the project root. If the file
 * is absent (e.g. first run, fresh clone) or the parsed array is empty,
 * the three seeded demo events are returned so the UI always has data to
 * display. Called on every `/api/feedback` GET request and internally by
 * `appendEvent` before writing.
 *
 * @returns Live `FrictionEvent[]` if any have been logged, otherwise the
 *   three seeded demo events.
 */
export async function getFrictionEvents() {
  try {
    const file = await readFile(logPath, "utf8");
    const events = JSON.parse(file) as FrictionEvent[];
    return events.length > 0 ? events : seedEvents;
  } catch {
    return seedEvents;
  }
}

/**
 * Appends a friction event to the log when a retrieval result triggered a
 * fallback.
 *
 * No-ops silently — returning `undefined` — when `result.fallback` is
 * false or `result.frictionReason` is absent. Only genuine fallback
 * outcomes are recorded. Called automatically by the `/api/ask` POST
 * handler after every retrieval; the caller does not need to check the
 * fallback state first.
 *
 * @param result - Full `RecommendationResult` from `recommendProducts`.
 * @returns The written `FrictionEvent`, or `undefined` if no event was
 *   logged.
 */
export async function logFrictionEvent(result: RecommendationResult) {
  if (!result.fallback || !result.frictionReason) {
    return undefined;
  }

  return appendEvent({
    id: `event-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    query: result.query,
    reason: result.frictionReason,
    extractedNeed: summarizeNeed(result),
    createdAt: new Date().toISOString()
  });
}

/**
 * Appends a friction event created from explicit rep feedback.
 *
 * Called by the `/api/rep-feedback` POST handler after the rep submits a
 * thumbs-down or flags a product. The resulting event is indistinguishable
 * from an auto-logged fallback event in the telemetry stream — both feed
 * the same `getFrictionEvents` log consumed by AI Operations.
 *
 * @param input - `query` (the original rep query), `reason` (translated
 *   from the rep's feedback type), and `extractedNeed` (a human-readable
 *   summary of what the rep flagged).
 * @returns The written `FrictionEvent`.
 */
export async function logRepFeedbackEvent(input: {
  query: string;
  reason: FrictionEvent["reason"];
  extractedNeed: string;
}) {
  return appendEvent({
    id: `feedback-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    query: input.query,
    reason: input.reason,
    extractedNeed: input.extractedNeed,
    createdAt: new Date().toISOString()
  });
}

async function appendEvent(event: FrictionEvent) {
  const events = await getFrictionEvents();
  await mkdir(dataDir, { recursive: true });
  await writeFile(logPath, JSON.stringify([event, ...events].slice(0, 100), null, 2));
  return event;
}

function summarizeNeed(result: RecommendationResult) {
  const parts = [
    result.constraints.waterproof ? "waterproof" : undefined,
    result.constraints.safetyToe ? `${result.constraints.safetyToe} toe` : undefined,
    result.constraints.height,
    result.constraints.sole?.replace("_", " "),
    result.constraints.pullOn ? "pull-on" : undefined,
    result.constraints.maxPrice ? `under $${result.constraints.maxPrice}` : undefined,
    ...result.constraints.useCases
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "ambiguous product-fit request";
}
