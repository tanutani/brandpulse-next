import type {
  Assumption,
  AssetMode,
  CausalSprint,
  DecisionBlocker,
  HumanDecision,
  Opportunity,
  PermissionInputs,
  PortfolioScope,
  PreparednessInputs,
  ProofInputs,
} from "@/lib/contracts";

/**
 * The authoring format for a use case.
 *
 * It carries inputs only. There is deliberately no `score`, no `components`, no
 * `readiness`, no `recommendedRoute` and no `routeReasonCodes` field anywhere in
 * this file: those are return values of the scorers and the route ladder, so a
 * fixture whose displayed number disagrees with the engine cannot be written.
 */

/** Proof inputs minus the evidence array, which the builder shares from the opportunity. */
export type ProofSource = Omit<ProofInputs, "evidence">;

/** Permission inputs minus the identity the builder fills in from brandId. */
export type PermissionSource = Omit<PermissionInputs, "brandId" | "blockers"> & {
  blockers?: DecisionBlocker[];
};

/** Preparedness inputs minus identity and minus the scope/mode the caller supplies. */
export type PreparednessSource = Omit<
  PreparednessInputs,
  "brandId" | "scope" | "assetMode" | "blockers"
> & {
  blockers?: DecisionBlocker[];
};

/**
 * Preparedness is the one gate that genuinely moves with the decision: narrowing
 * scope changes what stock can serve, and switching creative changes what rights
 * clear. It is authored as a function of both so the contract screen and the
 * resolver read the same definition instead of keeping separate copies that can
 * disagree.
 */
export type PreparednessFor = (
  scope: PortfolioScope,
  assetMode: AssetMode,
) => PreparednessSource;

export interface BrandSource {
  brandId: string;
  displayName: string;
  /** Permission does not vary with scope or rights: one brand, one value. */
  permission: PermissionSource;
  preparedness: PreparednessFor;
  portfolioConflicts?: string[];
}

/**
 * At least three brands, enforced by the tuple rather than by Zod's `.min(3)`.
 * A use case with two candidates now fails `tsc` instead of failing at load.
 */
export type BrandSourceTriple = [BrandSource, BrandSource, BrandSource, ...BrandSource[]];

export interface UseCaseSource {
  contractId: string;
  version: number;
  /** Evidence is authored literally here, including sourceUrl and capturedAt. */
  opportunity: Opportunity;
  /**
   * One Proof per opportunity. Proof asks whether the signal is real, which is a
   * question about the world rather than about any candidate brand.
   */
  proof: ProofSource;
  brands: BrandSourceTriple;
  selectedBrandId: string | null;
  assumptions: Assumption[];
  causalSprint?: CausalSprint | null;
  humanDecisions?: HumanDecision[];
  /** The clock the route ladder is evaluated against. */
  evaluatedAt: string;
  /**
   * The state the contract screen shows before anyone touches a control. For the
   * guided journey this is the unresolved starting position, so the contract
   * opens on the problem rather than on its solution.
   */
  storedScope: PortfolioScope;
  storedAssetMode: AssetMode;
}
