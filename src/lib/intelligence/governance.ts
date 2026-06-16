export type GovernanceSourceSystem =
  | "shopify_pim_demo"
  | "netsuite_deposco_demo"
  | "bigquery_demo"
  | "jira_ai_council_demo"
  | "internal";
export type GovernedActionStatus = "allowed_now" | "requires_review" | "out_of_scope";

export type GovernedAction = {
  label: string;
  sourceSystem: GovernanceSourceSystem;
  status: GovernedActionStatus;
  reason: string;
};

export const governedActions: GovernedAction[] = [
  {
    label: "Read product catalog data",
    sourceSystem: "shopify_pim_demo",
    status: "allowed_now",
    reason: "Read-only access to catalog metadata is required for every recommendation."
  },
  {
    label: "Read inventory and availability",
    sourceSystem: "netsuite_deposco_demo",
    status: "allowed_now",
    reason: "Read-only stock and substitute lookups support availability-aware recommendations."
  },
  {
    label: "Read review and return signals",
    sourceSystem: "bigquery_demo",
    status: "allowed_now",
    reason: "Read-only access to aggregated review/return themes informs business-impact framing."
  },
  {
    label: "Log friction and feedback events",
    sourceSystem: "internal",
    status: "allowed_now",
    reason: "Capturing rep feedback is the core mechanism for surfacing operating signals."
  },
  {
    label: "Open a metadata review ticket",
    sourceSystem: "jira_ai_council_demo",
    status: "requires_review",
    reason: "Filing a ticket to close a catalog gap should be confirmed by a human before it's created."
  },
  {
    label: "Create a training card from a friction theme",
    sourceSystem: "jira_ai_council_demo",
    status: "requires_review",
    reason: "Training content should be reviewed by a human before it's published to reps."
  },
  {
    label: "Write or adjust inventory levels",
    sourceSystem: "netsuite_deposco_demo",
    status: "out_of_scope",
    reason: "Inventory writes stay with NetSuite/Deposco as the system of record."
  },
  {
    label: "Alter catalog or product metadata",
    sourceSystem: "shopify_pim_demo",
    status: "out_of_scope",
    reason: "Catalog edits stay with Shopify/PIM as the system of record."
  },
  {
    label: "Place or modify orders",
    sourceSystem: "netsuite_deposco_demo",
    status: "out_of_scope",
    reason: "Order management is outside this assistant's scope."
  },
  {
    label: "Issue refunds",
    sourceSystem: "netsuite_deposco_demo",
    status: "out_of_scope",
    reason: "Refund processing is outside this assistant's scope."
  }
];
