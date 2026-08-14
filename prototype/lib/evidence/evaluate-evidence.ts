import type { EvidenceItem, Freshness } from "@/lib/contracts";

export interface AssessableEvidence extends EvidenceItem {
  observedAt: string;
  independentSourceFamily: string;
  quality: number;
}
export interface EvaluatedEvidenceItem extends AssessableEvidence { freshness: Freshness }
export interface EvidenceEvaluation {
  items: EvaluatedEvidenceItem[];
  independentSourceFamilies: string[];
  strongestSupport: EvaluatedEvidenceItem | null;
  strongestCounterEvidence: EvaluatedEvidenceItem | null;
  sourceConcentrationRisk: number;
}

const rank: Record<Freshness, number> = { live: 4, recent: 3, aging: 2, stale: 1 };
const clamp = (value: number) => Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

export function evaluateFreshness(observedAt: string, evaluatedAt: string): Freshness {
  const hours = (Date.parse(evaluatedAt) - Date.parse(observedAt)) / 3_600_000;
  if (!Number.isFinite(hours) || hours < 0) return "stale";
  if (hours <= 24) return "live";
  if (hours <= 7 * 24) return "recent";
  if (hours <= 30 * 24) return "aging";
  return "stale";
}

export function independentSourceFamilies(
  evidence: readonly Pick<AssessableEvidence, "evidenceType" | "independentSourceFamily">[],
): string[] {
  return [...new Set(evidence
    .filter(({ evidenceType }) => evidenceType !== "model_inference")
    .map(({ independentSourceFamily }) => independentSourceFamily.trim().toLocaleLowerCase("en"))
    .filter(Boolean))].sort();
}

export function calculateSourceConcentrationRisk(
  evidence: readonly Pick<AssessableEvidence, "evidenceType" | "independentSourceFamily">[],
): number {
  const observed = evidence.filter(({ evidenceType }) => evidenceType !== "model_inference");
  if (!observed.length) return 100;
  const counts = new Map<string, number>();
  for (const item of observed) {
    const family = item.independentSourceFamily.trim().toLocaleLowerCase("en") || "unknown";
    counts.set(family, (counts.get(family) ?? 0) + 1);
  }
  return Math.round((Math.max(...counts.values()) / observed.length) * 100);
}

function strongest(items: readonly EvaluatedEvidenceItem[], stance: EvidenceItem["stance"]) {
  return [...items]
    .filter((item) => item.stance === stance)
    .sort((a, b) => clamp(b.quality) - clamp(a.quality) || rank[b.freshness] - rank[a.freshness] || a.id.localeCompare(b.id, "en"))[0] ?? null;
}

export function selectStrongestCounterEvidence(items: readonly EvaluatedEvidenceItem[]) {
  return strongest(items, "contradict");
}

export function evaluateEvidence(evidence: readonly AssessableEvidence[], evaluatedAt: string): EvidenceEvaluation {
  const items = evidence.map((item) => ({
    ...item,
    quality: clamp(item.quality),
    freshness: evaluateFreshness(item.observedAt, evaluatedAt),
  }));
  return {
    items,
    independentSourceFamilies: independentSourceFamilies(items),
    strongestSupport: strongest(items, "support"),
    strongestCounterEvidence: selectStrongestCounterEvidence(items),
    sourceConcentrationRisk: calculateSourceConcentrationRisk(items),
  };
}
