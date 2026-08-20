"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { MODEL_STAGES, PRODUCTION_CONNECTIONS } from "@/lib/demo/model";
import {
  CITATIONS,
  PARAMETER_STAGES,
  countParameters,
  parametersForStage,
} from "@/lib/model/parameter-catalogue";

/**
 * Everything a judge may want to inspect but nobody needs on screen while
 * deciding: the model map, the proposed HUL connection map, the methodology,
 * and the prototype-versus-production boundary.
 */
export function MethodologyDrawer({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const counts = countParameters();

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <>
      <div className="drawer-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="drawer-head">
          <h2 id="drawer-title">How BrandPulse works</h2>
          <button className="btn btn-quiet" onClick={onClose} ref={closeRef} type="button">
            <X aria-hidden="true" size={14} /> Close
          </button>
        </div>
        <div className="drawer-body">
          <h3>The decision model</h3>
          <p>
            One signal becomes one accountable decision chain. Each stage answers a single question,
            and the answer is deterministic TypeScript, not model output.
          </p>
          {MODEL_STAGES.map((stage) => (
            <div className="drawer-stage" key={stage.id}>
              <strong>
                {stage.label} — {stage.question}
              </strong>
              <p>{stage.explanation}</p>
              <p>
                <code>{stage.exampleInputs.join(" · ")}</code> → <code>{stage.output}</code>
              </p>
            </div>
          ))}

          <h3>The parameter space, and what we actually score</h3>
          <p>
            We specified <strong>{counts.specified}</strong> parameters across six stages and score{" "}
            <strong>{counts.scored}</strong> of them today. The rest are designed and documented,
            not live. A model that claimed all {counts.specified} were driving the number would be
            harder to falsify, not more credible, so the two claims are kept apart.
          </p>
          <p className="small muted">
            <span className="provenance-tag is-grounded">Grounded</span> rests on published
            marketing science, cited at the end.{" "}
            <span className="provenance-tag is-proposed">Ours</span> is our own design — defensible,
            but not borrowed authority. {counts.grounded} of {counts.specified} are grounded.
          </p>

          {PARAMETER_STAGES.map((stage) => (
            <div className="drawer-stage" key={stage.id}>
              <strong>
                {stage.label} — {stage.question}
              </strong>
              <p className="small muted">Feeds {stage.feeds}.</p>
              <ul className="parameter-list">
                {parametersForStage(stage.id).map((parameter) => (
                  <li className={parameter.scored ? "is-scored" : undefined} key={parameter.id}>
                    <span className="parameter-name">
                      {parameter.name}
                      <span
                        className={`provenance-tag ${
                          parameter.provenance === "grounded" ? "is-grounded" : "is-proposed"
                        }`}
                      >
                        {parameter.provenance === "grounded" ? "Grounded" : "Ours"}
                      </span>
                      {parameter.scored ? (
                        <span className="provenance-tag is-scored-tag">Scored</span>
                      ) : (
                        <span className="provenance-tag is-spec-tag">Specified</span>
                      )}
                    </span>
                    <span className="parameter-question">{parameter.question}</span>
                    {parameter.earnsItsPlace ? (
                      <span className="parameter-reason">Why it is scored: {parameter.earnsItsPlace}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <h3>Sources</h3>
          <p className="small muted">
            Cited for the grounded parameters above. Everything marked as ours is not supported by
            these works and should not be read as if it were.
          </p>
          {CITATIONS.map((citation) => (
            <div className="drawer-stage" key={citation.id}>
              <p className="citation-apa">{citation.apa}</p>
              <p className="small muted">{citation.usedFor}</p>
            </div>
          ))}

          <h3>Where the model may and may not act</h3>
          <p>
            Gemini may summarise approved evidence, group it into themes, argue a counter-hypothesis,
            name missing evidence, and draft short copy. It may never generate or change Proof,
            Permission or Preparedness, select a route, override a blocker, alter sprint cells,
            budgets, thresholds or guardrails, approve an activation, reveal a result, publish
            anything, or receive private HUL or person-level data.
          </p>
          <p>
            Every model claim must cite evidence IDs that exist in the approved set. A response that
            invents a source is discarded and the checked-in synthesis is used instead.
          </p>

          <h3>Methodology</h3>
          <ul>
            <li>Readiness is the weakest of Proof, Permission and Preparedness — never an average.</li>
            <li>A mandatory blocker outranks any score, however high.</li>
            <li>Experiment rules are fixed before any result exists and cannot be revised after.</li>
            <li>Approval is bound to one exact contract version.</li>
            <li>Thresholds shown here are illustrative competition assumptions, not HUL policy.</li>
          </ul>

          <h3>Proposed production connections</h3>
          <p>
            Proposed interfaces, not confirmed HUL API paths. These show where production access
            would replace a checked-in fixture.
          </p>
          {PRODUCTION_CONNECTIONS.map((connection) => (
            <div className="drawer-stage" key={connection.stage}>
              <strong>{connection.stage}</strong>
              <p>
                <code>{connection.proposedInterface}</code> · {connection.accessPattern}
              </p>
              <p>{connection.decisionUse}</p>
              <p>
                <em>Prototype substitute:</em> {connection.prototypeSubstitute}
              </p>
            </div>
          ))}

          <h3>Prototype versus production</h3>
          <ul>
            <li>Today: dated public snapshots, visibly synthetic HUL-like aggregates, browser-local history.</li>
            <li>Production: listening, consumer, commerce and inventory inputs; brand, rights and claims systems; enterprise roles, lineage and an outcome store.</li>
            <li>This build contains no database, authentication, scraping, publishing, or private HUL integration.</li>
          </ul>
        </div>
      </aside>
    </>
  );
}
