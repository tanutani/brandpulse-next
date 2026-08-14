import { EVIDENCE_TYPE_LABELS, type EvidenceType } from "@/lib/contracts";

export function ProvenanceBadge({ type }: { type: EvidenceType }) {
  return <span className={`provenance-badge provenance-${type}`}>{EVIDENCE_TYPE_LABELS[type]}</span>;
}
