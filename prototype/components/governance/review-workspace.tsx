"use client";

import { Check, Eye, LockKeyhole, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { activationPackageFixture } from "@/lib/activation/draft-package";
import { LearningLedger } from "@/components/governance/learning-ledger";
import type { JourneyState, OpportunityContract } from "@/lib/contracts";
import { evaluateOutcome } from "@/lib/experiment/evaluate-outcome";
import { heroSyntheticOutcome } from "@/lib/fixtures/synthetic-result";
import { approveCurrentVersion, hasCurrentVersionApproval } from "@/lib/governance/approve-contract";
import { buildLedgerEntry } from "@/lib/learning/build-ledger-entry";
import { LocalContractStore } from "@/lib/persistence/local-contract-store";
import { LocalJourneyStore } from "@/lib/persistence/local-journey-store";
import { evaluateActivationVariant, policyChecksPass } from "@/lib/policies/evaluate-package";

const evaluatedAt = "2026-08-15T12:20:00.000Z";

export function ReviewWorkspace({ contract }: { contract: OpportunityContract }) {
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = new LocalJourneyStore(window.localStorage).load();
    queueMicrotask(() => { setJourney(stored); setReady(true); });
  }, []);

  const selectedId = journey?.selectedVariantId ?? activationPackageFixture.variants[0].id;
  const selected = activationPackageFixture.variants.find(({ id }) => id === selectedId) ?? activationPackageFixture.variants[0];
  const checks = useMemo(() => evaluateActivationVariant(selected, evaluatedAt), [selected]);
  const approved = journey ? hasCurrentVersionApproval(journey.decisions, journey.contractVersion) : false;
  const currentApproval = journey?.decisions.findLast((decision) => decision.decision === "approve_test" && decision.contractVersion === journey.contractVersion);

  function chooseVariant(id: string) {
    if (!journey || id === journey.selectedVariantId) return;
    const next = {
      ...journey,
      contractVersion: journey.contractVersion + 1,
      selectedVariantId: id,
      outcome: null,
    };
    new LocalJourneyStore(window.localStorage).save(next);
    setJourney(next);
  }

  function approve() {
    if (!journey || !policyChecksPass(checks)) return;
    const approval = approveCurrentVersion({
      actor: "brand_legal_checker",
      actorDisplayName: "A. Rao",
      rationale: "Corrected rights-safe variant; disclosures, claims, inclusion, and rights window pass.",
      reviewedContractVersion: journey.contractVersion,
      currentContractVersion: journey.contractVersion,
      checks,
      decidedAt: "2026-08-15T12:25:00.000Z",
    });
    const decisions = hasCurrentVersionApproval(journey.decisions, journey.contractVersion)
      ? journey.decisions
      : [...journey.decisions, approval];
    const next = { ...journey, decisions };
    new LocalJourneyStore(window.localStorage).save(next);
    new LocalContractStore(window.localStorage).appendDecision(approval);
    setJourney(next);
  }

  function revealResult() {
    if (!journey?.sprint || !approved) return;
    const outcome = evaluateOutcome(journey.sprint, heroSyntheticOutcome);
    const next = { ...journey, outcome };
    new LocalJourneyStore(window.localStorage).save(next);
    setJourney(next);
  }

  if (ready && !journey?.sprint?.lockedAt) {
    return <section className="system-state"><h2>Lock the Causal Sprint first</h2><p>Activation review cannot start until the metric, window, cells, and decision thresholds are immutable.</p><Link className="primary-action" href={`/sprint/${contract.opportunity.id}`}>Return to Causal Sprint</Link></section>;
  }

  const ledger = journey?.sprint && journey.outcome && currentApproval
    ? buildLedgerEntry({ contract, scope: journey.scope, sprint: journey.sprint, policyChecks: checks, approval: currentApproval, outcome: journey.outcome, recordedAt: "2026-08-22T18:30:00.000Z" })
    : null;

  return (
    <div className="review-stack">
      <section className="activation-review">
        <div className="section-heading"><div><p className="eyebrow">Activation package · Brand Guardian</p><h2>Fluent content does not outrank policy.</h2></div><span>Ruleset 1.0.0</span></div>
        <div className="variant-tabs" role="group" aria-label="Activation variants">
          {activationPackageFixture.variants.map((variant) => {
            const variantPasses = policyChecksPass(evaluateActivationVariant(variant, evaluatedAt));
            return <button aria-pressed={variant.id === selected.id} key={variant.id} onClick={() => chooseVariant(variant.id)} type="button"><span>{variantPasses ? <Check aria-hidden="true" size={14} /> : <ShieldAlert aria-hidden="true" size={14} />}{variantPasses ? "Rights-safe" : "Blocked"}</span><strong>{variant.label}</strong></button>;
          })}
        </div>
        <div className="review-grid">
          <article className="creative-preview">
            <span>{selected.channel.replaceAll("_", " ")} · Synthetic demo creative</span>
            <h3>{selected.copy}</h3>
            <p>{selected.claim}</p>
            <small>{selected.disclosure}</small>
          </article>
          <div className="policy-list">
            {checks.map((item) => <div className={`policy-check ${item.status}`} key={item.ruleId}><span>{item.status === "pass" ? <Check aria-hidden="true" size={14} /> : <ShieldAlert aria-hidden="true" size={14} />}{item.ruleId}</span><strong>{item.status === "pass" ? "Pass" : item.message}</strong>{item.remediation ? <small>{item.remediation}</small> : null}</div>)}
          </div>
        </div>
      </section>

      <section className="approval-panel">
        <div><p className="eyebrow">Maker-checker · Current contract v{journey?.contractVersion ?? "—"}</p><h2>{approved ? "Human approval recorded." : "A human owns the consequential decision."}</h2><p>{approved ? currentApproval?.rationale : "Approval remains unavailable until every current-version policy check passes."}</p></div>
        <div className="approval-actions">
          <button className="primary-button" disabled={!ready || !policyChecksPass(checks) || approved} onClick={approve} type="button"><LockKeyhole aria-hidden="true" size={16} /> {approved ? "Approved" : "Approve corrected variant"}</button>
          <button className="result-button" disabled={!approved || Boolean(journey?.outcome)} onClick={revealResult} type="button"><Eye aria-hidden="true" size={16} /> {journey?.outcome ? "Result revealed" : "Reveal synthetic result"}</button>
        </div>
        <div className="audit-list" aria-label="Append-only decision history">
          {journey?.decisions.length ? journey.decisions.map((decision) => <div key={decision.id}><strong>{decision.actor}</strong><span>{decision.decision.replaceAll("_", " ")} · Contract v{decision.contractVersion}</span><small>{decision.decidedAt}</small></div>) : <p>No approval recorded. Activation is blocked.</p>}
        </div>
      </section>
      {ledger ? <LearningLedger entry={ledger} /> : null}
    </div>
  );
}
