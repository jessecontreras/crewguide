export type ProductCategory = "boot" | "apparel" | "accessory";

export type SafetyToe = "soft" | "comp" | "brunt" | "unknown";
export type Height = "low" | "6in" | "8in" | "10in" | "unknown";
export type Sole = "wedge" | "defined_heel" | "logger" | "unknown";

export type ProductImage = {
  src: string;
  alt: string;
  label: string;
};

/**
 * A single product in the BRUNT demo catalog.
 *
 * `description` is buyer-friendly short copy shown in the product card
 * summary. `evidenceText` is the retrieval-focused prose shown in the
 * expanded card Evidence section and sent to the AI provider — it is the
 * source the mock provider draws on for "why it fits" bullets.
 *
 * `productUrl` links to the live storefront product page and is rendered
 * as a "View on BRUNT" link in the expanded card when present.
 * `subtitle` and `source` are populated in the seed data but are not
 * currently rendered in the Rep Assistant UI.
 *
 * All products in this demo are seeded in `seed-products.ts`. No live
 * catalog API is called at runtime.
 */
export type Product = {
  id: string;
  name: string;
  subtitle?: string;
  category: ProductCategory;
  price: number;
  productUrl?: string;
  image?: string;
  imageAlt?: string;
  images?: ProductImage[];
  source?: string;
  attributes: {
    waterproof?: boolean;
    safetyToe?: SafetyToe;
    height?: Height;
    sole?: Sole;
    pullOn?: boolean;
    welted?: boolean;
    useCases?: string[];
    tradeHints?: string[];
    safetyRatings?: string[];
    missingFields?: string[];
  };
  description: string;
  evidenceText: string;
};

/**
 * Customer needs parsed from a raw rep query by `extractConstraints`.
 *
 * Constraint slots that were not mentioned in the query are `undefined`,
 * not `false`. Scoring code in `scoreAttributes` skips `undefined` slots,
 * treating them as "customer did not request this attribute." This is
 * important: a product is not penalized for a trait the customer did not ask
 * about.
 *
 * `useCases` and `comparisonNames` are always arrays (never undefined) and
 * may be empty. `mentionsWeight` and `asksForSafety` are always booleans.
 */
export type ExtractedConstraints = {
  waterproof?: boolean;
  safetyToe?: SafetyToe;
  height?: Height;
  sole?: Sole;
  pullOn?: boolean;
  welted?: boolean;
  maxPrice?: number;
  useCases: string[];
  comparisonNames: string[];
  mentionsWeight: boolean;
  asksForSafety: boolean;
};

/**
 * A catalog product paired with its retrieval scoring breakdown.
 *
 * `matchedAttributes`, `missingAttributes`, and `tradeoffs` are label
 * strings built by `labelAttribute` and used both for UI display (tags,
 * tradeoff bullets) and for the fallback heuristic in `shouldFallback`.
 *
 * Key invariant: when a requested attribute is absent from the product
 * record entirely, the miss goes into `missingAttributes`. When the product
 * has a conflicting value (e.g. comp toe when soft was requested), the
 * miss goes into `tradeoffs`. Pull-on is a notable exception — it always
 * lands in `missingAttributes` because the catalog marks its absence by
 * omission rather than a conflicting value.
 */
export type ProductScore = {
  product: Product;
  score: number;
  attributeMatchScore: number;
  lexicalOverlapScore: number;
  semanticScore: number;
  matchedAttributes: string[];
  missingAttributes: string[];
  tradeoffs: string[];
};

/**
 * The full output of `recommendProducts` — retrieval result plus routing
 * signals for the API and the Rep Assistant UI.
 *
 * Key invariants:
 * - `topProducts` always contains up to 3 scored products, even when
 *   `fallback` is true. Callers can still inspect scores; they should just
 *   not present the products as a confident recommendation.
 * - `fallbackReason`, `clarifyingQuestion`, and `frictionReason` are only
 *   set when `fallback` is true. When `fallback` is false all three are
 *   `undefined`.
 * - `clarifyingQuestion` is what the Rep Assistant shows to the rep when
 *   asking for more context. It should be surfaced instead of a product card.
 * - `frictionReason` drives telemetry classification. It is written to the
 *   friction log and surfaced in the AI Operations and Catalog Readiness views.
 */
export type RecommendationResult = {
  query: string;
  constraints: ExtractedConstraints;
  topProducts: ProductScore[];
  confidence: number;
  fallback: boolean;
  fallbackReason?: string;
  clarifyingQuestion?: string;
  frictionReason?:
    | "low_confidence"
    | "missing_attribute"
    | "ambiguous_request"
    | "no_matching_product"
    | "conflicting_product_data";
};

export type FrictionEvent = {
  id: string;
  query: string;
  reason:
    | "low_confidence"
    | "missing_attribute"
    | "ambiguous_request"
    | "no_matching_product"
    | "conflicting_product_data";
  extractedNeed: string;
  createdAt: string;
};
