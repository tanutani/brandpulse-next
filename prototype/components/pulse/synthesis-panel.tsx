"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { useGuide } from "@/components/guide/guide-provider";
import { ProvenanceBadge } from "@/components/evidence/provenance-badge";
import { fetchSynthesis, readSynthesis } from "@/lib/ai/client-synthesis-store";
import type { FallbackReason, SynthesisResponse } from "@/lib/contracts/live-ai";

/**
 * Compact Gemini synthesis. Whatever happens upstream, this panel shows a
 * grounded summary and says plainly which mode produced it.
 */

const FALLBACK_EXPLANATIONS: Record<FallbackReason, string> = {
  disabled: "Live AI is switched off for this deployment.",
  missing_key: "No provider key is configured, so the checked-in synthesis is used.",
  timeout: "The provider did not answer within the six-second budget.",
  quota: "The provider quota was exhausted.",
  invalid_output: "The model response failed schema or evidence validation and was discarded.",
};

type PanelState = "idle" | "loading" | "ready" | "unavailable";

export function SynthesisPanel({ opportunityId }: { opportunityId: string }) {
  const guide = useGuide();
  const cached = readSynthesis(opportunityId);
  const [synthesis, setSynthesis] = useState<SynthesisResponse | null>(cached);
  const [state, setState] = useState<PanelState>(cached ? "ready" : "idle");

  async function runAnalysis() {
    setState("loading");
    const result = await fetchSynthesis(opportunityId);
    if (result) {
      setSynthesis(result);
      setState("ready");
      guide.completeAction("run-ai-analysis");
    } else {
      setState("unavailable");
    }
  }

  const isLive = synthesis?.mode === "live";

  return (
    <section className="surface" aria-labelledby="synthesis-title">
      <div className="signal-room-head">
        <div>
          <p className="section-kicker">Evidence synthesis</p>
          <h2 id="synthesis-title" style={{ fontSize: 18 }}>
            What the evidence says
          </h2>
        </div>
        {synthesis ? (
          <span className={`mode-chip ${isLive ? "is-live" : "is-fallback"}`}>
            {isLive ? "Live Gemini" : "Precomputed fallback"}
          </span>
        ) : null}
      </div>

      {state === "idle" ? (
        <div className="synthesis-idle">
          <p>
            Gemini will group this evidence into themes and argue the strongest case against it. It
            cannot set a score, choose a route, or approve anything.
          </p>
          <button
            className="btn btn-primary"
            data-guide-anchor="run-ai-analysis"
            onClick={runAnalysis}
            type="button"
          >
            <Sparkles aria-hidden="true" size={15} /> Run AI analysis
          </button>
        </div>
      ) : null}

      {state === "loading" ? (
        <div className="synthesis-idle is-loading-shimmer" aria-live="polite">
          <span className="muted small">Analysing approved evidence…</span>
          <span className="skeleton-line" />
          <span className="skeleton-line" />
          <span className="skeleton-line short" />
        </div>
      ) : null}

      {state === "unavailable" ? (
        <div className="synthesis-idle">
          <p>
            Synthesis is unavailable right now. Every deterministic score, route, blocker and
            approval on the following screens is unaffected.
          </p>
          <button className="btn btn-secondary" onClick={runAnalysis} type="button">
            Try again
          </button>
        </div>
      ) : null}

      {state === "ready" && synthesis ? (
        <div className="synthesis-panel-body">
          <p className="synthesis-summary">{synthesis.summary}</p>

          <div className="theme-list">
            {synthesis.themes.map((theme) => (
              <div className="theme-item" key={theme.label}>
                <strong>{theme.label}</strong>
                <span className="evidence-ids">{theme.evidenceIds.join(" · ")}</span>
              </div>
            ))}
          </div>

          <div className="inference-surface" style={{ marginTop: "var(--s4)" }}>
            <ProvenanceBadge type="model_inference" />
            <h3 style={{ marginTop: 6 }}>Counter-hypothesis</h3>
            <p style={{ marginTop: 4 }}>{synthesis.counterHypothesis.claim}</p>
            <span className="evidence-ids mono muted">
              {synthesis.counterHypothesis.evidenceIds.join(" · ")}
            </span>
          </div>

          {synthesis.missingEvidence.length ? (
            <>
              <p className="section-kicker" style={{ marginTop: "var(--s4)" }}>
                Missing evidence
              </p>
              <ul className="missing-evidence">
                {synthesis.missingEvidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}

          <details className="detail-disclosure" style={{ marginTop: "var(--s4)" }}>
            <summary>Model boundary and provenance</summary>
            <div className="detail-body">
              <p className="small muted">
                {isLive
                  ? "Generated live and validated against the approved evidence set."
                  : `Checked-in synthesis. ${synthesis.fallbackReason ? FALLBACK_EXPLANATIONS[synthesis.fallbackReason] : ""}`}
              </p>
              <p className="small muted" style={{ marginTop: 6 }}>
                Model <span className="mono">{synthesis.model ?? "none"}</span> · prompt{" "}
                <span className="mono">{synthesis.promptVersion}</span> · generated{" "}
                <span className="mono">{synthesis.generatedAt}</span>
              </p>
              <p className="small muted" style={{ marginTop: 6 }}>
                Every claim above cites evidence IDs that exist in the approved set. A response that
                cited an unknown ID would be discarded before it reached this panel.
              </p>
            </div>
          </details>
        </div>
      ) : null}
    </section>
  );
}
