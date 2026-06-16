export type ReviewReturnSourceSystem = "bigquery_demo" | "bigquery";
export type ReviewSentiment = "positive" | "mixed" | "negative";

export type ReviewReturnSignal = {
  productId?: string;
  sourceSystem: ReviewReturnSourceSystem;
  theme: string;
  sentiment: ReviewSentiment;
  evidenceSummary: string;
  businessImpact: string;
};

export const demoReviewSignals: ReviewReturnSignal[] = [
  {
    sourceSystem: "bigquery_demo",
    theme: "Comfort praise",
    sentiment: "positive",
    evidenceSummary:
      "Reviews across the waterproof line frequently call out all-day comfort, especially for standing work.",
    businessImpact:
      "Comfort is a reliable selling point for standing-heavy trades - safe to lead with in recommendations."
  },
  {
    sourceSystem: "bigquery_demo",
    theme: "Waterproof confidence",
    sentiment: "positive",
    evidenceSummary:
      "Customers consistently report the waterproof membrane holds up in wet jobsite conditions over extended use.",
    businessImpact:
      "Waterproofing claims are well-supported and can be stated with confidence for the Marin, Ryng, and Perkins lines."
  },
  {
    productId: "perkins-waterproof-comp-toe",
    sourceSystem: "bigquery_demo",
    theme: "Break-in firmness",
    sentiment: "mixed",
    evidenceSummary:
      "Some customers note the FARMGUARD leather requires a break-in period before softening to fit. Others report no issue.",
    businessImpact:
      "Setting break-in expectations at the point of sale can reduce early returns on this style - ties to the missing break-in guidance field."
  },
  {
    productId: "ohman-soft-toe",
    sourceSystem: "bigquery_demo",
    theme: "Water resistance clarification",
    sentiment: "mixed",
    evidenceSummary:
      "Some customers expected full waterproofing based on product positioning. The Ohman is water-resistant, not waterproof.",
    businessImpact:
      "Clarifying water-resistant vs. waterproof at point of sale reduces mismatch returns from customers expecting wet-condition performance - ties to the missing waterproof membrane details field."
  },
  {
    productId: "marin-waterproof-soft-toe",
    sourceSystem: "bigquery_demo",
    theme: "Fit for wide feet",
    sentiment: "negative",
    evidenceSummary:
      "Wide-foot customers report a snug fit in the moc toe box on this style, even with the SWITCH-FIT system engaged.",
    businessImpact:
      "Flagging fit limitations for wide-foot customers before purchase can reduce returns on this style."
  }
];
