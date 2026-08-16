import { CheckCircle2, FlaskConical, History, Scale } from "lucide-react";

import { ProvenanceBadge } from "@/components/evidence/provenance-badge";
import type { LearningLedgerEntry } from "@/lib/contracts";

export function LearningLedger({ entry }: { entry: LearningLedgerEntry }) {
  return (
    <section className="ledger" aria-labelledby="ledger-title">
      <div className="ledger-heading">
        <div><p className="eyebrow">Learning Ledger · Contract v{entry.contractVersion}</p><h2 id="ledger-title">The decision remembers what humans and the test taught it.</h2></div>
        <ProvenanceBadge type="synthetic_internal" />
      </div>
      <div className="ledger-summary">
        <div><span>Original hypothesis</span><strong>{entry.hypothesis}</strong></div>
        <div><span>Scope decision</span><strong>National → four in-stock cities</strong></div>
      </div>
      <ol className="ledger-timeline">
        <li><History aria-hidden="true" /><div><span>Opportunity Contract</span><strong>Rexona selected · weakest-link Test route</strong><small>Evidence, counter-evidence, assumptions, and version retained.</small></div></li>
        <li><FlaskConical aria-hidden="true" /><div><span>Pre-registration</span><strong>{entry.sprint.primaryMetric} locked</strong><small>Scale at ≥1.0pp; kill on negative lift or service below 90%.</small></div></li>
        <li><CheckCircle2 aria-hidden="true" /><div><span>Maker-checker</span><strong>{entry.approval.actor} approved current v{entry.approval.contractVersion}</strong><small>{entry.approval.rationale}</small></div></li>
        <li className="ledger-result"><Scale aria-hidden="true" /><div><span>Synthetic outcome</span><strong>{(entry.outcome.incrementalEffect * 100).toFixed(1)}pp lift · {entry.outcome.decision.toUpperCase()}</strong><small>95% interval {(entry.outcome.confidenceInterval.lower * 100).toFixed(1)} to {(entry.outcome.confidenceInterval.upper * 100).toFixed(1)}pp; service level {(entry.outcome.serviceLevelGuardrail * 100).toFixed(0)}%.</small></div></li>
      </ol>
      <div className="business-value-summary">
        <span>What BrandPulse changed</span>
        <strong>Prevented unsafe national activation, redirected ₹5 lakh into a measurable four-city test, and retained the learning.</strong>
        <small>Illustrative competition outcome using synthetic HUL-like operating data.</small>
      </div>
    </section>
  );
}
