import type { OwnerSelectionCriterion, PortfolioResolution } from "@/lib/contracts";

/**
 * States the owner-selection rule on screen.
 *
 * Without this the resolver looks self-contradictory: it can recommend a brand
 * whose readiness number is lower than a candidate it beat. That is correct —
 * readiness is not a selection criterion — but a viewer can only take that on
 * trust unless the actual rule and the deciding comparison are both visible.
 */

const CRITERION_LABEL: Record<OwnerSelectionCriterion, string> = {
  route: "Recommended action",
  permission: "Permission to speak",
  preparedness: "Ability to deliver",
  brandId: "Alphabetical order",
};

/** Plain-English gloss for the criterion that actually decided the winner. */
const CRITERION_BASIS: Record<OwnerSelectionCriterion, string> = {
  route: "they were the only brand cleared for a stronger action",
  permission: "audiences already accept this brand talking about this",
  preparedness: "they can deliver more of what this would create",
  brandId: "everything above was an exact tie, so the order is alphabetical",
};

export function OwnerSelectionRule({ resolution }: { resolution: PortfolioResolution }) {
  const { selectionBasis: basis, candidates, selectedBrandId } = resolution;
  if (!basis) return null;

  const nameOf = (brandId: string) =>
    candidates.find((candidate) => candidate.brandId === brandId)?.displayName ?? brandId;

  const winner = nameOf(selectedBrandId);
  const runnerUp = nameOf(basis.runnerUpBrandId);

  return (
    <section className="selection-rule" aria-labelledby="selection-rule-title">
      <p className="section-kicker">Owner rule</p>
      <h3 id="selection-rule-title">
        Why {winner}, not {runnerUp}?
      </h3>

      <p className="selection-rule-basis">
        Decided on <strong>{CRITERION_LABEL[basis.decidedBy].toLowerCase()}</strong> —{" "}
        {winner} {basis.winnerValue} vs {runnerUp} {basis.runnerUpValue}. In plain terms,{" "}
        {CRITERION_BASIS[basis.decidedBy]}.
      </p>

      <ol className="selection-rule-order">
        {resolution.selectionOrder.map((criterion) => (
          <li
            className={criterion === basis.decidedBy ? "is-deciding" : undefined}
            key={criterion}
          >
            {CRITERION_LABEL[criterion]}
            {criterion === basis.decidedBy ? <span> — decided here</span> : null}
          </li>
        ))}
      </ol>

      <p className="selection-rule-note">
        Readiness is not on this list. Readiness is the weakest of a brand&rsquo;s three
        scores and answers <em>can we act yet</em> — it is driven by stock, rights and
        channel reach, which are the same whoever owns the moment. This list answers a
        different question: <em>who should own it</em>. So the recommended brand can show a
        lower readiness than one it beat.
      </p>
    </section>
  );
}
