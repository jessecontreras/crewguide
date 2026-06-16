import { seedProducts } from "@/lib/catalog/seed-products";
import type {
  ExtractedConstraints,
  Product,
  ProductScore,
  RecommendationResult
} from "@/lib/catalog/product-types";
import { extractConstraints, tokenize } from "./normalize-query";
import { formatLabel } from "@/lib/formatting";

const ATTRIBUTE_FIELDS: Array<keyof ExtractedConstraints> = [
  "waterproof",
  "safetyToe",
  "height",
  "sole",
  "pullOn",
  "welted"
];

/**
 * The Rep Assistant's primary entry point for product retrieval.
 *
 * Orchestrates the full retrieval pipeline: normalizes the raw query into
 * structured constraints, scores and ranks every catalog product, computes
 * confidence, and decides whether to surface a recommendation or trigger a
 * clarifying-question fallback. All logic is deterministic and runs against
 * seeded catalog data — no external service is called.
 *
 * @param query - Raw customer query string from the rep.
 * @returns A `RecommendationResult` with the top-scored products, confidence,
 *   fallback flag, and — when `fallback` is true — a clarifying question and
 *   friction reason for telemetry.
 */
export function recommendProducts(query: string): RecommendationResult {
  const constraints = extractConstraints(query);
  const scores = scoreProducts(query, constraints);
  const topProducts = scores.slice(0, 3);
  const confidence = computeConfidence(topProducts);
  const fallback = shouldFallback(constraints, topProducts, confidence);
  const fallbackReason = getFallbackReason(constraints, topProducts, confidence);

  return {
    query,
    constraints,
    topProducts,
    confidence,
    fallback,
    fallbackReason,
    clarifyingQuestion: fallback ? buildClarifyingQuestion(constraints, fallbackReason) : undefined,
    frictionReason: fallback ? classifyFriction(fallbackReason) : undefined
  };
}

/**
 * Scores and ranks all catalog products against a normalized customer query.
 *
 * Blends three signals: attribute match (55%), keyword overlap (25%), and
 * seeded use-case relevance (20%). When the query names specific products for
 * comparison, matching products receive a +0.25 boost, capped at 1.0.
 *
 * Scoring is deterministic and runs entirely against seeded catalog data —
 * no model or external service is called.
 *
 * @param query - The raw customer query string, used for lexical tokenization.
 * @param constraints - Normalized constraint object from `extractConstraints`.
 * @returns All catalog products sorted by score descending. Slice to the
 *   desired count after calling; this returns every product.
 */
export function scoreProducts(query: string, constraints: ExtractedConstraints): ProductScore[] {
  const queryTokens = tokenize(query);
  const compared = constraints.comparisonNames.length > 0;

  return seedProducts
    .map((product) => {
      const attribute = scoreAttributes(product, constraints);
      const lexical = scoreLexical(product, queryTokens);
      const semantic = scoreUseCases(product, constraints);
      const comparisonBoost = compared && matchesComparisonName(product, constraints.comparisonNames) ? 0.25 : 0;
      const score = Math.min(1, attribute.score * 0.55 + lexical * 0.25 + semantic * 0.2 + comparisonBoost);

      return {
        product,
        score,
        attributeMatchScore: attribute.score,
        lexicalOverlapScore: lexical,
        semanticScore: semantic,
        matchedAttributes: attribute.matched,
        missingAttributes: attribute.missing,
        tradeoffs: attribute.tradeoffs
      };
    })
    .sort((a, b) => b.score - a.score);
}

