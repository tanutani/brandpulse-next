export const ROUTES = ["act_now", "test", "incubate", "watch", "ignore"] as const;
export type Route = (typeof ROUTES)[number];

export const EVIDENCE_TYPES = [
  "public",
  "synthetic_internal",
  "model_inference",
  "business_assumption",
] as const;
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const PROVENANCE_LABELS = [
  "Public Observation",
  "Synthetic HUL-like Data",
  "Model Inference",
  "Business Assumption",
] as const;
export type ProvenanceLabel = (typeof PROVENANCE_LABELS)[number];

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, ProvenanceLabel> = {
  public: "Public Observation",
  synthetic_internal: "Synthetic HUL-like Data",
  model_inference: "Model Inference",
  business_assumption: "Business Assumption",
};

export const FRESHNESS_STATES = ["live", "recent", "aging", "stale"] as const;
export type Freshness = (typeof FRESHNESS_STATES)[number];

export const BLOCKER_SEVERITIES = ["advisory", "remediable", "mandatory"] as const;
export type BlockerSeverity = (typeof BLOCKER_SEVERITIES)[number];

export const WORKFLOW_EVENTS = [
  "START",
  "EVIDENCE_ASSEMBLED",
  "CHALLENGE_COMPLETED",
  "SCORING_COMPLETED",
  "ROUTE_CONFIRMED",
  "EXPERIMENT_DESIGNED",
  "READINESS_CHECKED",
  "MAKER_APPROVED",
  "OUTCOME_REQUESTED",
  "LEARNING_RECORDED",
  "EVIDENCE_INSUFFICIENT",
  "POLICY_FAILED",
  "WINDOW_EXPIRED",
  "SERVICE_FAILED",
  "RETRY",
] as const;
export type WorkflowEventType = (typeof WORKFLOW_EVENTS)[number];

export const WORKFLOW_STATES = [
  "idle",
  "assembling_evidence",
  "challenging",
  "scoring",
  "awaiting_human_route",
  "designing_experiment",
  "checking_readiness",
  "awaiting_maker_approval",
  "approved_test",
  "simulating_outcome",
  "learned",
  "insufficient_evidence",
  "policy_blocked",
  "expired",
  "service_degraded",
] as const;
export type WorkflowState = (typeof WORKFLOW_STATES)[number];
