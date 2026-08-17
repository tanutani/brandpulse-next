"use client";

import { useState } from "react";

import { readSynthesis } from "@/lib/ai/client-synthesis-store";
import type { SynthesisResponse } from "@/lib/contracts/live-ai";

/**
 * Exactly three bounded questions. Not a chatbot: each answer is assembled from
 * deterministic reason codes plus the already-validated synthesis, and the two
 * sources are labelled separately so a rule is never mistaken for inference.
 *
 * No second model request is made — the synthesis is whatever the shared client
 * store already holds, falling back to the server-rendered copy.
 */

type QuestionId = "why-test" | "what-blocks" | "what-disproves";

const QUESTIONS: Array<{ id: QuestionId; label: string }> = [
  { id: "why-test", label: "Why Test, not Act?" },
  { id: "what-blocks", label: "What blocks national activation?" },
  { id: "what-disproves", label: "What could disprove this?" },
];

export interface AskWhyInputs {
  opportunityId: string;
  route: string;
  reasonCodes: string[];
  readiness: number;
  weakestGate: string;
  proof: number;
  permission: number;
  preparedness: number;
  actProofThreshold: number;
  nationalBlockers: Array<{ code: string; detail: string; remediation: string | null }>;
  /** Server-rendered fallback so an answer exists before any analysis is run. */
  synthesis: SynthesisResponse;
}

function RuleAnswer({ children, codes }: { children: React.ReactNode; codes?: string[] }) {
  return (
    <div className="answer-block">
      <span className="answer-source is-rule">Deterministic rule</span>
      <p>{children}</p>
      {codes?.length ? <span className="reason-codes">{codes.join(" · ")}</span> : null}
    </div>
  );
}

function ModelAnswer({ children, codes }: { children: React.ReactNode; codes?: string[] }) {
  return (
    <div className="answer-block">
      <span className="answer-source is-model">Model inference</span>
      <p>{children}</p>
      {codes?.length ? <span className="reason-codes">{codes.join(" · ")}</span> : null}
    </div>
  );
}

export function AskWhy(inputs: AskWhyInputs) {
  const [open, setOpen] = useState<QuestionId | null>(null);
  const synthesis = readSynthesis(inputs.opportunityId) ?? inputs.synthesis;

  return (
    <section className="ask-why" aria-labelledby="ask-why-title">
      <p className="section-kicker" id="ask-why-title">
        Ask why
      </p>
      <div className="ask-why-buttons">
        {QUESTIONS.map((question) => (
          <button
            aria-expanded={open === question.id}
            className="btn btn-quiet"
            key={question.id}
            onClick={() => setOpen(open === question.id ? null : question.id)}
            type="button"
          >
            {question.label}
          </button>
        ))}
      </div>

      {open === "why-test" ? (
        <div className="ask-why-answer">
          <RuleAnswer codes={inputs.reasonCodes}>
            Readiness is the weakest of the three gates, not an average. Here that is{" "}
            <strong>{inputs.weakestGate}</strong> at {inputs.readiness}. Act Now needs Proof at least{" "}
            {inputs.actProofThreshold} with no blocker, so the route resolves to{" "}
            {inputs.route.replaceAll("_", " ")}. A high score elsewhere cannot compensate.
          </RuleAnswer>
          <ModelAnswer>{synthesis.summary}</ModelAnswer>
        </div>
      ) : null}

      {open === "what-blocks" ? (
        <div className="ask-why-answer">
          {inputs.nationalBlockers.length ? (
            inputs.nationalBlockers.map((blocker) => (
              <RuleAnswer codes={[blocker.code]} key={blocker.code}>
                {blocker.detail}
                {blocker.remediation ? ` Remediation: ${blocker.remediation}` : ""}
              </RuleAnswer>
            ))
          ) : (
            <RuleAnswer>
              No mandatory blocker applies at national scope for the current configuration.
            </RuleAnswer>
          )}
        </div>
      ) : null}

      {open === "what-disproves" ? (
        <div className="ask-why-answer">
          <ModelAnswer codes={synthesis.counterHypothesis.evidenceIds}>
            {synthesis.counterHypothesis.claim}
          </ModelAnswer>
          {synthesis.missingEvidence.length ? (
            <RuleAnswer>
              The evidence that would settle it is not in the record:{" "}
              {synthesis.missingEvidence.join("; ")}. Until it exists, the router will not raise this
              above a bounded test.
            </RuleAnswer>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
