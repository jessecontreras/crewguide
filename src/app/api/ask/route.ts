import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai/provider";
import { buildEvidenceCitations } from "@/lib/retrieval/citations";
import { recommendProducts } from "@/lib/retrieval/hybrid-search";
import { logFrictionEvent } from "@/lib/telemetry/friction-log";

/**
 * Rep Assistant recommendation endpoint.
 *
 * Accepts `{ query: string }` in the request body. Runs the full retrieval
 * pipeline (normalization → scoring → confidence → fallback decision),
 * synthesizes a `CrewGuideAnswer` via the active AI provider, and logs a
 * friction event if the result is a fallback.
 *
 * When `result.fallback` is true, `result.clarifyingQuestion` is populated
 * and the UI should surface the question rather than showing product cards.
 *
 * @returns 400 if `query` is missing or blank; 200 with `AskResponse`
 *   (`{ result, answer, citations, frictionEvent? }`) otherwise.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as { query?: string };
  const query = body.query?.trim();

  if (!query) {
    return NextResponse.json({ error: "Query is required." }, { status: 400 });
  }

  const result = recommendProducts(query);
  const answer = await getAiProvider().synthesize(result);
  const frictionEvent = await logFrictionEvent(result);

  return NextResponse.json({
    result,
    answer,
    citations: buildEvidenceCitations(result.topProducts),
    frictionEvent
  });
}
