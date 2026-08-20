"use client";

import { Check, LockKeyhole, Scale, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useGuide } from "@/components/guide/guide-provider";
import { NextActionLink } from "@/components/shell/next-action-link";
import type { JourneyState, OpportunityContract, SprintRegistration } from "@/lib/contracts";
import { createHeroSprint } from "@/lib/experiment/hero-sprint";
import { lockSprint, validateSprint } from "@/lib/experiment/validate-sprint";
import { LocalJourneyStore } from "@/lib/persistence/local-journey-store";

export function SprintStudio({ contract }: { contract: OpportunityContract }) {
  const guide = useGuide();
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [sprint, setSprint] = useState<SprintRegistration>(() => createHeroSprint(contract));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = new LocalJourneyStore(window.localStorage).load(contract.contractId);
    queueMicrotask(() => {
      setJourney(stored);
      if (stored?.kind === "test" && stored.sprint) setSprint(stored.sprint);
      setReady(true);
    });
  }, [contract.contractId]);

  const validation = useMemo(() => validateSprint(sprint), [sprint]);
  const eligible = journey?.scope === "four_city" && journey.assetMode === "rights_safe_creator";

  function registerSprint() {
    if (!journey || journey.kind !== "test" || !eligible) return;
    const locked = lockSprint(sprint, "2026-08-15T12:10:00.000Z");
    const next = { ...journey, sprint: locked, outcome: null, decisions: [], selectedVariantId: null };
    new LocalJourneyStore(window.localStorage).save(next);
    setJourney(next);
    setSprint(locked);
    guide.completeAction("lock-sprint");
  }

  if (ready && !eligible) {
    return (
      <section className="system-state">
        <h2>Resolve operational readiness first</h2>
        <p>
          Narrow the hero to four in-stock cities and select rights-safe creator content before
          registering spend.
        </p>
        <Link className="btn btn-primary" href={`/resolver/${contract.opportunity.id}`}>
          Return to ownership view
        </Link>
      </section>
    );
  }

  const locked = Boolean(sprint.lockedAt);

  return (
    <div className="journey-grid">
      <div className="stack">
        <section className="decision-surface">
          <div className="decision-surface-head">
            <div>
              <p>Bounded test · pre-registered</p>
              <h2>One decision, fixed before exposure</h2>
            </div>
            <span className="mode-chip">
              {locked ? "Locked" : validation.valid ? "Valid draft" : "Blocked"}
            </span>
          </div>
          <div className="decision-surface-body">
            <p className="section-kicker">Hypothesis</p>
            <p style={{ marginTop: 4, fontSize: 15 }}>{sprint.hypothesis}</p>

            <div className="field-grid" style={{ marginTop: "var(--s4)" }}>
              <div className="field">
                <span>Treatment cells</span>
                <strong>{sprint.treatmentCells.join(", ")}</strong>
              </div>
              <div className="field">
                <span>Matched comparison</span>
                <strong>{sprint.comparisonCells.join(", ")}</strong>
              </div>
              <div className="field">
                <span>Budget cap</span>
                <strong>₹{sprint.budgetCapInr.toLocaleString("en-IN")}</strong>
              </div>
              <div className="field">
                <span>Primary metric</span>
                <strong>{sprint.primaryMetric}</strong>
              </div>
              <div className="field">
                <span>Measurement window</span>
                <strong>15–18 Aug · 72 hours</strong>
              </div>
              <div className="field">
                <span>Comparability</span>
                <strong>{sprint.comparabilityScore}/100</strong>
              </div>
            </div>
          </div>
        </section>

        {locked ? (
          <NextActionLink
            cta="Review activation package"
            detail="Rights, claims, disclosure and inclusion checks run before any human can approve."
            href={`/review/${contract.opportunity.id}`}
            label="The rules are immutable — now check the creative"
          />
        ) : null}
      </div>

      <div className="stack">
        <section className="surface surface-pad" aria-labelledby="rules-title">
          <div className="section-head">
            <div>
              <p className="section-kicker">Decision rules</p>
              <h2 id="rules-title" style={{ fontSize: 17 }}>
                Registered before the result
              </h2>
            </div>
          </div>

          <div className="rule-list">
            <div className="rule-row is-scale">
              <Scale aria-hidden="true" size={16} />
              <div>
                <strong>Scale</strong>
                <p>At least 1.0 percentage-point lift with a positive interval.</p>
              </div>
            </div>
            <div className="rule-row is-kill">
              <X aria-hidden="true" size={16} />
              <div>
                <strong>Kill</strong>
                <p>Negative lift, or service level below 90%.</p>
              </div>
            </div>
            <div className="rule-row is-guardrail">
              <ShieldCheck aria-hidden="true" size={16} />
              <div>
                <strong>Guardrail</strong>
                <p>Service level stays at or above 90% throughout.</p>
              </div>
            </div>
          </div>

          {validation.errors.map((error) => (
            <p className="muted small" key={error} style={{ marginTop: "var(--s2)" }}>
              {error.replaceAll("_", " ")}
            </p>
          ))}

          <div style={{ marginTop: "var(--s4)" }}>
            {!locked ? (
              <button
                className="btn btn-primary btn-block"
                data-guide-anchor="lock-sprint"
                disabled={!validation.valid || !ready}
                onClick={registerSprint}
                type="button"
              >
                <LockKeyhole aria-hidden="true" size={15} /> Lock sprint rules
              </button>
            ) : (
              <div className="ready-alert">
                <Check aria-hidden="true" size={18} />
                <div>
                  <strong>Locked at 15 Aug, 17:40 IST</strong>
                  <p>Metric, window, cells, budget and thresholds are immutable.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <details className="detail-disclosure">
          <summary>Why pre-registration matters</summary>
          <div className="detail-body">
            <p className="muted small">
              The scale and kill rules are stored on the sprint before any result exists, and the
              outcome is later judged only against that stored copy. Moving a threshold after seeing
              a number is how a test stops being a test.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
