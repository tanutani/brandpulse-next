import { Check, Minus } from "lucide-react";

import type { OpportunityContract } from "@/lib/contracts";
import { compareMemoryGrowth } from "@/lib/memory/memory-yield";

/**
 * Brand memory yield — how much of this decision the organisation already knew.
 *
 * Rendered as a fraction first, percentage second. A small denominator is
 * self-evidently checkable in a way a percentage is not, and the unanswered
 * questions are shown rather than hidden: an open question is the system saying
 * what it does not know, which is the honest half of the compounding claim.
 *
 * The two figures come from running the same function over an empty corpus and
 * over the retained one, so the difference between them is a measurement rather
 * than an assertion that the system improves.
 */

export function MemoryYieldPanel({
  contract,
  knownClaimBrandIds,
}: {
  contract: OpportunityContract;
  knownClaimBrandIds: string[];
}) {
  const { firstDecision, withHistory } = compareMemoryGrowth(contract, knownClaimBrandIds);

  return (
    <section className="surface surface-pad" aria-labelledby="memory-yield-title">
      <div className="section-head">
        <div>
          <p className="section-kicker">Does this get better with use?</p>
          <h2 id="memory-yield-title" style={{ fontSize: 17 }}>
            Answered from memory
          </h2>
        </div>
      </div>

      <div className="memory-compare">
        <div className="memory-figure is-muted">
          <strong>
            {firstDecision.answered} / {firstDecision.total}
          </strong>
          <span>First decision in a category</span>
        </div>
        <div className="memory-figure">
          <strong>
            {withHistory.answered} / {withHistory.total}
          </strong>
          <span>With {withHistory.answered > 0 ? "decisions retained" : "nothing retained"}</span>
        </div>
      </div>

      <p className="muted small">
        Both figures are the same calculation run twice — once against an empty record, once against
        what this workspace has actually kept. The difference is measured, not claimed.
      </p>

      <ul className="memory-question-list">
        {withHistory.answers.map((answer) => (
          <li className={answer.answered ? "is-answered" : "is-open"} key={answer.question.id}>
            <span className="memory-mark" aria-hidden="true">
              {answer.answered ? <Check size={13} /> : <Minus size={13} />}
            </span>
            <div>
              <strong>{answer.question.question}</strong>
              <span className="memory-detail">{answer.detail}</span>
            </div>
          </li>
        ))}
      </ul>

      <p className="muted small" style={{ marginTop: "var(--s3)" }}>
        An open question is not a gap in the demo — it is the record stating what still needs fresh
        research. A question counts as answered only when a stored record of the required shape
        exists; nothing here is judged by similarity.
      </p>
    </section>
  );
}
