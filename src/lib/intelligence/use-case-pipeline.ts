export type WorkflowStatus = "approved_pilot" | "approved_workflow" | "required_platform";
export type ActionMode = "read_only" | "triage_and_review" | "control_layer";
export type RiskLevel = "low" | "medium" | "high";
export type PipelineStage = "discovery" | "sandbox_build" | "review" | "pilot_candidate" | "graduated";

export type PointPerson = {
  name: string;
  role: string;
  initials: string;
};

export type GateChecklistStatus = "complete" | "in_progress" | "required" | "blocked";
export type GateChecklistItem = {
  label: string;
  status: GateChecklistStatus;
};

export type ArtifactStatus = "not_started" | "draft" | "needs_review" | "approved" | "required";
export type Artifact = {
  name: string;
  type: string;
  status: ArtifactStatus;
  owner: string;
  lastUpdated: string;
};

export type PipelineGovernanceStatus = "allowed_now" | "requires_review" | "out_of_scope";

export type ApprovedWorkflow = {
  id: string;
  name: string;
  audience: string;
  purpose: string;
  sourceSystems: string[];
  actionMode: ActionMode;
  riskLevel: RiskLevel;
  status: WorkflowStatus;
};

export type PipelineIdea = {
  id: string;
  useCase: string;
  owner: string;
  stage: PipelineStage;
  risk: RiskLevel;
  sourceSystems: string[];
  nextGate: string;
  problemStatement: string;
  intendedUsers: string;
  dataSensitivity: string;
  actionPermissions: string;
  dependencyReview: string;
  acceptanceCriteria: string[];
  evalRequirements: string;
  productionPath: string;
  governanceNotes: string;
  pointPerson: PointPerson;
  lifecycleStep: number;
  gateChecklist: GateChecklistItem[];
  artifacts: Artifact[];
  lastReviewed: string;
  governanceStatus: PipelineGovernanceStatus;
};

export const LIFECYCLE_STEPS = [
  { id: "intake", label: "Intake" },
  { id: "discovery", label: "Discovery" },
  { id: "sandbox_build", label: "Sandbox Build" },
  { id: "review", label: "Review" },
  { id: "pilot", label: "Pilot" },
  { id: "graduated", label: "Graduated" },
] as const;

// Canonical map — seeded lifecycleStep values must match these.
export const STAGE_TO_LIFECYCLE_STEP: Record<PipelineStage, number> = {
  discovery: 2,
  sandbox_build: 3,
  review: 4,
  pilot_candidate: 5,
  graduated: 6,
};

export const WORKFLOW_STATUS_LABEL: Record<WorkflowStatus, string> = {
  approved_pilot: "Approved Pilot",
  approved_workflow: "Approved Workflow",
  required_platform: "Required Platform Layer"
};

export const WORKFLOW_STATUS_TONE: Record<WorkflowStatus, string> = {
  approved_pilot: "badge-warn",
  approved_workflow: "badge-good",
  required_platform: "badge-best"
};

export const ACTION_MODE_LABEL: Record<ActionMode, string> = {
  read_only: "Read-only",
  triage_and_review: "Triage & review",
  control_layer: "Control layer"
};

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High"
};

export const RISK_LEVEL_TONE: Record<RiskLevel, string> = {
  low: "badge-neutral",
  medium: "badge-warn",
  high: "badge-bad"
};

export const STAGE_LABEL: Record<PipelineStage, string> = {
  discovery: "Discovery",
  sandbox_build: "Sandbox Build",
  review: "Review",
  pilot_candidate: "Pilot Candidate",
  graduated: "Graduated"
};

export const STAGE_TONE: Record<PipelineStage, string> = {
  discovery: "badge-neutral",
  sandbox_build: "badge-warn",
  review: "badge-warn",
  pilot_candidate: "badge-good",
  graduated: "badge-best"
};

export const GATE_ITEM_ICON: Record<GateChecklistStatus, string> = {
  complete: "✓",
  in_progress: "◎",
  required: "○",
  blocked: "✗",
};

