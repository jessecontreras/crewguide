export type InventorySourceSystem = "netsuite_deposco_demo" | "netsuite" | "deposco";
export type InventoryStatus = "in_stock" | "low_stock" | "not_stocked" | "unknown";

export type InventorySignal = {
  productId: string;
  sourceSystem: InventorySourceSystem;
  locationLabel: string;
  status: InventoryStatus;
  sizeNotes?: string;
  substituteProductId?: string;
  businessImpact: string;
};

export const demoInventorySignals: InventorySignal[] = [
  {
    productId: "marin-waterproof-comp-toe",
    sourceSystem: "netsuite_deposco_demo",
    locationLabel: "DC1 - Reno, NV",
    status: "in_stock",
    businessImpact: "Healthy stock across common sizes - safe to recommend without a substitute."
  },
  {
    productId: "marin-waterproof-soft-toe",
    sourceSystem: "netsuite_deposco_demo",
    locationLabel: "DC1 - Reno, NV",
    status: "low_stock",
    sizeNotes: "Sizes 9-11 below reorder point",
    substituteProductId: "ohman-soft-toe",
    businessImpact:
      "Common sizes are below reorder point. The Ohman (Soft Toe) is available as a slip-on alternative, but it is water-resistant only, not fully waterproof. Confirm the customer's wet-condition needs before substituting."
  },
  {
    productId: "ryng-waterproof-comp-toe",
    sourceSystem: "netsuite_deposco_demo",
    locationLabel: "DC1 - Reno, NV",
    status: "in_stock",
    businessImpact: "Healthy stock - safe to recommend without a substitute."
  },
  {
    productId: "perkins-waterproof-comp-toe",
    sourceSystem: "netsuite_deposco_demo",
    locationLabel: "DC1 - Reno, NV",
    status: "in_stock",
    businessImpact: "Healthy stock - safe to recommend without a substitute."
  },
  {
    productId: "ohman-soft-toe",
    sourceSystem: "netsuite_deposco_demo",
    locationLabel: "DC1 - Reno, NV",
    status: "low_stock",
    sizeNotes: "Wide widths below reorder point",
    businessImpact:
      "Wide-width stock is running low with no in-line substitute identified - flag for replenishment review."
  },
  {
    productId: "ohman-comp-toe",
    sourceSystem: "netsuite_deposco_demo",
    locationLabel: "DC1 - Reno, NV",
    status: "not_stocked",
    substituteProductId: "ohman-soft-toe",
    businessImpact:
      "Currently not stocked. The Ohman (Soft Toe) is available as a substitute, but that removes the composite safety toe. Confirm it is acceptable before recommending."
  }
];

/**
 * Returns the seeded inventory signal for a catalog product.
 *
 * Looks up the product ID in `demoInventorySignals`. When no matching
 * signal is found, returns a synthetic "unknown" record whose
 * `businessImpact` notes that the missing signal would resolve to live
 * NetSuite/Deposco data in production.
 *
 * All data is seeded/demo — no live inventory system is called at runtime.
 * Called lazily in `RecommendationCard` only when the card is expanded, to
 * avoid lookups for all three cards on every render.
 *
 * @param productId - The `product.id` field from the catalog.
 * @returns The matching `InventorySignal`, or a synthetic unknown record if
 *   the product has no seeded signal.
 */
export function getInventorySignal(productId: string): InventorySignal {
  return (
    demoInventorySignals.find((signal) => signal.productId === productId) ?? {
      productId,
      sourceSystem: "netsuite_deposco_demo",
      locationLabel: "DC1 - Reno, NV",
      status: "unknown",
      businessImpact:
        "No inventory signal seeded for this product in this demo. In production this would resolve to live NetSuite/Deposco availability."
    }
  );
}
