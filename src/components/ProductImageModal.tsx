"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ProductScore } from "@/lib/catalog/product-types";
import { ProductThumb, type ProductThumbVariant } from "./ProductThumb";

type ProductImageModalProps = {
  score: ProductScore | null;
  onClose: () => void;
};

const FALLBACK_VIEWS: Array<{ key: ProductThumbVariant; label: string }> = [
  { key: "side", label: "Side view" },
  { key: "toe", label: "Toe / safety-toe view" },
  { key: "sole", label: "Sole / traction view" }
];

export function ProductImageModal({ score, onClose }: ProductImageModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [viewIndex, setViewIndex] = useState(0);

  const realImages = score?.product.images ?? [];
  const hasRealImages = realImages.length > 0;
  const hasSingleImage = !hasRealImages && !!score?.product.image;
  const total = hasRealImages ? realImages.length : hasSingleImage ? 1 : FALLBACK_VIEWS.length;

  useEffect(() => {
    setViewIndex(0);
  }, [score?.product.id]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (score && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!score && dialog.open) {
      dialog.close();
    }
  }, [score]);

  function goTo(delta: number) {
    setViewIndex((current) => (current + delta + total) % total);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") {
      goTo(-1);
    } else if (event.key === "ArrowRight") {
      goTo(1);
    }
  }

  function renderImage() {
    if (!score) return null;

    if (hasRealImages) {
      const img = realImages[viewIndex];
      return (
        <img
          src={img.src}
          alt={img.alt}
          className="product-modal-img"
        />
      );
    }

    if (hasSingleImage) {
      return (
        <img
          src={score.product.image}
          alt={score.product.imageAlt ?? score.product.name}
          className="product-modal-img"
        />
      );
    }

    const view = FALLBACK_VIEWS[viewIndex];
    return <ProductThumb product={score.product} variant={view.key} />;
  }

  function currentLabel() {
    if (hasRealImages) return realImages[viewIndex].label;
    if (hasSingleImage) return "Side view";
    return FALLBACK_VIEWS[viewIndex].label;
  }

  const showNav = total > 1;
  const showDisclaimer = !hasRealImages && !hasSingleImage;

  return (
    <dialog
      ref={dialogRef}
      className="image-modal"
      aria-label={score ? `${score.product.name} visuals` : "Product visuals"}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      {score ? (
        <div className="image-modal-body">
          <div className="image-modal-header">
            <p className="small-label">
              {viewIndex + 1} of {total} – {currentLabel()}
            </p>
            <button
              type="button"
              className="image-modal-close"
              aria-label="Close product visuals"
              ref={closeButtonRef}
              onClick={onClose}
            >
              &times;
            </button>
          </div>

          <div className="image-modal-thumb">
            {renderImage()}
          </div>

          <h3 className="product-title">{score.product.name}</h3>
          <div className="card-label-row">
            <span className="price">${score.product.price}</span>
            <span className="badge badge-score">{Math.round(score.score * 100)}% match</span>
          </div>

          {showDisclaimer && (
            <p className="notice">Illustrative demo visual, not an actual BRUNT product photo.</p>
          )}

          {showNav && (
            <div className="image-modal-nav">
              <button
                type="button"
                className="secondary-button"
                onClick={() => goTo(-1)}
                aria-label="Previous view"
              >
                &larr; Previous
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => goTo(1)}
                aria-label="Next view"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      ) : null}
    </dialog>
  );
}
