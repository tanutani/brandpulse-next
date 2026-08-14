import type {
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

  const ranked = [...results].sort((a, b) =>
    routeRank[b.decision.route] - routeRank[a.decision.route]
    || b.permission.score - a.permission.score
    || b.preparedness.score - a.preparedness.score
    || a.brandId.localeCompare(b.brandId),
  );

  return {
    rulesetVersion: "portfolio-1.0.0",
    scope,
    assetMode,
    selectedBrandId: ranked[0]?.brandId ?? "",
    candidates: results,
  };
}
