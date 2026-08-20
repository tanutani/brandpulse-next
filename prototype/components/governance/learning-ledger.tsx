"use client";

import { CheckCircle2, FlaskConical, History, Scale } from "lucide-react";

import { ProvenanceBadge } from "@/components/evidence/provenance-badge";
import { useGuide } from "@/components/guide/guide-provider";
import type { LearningLedgerEntry } from "@/lib/contracts";

export function LearningLedger({ entry }: { entry: LearningLedgerEntry }) {
  useGuide();

  if (entry.kind === "act") {
    return (
      <section className="surface surface-pad" aria-labelledby="ledger-title" data-guide-anchor="ledger">
        <div className="section-head">
          <div>
            <p className="section-kicker">Decision history · contract v{entry.contractVersion}</p>
            <h2 id="ledger-title" style={{ fontSize: 18 }}>
              Approval and descriptive observation stay attached to the decision
            </h2>
          </div>
          <ProvenanceBadge type="synthetic_internal" />
        </div>

        <ol className="ledger-timeline">
          <li className="ledger-event">
            <span className="ledger-marker"><History aria-hidden="true" size={14} /></span>
            <div>
              <span>Decision record</span>
              <strong>Surf Excel selected · growth activation</strong>
              <small>Prepared inventory, claim support and creator rights retained.</small>
            </div>
          </li>
          <li className="ledger-event">
            <span className="ledger-marker"><FlaskConical aria-hidden="true" size={14} /></span>
            <div>
              <span>Monitored activation plan</span>
              <strong>{entry.activationPlan.selectedScope.replaceAll("_", " ")} · {entry.activationPlan.channel.replaceAll("_", " ")}</strong>
              <small>{entry.activationPlan.stopRule}</small>
            </div>
          </li>
          <li className="ledger-event">
            <span className="ledger-marker"><CheckCircle2 aria-hidden="true" size={14} /></span>
            <div>
              <span>Maker-checker</span>
              <strong>{entry.approval.actor} approved current v{entry.approval.contractVersion}</strong>
              <small>{entry.approval.rationale}</small>
            </div>
          </li>
          <li className="ledger-event is-result">
            <span className="ledger-marker"><Scale aria-hidden="true" size={14} /></span>
            <div>
              <span>Synthetic monitored outcome</span>
              <strong>{(entry.outcome.observedValue * 100).toFixed(1)}% observed · {entry.outcome.decision.toUpperCase()}</strong>
              <small>
                Descriptive only — no treatment/control, incrementality estimate, confidence interval or causal claim.
                Service {(entry.outcome.inventoryService * 100).toFixed(0)}%; backlash {(entry.outcome.backlashRate * 100).toFixed(1)}%.
              </small>
            </div>
          </li>
        </ol>
      </section>
    );
  }

  return (
    <section className="surface surface-pad" aria-labelledby="ledger-title" data-guide-anchor="ledger">
      <div className="section-head">
        <div>
          <p className="section-kicker">Decision history · contract v{entry.contractVersion}</p>
          <h2 id="ledger-title" style={{ fontSize: 18 }}>
            The decision remembers what humans and the bounded test taught it
          </h2>
        </div>
        <ProvenanceBadge type="synthetic_internal" />
      </div>

      <ol className="ledger-timeline">
        <li className="ledger-event">
          <span className="ledger-marker">
            <History aria-hidden="true" size={14} />
          </span>
          <div>
            <span>Decision record</span>
            <strong>Rexona selected · weakest-link Test route</strong>
            <small>Evidence, counter-evidence, assumptions and version retained.</small>
          </div>
        </li>
        <li className="ledger-event">
          <span className="ledger-marker">
            <FlaskConical aria-hidden="true" size={14} />
          </span>
          <div>
            <span>Human change</span>
            <strong>National → four in-stock cities</strong>
            <small>{entry.sprint.primaryMetric} locked before any result existed.</small>
          </div>
        </li>
        <li className="ledger-event">
          <span className="ledger-marker">
            <CheckCircle2 aria-hidden="true" size={14} />
          </span>
          <div>
            <span>Maker-checker</span>
            <strong>
              {entry.approval.actor} approved current v{entry.approval.contractVersion}
            </strong>
            <small>{entry.approval.rationale}</small>
          </div>
        </li>
        <li className="ledger-event is-result">
          <span className="ledger-marker">
            <Scale aria-hidden="true" size={14} />
          </span>
          <div>
            <span>Synthetic outcome</span>
            <strong>
              {(entry.outcome.incrementalEffect * 100).toFixed(1)}pp lift ·{" "}
              {entry.outcome.decision.toUpperCase()}
            </strong>
            <small>
              95% interval {(entry.outcome.confidenceInterval.lower * 100).toFixed(1)} to{" "}
              {(entry.outcome.confidenceInterval.upper * 100).toFixed(1)}pp; service level{" "}
              {(entry.outcome.serviceLevelGuardrail * 100).toFixed(0)}%.
            </small>
          </div>
        </li>
      </ol>

      <div className="value-summary">
        <span>What BrandPulse changed</span>
        <strong>
          Prevented an unsafe national activation, redirected ₹5 lakh into a measurable four-city
          test, and retained the learning.
        </strong>
        <small>Illustrative competition outcome using synthetic HUL-like operating data.</small>
      </div>
    </section>
  );
}
