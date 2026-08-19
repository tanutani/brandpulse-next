"use client";

import { ShieldQuestion } from "lucide-react";
import { useState } from "react";

import { ProvenanceBadge } from "@/components/evidence/provenance-badge";
import { fetchSkeptic, readSkeptic } from "@/lib/ai/client-agent-store";
import type { FallbackReason, SkepticResponse } from "@/lib/contracts/live-ai";

/**
 * The Skeptic: the case against the recommendation, generated from the current
 * evidence chain rather than served as fixed copy.
 *
 * The generating state is deliberately visible and unhurried. A judge needs to
 * see that the argument is being written now, from this evidence — that is the
 * whole claim being demonstrated.
 */

const FALLBACK_EXPLANATIONS: Record<FallbackReason, string> = {
  disabled: "Live AI is switched off for this session, so the checked-in counter-case is shown.",
  missing_key: "No provider key is configured, so the checked-in counter-case is shown.",
  timeout: "The provider did not answer within the six-second budget.",
  quota: "The provider quota was exhausted.",
  invalid_output: "The response failed schema or evidence validation and was discarded.",
};

type PanelState = "idle" | "loading" | "ready" | "unavailable";

export function SkepticPanel({ opportunityId }: { opportunityId: string }) {
  const cached = readSkeptic(opportunityId);
  const [skeptic, setSkeptic] = useState<SkepticResponse | null>(cached);
  const [state, setState] = useState<PanelState>(cached ? "ready" : "idle");

  async function challenge() {
    setState("loading");
    const result = await fetchSkeptic(opportunityId);
    if (result) {
      setSkeptic(result);
      setState("ready");
    } else {
      setState("unavailable");
    }
  }

  const isLive = skeptic?.mode === "live";

  return (
    <section className="surface skeptic-panel" aria-labelledby="skeptic-title">
      <div className="signal-room-head">
        <div>
          <p className="section-kicker">The Skeptic</p>
          <h2 id="skeptic-title" style={{ fontSize: 18 }}>
            What could make this wrong?
          </h2>
        </div>
        {skeptic ? (
          <span className={`mode-chip ${isLive ? "is-live" : "is-fallback"}`}>
            {isLive ? "Written live" : "Checked-in copy"}
          </span>
        ) : null}
      </div>

      {state === "idle" ? (
        <div className="synthesis-idle">
          <p>
            Before anyone acts, something has to argue the other side. This reads the same
            evidence and writes the strongest case that the reading is wrong. It cannot change
            a score or block anything — only a person can do that.
          </p>
          <button className="btn btn-primary" onClick={challenge} type="button">
            <ShieldQuestion aria-hidden="true" size={15} /> Argue against this
          </button>
        </div>
      ) : null}

      {state === "loading" ? (
        <div className="synthesis-idle is-loading-shimmer" aria-live="polite">
          <span className="muted small">Reading the evidence chain and writing the counter-case…</span>
          <span className="skeleton-line" />
          <span className="skeleton-line" />
          <span className="skeleton-line short" />
        </div>
      ) : null}

      {state === "unavailable" ? (
        <div className="synthesis-idle">
          <p>
            The counter-case is unavailable right now. Every score, route, blocker and approval
            on the following screens is unaffected.
          </p>
          <button className="btn btn-secondary" onClick={challenge} type="button">
            Try again
          </button>
        </div>
      ) : null}

      {state === "ready" && skeptic ? (
        <div className="synthesis-panel-body">
          <div className="inference-surface">
            <ProvenanceBadge type="model_inference" />
            <p className="skeptic-headline">{skeptic.headline}</p>
          </div>

          <ol className="skeptic-challenges">
            {skeptic.challenges.map((challengeItem) => (
              <li key={challengeItem.claim}>
                <p>{challengeItem.claim}</p>
                <p className="skeptic-resolver">
                  <strong>Settled by:</strong> {challengeItem.wouldChangeDecisionIf}
                </p>
                <span className="evidence-ids mono muted">
                  {challengeItem.evidenceIds.join(" · ")}
                </span>
              </li>
            ))}
          </ol>

          <details className="detail-disclosure" style={{ marginTop: "var(--s4)" }}>
            <summary>Where this came from</summary>
            <div className="detail-body">
              <p className="small muted">
                {isLive
                  ? "Written just now from the evidence chain, and checked against the approved evidence set before it was shown."
                  : `Checked-in counter-case. ${skeptic.fallbackReason ? FALLBACK_EXPLANATIONS[skeptic.fallbackReason] : ""}`}
              </p>
              <p className="small muted" style={{ marginTop: 6 }}>
                Model <span className="mono">{skeptic.model ?? "none"}</span> · prompt{" "}
                <span className="mono">{skeptic.promptVersion}</span> · written{" "}
                <span className="mono">{skeptic.generatedAt}</span>
              </p>
              <p className="small muted" style={{ marginTop: 6 }}>
                Every objection cites evidence IDs that exist in the approved set. An objection
                citing an unknown ID would be discarded before reaching this panel.
              </p>
            </div>
          </details>
        </div>
      ) : null}
    </section>
  );
}