export const GATE_ITEM_TONE: Record<GateChecklistStatus, string> = {
  complete: "badge-good",
  in_progress: "badge-warn",
  required: "badge-neutral",
  blocked: "badge-bad",
};

export const GATE_ITEM_LABEL: Record<GateChecklistStatus, string> = {
  complete: "Complete",
  in_progress: "In progress",
  required: "Required",
  blocked: "Blocked",
};

export const ARTIFACT_STATUS_LABEL: Record<ArtifactStatus, string> = {
  not_started: "Not started",
  draft: "Draft",
  needs_review: "Needs review",
  approved: "Approved",
  required: "Required",
};

export const ARTIFACT_STATUS_TONE: Record<ArtifactStatus, string> = {
  not_started: "badge-neutral",
  draft: "badge-warn",
  needs_review: "badge-warn",
  approved: "badge-good",
  required: "badge-neutral",
};

export const PIPELINE_GOVERNANCE_LABEL: Record<PipelineGovernanceStatus, string> = {
  allowed_now: "Allowed",
  requires_review: "Requires review",
  out_of_scope: "Out of scope",
};

export const PIPELINE_GOVERNANCE_TONE: Record<PipelineGovernanceStatus, string> = {
  allowed_now: "badge-good",
  requires_review: "badge-warn",
  out_of_scope: "badge-bad",
};

export const APPROVED_WORKFLOWS: ApprovedWorkflow[] = [
  {
    id: "store-product-guidance",
    name: "Store Product Guidance",
    audience: "Store teams",
    purpose: "Turn customer needs into grounded product recommendations",
    sourceSystems: ["Catalog", "Availability", "Rep feedback"],
    actionMode: "read_only",
    riskLevel: "low",
    status: "approved_pilot"
  },
  {
    id: "ai-use-case-operations",
    name: "AI Use Case Operations",
    audience: "Business Ops",
    purpose: "Convert friction signals into an operating queue",
    sourceSystems: ["Catalog", "Inventory", "Rep feedback", "Review themes", "Governance"],
    actionMode: "triage_and_review",
    riskLevel: "low",
    status: "approved_workflow"
  },
  {
    id: "catalog-readiness",
    name: "Catalog Readiness",
    audience: "Merchandising / Business Ops",
    purpose: "Identify metadata gaps that weaken AI guidance",
    sourceSystems: ["Shopify/PIM"],
    actionMode: "read_only",
    riskLevel: "low",
    status: "approved_workflow"
  },
  {
    id: "inventory-signals",
    name: "Inventory Signals",
    audience: "Operations",
    purpose: "Surface availability and substitute risks",
    sourceSystems: ["NetSuite/Deposco"],
    actionMode: "read_only",
    riskLevel: "low",
    status: "approved_workflow"
  },
  {
    id: "governance",
    name: "Governance",
    audience: "Tech / AI Council / Business Ops",
    purpose: "Define allowed, review-required, and blocked AI actions",
    sourceSystems: ["Policy"],
    actionMode: "control_layer",
    riskLevel: "low",
    status: "required_platform"
  }
];

