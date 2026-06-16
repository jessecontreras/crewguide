import type { Product } from "./product-types";

export const seedProducts: Product[] = [
  {
    id: "marin-waterproof-comp-toe",
    name: "The Marin Waterproof (Comp Toe)",
    subtitle: '6" Comp Toe Work Boot',
    category: "boot",
    price: 164.99,
    productUrl: "https://bruntworkwear.com/products/the-marin-waterproof-comp-toe",
    image: "/products/brunt/marin-waterproof-comp-toe/side.jpg",
    imageAlt: "Right side of the BRUNT 6 inch waterproof composite toe Marin work boot in brown",
    images: [
      {
        src: "/products/brunt/marin-waterproof-comp-toe/side.jpg",
        alt: "Right side of the BRUNT 6 inch waterproof composite toe Marin work boot in brown",
        label: "Side"
      },
      {
        src: "/products/brunt/marin-waterproof-comp-toe/angle.jpg",
        alt: "45 degree angle of the BRUNT 6 inch waterproof composite toe Marin work boot in brown",
        label: "Angle"
      },
      {
        src: "/products/brunt/marin-waterproof-comp-toe/sole.jpg",
        alt: "Bottom sole of the BRUNT 6 inch waterproof composite toe Marin work boot",
        label: "Sole"
      }
    ],
    source: "Public BRUNT product page",
    attributes: {
      waterproof: true,
      safetyToe: "comp",
      height: "6in",
      sole: "wedge",
      useCases: ["electrician", "construction", "ironwork", "factory work", "standing all day"],
      tradeHints: [
        "Wedge sole, suited for flat surfaces and standing work. Defined-heel options like the Ryng or Perkins are better for ladder work."
      ],
      safetyRatings: ["ASTM F2413-24 M I/75 C/75 EH"],
      missingFields: ["insulation rating", "shank material"]
    },
    description:
      'Waterproof 6-inch composite toe work boot with a wedge sole.',
    evidenceText:
      "The Marin Waterproof (Comp Toe) is waterproof, composite safety toe, 6 inch, wedge sole, EH-rated, and priced at $164.99."
  },
  {
    id: "marin-waterproof-soft-toe",
    name: "The Marin Waterproof (Soft Toe)",
    subtitle: '6" Moc Toe Work Boot',
    category: "boot",
    price: 154.99,
    productUrl: "https://bruntworkwear.com/products/the-marin-waterproof-soft-toe",
    image: "/products/brunt/marin-waterproof-soft-toe/side.jpg",
    imageAlt: "Right side of the BRUNT 6 inch waterproof soft toe Marin work boot in brown",
    images: [
      {
        src: "/products/brunt/marin-waterproof-soft-toe/side.jpg",
        alt: "Right side of the BRUNT 6 inch waterproof soft toe Marin work boot in brown",
        label: "Side"
      },
      {
        src: "/products/brunt/marin-waterproof-soft-toe/angle.jpg",
        alt: "45 degree angle of the BRUNT 6 inch waterproof soft toe Marin work boot in brown",
        label: "Angle"
      },
      {
        src: "/products/brunt/marin-waterproof-soft-toe/sole.jpg",
        alt: "Bottom sole of the BRUNT 6 inch waterproof soft toe Marin work boot",
        label: "Sole"
      }
    ],
    source: "Public BRUNT product page",
    attributes: {
      waterproof: true,
      safetyToe: "soft",
      height: "6in",
      sole: "wedge",
      useCases: ["outdoor work", "mud", "construction", "standing all day", "factory work"],
      tradeHints: [
        "No safety toe, suited when comp toe is not required. Wedge sole for standing comfort on flat surfaces."
      ],
      safetyRatings: ["ASTM F2892-24 EH"],
      missingFields: ["insulation rating", "shank material"]
    },
    description:
      'Waterproof 6-inch soft moc toe work boot with a wedge sole.',
    evidenceText:
      "The Marin Waterproof (Soft Toe) is waterproof, soft toe, 6 inch, wedge sole, EH-rated, and priced at $154.99."
  },
  {
    id: "ryng-waterproof-comp-toe",
    name: "The Ryng Waterproof (Comp Toe)",
    subtitle: '6" Lightweight 90° Heel Work Boot',
    category: "boot",
    price: 154.99,
    productUrl: "https://bruntworkwear.com/products/the-ryng-waterproof-comp-toe",
    image: "/products/brunt/ryng-waterproof-comp-toe/side.jpg",
    imageAlt: "Right side of the BRUNT 6 inch lightweight waterproof composite toe Ryng work boot in black",
    images: [
      {
        src: "/products/brunt/ryng-waterproof-comp-toe/side.jpg",
        alt: "Right side of the BRUNT 6 inch lightweight waterproof composite toe Ryng work boot in black",
        label: "Side"
      },
      {
        src: "/products/brunt/ryng-waterproof-comp-toe/angle.jpg",
        alt: "45 degree angle of the BRUNT 6 inch lightweight waterproof composite toe Ryng work boot in black",
        label: "Angle"
      },
      {
        src: "/products/brunt/ryng-waterproof-comp-toe/sole.jpg",
        alt: "Bottom sole of the BRUNT 6 inch lightweight waterproof composite toe Ryng work boot",
        label: "Sole"
      }
    ],
    source: "Public BRUNT product page",
    attributes: {
      waterproof: true,
      safetyToe: "comp",
      height: "6in",
      sole: "defined_heel",
      useCases: ["electrician", "climbing", "ladder work", "electrical work", "utility work", "landscaping"],
      tradeHints: [
        "90° defined heel and lightweight build (1 lb 9 oz, size 9), preferred for ladder and climbing work over a wedge sole."
      ],
      safetyRatings: ["ASTM F2413-24 M I/75 C/75 EH"],
      missingFields: ["insulation rating", "ladder safety rating"]
    },
    description:
      'Lightweight waterproof 6-inch composite toe work boot with a 90° defined heel.',
    evidenceText:
      "The Ryng Waterproof (Comp Toe) is waterproof, composite safety toe, 6 inch, defined heel, EH-rated, and priced at $154.99."
  },
  {
    id: "perkins-waterproof-comp-toe",
    name: "The Perkins Waterproof (Comp Toe)",
    subtitle: '6" Durable 90° Heel Work Boot',
    category: "boot",
    price: 174.99,
    productUrl: "https://bruntworkwear.com/products/the-perkins-waterproof-comp-toe",
    image: "/products/brunt/perkins-waterproof-comp-toe/side.jpg",
    imageAlt: "Right side of the BRUNT 6 inch durable waterproof composite toe Perkins work boot in brown",
    images: [
      {
        src: "/products/brunt/perkins-waterproof-comp-toe/side.jpg",
        alt: "Right side of the BRUNT 6 inch durable waterproof composite toe Perkins work boot in brown",
        label: "Side"
      },
      {
        src: "/products/brunt/perkins-waterproof-comp-toe/angle.jpg",
        alt: "45 degree angle of the BRUNT 6 inch durable waterproof composite toe Perkins work boot in brown",
        label: "Angle"
      },
      {
        src: "/products/brunt/perkins-waterproof-comp-toe/sole.jpg",
        alt: "Bottom sole of the BRUNT 6 inch durable waterproof composite toe Perkins work boot",
        label: "Sole"
      }
    ],
    source: "Public BRUNT product page",
    attributes: {
      waterproof: true,
      safetyToe: "comp",
      height: "6in",
      sole: "defined_heel",
      useCases: ["construction", "roofing", "logging", "utility work", "climbing", "scaffolding"],
      tradeHints: [
        "FARMGUARD leather build for tough outdoor conditions. 90° defined heel for climbing, roofing, and scaffolding work."
      ],
      safetyRatings: ["ASTM F2413-24 M I/75 C/75 EH"],
      missingFields: ["insulation rating", "shank stiffness rating"]
    },
    description:
      'Waterproof 6-inch composite toe work boot with a 90° defined heel and FARMGUARD leather.',
    evidenceText:
      "The Perkins Waterproof (Comp Toe) is waterproof, composite safety toe, 6 inch, defined heel, EH-rated, and priced at $174.99."
  },
  {
    id: "ohman-soft-toe",
    name: "The Ohman (Soft Toe)",
    subtitle: '6" Slip-On Work Boot',
    category: "boot",
    price: 144.99,
    productUrl: "https://bruntworkwear.com/products/the-ohman-soft-toe",
    image: "/products/brunt/ohman-soft-toe/side.jpg",
    imageAlt: "Right side of the BRUNT 6 inch water-resistant slip-on soft toe Ohman work boot in brown",
    images: [
      {
        src: "/products/brunt/ohman-soft-toe/side.jpg",
        alt: "Right side of the BRUNT 6 inch water-resistant slip-on soft toe Ohman work boot in brown",
        label: "Side"
      },
      {
        src: "/products/brunt/ohman-soft-toe/angle.jpg",
        alt: "45 degree angle of the BRUNT 6 inch water-resistant slip-on soft toe Ohman work boot in brown",
        label: "Angle"
      },
      {
        src: "/products/brunt/ohman-soft-toe/sole.jpg",
        alt: "Bottom sole of the BRUNT 6 inch water-resistant slip-on soft toe Ohman work boot",
        label: "Sole"
      }
    ],
    source: "Public BRUNT product page",
    attributes: {
      waterproof: false,
      safetyToe: "soft",
      height: "6in",
      sole: "defined_heel",
      pullOn: true,
      useCases: ["farming", "general trade", "pull-on convenience", "outdoor work"],
      tradeHints: [
        "Water-resistant, not fully waterproof. Not suited for sustained wet conditions. Slip-on is quickest on and off."
      ],
      safetyRatings: ["ASTM F2892-24 EH"],
      missingFields: ["waterproof membrane details", "insulation rating"]
    },
    description:
      'Water-resistant 6-inch soft toe slip-on work boot.',
    evidenceText:
      "The Ohman (Soft Toe) is water-resistant (not waterproof), soft toe, 6 inch, defined heel, pull-on, EH-rated, and priced at $144.99."
  },
  {
    id: "ohman-comp-toe",
    name: "The Ohman (Comp Toe)",
    subtitle: '6" Slip-On Comp Toe Work Boot',
    category: "boot",
    price: 154.99,
    productUrl: "https://bruntworkwear.com/products/the-ohman-comp-toe",
    image: "/products/brunt/ohman-comp-toe/side.jpg",
    imageAlt: "Right side of the BRUNT 6 inch water-resistant slip-on composite toe Ohman work boot in brown",
    images: [
      {
        src: "/products/brunt/ohman-comp-toe/side.jpg",
        alt: "Right side of the BRUNT 6 inch water-resistant slip-on composite toe Ohman work boot in brown",
        label: "Side"
      },
      {
        src: "/products/brunt/ohman-comp-toe/angle.jpg",
        alt: "45 degree angle of the BRUNT 6 inch water-resistant slip-on composite toe Ohman work boot in brown",
        label: "Angle"
      },
      {
        src: "/products/brunt/ohman-comp-toe/sole.jpg",
        alt: "Bottom sole of the BRUNT 6 inch water-resistant slip-on composite toe Ohman work boot",
        label: "Sole"
      }
    ],
    source: "Public BRUNT product page",
    attributes: {
      waterproof: false,
      safetyToe: "comp",
      height: "6in",
      sole: "defined_heel",
      pullOn: true,
      useCases: ["shop work", "farming", "general trade", "pull-on convenience"],
      tradeHints: [
        "Water-resistant, not fully waterproof. Good for dry trades and shop work where pull-on convenience matters."
      ],
      safetyRatings: ["ASTM F2413-24 M I/75 C/75 EH"],
      missingFields: ["waterproof membrane details", "insulation rating"]
    },
    description:
      'Water-resistant 6-inch composite toe slip-on work boot.',
    evidenceText:
      "The Ohman (Comp Toe) is water-resistant (not waterproof), composite safety toe, 6 inch, defined heel, pull-on, EH-rated, and priced at $154.99."
  }
];
