"use client";

import { Check, Eye, LockKeyhole, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getActivationPackage } from "@/lib/activation/draft-package";
import { LearningLedger } from "@/components/governance/learning-ledger";
import { useGuide } from "@/components/guide/guide-provider";
import type { JourneyState, OpportunityContract } from "@/lib/contracts";
import { evaluateOutcome } from "@/lib/experiment/evaluate-outcome";
import { heroSyntheticOutcome, surfMonitoredOutcome } from "@/lib/fixtures/synthetic-result";
import { approveCurrentVersion, hasCurrentVersionApproval } from "@/lib/governance/approve-contract";
import { buildLedgerEntry, buildMonitoredLedgerEntry } from "@/lib/learning/build-ledger-entry";
import { LocalContractStore } from "@/lib/persistence/local-contract-store";
import { LocalJourneyStore } from "@/lib/persistence/local-journey-store";
import { evaluateActivationVariant, policyChecksPass } from "@/lib/policies/evaluate-package";

const evaluatedAt = "2026-08-15T12:20:00.000Z";

export function ReviewWorkspace({ contract }: { contract: OpportunityContract }) {
  const guide = useGuide();
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = new LocalJourneyStore(window.localStorage).load(contract.contractId);
    queueMicrotask(() => {
      setJourney(stored);
      setReady(true);
    });
  }, [contract.contractId]);

  const activationPackage = getActivationPackage(contract.opportunity.id)!;
  const selectedId = journey?.selectedVariantId ?? activationPackage.variants[0].id;
  const selected =
    activationPackage.variants.find(({ id }) => id === selectedId) ??
    activationPackage.variants[0];
  const checks = evaluateActivationVariant(selected, evaluatedAt);
  const approvalType = journey?.kind === "act" ? "approve_activation" : "approve_test";
  const approved = journey ? hasCurrentVersionApproval(journey.decisions, journey.contractVersion, approvalType) : false;
  const currentApproval = journey?.decisions.findLast(
    (decision) => decision.decision === approvalType && decision.contractVersion === journey.contractVersion,
  );
  const passing = policyChecksPass(checks);

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

    if (policyChecksPass(evaluateActivationVariant(
      activationPackage.variants.find((variant) => variant.id === id) ?? selected,
      evaluatedAt,
    ))) {
      guide.completeAction("variant-corrected");
    }
  }

  function approve() {
    if (!journey || !passing) return;
    const approval = approveCurrentVersion({
      actor: "brand_legal_checker",
      actorDisplayName: "A. Rao",
      rationale:
        "Corrected rights-safe variant; disclosures, claims, inclusion, and rights window pass.",
      reviewedContractVersion: journey.contractVersion,
      currentContractVersion: journey.contractVersion,
      checks,
      decidedAt: "2026-08-15T12:25:00.000Z",
      decision: approvalType,
    });
    const decisions = hasCurrentVersionApproval(journey.decisions, journey.contractVersion)
      ? journey.decisions
      : [...journey.decisions, approval];
    const next: JourneyState = journey.kind === "act"
      ? {
          ...journey,
          decisions,
          activationPlan: { ...journey.activationPlan, approvalState: "approved" },
        }
      : { ...journey, decisions };
    new LocalJourneyStore(window.localStorage).save(next);
    new LocalContractStore(window.localStorage).appendDecision(approval);
    setJourney(next);
    guide.completeAction("approve");
  }

  function revealResult() {
    if (!journey || !approved) return;
    const next: JourneyState = journey.kind === "act"
      ? { ...journey, outcome: surfMonitoredOutcome }
      : journey.sprint
        ? { ...journey, outcome: evaluateOutcome(journey.sprint, heroSyntheticOutcome) }
        : journey;
    new LocalJourneyStore(window.localStorage).save(next);
    setJourney(next);
    guide.completeAction("reveal-result");
  }

  if (ready && (!journey || (journey.kind === "test" && !journey.sprint?.lockedAt))) {
    return (
      <section className="system-state">
        <h2>Lock the bounded test first</h2>
        <p>
          Activation review cannot start until the metric, window, cells and decision thresholds are
          immutable.
        </p>
        <Link className="btn btn-primary" href={`/sprint/${contract.opportunity.id}`}>
          Return to bounded test
        </Link>
      </section>
    );
  }

  const ledger = journey?.kind === "test" && journey.sprint && journey.outcome && currentApproval
      ? buildLedgerEntry({
          contract,
          scope: journey.scope,
          sprint: journey.sprint,
          policyChecks: checks,
          approval: currentApproval,
          outcome: journey.outcome,
          recordedAt: "2026-08-22T18:30:00.000Z",
        })
      : journey?.kind === "act" && journey.outcome && currentApproval
        ? buildMonitoredLedgerEntry({
            contract,
            activationPlan: journey.activationPlan,
            policyChecks: checks,
            approval: currentApproval,
            outcome: journey.outcome,
            recordedAt: "2026-08-17T18:30:00.000Z",
          })
        : null;

  return (
    <div className="journey-grid">
      <div className="stack">
        <section className="decision-surface">
          <div className="decision-surface-head">
            <div>
              <p>Activation review · ruleset 1.0.0</p>
              <h2>Fluent content does not outrank policy</h2>
            </div>
          </div>
          <div className="decision-surface-body">
            <div className="variant-tabs" role="group" aria-label="Activation variants">
              {activationPackage.variants.map((variant) => {
                const variantPasses = policyChecksPass(evaluateActivationVariant(variant, evaluatedAt));
                return (
                  <button
                    aria-pressed={variant.id === selected.id}
                    className={`variant-tab ${variantPasses ? "is-safe" : "is-blocked"}`}
                    data-guide-anchor={variantPasses ? "variant-corrected" : undefined}
                    key={variant.id}
                    onClick={() => chooseVariant(variant.id)}
                    type="button"
                  >
                    <span>
                      {variantPasses ? (
                        <Check aria-hidden="true" size={12} />
                      ) : (
                        <ShieldAlert aria-hidden="true" size={12} />
                      )}
                      {variantPasses ? "Rights-safe" : "Blocked"}
                    </span>
                    <strong>{variant.label}</strong>
                  </button>
                );
              })}
            </div>

            <div className="creative-preview" style={{ marginTop: "var(--s4)" }}>
              <span>{selected.channel.replaceAll("_", " ")} · synthetic demo creative</span>
              <h3>{selected.copy}</h3>
              <p>{selected.claim}</p>
              <small>{selected.disclosure}</small>
            </div>
          </div>
        </section>

        <section className="approval-surface" aria-labelledby="approval-title">
          <p className="section-kicker">Maker-checker · current contract v{journey?.contractVersion ?? "—"}</p>
          <h2 id="approval-title" style={{ fontSize: 18, marginTop: 2 }}>
            {approved ? "Human approval recorded" : "A human owns the consequential decision"}
          </h2>
          <p className="muted small" style={{ marginTop: 4 }}>
            {approved
              ? currentApproval?.rationale
              : "Approval stays unavailable until every current-version policy check passes."}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s2)", marginTop: "var(--s4)" }}>
            <button
              className="btn btn-primary"
              data-guide-anchor="approve"
              disabled={!ready || !passing || approved}
              onClick={approve}
              type="button"
            >
              <LockKeyhole aria-hidden="true" size={15} />{" "}
              {approved ? "Approved" : "Approve corrected variant"}
            </button>
            <button
              className="btn btn-secondary"
              data-guide-anchor="reveal-result"
              disabled={!approved || Boolean(journey?.outcome)}
              onClick={revealResult}
              type="button"
            >
              <Eye aria-hidden="true" size={15} />{" "}
              {journey?.outcome ? "Result revealed" : journey?.kind === "act" ? "Reveal monitored result" : "Reveal synthetic result"}
            </button>
          </div>

          <div className="audit-list" aria-label="Append-only decision history">
            {journey?.decisions.length ? (
              journey.decisions.map((decision) => (
                <div className="audit-entry" key={decision.id}>
                  <strong>{decision.actor}</strong>
                  <span>
                    {decision.decision.replaceAll("_", " ")} · contract v{decision.contractVersion}
                  </span>
                  <time className="mono">{decision.decidedAt}</time>
                </div>
              ))
            ) : (
              <p className="muted small">No approval recorded. Activation is blocked.</p>
            )}
          </div>
        </section>

        {ledger ? <LearningLedger entry={ledger} /> : null}
      </div>

      <div className="stack">
        <section className="surface surface-pad" aria-labelledby="policy-title">
          <div className="section-head">
            <div>
              <p className="section-kicker">Policy checks</p>
              <h2 id="policy-title" style={{ fontSize: 17 }}>
                Non-bypassable rules
              </h2>
            </div>
            <span className="muted small">{checks.filter((c) => c.status === "pass").length}/{checks.length} pass</span>
          </div>

          <div className="policy-list" data-guide-anchor="rights-check">
            {checks.map((item) => (
              <div className={`policy-check ${item.status}`} key={item.ruleId}>
                {item.status === "pass" ? (
                  <Check aria-hidden="true" size={15} />
                ) : (
                  <ShieldAlert aria-hidden="true" size={15} />
                )}
                <div>
                  <span className="rule-id">{item.ruleId}</span>
                  <strong style={{ display: "block" }}>
                    {item.status === "pass" ? "Pass" : item.message}
                  </strong>
                  {item.remediation ? <small>{item.remediation}</small> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