function scoreAttributes(product: Product, constraints: ExtractedConstraints) {
  const matched: string[] = [];
  const missing: string[] = [];
  const tradeoffs: string[] = [];
  let requested = 0;
  let points = 0;

  ATTRIBUTE_FIELDS.forEach((field) => {
    const requestedValue = constraints[field];
    if (requestedValue === undefined) {
      return;
    }

    requested += 1;
    const productValue = product.attributes[field as keyof Product["attributes"]];
    if (productValue === requestedValue) {
      points += 1;
      matched.push(labelAttribute(field, String(requestedValue)));
    } else if (productValue === undefined || productValue === "unknown") {
      missing.push(labelAttribute(field, String(requestedValue)));
    } else {
      tradeoffs.push(`${product.name} is ${labelAttribute(field, String(productValue))}, not ${labelAttribute(field, String(requestedValue))}.`);
    }
  });

  if (constraints.maxPrice !== undefined) {
    requested += 1;
    if (product.price <= constraints.maxPrice) {
      points += 1;
      matched.push(`under $${constraints.maxPrice}`);
    } else {
      tradeoffs.push(`${product.name} is $${product.price}, above the $${constraints.maxPrice} target.`);
    }
  }

  if (constraints.mentionsWeight) {
    requested += 1;
    missing.push("weight metadata");
  }

  const useCaseMatches = constraints.useCases.filter((useCase) => product.attributes.useCases?.includes(useCase));
  if (constraints.useCases.length > 0) {
    requested += constraints.useCases.length;
    points += useCaseMatches.length;
    matched.push(...useCaseMatches);
  }

  const score = requested === 0 ? 0.35 : points / requested;
  return { score, matched, missing, tradeoffs };
}

function scoreLexical(product: Product, queryTokens: string[]) {
  if (queryTokens.length === 0) {
    return 0;
  }

  const productTokens = new Set(tokenize(`${product.name} ${product.description} ${product.evidenceText}`));
  const overlap = queryTokens.filter((token) => productTokens.has(token)).length;
  return Math.min(1, overlap / Math.max(4, queryTokens.length));
}

function scoreUseCases(product: Product, constraints: ExtractedConstraints) {
  if (constraints.useCases.length === 0) {
    return 0.35;
  }

  const cases = product.attributes.useCases ?? [];
  const matches = constraints.useCases.filter((useCase) => cases.includes(useCase)).length;
  return matches / constraints.useCases.length;
}

function matchesComparisonName(product: Product, names: string[]) {
  const productName = product.name.toLowerCase();
  return names.some((name) =>
    name
      .toLowerCase()
      .split(/\s+/)
      .filter((token) => token.length > 3)
      .every((token) => productName.includes(token))
  );
}

/**
 * Derives a confidence value for a ranked recommendation set.
 *
 * Starts from the best product's raw score and adds a separation bonus —
 * `(best − second) × 0.2` — rewarding a clear winner over a close race.
 * Clamped to [0.05, 0.98] so the UI never renders 0% or 100% confidence.
 *
 * @param topProducts - Ranked scored products (typically the top 3 from
 *   `scoreProducts`). The first element is treated as the best match; the
 *   second is used only to compute separation.
 * @returns A confidence value in [0.05, 0.98], or 0 if the array is empty.
 */
function computeConfidence(topProducts: ProductScore[]) {
  if (topProducts.length === 0) {
    return 0;
  }

  const best = topProducts[0];
  const second = topProducts[1]?.score ?? 0;
  const separation = Math.max(0, best.score - second) * 0.2;
  return Math.min(0.98, Math.max(0.05, best.score + separation));
}

/**
 * Decides whether the assistant should withhold a recommendation and ask a
 * clarifying question instead.
 *
 * Returns `true` under any of these conditions:
 * - Confidence is below 0.48 (weak retrieval signal overall)
 * - The best product has ≥ 2 hard-miss tradeoffs — strings containing "above"
 *   or "not" — indicating multiple requested constraints are unmet
 * - The query mentions weight but the catalog carries no weight metadata
 * - The best product is priced above the requested max-price constraint
 *
 * Pull-on is treated as a special case: when the best product has no pull-on
 * attribute at all, the miss lands in `missingAttributes` rather than
 * `tradeoffs`. The `pullOnMiss` counter ensures it still counts toward the
 * hard-miss threshold so the fallback fires correctly.
 *
 * @param constraints - Normalized constraints extracted from the query.
 * @param topProducts - Ranked scored products; only the first is evaluated.
 * @param confidence - Pre-computed value from `computeConfidence`.
 * @returns `true` if the assistant should fall back to a clarifying question.
 */
