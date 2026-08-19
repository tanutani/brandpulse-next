import type {
  OwnerSelectionBasis,
  OwnerSelectionCriterion,
  PortfolioCandidateInputs,
  PortfolioCandidateResult,
  PortfolioResolution,
  PortfolioScope,
  AssetMode,
  Opportunity,
} from "@/lib/contracts";
import { selectRoute } from "@/lib/routing/select-route";
import { calculatePermission } from "@/lib/scoring/permission";
import { calculatePreparedness } from "@/lib/scoring/preparedness";

const routeRank = { act_now: 5, test: 4, incubate: 3, watch: 2, ignore: 1 } as const;

/**
 * Owner selection order, applied top to bottom until one criterion separates
 * two candidates.
 *
 * Readiness is intentionally absent. Readiness is the weakest of a brand's own
 * three gates and answers "can this brand act yet?" — it is set almost entirely
 * by shared operational facts (stock, rights, channel coverage) that are the
 * same whichever brand owns the moment, so it barely discriminates between
 * candidates. "Who should own this?" is a question about brand permission, so
 * permission is the first score consulted. A brand can therefore be recommended
 * as owner while showing a lower readiness than a candidate it beat.
 */
export const OWNER_SELECTION_ORDER: readonly OwnerSelectionCriterion[] = [
  "route",
  "permission",
  "preparedness",
  "brandId",
];

/** Human-readable value for each criterion, used both to compare and to display. */
function criterionValue(
  candidate: PortfolioCandidateResult,
  criterion: OwnerSelectionCriterion,
): string {
  switch (criterion) {
    case "route":
      return candidate.decision.route;
    case "permission":
      return String(candidate.permission.score);
    case "preparedness":
      return String(candidate.preparedness.score);
    case "brandId":
      return candidate.brandId;
  }
}

function compareOn(
  a: PortfolioCandidateResult,
  b: PortfolioCandidateResult,
  criterion: OwnerSelectionCriterion,
): number {
  switch (criterion) {
    case "route":
      return routeRank[b.decision.route] - routeRank[a.decision.route];
    case "permission":
      return b.permission.score - a.permission.score;
    case "preparedness":
      return b.preparedness.score - a.preparedness.score;
    case "brandId":
      return a.brandId.localeCompare(b.brandId);
  }
}

/**
 * Finds the first criterion that actually separated the winner from the
 * runner-up, so the UI can name the deciding rule instead of asserting a
 * recommendation the numbers appear to contradict.
 */
function explainSelection(
  winner: PortfolioCandidateResult,
  runnerUp: PortfolioCandidateResult | undefined,
): OwnerSelectionBasis | null {
  if (!runnerUp) return null;

  // brandId is last and always breaks a tie, so this loop cannot fall through
  // for two distinct candidates.
  const decidedBy =
    OWNER_SELECTION_ORDER.find((criterion) => compareOn(winner, runnerUp, criterion) !== 0)
    ?? "brandId";

  return {
    decidedBy,
    runnerUpBrandId: runnerUp.brandId,
    winnerValue: criterionValue(winner, decidedBy),
    runnerUpValue: criterionValue(runnerUp, decidedBy),
  };
}

export function resolvePortfolio({
  candidates,
  opportunity,
  scope,
  assetMode,
  evaluatedAt,
}: {
  candidates: PortfolioCandidateInputs[];
  opportunity: Pick<Opportunity, "signalClass" | "usefulUntil">;
  scope: PortfolioScope;
  assetMode: AssetMode;
  evaluatedAt: string;
}): PortfolioResolution {
  const results: PortfolioCandidateResult[] = candidates.map((candidate) => {
    const permission = calculatePermission(candidate.permission);
    const preparedness = calculatePreparedness(candidate.preparedness);
    const blockers = [...candidate.permission.blockers, ...candidate.preparedness.blockers];
    const decision = selectRoute({
      opportunity,
      proof: candidate.proof,
      permission,
      preparedness,
      blockers,
      evaluatedAt,
    });
    return {
      brandId: candidate.brandId,
      displayName: candidate.displayName,
      proof: candidate.proof,
      permission,
      preparedness,
      readiness: decision.readiness,
      decision,
      blockers,
      portfolioConflicts: candidate.portfolioConflicts,
    };
  });

  const ranked = [...results].sort((a, b) => {
    for (const criterion of OWNER_SELECTION_ORDER) {
      const order = compareOn(a, b, criterion);
      if (order !== 0) return order;
    }
    return 0;
  });

  return {
    rulesetVersion: "portfolio-1.0.0",
    scope,
    assetMode,
    selectedBrandId: ranked[0]?.brandId ?? "",
    selectionOrder: OWNER_SELECTION_ORDER,
    selectionBasis: explainSelection(ranked[0], ranked[1]),
    candidates: results,
  };
}
