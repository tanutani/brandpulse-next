import { z } from "zod";

import type { DecisionBlocker, RouteDecision } from "./decision";
import type { GateAssessment, HumanDecision, OpportunityContract } from "./opportunity";

export const PORTFOLIO_SCOPES = ["national", "four_city"] as const;
export const ASSET_MODES = ["unlicensed_match_footage", "rights_safe_creator"] as const;
export type PortfolioScope = (typeof PORTFOLIO_SCOPES)[number];
export type AssetMode = (typeof ASSET_MODES)[number];

export interface PermissionInputs {
  brandId: string;
  brandMeaning: number;
  audienceOverlap: number;
  distinctiveAssetFit: number;
  historicalCredibility: number;
  portfolioDistinctiveness: number;
  culturalClaimsSafety: number;
  portfolioConflictPenalty: number;
  evidenceIds: string[];
  blockers: DecisionBlocker[];
}

export interface PreparednessInputs {
  brandId: string;
  scope: PortfolioScope;
  assetMode: AssetMode;
  productClaimAvailability: number;
  inventoryService: number;
  channelCoverage: number;
  creatorAgencyReadiness: number;
  rightsLegalApproval: number;
  measurementReadiness: number;
  evidenceIds: string[];
  blockers: DecisionBlocker[];
}

export interface PortfolioCandidateInputs {
  brandId: string;
  displayName: string;
  proof: GateAssessment;
  permission: PermissionInputs;
  preparedness: PreparednessInputs;
  portfolioConflicts: string[];
}

export interface PortfolioCandidateResult {
  brandId: string;
  displayName: string;
  proof: GateAssessment;
  permission: GateAssessment;
  preparedness: GateAssessment;
  readiness: number;
  decision: RouteDecision;
  blockers: DecisionBlocker[];
  portfolioConflicts: string[];
}

export interface PortfolioResolution {
  rulesetVersion: "portfolio-1.0.0";
  scope: PortfolioScope;
  assetMode: AssetMode;
  selectedBrandId: string;
  candidates: PortfolioCandidateResult[];
}

export const SprintRegistrationSchema = z
  .object({
    schemaVersion: z.literal("1.0.0"),
    id: z.string().min(1),
    hypothesis: z.string().min(1),
    treatmentCells: z.array(z.string()).min(1),
    comparisonCells: z.array(z.string()).min(1),
    channel: z.literal("q_commerce"),
    budgetCapInr: z.number().positive().max(500_000),
    primaryMetric: z.literal("incremental q-commerce conversion"),
    guardrailMetrics: z.array(z.string()).min(1),
    measurementWindow: z.object({
      start: z.iso.datetime({ offset: true }),
      end: z.iso.datetime({ offset: true }),
    }).strict(),
    scaleThreshold: z.object({ incrementalEffectAtLeast: z.number() }).strict(),
    killThreshold: z.object({
      incrementalEffectBelow: z.number(),
      serviceLevelBelow: z.number().min(0).max(1),
    }).strict(),
    comparabilityScore: z.number().int().min(0).max(100),
    validationStatus: z.enum(["draft", "valid", "blocked"]),
    lockedAt: z.iso.datetime({ offset: true }).nullable(),
  })
  .strict();

export type SprintRegistration = z.infer<typeof SprintRegistrationSchema>;

export interface SprintValidation {
  valid: boolean;
  errors: string[];
}

export const POLICY_STATUSES = ["pass", "fail"] as const;
export type PolicyStatus = (typeof POLICY_STATUSES)[number];

export const ActivationVariantSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  channel: z.string().min(1),
  copy: z.string().min(1),
  usesMatchFootage: z.boolean(),
  rightsStatus: z.enum(["unavailable", "cleared_for_demo"]),
  claim: z.string(),
  disclosure: z.string(),
  inclusionSafe: z.boolean(),
  rightsExpiresAt: z.iso.datetime({ offset: true }).nullable(),
}).strict();

export type ActivationVariant = z.infer<typeof ActivationVariantSchema>;

export interface PolicyCheck {
  ruleId: string;
  status: PolicyStatus;
  message: string;
  remediation: string | null;
}

export interface ApprovalRequest {
  actor: "brand_legal_checker";
  actorDisplayName: string;
  rationale: string;
  reviewedContractVersion: number;
  currentContractVersion: number;
  checks: PolicyCheck[];
  decidedAt: string;
}

export interface SyntheticOutcome {
  id: string;
  sprintId: string;
  observedAt: string;
  primaryMetric: string;
  treatmentRate: number;
  comparisonRate: number;
  incrementalEffect: number;
  confidenceInterval: { lower: number; upper: number };
  serviceLevelGuardrail: number;
  synthetic: true;
}

export interface OutcomeEvaluation extends SyntheticOutcome {
  decision: "scale" | "iterate" | "kill" | "inconclusive";
  reasonCodes: string[];
}

export interface LearningLedgerEntry {
  schemaVersion: "1.0.0";
  contractId: string;
  contractVersion: number;
  hypothesis: string;
  selectedBrandId: string;
  scopeChange: { from: "national"; to: PortfolioScope };
  sprint: SprintRegistration;
  policyChecks: PolicyCheck[];
  approval: HumanDecision;
  outcome: OutcomeEvaluation;
  recordedAt: string;
}

export const JourneyStateSchema = z.object({
  storageVersion: z.literal("1.0.0"),
  contractId: z.string(),
  contractVersion: z.number().int().min(1),
  scope: z.enum(PORTFOLIO_SCOPES),
  assetMode: z.enum(ASSET_MODES),
  selectedBrandId: z.string(),
  sprint: SprintRegistrationSchema.nullable(),
  selectedVariantId: z.string().nullable(),
  decisions: z.array(z.object({
    id: z.string(),
    actor: z.string(),
    decision: z.enum(["approve_test", "request_changes", "watch", "reject", "override"]),
    rationale: z.string().min(1),
    decidedAt: z.iso.datetime({ offset: true }),
    contractVersion: z.number().int().min(1),
  }).strict()),
  outcome: z.record(z.string(), z.unknown()).nullable(),
}).strict();

export type JourneyState = z.infer<typeof JourneyStateSchema>;

export interface LedgerAssemblyInputs {
  contract: OpportunityContract;
  scope: PortfolioScope;
  sprint: SprintRegistration;
  policyChecks: PolicyCheck[];
  approval: HumanDecision;
  outcome: OutcomeEvaluation;
  recordedAt: string;
}
