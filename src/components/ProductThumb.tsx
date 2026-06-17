import type { Product } from "@/lib/catalog/product-types";

const TOE_TONE: Record<string, string> = {
  soft: "var(--good)",
  comp: "var(--gold)",
  brunt: "var(--brand)",
  unknown: "var(--muted)"
};

export type ProductThumbVariant = "side" | "toe" | "sole";

type ProductThumbProps = {
  product: Product;
  variant?: ProductThumbVariant;
};

export function ProductThumb({ product, variant = "side" }: ProductThumbProps) {
  const tone = TOE_TONE[product.attributes.safetyToe ?? "unknown"];

  return (
    <div className="product-thumb" style={{ color: tone }} aria-hidden="true">
      <svg viewBox="0 0 48 48" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
        {variant === "side" ? (
          <>
            <path
              d="M16 4h14a3 3 0 0 1 3 3v17.5c0 1.2.6 2.3 1.6 3l8.6 5.9A4 4 0 0 1 45 36.7V40a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9c0-2.3 1.2-4.4 3.2-5.5L13 19.6A6 6 0 0 0 16 14.4V7a3 3 0 0 1 0-3z"
              fill="currentColor"
            />
            <rect x="3" y="38" width="42" height="5" rx="2.5" fill="currentColor" opacity="0.55" />
          </>
        ) : null}

        {variant === "toe" ? (
          <>
            <path
              d="M24 6c8.8 0 16 7.2 16 16v6a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-6C8 13.2 15.2 6 24 6z"
              fill="currentColor"
              opacity="0.85"
            />
            <rect x="8" y="27" width="32" height="6" rx="2" fill="currentColor" />
            <rect x="3" y="38" width="42" height="5" rx="2.5" fill="currentColor" opacity="0.55" />
          </>
        ) : null}

        {variant === "sole" ? (
          <>
            <rect x="4" y="10" width="40" height="24" rx="10" fill="currentColor" opacity="0.18" />
            <rect x="8" y="14" width="32" height="4" rx="2" fill="currentColor" />
            <rect x="8" y="21" width="32" height="4" rx="2" fill="currentColor" />
            <rect x="8" y="28" width="32" height="4" rx="2" fill="currentColor" />
          </>
        ) : null}
      </svg>
    </div>
  );
}
