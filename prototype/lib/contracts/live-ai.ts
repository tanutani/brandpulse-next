import { z } from "zod";

/**
 * Contracts for the live signal room and the bounded Gemini synthesis boundary.
 *
 * These are additive to the frozen Day 1 contracts. Nothing here may express a
 * Proof/Permission/Preparedness value, a route, a blocker, an approval, or an
 * outcome: model output is evidence-grounded commentary, never a decision.
 */

export const SIGNAL_SOURCE_TYPES = [
  "sports_news",
  "search",
  "consumer_language",
  "commerce",
  "inventory",
  "rights",
] as const;

/** Only public snapshots and synthetic aggregates ever reach the replay or the model. */
export const SYNTHESIS_EVIDENCE_TYPES = ["public", "synthetic_internal"] as const;

export const FALLBACK_REASONS = [
  "disabled",
  "missing_key",
  "timeout",
  "quota",
  "invalid_output",
] as const;

export type SignalSourceType = (typeof SIGNAL_SOURCE_TYPES)[number];
export type SynthesisEvidenceType = (typeof SYNTHESIS_EVIDENCE_TYPES)[number];
export type FallbackReason = (typeof FALLBACK_REASONS)[number];

/** The replay is a fixed five-second window; every event must land inside it. */
export const REPLAY_DURATION_MS = 5_000;

export const SyntheticSignalEventSchema = z
  .object({
    id: z.string().min(1).max(80),
    offsetMs: z.number().int().min(0).max(REPLAY_DURATION_MS),
    sourceType: z.enum(SIGNAL_SOURCE_TYPES),
    label: z.string().min(1).max(80),
    detail: z.string().min(1).max(240),
    value: z.union([z.number(), z.string().min(1).max(40)]),
    delta: z.number().optional(),
    evidenceIds: z.array(z.string().min(1).max(80)).min(1).max(8),
    evidenceType: z.enum(SYNTHESIS_EVIDENCE_TYPES),
    synthetic: z.boolean(),
  })
  .strict();

export type SyntheticSignalEvent = z.infer<typeof SyntheticSignalEventSchema>;

export const SynthesisRequestSchema = z
  .object({
    opportunityId: z.string().min(1).max(120),
    evidenceVersion: z.string().min(1).max(40),
  })
  .strict();

export type SynthesisRequest = z.infer<typeof SynthesisRequestSchema>;

export const SynthesisThemeSchema = z
  .object({
    label: z.string().min(1).max(80),
    evidenceIds: z.array(z.string().min(1).max(80)).min(1).max(8),
  })
  .strict();

export const CounterHypothesisSchema = z
  .object({
    claim: z.string().min(1).max(400),
    evidenceIds: z.array(z.string().min(1).max(80)).min(1).max(8),
  })
  .strict();

/**
 * Exactly what the provider is allowed to return. `.strict()` rejects any
 * additional field, so a model cannot smuggle a score, route, or approval
 * through an unexpected key.
 */
export const SynthesisModelOutputSchema = z
  .object({
    summary: z.string().min(1).max(600),
    themes: z.array(SynthesisThemeSchema).min(1).max(4),
    counterHypothesis: CounterHypothesisSchema,
    missingEvidence: z.array(z.string().min(1).max(160)).max(4),
  })
  .strict();

export type SynthesisModelOutput = z.infer<typeof SynthesisModelOutputSchema>;

export const SynthesisResponseSchema = SynthesisModelOutputSchema.extend({
  mode: z.enum(["live", "precomputed_fallback"]),
  model: z.string().max(80).nullable(),
  promptVersion: z.string().min(1).max(40),
  generatedAt: z.iso.datetime({ offset: true }),
  fallbackReason: z.enum(FALLBACK_REASONS).optional(),
}).strict();

export type SynthesisResponse = z.infer<typeof SynthesisResponseSchema>;

/** Evidence shape handed to the provider. Deliberately has no score or route field. */
export interface SynthesisEvidenceRecord {
  id: string;
  claim: string;
  stance: "support" | "contradict" | "neutral";
  evidenceType: SynthesisEvidenceType;
  freshness: string;
  geography: string;
}
