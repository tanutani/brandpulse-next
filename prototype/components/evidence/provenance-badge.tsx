import { Beaker, Brain, Globe2, Ruler } from "lucide-react";
import type { ReactNode } from "react";

import { EVIDENCE_TYPE_LABELS, type EvidenceType } from "@/lib/contracts";

/** Colour never carries the meaning alone: each provenance also has an icon and a word. */
const ICONS: Record<EvidenceType, ReactNode> = {
  public: <Globe2 aria-hidden="true" size={11} />,
  synthetic_internal: <Beaker aria-hidden="true" size={11} />,
  model_inference: <Brain aria-hidden="true" size={11} />,
  business_assumption: <Ruler aria-hidden="true" size={11} />,
};

export function ProvenanceBadge({ type, label }: { type: EvidenceType; label?: string }) {
  return (
    <span className={`badge badge-${type}`}>
      {ICONS[type]} {label ?? EVIDENCE_TYPE_LABELS[type]}
    </span>
  );
}