export const PIPELINE_IDEAS: PipelineIdea[] = [
  {
    id: "crm-workflow-exploration",
    useCase: "CRM workflow exploration",
    owner: "Business Ops",
    stage: "discovery",
    risk: "high",
    sourceSystems: ["CRM", "Customer data", "Order history", "Support workflows"],
    nextGate: "Buy-vs-build review",
    problemStatement:
      "Identify which BRUNT-specific customer relationship workflows are worth owning in-house versus staying with the current vendor. This is not a CRM build. It is a buy-vs-build signal.",
    intendedUsers: "Business Ops, leadership",
    dataSensitivity:
      "High. Customer data and order history require access controls, audit logging, and legal review before any in-house processing.",
    actionPermissions:
      "Discovery only. No write actions, integrations, or data movement until buy-vs-build review clears.",
    dependencyReview:
      "Not started. External CRM vendor evaluation, contract review, and data residency analysis required before any scoping.",
    acceptanceCriteria: [
      "Buy-vs-build decision documented and signed off",
      "BRUNT-specific workflows identified and scoped separately from commodity CRM features",
      "Data sensitivity review complete",
      "No overlap with existing vendor contracts"
    ],
    evalRequirements:
      "Structured decision framework with clear criteria for what qualifies as a BRUNT-specific workflow worth owning.",
    productionPath:
      "If approved, workflows graduate into CrewGuide individually, not as a monolithic CRM replacement.",
    governanceNotes:
      "Commodity CRM features should stay bought unless there is a clear strategic reason to own them. The pipeline evaluates whether specific BRUNT workflows are unique enough to graduate into CrewGuide.",
    pointPerson: { name: "Morgan Lee", role: "Business Ops Lead", initials: "ML" },
    lifecycleStep: 2,
    gateChecklist: [
      { label: "Business owner assigned", status: "complete" },
      { label: "Workflow map drafted", status: "in_progress" },
      { label: "Current vendor contract reviewed", status: "required" },
      { label: "Data sensitivity reviewed", status: "required" },
      { label: "Buy-vs-build criteria written", status: "in_progress" },
      { label: "Decision memo prepared", status: "required" },
    ],
    artifacts: [
      { name: "Discovery brief", type: "Brief", status: "draft", owner: "Morgan Lee", lastUpdated: "2026-06-01" },
      { name: "Buy-vs-build memo", type: "Memo", status: "draft", owner: "Morgan Lee", lastUpdated: "2026-06-05" },
      { name: "Source-system map", type: "Map", status: "not_started", owner: "N/A", lastUpdated: "N/A" },
      { name: "Data sensitivity review", type: "Review", status: "not_started", owner: "N/A", lastUpdated: "N/A" },
      { name: "Eval plan", type: "Plan", status: "not_started", owner: "N/A", lastUpdated: "N/A" },
    ],
    lastReviewed: "2026-06-05",
    governanceStatus: "requires_review",
  },
  {
    id: "returns-reason-summarizer",
    useCase: "Returns reason summarizer",
    owner: "Customer Experience",
    stage: "sandbox_build",
    risk: "medium",
    sourceSystems: ["Reviews", "Returns data", "Support notes"],
    nextGate: "Data sensitivity review",
    problemStatement:
      "Summarize return reason patterns across products to surface recurring issues that reps and merchandising teams can act on.",
    intendedUsers: "Customer Experience, Merchandising",
    dataSensitivity:
      "Medium. Return data may include customer PII and should be aggregated before AI processing.",
    actionPermissions:
      "Read-only summary. No write actions, no direct customer contact.",
    dependencyReview:
      "Returns data access needs IT approval. No OSS dependencies beyond existing stack.",
    acceptanceCriteria: [
      "Summaries are accurate against source return records",
      "PII stripped before AI processing",
      "Output reviewed by Customer Experience team before wider use"
    ],
    evalRequirements: "Eval set of 20+ return reason clusters tested against known patterns.",
    productionPath:
      "NetSuite or returns platform integration. Summaries surfaced in CrewGuide AI Use Case Operations queue.",
    governanceNotes:
      "Requires review before production. Data sensitivity and PII handling must be confirmed.",
    pointPerson: { name: "Alex Chen", role: "CX Lead", initials: "AC" },
    lifecycleStep: 3,
    gateChecklist: [
      { label: "Sandbox build initiated", status: "complete" },
      { label: "Returns data access secured", status: "in_progress" },
      { label: "PII aggregation approach defined", status: "required" },
      { label: "IT approval for data access", status: "blocked" },
      { label: "Sample output reviewed by CX team", status: "required" },
    ],
    artifacts: [
      { name: "Discovery brief", type: "Brief", status: "approved", owner: "Alex Chen", lastUpdated: "2026-05-15" },
      { name: "Source-system map", type: "Map", status: "draft", owner: "Alex Chen", lastUpdated: "2026-05-20" },
      { name: "Data sensitivity review", type: "Review", status: "needs_review", owner: "IT / Legal", lastUpdated: "2026-06-01" },
      { name: "OSS / dependency review", type: "Review", status: "approved", owner: "IT", lastUpdated: "2026-05-28" },
      { name: "Eval plan", type: "Plan", status: "not_started", owner: "N/A", lastUpdated: "N/A" },
    ],
    lastReviewed: "2026-06-08",
    governanceStatus: "requires_review",
  },
  {
    id: "training-card-generator",
    useCase: "Training card generator",
    owner: "Store Enablement",
    stage: "review",
    risk: "medium",
    sourceSystems: ["Rep feedback", "Catalog gaps", "Approved product guidance"],
    nextGate: "Human review workflow",
    problemStatement:
      "Generate structured training cards from recurring rep feedback patterns and catalog gaps, so store enablement teams spend less time manually authoring training content.",
    intendedUsers: "Store Enablement, store managers",
    dataSensitivity:
      "Low. Input is aggregated rep feedback and catalog data already in CrewGuide.",
    actionPermissions:
      "Read-only generation. Human review required before any card is published or distributed.",
    dependencyReview:
      "No new dependencies. Uses existing CrewGuide feedback log and catalog data.",
    acceptanceCriteria: [
      "Generated cards reviewed and approved by Store Enablement before use",
      "Cards reflect real catalog gaps, not hallucinated content",
      "Human-in-the-loop review workflow documented"
    ],
    evalRequirements:
      "Structured eval comparing generated cards against manually authored baseline.",
    productionPath:
      "Integration with internal training platform after review workflow is defined.",
    governanceNotes:
      "Requires human review workflow before any content is distributed. AI generates; humans approve.",
    pointPerson: { name: "Sam Torres", role: "Store Enablement Manager", initials: "ST" },
    lifecycleStep: 4,
    gateChecklist: [
      { label: "Human review workflow documented", status: "complete" },
      { label: "Store Enablement sign-off", status: "in_progress" },
      { label: "Sample cards reviewed by managers", status: "in_progress" },
      { label: "No hallucinated content confirmed", status: "complete" },
      { label: "Publishing and distribution controls defined", status: "required" },
    ],
    artifacts: [
      { name: "Discovery brief", type: "Brief", status: "approved", owner: "Sam Torres", lastUpdated: "2026-04-10" },
      { name: "Source-system map", type: "Map", status: "approved", owner: "Sam Torres", lastUpdated: "2026-04-15" },
      { name: "Data sensitivity review", type: "Review", status: "approved", owner: "IT", lastUpdated: "2026-04-20" },
      { name: "Eval plan", type: "Plan", status: "needs_review", owner: "Sam Torres", lastUpdated: "2026-05-30" },
      { name: "Human review workflow doc", type: "Doc", status: "draft", owner: "Sam Torres", lastUpdated: "2026-06-02" },
      { name: "Pilot acceptance criteria", type: "Doc", status: "draft", owner: "Sam Torres", lastUpdated: "2026-06-07" },
    ],
    lastReviewed: "2026-06-10",
    governanceStatus: "requires_review",
  },
  {
    id: "store-follow-up-assistant",
    useCase: "Store follow-up assistant",
    owner: "Retail Ops",
    stage: "discovery",
    risk: "medium",
    sourceSystems: ["Customer questions", "Product recommendation history"],
    nextGate: "Workflow mapping",
    problemStatement:
      "Help store reps follow up with customers who had open or unresolved product questions at point of sale.",
    intendedUsers: "Store reps, Retail Ops",
    dataSensitivity:
      "Medium. Customer contact information and purchase history require access controls.",
    actionPermissions:
      "Discovery only. No outbound contact or write actions until workflow mapping and review are complete.",
    dependencyReview:
      "Not started. Requires assessment of customer data access, contact channel, and opt-in requirements.",
    acceptanceCriteria: [
      "Customer contact scope and channel defined",
      "Opt-in requirements reviewed by legal",
      "Rep workflow and escalation path documented"
    ],
    evalRequirements:
      "Pilot with 2–3 reps before wider rollout. Structured feedback collection required.",
    productionPath:
      "Would integrate with customer contact channel (email, SMS platform) after legal review and workflow mapping.",
    governanceNotes:
      "Any outbound contact requires explicit legal and compliance review. Discovery phase only.",
    pointPerson: { name: "Dana Kim", role: "Retail Ops Director", initials: "DK" },
    lifecycleStep: 2,
    gateChecklist: [
      { label: "Problem statement defined", status: "complete" },
      { label: "End-to-end workflow mapped", status: "required" },
      { label: "Legal opt-in requirements reviewed", status: "required" },
      { label: "Customer data access scoped", status: "required" },
      { label: "Rep pilot candidate identified", status: "required" },
    ],
    artifacts: [
      { name: "Discovery brief", type: "Brief", status: "draft", owner: "Dana Kim", lastUpdated: "2026-06-03" },
      { name: "Source-system map", type: "Map", status: "not_started", owner: "N/A", lastUpdated: "N/A" },
      { name: "Data sensitivity review", type: "Review", status: "not_started", owner: "N/A", lastUpdated: "N/A" },
      { name: "Legal opt-in review", type: "Review", status: "not_started", owner: "N/A", lastUpdated: "N/A" },
      { name: "Eval plan", type: "Plan", status: "not_started", owner: "N/A", lastUpdated: "N/A" },
    ],
    lastReviewed: "2026-06-03",
    governanceStatus: "requires_review",
  },
  {
    id: "inventory-substitute-recommender",
    useCase: "Inventory substitute recommender",
    owner: "Operations",
    stage: "pilot_candidate",
    risk: "medium",
    sourceSystems: ["NetSuite/Deposco", "Catalog"],
    nextGate: "Eval pass + human approval",
    problemStatement:
      "When an item is low stock or not stocked, recommend an in-stock substitute that meets the same customer need, based on catalog attributes and availability data.",
    intendedUsers: "Store reps, Operations",
    dataSensitivity:
      "Low. Inventory and catalog data only. No customer data required.",
    actionPermissions:
      "Read-only recommendations. Reps choose whether to present the substitute.",
    dependencyReview:
      "Existing demo inventory and catalog data in CrewGuide. Production would require NetSuite/Deposco integration.",
    acceptanceCriteria: [
      "Substitutes are attribute-matched, not random",
      "In-stock status confirmed before recommendation",
      "Eval set covers low-stock and not-stocked scenarios"
    ],
    evalRequirements:
      "10+ product pairs with known substitutes. Pass rate ≥ 80% on attribute match before pilot.",
    productionPath:
      "NetSuite/Deposco real-time inventory integration. Substitute logic reviewed by Operations before pilot.",
    governanceNotes:
      "Allowed now in demo context. Production requires data integration review and eval pass.",
    pointPerson: { name: "Jordan Reyes", role: "Operations Manager", initials: "JR" },
    lifecycleStep: 5,
    gateChecklist: [
      { label: "Attribute-match eval set defined", status: "complete" },
      { label: "10+ product pairs validated", status: "complete" },
      { label: "Pass rate ≥ 80% confirmed", status: "in_progress" },
      { label: "Operations review complete", status: "in_progress" },
      { label: "Human approval obtained", status: "required" },
    ],
    artifacts: [
      { name: "Discovery brief", type: "Brief", status: "approved", owner: "Jordan Reyes", lastUpdated: "2026-03-10" },
      { name: "Source-system map", type: "Map", status: "approved", owner: "Jordan Reyes", lastUpdated: "2026-03-15" },
      { name: "Data sensitivity review", type: "Review", status: "approved", owner: "IT", lastUpdated: "2026-03-20" },
      { name: "Eval plan", type: "Plan", status: "approved", owner: "Jordan Reyes", lastUpdated: "2026-04-01" },
      { name: "Pilot acceptance criteria", type: "Doc", status: "needs_review", owner: "Jordan Reyes", lastUpdated: "2026-05-30" },
      { name: "OSS / dependency review", type: "Review", status: "approved", owner: "IT", lastUpdated: "2026-03-22" },
    ],
    lastReviewed: "2026-06-11",
    governanceStatus: "allowed_now",
  },
];
