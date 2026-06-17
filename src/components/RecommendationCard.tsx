"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import type { CrewGuideAnswer } from "@/lib/ai/provider";
import type { ProductScore } from "@/lib/catalog/product-types";
import { getInventorySignal } from "@/lib/intelligence/demo-inventory";
import { formatBootHeight, formatSole } from "@/lib/formatting";
import { INVENTORY_LABEL, INVENTORY_TONE } from "./intelligence/shared";
import { ProductThumb } from "./ProductThumb";

type RecommendationCardProps = {
  score: ProductScore;
  answer: CrewGuideAnswer;
  rank: number;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onOpenImage: () => void;
};

type ScoreBreakdownKey = "attributeMatchScore" | "lexicalOverlapScore" | "semanticScore";

const SCORE_BREAKDOWN: Array<{ key: ScoreBreakdownKey; label: string; weight: string }> = [
  { key: "attributeMatchScore", label: "Attribute match", weight: "55%" },
  { key: "lexicalOverlapScore", label: "Keyword overlap", weight: "25%" },
  { key: "semanticScore", label: "Use-case relevance", weight: "20%" }
];


export function RecommendationCard({
  score,
  answer,
  rank,
  expanded,
  onExpand,
  onCollapse,
  onOpenImage
}: RecommendationCardProps) {
  const isBest = rank === 0;
  const matchPercent = Math.round(score.score * 100);
  const detailsId = `details-${score.product.id}`;
  const inventorySignal = expanded ? getInventorySignal(score.product.id) : null;
  const tradeoffLines = isBest ? answer.tradeoffs : score.tradeoffs;

  return (
    <article
      className={`product-card ${expanded ? "selected" : ""}`}
      onClick={onExpand}
      aria-current={expanded ? "true" : undefined}
    >
      <div className="product-head">
        <button
          type="button"
          className="thumb-button"
          aria-label={`View product visuals for ${score.product.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onOpenImage();
          }}
        >
          {score.product.images?.[0] ? (
            <div className="product-thumb">
              <img
                src={score.product.images[0].src}
                alt={score.product.images[0].alt}
                className="product-thumb-img"
              />
            </div>
          ) : score.product.image ? (
            <div className="product-thumb">
              <img
                src={score.product.image}
                alt={score.product.imageAlt ?? score.product.name}
                className="product-thumb-img"
              />
            </div>
          ) : (
            <ProductThumb product={score.product} />
          )}
        </button>
        <div>
          <div className="card-label-row">
            {isBest ? (
              <span className="badge badge-best">Best match</span>
            ) : (
              <p className="small-label">Alternative {rank}</p>
            )}
            <span className="badge badge-score">{matchPercent}% match</span>
          </div>
          <h3 className="product-title">{score.product.name}</h3>
        </div>
        <div className="price">${score.product.price}</div>
      </div>

      <p className="summary">{score.product.description}</p>

      <div className="tag-row">
        {score.matchedAttributes.slice(0, 5).map((match) => (
          <span className="tag match" key={match}>
            {match}
          </span>
        ))}
        {score.missingAttributes.slice(0, 3).map((missing) => (
          <Tooltip.Root key={missing}>
            <Tooltip.Trigger asChild>
              <span className="tag missing">missing {missing}</span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="tooltip-content" sideOffset={6}>
                Not tracked in this demo catalog. In production this would map to Shopify/PIM
                product metadata.
                <Tooltip.Arrow className="tooltip-arrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>

      {expanded ? (
        <div id={detailsId} className="stack card-details">
          <div>
            <p className="small-label">Score breakdown</p>
            <div className="score-breakdown">
              {SCORE_BREAKDOWN.map((item) => {
                const percent = Math.round(score[item.key] * 100);
                return (
                  <div className="score-row" key={item.key}>
                    <span className="score-label">
                      {item.label} <span className="score-weight">({item.weight})</span>
                    </span>
                    <div className="score-bar">
                      <div className="score-bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="score-value">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {isBest ? (
            <div>
              <p className="small-label">Why it fits</p>
              <ul className="detail-list">
                {answer.whyThisFits.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <p className="small-label">Tradeoffs</p>
            <ul className="detail-list">
              {(tradeoffLines.length > 0
                ? tradeoffLines.slice(0, 4)
                : ["No major tradeoff found in the scored demo metadata."]
              ).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          {isBest ? (
            <div>
              <p className="small-label">What to ask next</p>
              <ul className="detail-list">
                {answer.whatToAskNext.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <p className="small-label">Product attributes</p>
            <div className="tag-row">
              <span className="tag">
                Waterproof: {score.product.attributes.waterproof ? "Yes" : "No"}
              </span>
              <span className="tag">
                Safety toe: {score.product.attributes.safetyToe ?? "unknown"}
              </span>
              <span className="tag">Height: {formatBootHeight(score.product.attributes.height)}</span>
              <span className="tag">Sole: {formatSole(score.product.attributes.sole)}</span>
              {score.product.attributes.pullOn ? <span className="tag">Pull-on</span> : null}
              {score.product.attributes.welted ? <span className="tag">Welted</span> : null}
            </div>
          </div>

          {score.product.attributes.useCases?.length ? (
            <div>
              <p className="small-label">Use cases</p>
              <div className="tag-row">
                {score.product.attributes.useCases.map((useCase) => (
                  <span className="tag" key={useCase}>
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {score.product.attributes.safetyRatings?.length ? (
            <div>
              <p className="small-label">Safety ratings</p>
              <div className="tag-row">
                {score.product.attributes.safetyRatings.map((rating) => (
                  <span className="tag" key={rating}>
                    {rating}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {inventorySignal ? (
            <div>
              <p className="small-label">Demo availability signal</p>
              <div className="tag-row">
                <span className={`badge ${INVENTORY_TONE[inventorySignal.status]}`}>
                  {INVENTORY_LABEL[inventorySignal.status]}
                </span>
                <span className="tag">{inventorySignal.locationLabel}</span>
                <span className="tag">NetSuite/Deposco (demo)</span>
                {inventorySignal.sizeNotes ? (
                  <span className="tag">{inventorySignal.sizeNotes}</span>
                ) : null}
              </div>
              <p className="notice">{inventorySignal.businessImpact}</p>
              <p className="notice">
                Demo signal only. In production, availability and substitute suggestions would
                come from NetSuite and Deposco inventory and fulfillment data.
              </p>
            </div>
          ) : null}

          <div>
            <p className="small-label">Evidence</p>
            <p className="notice">{score.product.evidenceText}</p>
          </div>

          {score.missingAttributes.length > 0 ||
          (score.product.attributes.missingFields?.length ?? 0) > 0 ? (
            <div>
              <p className="small-label">Missing or limited data</p>
              <div className="tag-row">
                {score.missingAttributes.map((missing) => (
                  <span className="tag missing" key={`needed-${missing}`}>
                    missing {missing}
                  </span>
                ))}
                {(score.product.attributes.missingFields ?? []).map((field) => (
                  <span className="tag missing" key={`gap-${field}`}>
                    {field} not tracked
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="card-actions">
        {expanded ? (
          <>
            <span className="small-label">Selected product</span>
            {score.product.productUrl ? (
              <a
                href={score.product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-toggle"
                aria-label={`View ${score.product.name} on BRUNT`}
                onClick={(event) => event.stopPropagation()}
              >
                View on BRUNT
              </a>
            ) : null}
            <button
              type="button"
              className="card-toggle"
              aria-expanded={true}
              aria-controls={detailsId}
              onClick={(event) => {
                event.stopPropagation();
                onCollapse();
              }}
            >
              Hide match details
            </button>
          </>
        ) : (
          <button
            type="button"
            className="card-toggle"
            onClick={(event) => {
              event.stopPropagation();
              onExpand();
            }}
          >
            Select this product
          </button>
        )}
      </div>
    </article>
  );
}
