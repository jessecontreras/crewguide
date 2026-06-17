import { seedProducts } from "@/lib/catalog/seed-products";
import { demoInventorySignals } from "@/lib/intelligence/demo-inventory";
import { formatLabel } from "@/lib/formatting";
import { INVENTORY_TONE } from "./intelligence/shared";

export function InventorySignalsView() {
  return (
    <section className="stack" aria-label="Inventory signals">
      <div className="page-header">
        <p className="page-eyebrow">Business Ops</p>
        <h1 className="page-title">Inventory Signals</h1>
        <p className="page-description">Stock exceptions and substitute signals from NetSuite/Deposco.</p>
      </div>

      <div className="panel stack">
        <p className="notice">
          NetSuite/Deposco-shaped demo data. Statuses and substitutes below are seeded. In
          production, the source would be live NetSuite/Deposco inventory and fulfillment feeds.
        </p>
        <ul className="theme-list">
          {demoInventorySignals.map((signal) => {
            const product = seedProducts.find((candidate) => candidate.id === signal.productId);
            const substitute = signal.substituteProductId
              ? seedProducts.find((candidate) => candidate.id === signal.substituteProductId)
              : undefined;
            return (
              <li className="stack" key={signal.productId}>
                <div className="actions">
                  <span className="card-title">{product?.name ?? signal.productId}</span>
                  <span className={`badge ${INVENTORY_TONE[signal.status]}`}>
                    {formatLabel(signal.status)}
                  </span>
                </div>
                <div className="tag-row">
                  <span className="tag">{signal.locationLabel}</span>
                  {signal.sizeNotes ? <span className="tag">{signal.sizeNotes}</span> : null}
                  {substitute ? <span className="tag">Substitute: {substitute.name}</span> : null}
                </div>
                <p className="notice card-impact">{signal.businessImpact}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
