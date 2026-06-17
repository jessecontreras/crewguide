import { buildMetadataBacklog } from "@/lib/intelligence/demo-catalog-signals";
import type { FeedbackPayload } from "./types";

type CatalogReadinessViewProps = {
  feedback: FeedbackPayload | null;
};

export function CatalogReadinessView({ feedback }: CatalogReadinessViewProps) {
  const metadataBacklog = buildMetadataBacklog();

  return (
    <section className="stack" aria-label="Catalog readiness">
      <div className="page-header">
        <p className="page-eyebrow">Business Ops</p>
        <h1 className="page-title">Catalog Readiness</h1>
        <p className="page-description">Catalog metadata gaps that block confident recommendations.</p>
      </div>

      <div className="panel stack">
        <p className="notice">
          Catalog completeness from Shopify/PIM-shaped demo data. These gaps most often block a
          confident recommendation.
        </p>
        <ul className="theme-list">
          {metadataBacklog.map((item) => {
            const extra = item.affectedProductCount - item.exampleProductNames.length;
            return (
              <li className="stack" key={item.field}>
                <div className="actions">
                  <span className="card-title">{item.field}</span>
                  <span className="badge">
                    {item.affectedProductCount}/{item.totalProductCount} products
                  </span>
                </div>
                <p className="notice card-impact">{item.businessImpact}</p>
                <div className="tag-row">
                  {item.exampleProductNames.map((name) => (
                    <span className="tag" key={name}>
                      {name}
                    </span>
                  ))}
                  {extra > 0 ? <span className="tag">+{extra} more</span> : null}
                </div>
                <p className="notice">
                  <strong>Recommended:</strong> Open a metadata review ticket to add &quot;{item.field}&quot; to
                  the affected products.
                </p>
              </li>
            );
          })}
        </ul>
        <div>
          <p className="small-label">Suggested metadata improvements</p>
          <ul className="theme-list">
            {(feedback?.themes.suggestedImprovements ?? [
              "Add structured fields for outsole, weight, insulation, ASTM/safety standard, and jobsite use cases."
            ]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