function shouldFallback(
  constraints: ExtractedConstraints,
  topProducts: ProductScore[],
  confidence: number
) {
  if (topProducts.length === 0 || confidence < 0.48) {
    return true;
  }

  const best = topProducts[0];
  const hardMisses = best.tradeoffs.filter((tradeoff) =>
    /above|not/.test(tradeoff.toLowerCase())
  );

  // pull-on is a structural constraint: when the best product lacks it entirely,
  // the miss lands in missingAttributes rather than tradeoffs — count it the same way
  const pullOnMiss =
    constraints.pullOn === true && best.missingAttributes.includes("pull-on") ? 1 : 0;

  if (hardMisses.length + pullOnMiss >= 2) {
    return true;
  }

  if (constraints.mentionsWeight && best.missingAttributes.includes("weight metadata")) {
    return true;
  }

  if (
    constraints.maxPrice !== undefined &&
    best.tradeoffs.some((tradeoff) => tradeoff.includes(`above the $${constraints.maxPrice}`))
  ) {
    return true;
  }

  return false;
}

function getFallbackReason(
  constraints: ExtractedConstraints,
  topProducts: ProductScore[],
  confidence: number
) {
  if (topProducts.length === 0) {
    return "No product record scored against the query.";
  }

  if (constraints.mentionsWeight) {
    return "The catalog demo does not include structured weight metadata.";
  }

  if (
    constraints.maxPrice !== undefined &&
    topProducts[0]?.tradeoffs.some((tradeoff) => tradeoff.includes(`above the $${constraints.maxPrice}`))
  ) {
    return "The closest product is above the requested budget.";
  }

  if (confidence < 0.48) {
    return "The retrieved evidence is too weak for a confident product recommendation.";
  }

  const best = topProducts[0];
  if (best.tradeoffs.length >= 2) {
    return "The closest product misses multiple requested constraints.";
  }

  return undefined;
}

function buildClarifyingQuestion(constraints: ExtractedConstraints, reason?: string) {
  if (constraints.mentionsWeight) {
    return "I do not have weight metadata in this demo catalog. Should I optimize for waterproof protection, safety toe, sole style, or budget first?";
  }

  if (constraints.maxPrice) {
    return `I do not have a strong match under $${constraints.maxPrice}. Can the customer flex on budget, height, or toe type?`;
  }

  if (reason?.includes("weak")) {
    return "Can you confirm the must-have attributes: waterproof, toe type, boot height, sole style, and budget?";
  }

  return "Can you confirm which requirement is most important so I do not overstate the catalog evidence?";
}

function classifyFriction(reason?: string): RecommendationResult["frictionReason"] {
  if (!reason) {
    return "low_confidence";
  }

  if (reason.includes("weight") || reason.includes("metadata")) {
    return "missing_attribute";
  }

  if (reason.includes("No product")) {
    return "no_matching_product";
  }

  if (reason.includes("multiple requested constraints")) {
    return "conflicting_product_data";
  }

  return "low_confidence";
}

function labelAttribute(field: keyof ExtractedConstraints, value: string) {
  const normalizedValue = formatLabel(value.replace("true", "yes").replace("false", "no"));

  if (field === "safetyToe") {
    return `${normalizedValue} toe`;
  }

  if (field === "height") {
    return normalizedValue;
  }

  if (field === "maxPrice") {
    return `under $${normalizedValue}`;
  }

  if (field === "pullOn") {
    return "pull-on";
  }

  return `${String(field)}: ${normalizedValue}`;
}
