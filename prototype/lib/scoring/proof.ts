import type { ComponentScore, GateAssessment, ProofInputs } from "@/lib/contracts";
import { P3_RULESET_VERSION, P3_WEIGHTS, PENALTY_LIMITS } from "./config";

type ComponentName = keyof typeof P3_WEIGHTS.proof;
const COMPONENTS = Object.keys(P3_WEIGHTS.proof) as ComponentName[];

export interface ProofPenalty {
  code: "SOURCE_CONCENTRATION" | "MANIPULATION_RISK";
  normalizedRisk: number;
  cap: number;
  points: number;
}

export type ProofAssessment = GateAssessment & { baseScore: number; penalties: ProofPenalty[] };

const clamp = (value: number) =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

export function calculateNormalizedPenalty(risk: number, cap: number): number {
  return (clamp(risk) / 100) * Math.max(0, cap);
}

export function calculateBaseProof(inputs: ProofInputs): number {
  return Math.round(
    COMPONENTS.reduce((sum, name) => sum + clamp(inputs[name]) * P3_WEIGHTS.proof[name], 0),
  );
}

/**
 * True when a stored gate carries the real six weighted components rather than a
 * single collapsed placeholder.
 *
 * Most checked-in assessments store one component whose value simply repeats the
 * score. Those cannot be re-scored, because the six inputs behind them were never
 * recorded. Callers that want to recompute must check this first: reading a named
 * component off a collapsed set yields undefined, and undefined arithmetic
 * silently clamps to zero rather than throwing.
 */
export function hasFullProofComponents(components: ComponentScore[]): boolean {
  if (components.length !== COMPONENTS.length) return false;
  const names = new Set(components.map(({ name }) => name));
  return COMPONENTS.every((name) => names.has(name));
}

export function calculateProof(inputs: ProofInputs): ProofAssessment {
  const evidenceIds = [...new Set(inputs.evidence.map(({ id }) => id))].sort();
  const components: ComponentScore[] = COMPONENTS.map((name) => ({
    name,
    value: clamp(inputs[name]),
    weight: P3_WEIGHTS.proof[name],
    evidenceIds,
  }));
  const baseScore = calculateBaseProof(inputs);
  const penalties: ProofPenalty[] = [
    {
      code: "SOURCE_CONCENTRATION",
      normalizedRisk: clamp(inputs.sourceConcentration),
      cap: PENALTY_LIMITS.sourceConcentrationMax,
      points: calculateNormalizedPenalty(inputs.sourceConcentration, PENALTY_LIMITS.sourceConcentrationMax),
    },
    {
      code: "MANIPULATION_RISK",
      normalizedRisk: clamp(inputs.manipulationRisk),
      cap: PENALTY_LIMITS.manipulationRiskMax,
      points: calculateNormalizedPenalty(inputs.manipulationRisk, PENALTY_LIMITS.manipulationRiskMax),
    },
  ];
  const score = Math.round(
    clamp(baseScore - penalties.reduce((sum, penalty) => sum + penalty.points, 0)),
  );

  return {
    gate: "proof",
    score,
    baseScore,
    components,
    penalties,
    blockers: [],
    rulesetVersion: P3_RULESET_VERSION,
  };
}
