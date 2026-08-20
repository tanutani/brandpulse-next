import { CONTRACT_STORAGE_KEY } from "@/lib/persistence/local-contract-store";
import { JOURNEY_STORAGE_KEY, LEGACY_JOURNEY_STORAGE_KEY } from "@/lib/persistence/local-journey-store";

export const HERO_OPPORTUNITY_ID = "opp-extra-time-sweat-confidence";

/** The Act case, kept playable so a second journey ends somewhere different. */
export const ACT_OPPORTUNITY_ID = "opp-surf-first-monsoon";

/**
 * Opportunities that can be walked past the contract screen.
 *
 * Deliberately not every use case. The resolver, sprint and review screens each
 * need a scope story, an experiment design and an activation package, and a
 * screen offering controls that lead nowhere is worse than one that says it is
 * out of scope. The rest of the catalogue is readable but not playable.
 */
export const PLAYABLE_OPPORTUNITY_IDS: readonly string[] = [
  HERO_OPPORTUNITY_ID,
  ACT_OPPORTUNITY_ID,
];

export function isPlayableOpportunity(opportunityId: string): boolean {
  return PLAYABLE_OPPORTUNITY_IDS.includes(opportunityId);
}

export const GUIDE_STORAGE_KEY = "brandpulse-next:guide:1.0.0";

/**
 * Every key BrandPulse owns. Reset Demo removes exactly these and nothing else,
 * so an unrelated key in the same browser profile survives.
 */
export const BRANDPULSE_STORAGE_KEYS = [
  CONTRACT_STORAGE_KEY,
  JOURNEY_STORAGE_KEY,
  LEGACY_JOURNEY_STORAGE_KEY,
  GUIDE_STORAGE_KEY,
] as const;

export function resetBrandPulseStorage(storage: Storage): void {
  for (const key of BRANDPULSE_STORAGE_KEYS) storage.removeItem(key);
}

/* ---------------------------------------------------------------------------
   Decision Pulse
   ------------------------------------------------------------------------ */

export type PulseStationId =
  | "signal"
  | "evidence"
  | "route"
  | "blocked"
  | "test"
  | "learning";

export interface PulseStation {
  id: PulseStationId;
  label: string;
  /** Accent that this station contributes to the rail. */
  accent: string;
}

export const PULSE_STATIONS: PulseStation[] = [
  { id: "signal", label: "Signal", accent: "var(--signal-teal)" },
  { id: "evidence", label: "Evidence", accent: "var(--brand-primary)" },
  { id: "route", label: "Route", accent: "var(--decision-yellow)" },
  { id: "blocked", label: "Blocked action", accent: "var(--block-red)" },
  { id: "test", label: "Approval", accent: "var(--portfolio-violet)" },
  { id: "learning", label: "Learning", accent: "var(--brand-deep)" },
];

export interface PulsePosition {
  /** Station the viewer is looking at now. */
  activeIndex: number;
  /** How many stations are finished, so the rail can fill behind the marker. */
  completedCount: number;
}

export interface JourneyProgress {
  scopeAndRightsResolved: boolean;
  sprintLocked: boolean;
  outcomeRevealed: boolean;
}

/**
 * Maps the current screen plus persisted progress onto the rail. Kept pure so
 * the mapping is unit-testable without a browser.
 */
export function getPulsePosition(
  pathname: string,
  progress: JourneyProgress,
): PulsePosition | null {
  if (pathname.startsWith("/review/")) {
    return { activeIndex: 5, completedCount: progress.outcomeRevealed ? 6 : 5 };
  }
  if (pathname.startsWith("/sprint/")) {
    return { activeIndex: 4, completedCount: progress.sprintLocked ? 5 : 4 };
  }
  if (pathname.startsWith("/resolver/")) {
    return { activeIndex: 3, completedCount: progress.scopeAndRightsResolved ? 4 : 3 };
  }
  if (pathname.startsWith("/opportunities/")) {
    return { activeIndex: 1, completedCount: 1 };
  }
  if (pathname === "/opportunities") {
    return { activeIndex: 0, completedCount: 0 };
  }
  // The cover carries no pulse: the journey has not started.
  return null;
}

/* ---------------------------------------------------------------------------
   Guided conversation
   ------------------------------------------------------------------------ */

/** Anchors are declared on the real controls via data-guide-anchor. */
export type GuideAnchorId =
  | "replay-signal"
  | "run-ai-analysis"
  | "open-hero"
  | "scope-four-city"
  | "asset-creator"
  | "lock-sprint"
  | "rights-check"
  | "variant-corrected"
  | "approve"
  | "reveal-result"
  | "ledger";

export interface GuideStep {
  id: GuideAnchorId;
  message: string;
  /** Where the anchor lives, so a stranded viewer can be offered the way back. */
  href: string;
  screen: string;
  /**
   * Observation steps have nothing to click, so they carry an explicit
   * acknowledgement. Action steps advance only when the real control succeeds.
   */
  acknowledge?: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: "replay-signal",
    message:
      "Start here. Replay the five-second window and watch the signal arrive from six different sources.",
    href: "/opportunities",
    screen: "Pulse Room",
  },
  {
    id: "run-ai-analysis",
    message:
      "Now let Gemini group that evidence and argue against it. It can summarise and challenge — it cannot decide.",
    href: "/opportunities",
    screen: "Pulse Room",
  },
  {
    id: "open-hero",
    message: "Open the Rexona decision to see the evidence chain behind that summary.",
    href: "/opportunities",
    screen: "Pulse Room",
  },
  {
    id: "scope-four-city",
    message:
      "National stock cannot serve the demand this would create. Narrow the scope to the four cities that can.",
    href: `/resolver/${HERO_OPPORTUNITY_ID}`,
    screen: "Ownership view",
  },
  {
    id: "asset-creator",
    message:
      "Match footage has no usage rights. Switch to rights-safe creator content and watch Preparedness recalculate.",
    href: `/resolver/${HERO_OPPORTUNITY_ID}`,
    screen: "Ownership view",
  },
  {
    id: "lock-sprint",
    message:
      "Fix the budget, metric, window and decision rules before any result exists. Lock the ₹5,00,000 experiment.",
    href: `/sprint/${HERO_OPPORTUNITY_ID}`,
    screen: "Bounded test",
  },
  {
    id: "rights-check",
    message:
      "RIGHTS-001 has blocked the match-footage variant. No score and no model answer can override this rule.",
    href: `/review/${HERO_OPPORTUNITY_ID}`,
    screen: "Activation Review",
    acknowledge: "Understood",
  },
  {
    id: "variant-corrected",
    message: "Select the corrected creator-led variant and every policy check turns green.",
    href: `/review/${HERO_OPPORTUNITY_ID}`,
    screen: "Activation Review",
  },
  {
    id: "approve",
    message: "A named human approves this exact contract version. Nothing activates without that record.",
    href: `/review/${HERO_OPPORTUNITY_ID}`,
    screen: "Activation Review",
  },
  {
    id: "reveal-result",
    message:
      "Only now is the result revealed, and it is judged against the rules locked before exposure.",
    href: `/review/${HERO_OPPORTUNITY_ID}`,
    screen: "Activation Review",
  },
  {
    id: "ledger",
    message:
      "Decision history keeps the whole chain — evidence, the human change, the approval and the outcome.",
    href: `/review/${HERO_OPPORTUNITY_ID}`,
    screen: "Decision history",
    acknowledge: "Finish",
  },
];
