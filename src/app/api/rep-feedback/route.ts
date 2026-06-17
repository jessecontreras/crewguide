import { NextResponse } from "next/server";
import type { FrictionEvent } from "@/lib/catalog/product-types";
import { logRepFeedbackEvent } from "@/lib/telemetry/friction-log";

const REASON_BY_FEEDBACK: Record<string, FrictionEvent["reason"]> = {
  missing_product: "no_matching_product",
  missing_attribute: "missing_attribute",
  needs_clarification: "ambiguous_request"
};

/**
 * Rep feedback logging endpoint.
 *
 * Accepts `{ query, productName?, feedback }` where `feedback` must be one
 * of `"missing_product"`, `"missing_attribute"`, or `"needs_clarification"`.
 * Translates the rep-facing feedback type to an internal `FrictionEvent`
 * reason via `REASON_BY_FEEDBACK` and appends the event to the friction log.
 * The resulting event is identical in structure to an auto-logged fallback
 * event and feeds the same AI Operations telemetry stream.
 *
 * @returns 400 for unrecognized feedback types or a blank query; 200 with
 *   `{ event: FrictionEvent }` on success.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    query?: string;
    productName?: string;
    feedback?: string;
  };

  const reason = body.feedback ? REASON_BY_FEEDBACK[body.feedback] : undefined;

  if (!body.query?.trim() || !reason) {
    return NextResponse.json({ error: "Unsupported feedback type." }, { status: 400 });
  }

  const extractedNeed = body.productName
    ? `Rep flagged "${body.feedback}" for ${body.productName}`
    : `Rep flagged "${body.feedback}"`;

  const event = await logRepFeedbackEvent({
    query: body.query.trim(),
    reason,
    extractedNeed
  });

  return NextResponse.json({ event });
}
