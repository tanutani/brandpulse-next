"use client";

import { ArrowRight, Check, LockKeyhole, Scale } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { JourneyState, OpportunityContract, SprintRegistration } from "@/lib/contracts";
import { createHeroSprint } from "@/lib/experiment/hero-sprint";
import { lockSprint, validateSprint } from "@/lib/experiment/validate-sprint";
import { LocalJourneyStore } from "@/lib/persistence/local-journey-store";

export function SprintStudio({ contract }: { contract: OpportunityContract }) {
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [sprint, setSprint] = useState<SprintRegistration>(() => createHeroSprint(contract));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = new LocalJourneyStore(window.localStorage).load();
    queueMicrotask(() => {
      setJourney(stored);
      if (stored?.sprint) setSprint(stored.sprint);
      setReady(true);
    });
  }, []);

  const validation = useMemo(() => validateSprint(sprint), [sprint]);
  const eligible = journey?.scope === "four_city" && journey.assetMode === "rights_safe_creator";

  function registerSprint() {
    if (!journey || !eligible) return;
    const locked = lockSprint(sprint, "2026-08-15T12:10:00.000Z");
    const next = { ...journey, sprint: locked, outcome: null, decisions: [], selectedVariantId: null };
    new LocalJourneyStore(window.localStorage).save(next);
    setJourney(next);
    setSprint(locked);
  }

  if (ready && !eligible) {
    return (
      <section className="system-state">
        <h2>Resolve operational readiness first</h2>
        <p>Narrow the hero to four in-stock cities and select rights-safe creator content before registering spend.</p>
        <Link className="primary-action" href={`/resolver/${contract.opportunity.id}`}>Return to Portfolio Resolver</Link>
      </section>
    );
  }

  return (
    <div className="sprint-layout">
      <section className="sprint-contract" aria-labelledby="sprint-title">
        <div className="section-heading"><div><p className="eyebrow">Causal Sprint · Pre-registered</p><h2 id="sprint-title">One decision, fixed before exposure.</h2></div><span>{sprint.lockedAt ? "Locked" : validation.valid ? "Valid draft" : "Blocked"}</span></div>
        <div className="sprint-hypothesis"><span>Hypothesis</span><strong>{sprint.hypothesis}</strong></div>
        <div className="cell-grid">
          <div><span>Treatment cells</span>{sprint.treatmentCells.map((cell) => <strong key={cell}>{cell}</strong>)}</div>
          <div><span>Matched comparison</span>{sprint.comparisonCells.map((cell) => <strong key={cell}>{cell}</strong>)}</div>
        </div>
        <div className="sprint-fields">
          <div><span>Budget cap</span><strong>₹{sprint.budgetCapInr.toLocaleString("en-IN")}</strong></div>
          <div><span>Primary metric</span><strong>{sprint.primaryMetric}</strong></div>
          <div><span>Measurement window</span><strong>15–18 Aug · 72 hours</strong></div>
          <div><span>Comparability</span><strong>{sprint.comparabilityScore}/100</strong></div>
        </div>
      </section>
      <aside className="rule-lock-panel">
        <LockKeyhole aria-hidden="true" size={25} />
        <p className="eyebrow">Decision rules</p>
        <h2>Registered before the result</h2>
        <div className="threshold-rule scale-rule"><Scale aria-hidden="true" size={18} /><span><strong>Scale</strong>≥1.0 percentage-point lift with positive interval</span></div>
        <div className="threshold-rule kill-rule"><span aria-hidden="true">×</span><span><strong>Kill</strong>Negative lift or service level below 90%</span></div>
        <div className="threshold-rule"><Check aria-hidden="true" size={18} /><span><strong>Guardrail</strong>Service level remains at or above 90%</span></div>
        {validation.errors.map((error) => <p className="inline-warning" key={error}>{error.replaceAll("_", " ")}</p>)}
        {!sprint.lockedAt ? (
          <button className="primary-button" disabled={!validation.valid || !ready} onClick={registerSprint} type="button">Lock sprint rules</button>
        ) : (
          <div className="locked-confirmation"><Check aria-hidden="true" size={17} /><span>Locked at 15 Aug, 17:40 IST. Metric, window, cells, budget, and thresholds are immutable.</span></div>
        )}
        {sprint.lockedAt ? <Link className="primary-action" href={`/review/${contract.opportunity.id}`}>Review activation package <ArrowRight aria-hidden="true" size={17} /></Link> : null}
      </aside>
    </div>
  );
}
