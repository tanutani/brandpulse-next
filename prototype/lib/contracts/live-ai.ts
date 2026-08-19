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
    /** Set by the ?static=1 URL flag. Forces the checked-in answer, no network. */
    forceStatic: z.boolean().optional(),
  })
  .strict();

export type SynthesisRequest = z.infer<typeof SynthesisRequestSchema>;

/* ---------------------------------------------------------------------------
   Live evidence extraction (GDELT)
   ------------------------------------------------------------------------ */

/**
 * One observation extracted from a live public feed.
 *
 * Deliberately the same shape as a checked-in replay event, so the signal room
 * renders live and fixture observations through one path and a failed fetch is
 * invisible to the layout. It carries no score and no route: a live observation
 * is something we noticed, never something we concluded. Nothing here reaches
 * the deterministic scoring, which stays on the frozen fixture set.
 */
export const SignalObservationSchema = z
  .object({
    id: z.string().min(1).max(80),
    offsetMs: z.number().int().min(0).max(REPLAY_DURATION_MS),
    sourceType: z.enum(SIGNAL_SOURCE_TYPES),
    label: z.string().min(1).max(80),
    detail: z.string().min(1).max(240),
    value: z.union([z.number(), z.string().min(1).max(40)]),
    evidenceIds: z.array(z.string().min(1).max(80)).min(1).max(8),
    evidenceType: z.enum(SYNTHESIS_EVIDENCE_TYPES),
    synthetic: z.boolean(),
    /** Present only on live observations, so the UI can link the real article. */
    sourceUrl: z.url().max(500).optional(),
    sourceDomain: z.string().min(1).max(120).optional(),
  })
  .strict();

export type SignalObservation = z.infer<typeof SignalObservationSchema>;

/** Exactly what the extraction model may return, before we add provenance. */
export const ObservationModelOutputSchema = z
  .object({
    observations: z
      .array(
        z
          .object({
            sourceType: z.enum(SIGNAL_SOURCE_TYPES),
            label: z.string().min(1).max(80),
            detail: z.string().min(1).max(240),
            /** Index into the article list handed to the model. */
            articleIndex: z.number().int().min(0).max(49),
          })
          .strict(),
      )
      .min(1)
      .max(6),
  })
  .strict();

export type ObservationModelOutput = z.infer<typeof ObservationModelOutputSchema>;

export const ObservationRequestSchema = z
  .object({
    opportunityId: z.string().min(1).max(120),
    evidenceVersion: z.string().min(1).max(40),
    forceStatic: z.boolean().optional(),
  })
  .strict();

export type ObservationRequest = z.infer<typeof ObservationRequestSchema>;

export const ObservationResponseSchema = z
  .object({
    mode: z.enum(["live", "fixture_fallback"]),
    observations: z.array(SignalObservationSchema).min(1),
    model: z.string().max(80).nullable(),
    /** The live query actually issued, so a judge can reproduce it. */
    query: z.string().max(240).nullable(),
    generatedAt: z.iso.datetime({ offset: true }),
    fallbackReason: z.enum(FALLBACK_REASONS).optional(),
  })
  .strict();

export type ObservationResponse = z.infer<typeof ObservationResponseSchema>;

/* ---------------------------------------------------------------------------
   The Skeptic
   ------------------------------------------------------------------------ */

export const SkepticRequestSchema = z
  .object({
    opportunityId: z.string().min(1).max(120),
    evidenceVersion: z.string().min(1).max(40),
    forceStatic: z.boolean().optional(),
  })
  .strict();

export type SkepticRequest = z.infer<typeof SkepticRequestSchema>;

/**
 * The counter-case, generated from the current evidence chain.
 *
 * Every challenge must cite approved evidence, so the Skeptic argues from the
 * same record the recommendation was built on rather than inventing doubt.
 */
export const SkepticModelOutputSchema = z
  .object({
    headline: z.string().min(1).max(160),
    challenges: z
      .array(
        z
          .object({
            claim: z.string().min(1).max(400),
            wouldChangeDecisionIf: z.string().min(1).max(240),
            evidenceIds: z.array(z.string().min(1).max(80)).min(1).max(8),
          })
          .strict(),
      )
      .min(1)
      .max(4),
  })
  .strict();

export type SkepticModelOutput = z.infer<typeof SkepticModelOutputSchema>;

export const SkepticResponseSchema = SkepticModelOutputSchema.extend({
  mode: z.enum(["live", "precomputed_fallback"]),
  model: z.string().max(80).nullable(),
  promptVersion: z.string().min(1).max(40),
  generatedAt: z.iso.datetime({ offset: true }),
  fallbackReason: z.enum(FALLBACK_REASONS).optional(),
}).strict();

export type SkepticResponse = z.infer<typeof SkepticResponseSchema>;

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
