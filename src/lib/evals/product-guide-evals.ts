import { recommendProducts } from "@/lib/retrieval/hybrid-search";

export const productGuideEvals = [
  {
    query: "Customer is an electrician. Needs waterproof, comp toe, 6 inch, under $180.",
    expectedTopProductId: "marin-waterproof-comp-toe"
  },
  {
    query: "Someone works outdoors in mud and wants waterproof but does not need safety toe.",
    expectedTopProductId: "marin-waterproof-soft-toe"
  },
  {
    query: "Customer needs a pull-on comp toe boot that is easy on and off.",
    expectedTopProductId: "ohman-comp-toe"
  },
  {
    query: "Customer needs a waterproof comp toe boot under $130.",
    expectedFallback: true
  },
  {
    query: "What product should I recommend for someone who wants durable but complains about heavy footwear?",
    expectedFallback: true
  }
];

/**
 * Runs the product retrieval eval suite against the live `recommendProducts`
 * function and returns per-test pass/fail results.
 *
 * Each case asserts either an exact top-product ID or that the fallback
 * flag fires. A case passes when `result.topProducts[0].product.id`
 * matches `expectedTopProductId`, or when `result.fallback` matches
 * `expectedFallback`. This suite is the correctness gate for scoring and
 * retrieval changes — it is also surfaced live via the `/api/eval` GET
 * endpoint.
 *
 * All evaluation is deterministic and runs against seeded catalog data;
 * no external service is called.
 *
 * @returns One result object per test case, spreading the original case
 *   definition and adding `topProductId`, `fallback`, `confidence`, and
 *   `passed`.
 */
export function runProductGuideEvals() {
  return productGuideEvals.map((test) => {
    const result = recommendProducts(test.query);
    const topProductId = result.topProducts[0]?.product.id;
    const passed =
      test.expectedFallback !== undefined
        ? result.fallback === test.expectedFallback
        : topProductId === test.expectedTopProductId;

    return {
      ...test,
      topProductId,
      fallback: result.fallback,
      confidence: result.confidence,
      passed
    };
  });
}
