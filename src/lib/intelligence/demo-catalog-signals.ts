import { seedProducts } from "@/lib/catalog/seed-products";

export type CatalogSourceSystem = "shopify_pim_demo" | "shopify" | "pim";
export type CatalogFieldStatus = "complete" | "missing" | "weak";

export type ProductCatalogSignal = {
  productId: string;
  sourceSystem: CatalogSourceSystem;
  field: string;
  status: CatalogFieldStatus;
  businessImpact: string;
  sourceRecordId?: string;
};

export type MetadataBacklogItem = {
  field: string;
  sourceSystem: CatalogSourceSystem;
  affectedProductCount: number;
  totalProductCount: number;
  exampleProductNames: string[];
  businessImpact: string;
};

const FIELD_BUSINESS_IMPACT: Record<string, string> = {
  weight:
    "Blocks confident answers to \"durable but not heavy\" style requests and weight-based comparisons.",
  "exact safety certification":
    "Limits confirming an exact ASTM/safety certification when a customer asks for a specific standard.",
  insulation: "Blocks insulation-based recommendations for cold-weather or seasonal requests.",
  "ASTM safety standard":
    "Limits confirming ASTM safety standard compliance for safety-sensitive trades.",
  "ladder safety rating":
    "Blocks structured ladder-work suitability comparisons between wedge and defined-heel soles.",
  "waterproof membrane details":
    "Limits explaining waterproof membrane construction and durability differences.",
  "break-in guidance":
    "Blocks setting break-in expectations for welted, durability-positioned styles."
};

function describeImpact(field: string): string {
  return (
    FIELD_BUSINESS_IMPACT[field] ??
    `Missing "${field}" data limits how confidently this product can be recommended.`
  );
}

export function buildCatalogSignals(): ProductCatalogSignal[] {
  const signals: ProductCatalogSignal[] = [];

  for (const product of seedProducts) {
    for (const field of product.attributes.missingFields ?? []) {
      signals.push({
        productId: product.id,
        sourceSystem: "shopify_pim_demo",
        field,
        status: "missing",
        businessImpact: describeImpact(field)
      });
    }
  }

  return signals;
}

/**
 * Pivots per-product catalog gap signals into a ranked per-field backlog.
 *
 * Reads `product.attributes.missingFields` from the seeded catalog — all
 * data here is demo/seeded, not live from Shopify or PIM. Each missing-field
 * entry from each product becomes a `ProductCatalogSignal`; this function
 * then groups those signals by field name and counts how many products are
 * affected.
 *
 * `exampleProductNames` is capped at 3 entries per field to keep the UI
 * scannable; `affectedProductCount` reflects the true total.
 *
 * `businessImpact` is sourced from the `FIELD_BUSINESS_IMPACT` lookup keyed
 * by field name. Fields not in the lookup get a generic fallback string.
 *
 * @returns Backlog items sorted by `affectedProductCount` descending — the
 *   most widely missing field appears first.
 */
export function buildMetadataBacklog(): MetadataBacklogItem[] {
  const signals = buildCatalogSignals();
  const byField = new Map<string, ProductCatalogSignal[]>();

  for (const signal of signals) {
    byField.set(signal.field, [...(byField.get(signal.field) ?? []), signal]);
  }

  const items: MetadataBacklogItem[] = [];

  for (const [field, fieldSignals] of byField) {
    const exampleProductNames = fieldSignals.map((signal) => {
      const product = seedProducts.find((candidate) => candidate.id === signal.productId);
      return product?.name ?? signal.productId;
    });

    items.push({
      field,
      sourceSystem: "shopify_pim_demo",
      affectedProductCount: fieldSignals.length,
      totalProductCount: seedProducts.length,
      exampleProductNames: exampleProductNames.slice(0, 3),
      businessImpact: describeImpact(field)
    });
  }

  return items.sort((a, b) => b.affectedProductCount - a.affectedProductCount);
}
