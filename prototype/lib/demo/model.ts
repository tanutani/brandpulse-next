export const HERO_OPPORTUNITY_ID = "opp-extra-time-sweat-confidence";

export type DemoStepId = "understand" | "choose" | "test" | "approve";

export interface DemoStep {
  id: DemoStepId;
  number: number;
  label: string;
  plainLanguage: string;
  href: string;
}

export interface ModelStage {
  id: string;
  label: string;
  question: string;
  explanation: string;
  exampleInputs: string[];
  output: string;
}

export interface ProductionConnection {
  stage: string;
  proposedInterface: string;
  accessPattern: string;
  dataAccess: string;
  decisionUse: string;
  prototypeSubstitute: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: "understand",
    number: 1,
    label: "Understand the opportunity",
    plainLanguage: "Check whether the signal is credible or only attention.",
    href: `/opportunities/${HERO_OPPORTUNITY_ID}`,
  },
  {
    id: "choose",
    number: 2,
    label: "Choose brand and scope",
    plainLanguage: "Find the brand that fits and the market that can execute.",
    href: `/resolver/${HERO_OPPORTUNITY_ID}`,
  },
  {
    id: "test",
    number: 3,
    label: "Lock the experiment",
    plainLanguage: "Fix the budget and success rules before seeing a result.",
    href: `/sprint/${HERO_OPPORTUNITY_ID}`,
  },
  {
    id: "approve",
    number: 4,
    label: "Approve and learn",
    plainLanguage: "Block unsafe work, record approval, and retain the outcome.",
    href: `/review/${HERO_OPPORTUNITY_ID}`,
  },
];

export const MODEL_STAGES: ModelStage[] = [
  {
    id: "signals",
    label: "Market signals",
    question: "What is changing?",
    explanation: "Bring dated observations and internal operating signals into one decision record.",
    exampleInputs: ["Search and news", "Consumer language", "Commerce and stock"],
    output: "Evidence chain",
  },
  {
    id: "gates",
    label: "Three decision gates",
    question: "Is it real, ownable, and executable?",
    explanation: "The lowest of Proof, Permission, and Preparedness sets readiness; a hard blocker always wins.",
    exampleInputs: ["Proof", "Permission", "Preparedness"],
    output: "Readiness",
  },
  {
    id: "route",
    label: "Decision route",
    question: "What should the team do next?",
    explanation: "Transparent rules return Act, Test, Incubate, Watch, or Ignore with reason codes.",
    exampleInputs: ["Scores", "Useful window", "Blockers"],
    output: "Next action",
  },
  {
    id: "experiment",
    label: "Safe experiment",
    question: "What is the smallest useful test?",
    explanation: "Lock cells, budget, metric, guardrails, and scale or kill rules before results appear.",
    exampleInputs: ["Treatment cells", "₹5 lakh cap", "Scale and kill rules"],
    output: "Causal Sprint",
  },
  {
    id: "approval",
    label: "Human approval",
    question: "Is the current package safe to run?",
    explanation: "Rights and policy checks must pass before an accountable reviewer can approve the current version.",
    exampleInputs: ["Rights", "Claims", "Disclosure"],
    output: "Approved package",
  },
  {
    id: "learning",
    label: "Learning",
    question: "What should the organization remember?",
    explanation: "Compare the synthetic outcome only with the rules locked before exposure and retain the full history.",
    exampleInputs: ["Lift", "Service level", "Human decision"],
    output: "Learning Ledger",
  },
];

export const PRODUCTION_CONNECTIONS: ProductionConnection[] = [
  {
    stage: "Detect and prove",
    proposedInterface: "SignalObservation[]",
    accessPattern: "Inbound events or scheduled read",
    dataAccess: "Social listening, search trends, news events, and approved web-observation feeds.",
    decisionUse: "Measures velocity, persistence, diffusion, freshness, and source independence.",
    prototypeSubstitute: "Three dated public links plus checked-in snapshots.",
  },
  {
    stage: "Understand people",
    proposedInterface: "ConsumerNeedAggregate[]",
    accessPattern: "Permissioned read-only query",
    dataAccess: "Consent-scoped consumer research, first-party CRM cohorts, and queryable insight repositories.",
    decisionUse: "Tests whether attention reflects a recognizable need and priority audience.",
    prototypeSubstitute: "Invented aggregate consumer-connect records.",
  },
  {
    stage: "Verify behavior",
    proposedInterface: "CommerceCellMetric[]",
    accessPattern: "Scheduled read plus outcome events",
    dataAccess: "Q-commerce, e-commerce, search, basket, off-take, and campaign-performance aggregates.",
    decisionUse: "Separates curiosity from progression toward purchase and later measures incrementality.",
    prototypeSubstitute: "Invented city-level commerce and conversion fixtures.",
  },
  {
    stage: "Check execution",
    proposedInterface: "InventoryReadiness[]",
    accessPattern: "Read snapshot or readiness event",
    dataAccess: "SKU-by-city inventory, days cover, service level, channel availability, and demand sensing.",
    decisionUse: "Calculates Preparedness and prevents demand creation where supply cannot serve it.",
    prototypeSubstitute: "Invented inventory and service-level records for four cities.",
  },
  {
    stage: "Resolve ownership",
    proposedInterface: "BrandPolicyBundle",
    accessPattern: "Versioned read-only configuration",
    dataAccess: "Brand positioning, audiences, approved claims, taboos, distinctive assets, and active campaigns.",
    decisionUse: "Calculates Permission, exposes portfolio conflict, and selects the most credible owner.",
    prototypeSubstitute: "Versioned synthetic Rexona, Dove, and Axe brand memory.",
  },
  {
    stage: "Make content safe",
    proposedInterface: "CreatorRightsBundle",
    accessPattern: "Versioned read plus expiry events",
    dataAccess: "Creator eligibility, safety review, usage rights, expiry windows, claims, and disclosure rules.",
    decisionUse: "Blocks unavailable footage or non-compliant content and supplies exact remediation.",
    prototypeSubstitute: "One blocked and two corrected checked-in variants.",
  },
  {
    stage: "Approve and activate",
    proposedInterface: "ApprovalEvent[] / ActivationCommand",
    accessPattern: "Approval events; guarded outbound command",
    dataAccess: "Enterprise identity, maker-checker roles, legal workflow, campaign tooling, and audit lineage.",
    decisionUse: "Confirms the current version has accountable approval before a bounded activation is sent.",
    prototypeSubstitute: "Labeled demo roles and browser-local append-only decisions; nothing is published.",
  },
  {
    stage: "Measure and learn",
    proposedInterface: "ExperimentObservation[]",
    accessPattern: "Read-only metric and guardrail events",
    dataAccess: "Exposure, treatment/comparison cells, conversion, service level, cost, and contribution outcomes.",
    decisionUse: "Evaluates Scale, Iterate, or Kill only against the rules locked before exposure.",
    prototypeSubstitute: "Checked-in 1.2-point synthetic lift and 95% service result.",
  },
];
