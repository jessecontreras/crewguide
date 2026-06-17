import type { ExtractedConstraints, Height, SafetyToe, Sole } from "@/lib/catalog/product-types";

const useCaseMap: Array<[string, string]> = [
  ["electric", "electrician"],
  ["ladder", "ladder work"],
  ["mud", "mud"],
  ["outdoor", "outdoor work"],
  ["outside", "outdoor work"],
  ["warehouse", "warehouse"],
  ["construction", "construction"],
  ["durable", "durability"],
  ["durability", "durability"],
  ["farm", "farm"],
  ["standing", "standing all day"]
];

function normalizeQuery(query: string) {
  return query
    .toLowerCase()
    .replace(/90[ -]?degree/g, "90 degree")
    .replace(/90°/g, "90 degree")
    .replace(/"/g, " inch")
    .replace(/[^a-z0-9$.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Splits text into lowercase tokens for lexical overlap scoring.
 *
 * Applies `normalizeQuery` first, then discards tokens shorter than 3
 * characters and a fixed stopword list ("the", "and", "for", "with", "what",
 * "should", "customer"). Used for both query tokenization and product text
 * tokenization inside `scoreLexical` — the same function runs on both sides
 * of the comparison.
 *
 * @param text - Any string: a customer query, product name, description, or
 *   evidence text.
 * @returns Lowercase string tokens ready for set-intersection comparison.
 */
export function tokenize(text: string) {
  return normalizeQuery(text)
    .split(" ")
    .filter((token) => token.length > 2)
    .filter((token) => !["the", "and", "for", "with", "what", "should", "customer"].includes(token));
}

/**
 * Parses a raw customer query into structured product constraints.
 *
 * Extraction is rule-based and deterministic — no model is called. Key
 * behaviors to know:
 * - Pull-on: "pull-on", "pull on", "slip-on", "slip on", and "slipon" all
 *   map to `pullOn: true`.
 * - Sole: "ladder" or "90 degree" both map to `defined_heel`; the sole slot
 *   stays `undefined` if neither appears.
 * - Use cases: matched against a seeded keyword map (e.g. "electric" →
 *   "electrician"). Only tokens in that map produce use-case constraints.
 * - Budget: extracted from phrases like "under $160", "below 150", "$180".
 * - Comparison names: only populated when the query contains "compare";
 *   fragments shorter than 7 characters after splitting on "and"/"vs" are
 *   discarded to avoid partial-name noise.
 *
 * Unrecognized constraint slots are `undefined`, not `false`. Callers in
 * `scoreAttributes` skip any slot that is `undefined`, treating it as
 * "customer did not request this attribute."
 *
 * @param query - The raw customer query string before any normalization.
 * @returns An `ExtractedConstraints` object with recognized constraints set
 *   and unrecognized slots left as `undefined`.
 */
export function extractConstraints(query: string): ExtractedConstraints {
  const normalized = normalizeQuery(query);
  const maxPrice = extractBudget(normalized);
  const comparisonNames = extractComparisonNames(query);
  const useCases = useCaseMap
    .filter(([needle]) => normalized.includes(needle))
    .map(([, useCase]) => useCase);

  return {
    waterproof: normalized.includes("waterproof") ? true : undefined,
    safetyToe: extractSafetyToe(normalized),
    height: extractHeight(normalized),
    sole: extractSole(normalized),
    pullOn:
      normalized.includes("pull-on") ||
      normalized.includes("pull on") ||
      normalized.includes("slip-on") ||
      normalized.includes("slip on") ||
      normalized.includes("slipon")
        ? true
        : undefined,
    welted: normalized.includes("welted") ? true : undefined,
    maxPrice,
    useCases: Array.from(new Set(useCases)),
    comparisonNames,
    mentionsWeight:
      normalized.includes("lightweight") ||
      normalized.includes("light weight") ||
      normalized.includes("heavy") ||
      normalized.includes("weight"),
    asksForSafety:
      normalized.includes("safety") ||
      normalized.includes("astm") ||
      normalized.includes("osha") ||
      normalized.includes("comp toe") ||
      normalized.includes("composite toe")
  };
}

function extractSafetyToe(query: string): SafetyToe | undefined {
  if (query.includes("soft toe") || query.includes("does not need safety toe") || query.includes("no safety toe")) {
    return "soft";
  }

  if (query.includes("comp toe") || query.includes("composite toe")) {
    return "comp";
  }

  if (query.includes("brunt toe")) {
    return "brunt";
  }

  return undefined;
}

function extractHeight(query: string): Height | undefined {
  if (/(^|\s)6[\s-]?(inch|in)\b/.test(query) || query.includes("6 inch")) {
    return "6in";
  }

  if (/(^|\s)8[\s-]?(inch|in)\b/.test(query) || query.includes("8 inch")) {
    return "8in";
  }

  if (/(^|\s)10[\s-]?(inch|in)\b/.test(query) || query.includes("10 inch")) {
    return "10in";
  }

  return undefined;
}

function extractSole(query: string): Sole | undefined {
  if (query.includes("wedge")) {
    return "wedge";
  }

  if (query.includes("90 degree") || query.includes("defined heel") || query.includes("ladder")) {
    return "defined_heel";
  }

  if (query.includes("logger")) {
    return "logger";
  }

  return undefined;
}

function extractBudget(query: string) {
  const underMatch = query.match(/(?:under|below|less than|sub)\s?\$?(\d{2,4})/);
  if (underMatch) {
    return Number(underMatch[1]);
  }

  const dollarMatch = query.match(/\$(\d{2,4})/);
  if (dollarMatch) {
    return Number(dollarMatch[1]);
  }

  return undefined;
}

function extractComparisonNames(query: string) {
  if (!/compare/i.test(query)) {
    return [];
  }

  return query
    .split(/\bvs\b|\band\b/i)
    .map((part) => part.replace(/compare/gi, "").replace(/for .*/gi, "").trim())
    .filter((part) => part.length > 6);
}
