import { z } from "zod";

import { EVIDENCE_TYPES, FRESHNESS_STATES, ROUTES } from "./enums";

export const EvidenceTypeSchema = z.enum(EVIDENCE_TYPES);
export const FreshnessSchema = z.enum(FRESHNESS_STATES);
export const RouteSchema = z.enum(ROUTES);

export const ComponentScoreSchema = z
  .object({
    name: z.string(),
    value: z.number().min(0).max(100),
    weight: z.number().min(0).max(1),
    evidenceIds: z.array(z.string()),
  })
  .strict();

export const GateAssessmentSchema = z
  .object({
    gate: z.enum(["proof", "permission", "preparedness"]),
    score: z.number().int().min(0).max(100),
    components: z.array(ComponentScoreSchema),
    blockers: z.array(z.string()),
    rulesetVersion: z.string(),
  })
  .passthrough();

export const EvidenceItemSchema = z
  .object({
    id: z.string(),
    stance: z.enum(["support", "contradict", "neutral"]),
    claim: z.string(),
    evidenceType: EvidenceTypeSchema,
    freshness: FreshnessSchema,
    sourceUrl: z.url().nullable().optional(),
  })
  .passthrough();

export const OpportunitySchema = z
  .object({
    id: z.string(),
    title: z.string(),
    hypothesis: z.string(),
    signalClass: z.enum([
      "live_moment",
      "emerging_shift",
      "durable_trend",
      "fad_noise",
      "unresolved",
    ]),
    usefulUntil: z.iso.datetime({ offset: true }),
    evidence: z.array(EvidenceItemSchema).min(1),
  })
  .passthrough();

export const BrandAssessmentSchema = z
  .object({
    brandId: z.string(),
    proof: GateAssessmentSchema,
    permission: GateAssessmentSchema,
    preparedness: GateAssessmentSchema,
    readiness: z.number().int().min(0).max(100),
    portfolioConflicts: z.array(z.string()).optional(),
  })
  .strict();

export const CausalSprintSchema = z
  .object({
    id: z.string(),
    hypothesis: z.string(),
    treatmentCells: z.array(z.string()).min(1),
    comparisonCells: z.array(z.string()).min(1),
    channel: z.string(),
    budgetCapInr: z.number().positive(),
    primaryMetric: z.string(),
    measurementWindow: z
      .object({
        start: z.iso.datetime({ offset: true }),
        end: z.iso.datetime({ offset: true }),
      })
      .strict(),
    scaleThreshold: z.object({}).passthrough(),
    killThreshold: z.object({}).passthrough(),
    validationStatus: z.enum(["draft", "valid", "blocked"]),
  })
  .passthrough();

export const HumanDecisionSchema = z
  .object({
    id: z.string(),
    actor: z.string(),
    decision: z.enum(["approve_test", "request_changes", "watch", "reject", "override"]),
    rationale: z.string().min(1),
    decidedAt: z.iso.datetime({ offset: true }),
    contractVersion: z.number().int().min(1),
  })
  .strict();

export const OpportunityContractSchema = z
  .object({
    schemaVersion: z.literal("1.0.0"),
    contractId: z.string().min(1),
    version: z.number().int().min(1),
    opportunity: OpportunitySchema,
    selectedBrandId: z.string().nullable().optional(),
    brandAssessments: z.array(BrandAssessmentSchema).min(3),
    recommendedRoute: RouteSchema,
    routeReasonCodes: z.array(z.string()).min(1),
    assumptions: z.array(
      z
        .object({
          label: z.string(),
          value: z.unknown(),
          evidenceType: EvidenceTypeSchema,
        })
        .strict(),
    ),
    causalSprint: CausalSprintSchema.nullable().optional(),
    humanDecisions: z.array(HumanDecisionSchema),
    outcome: z.object({}).passthrough().nullable().optional(),
  })
  .strict();

export type ComponentScore = z.infer<typeof ComponentScoreSchema>;
export type GateAssessment = z.infer<typeof GateAssessmentSchema>;
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
export type Opportunity = z.infer<typeof OpportunitySchema>;
export type BrandAssessment = z.infer<typeof BrandAssessmentSchema>;
export type CausalSprint = z.infer<typeof CausalSprintSchema>;
export type HumanDecision = z.infer<typeof HumanDecisionSchema>;
export type OpportunityContract = z.infer<typeof OpportunityContractSchema>;
