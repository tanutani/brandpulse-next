"use client";

import { Activity, BookOpen, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { GuideBubble } from "@/components/guide/guide-bubble";
import { GuideProvider, useGuide } from "@/components/guide/guide-provider";
import { DecisionPulse } from "@/components/shell/decision-pulse";
import { MethodologyDrawer } from "@/components/shell/methodology-drawer";
import { OPEN_METHODOLOGY_EVENT } from "@/components/shell/how-it-works-link";
import { getPulsePosition, resetBrandPulseStorage, type JourneyProgress } from "@/lib/demo/journey";
import { JOURNEY_CHANGED_EVENT, LocalJourneyStore } from "@/lib/persistence/local-journey-store";

const EMPTY_PROGRESS: JourneyProgress = {
  scopeAndRightsResolved: false,
  sprintLocked: false,
  outcomeRevealed: false,
};

const WORKSPACE_LABELS: Array<[RegExp, string]> = [
  [/^\/opportunities\/.+/, "Decision record"],
  [/^\/opportunities$/, "Pulse Room"],
  [/^\/resolver\//, "Ownership view"],
  [/^\/sprint\//, "Bounded test"],
  [/^\/review\//, "Activation Review"],
];

function workspaceLabel(pathname: string): string | null {
  return WORKSPACE_LABELS.find(([pattern]) => pattern.test(pathname))?.[1] ?? null;
}

/** Mirrors persisted journey state so the pulse can follow it from the layout. */
function useJourneyProgress(): JourneyProgress {
  const [progress, setProgress] = useState<JourneyProgress>(EMPTY_PROGRESS);

  const read = useCallback(() => {
    try {
      const journey = new LocalJourneyStore(window.localStorage).load();
      const next: JourneyProgress =
        journey
          ? {
              scopeAndRightsResolved:
                journey.scope === "four_city" && journey.assetMode === "rights_safe_creator",
              sprintLocked: Boolean(journey.sprint?.lockedAt),
              outcomeRevealed: journey.outcome !== null,
            }
          : EMPTY_PROGRESS;
      queueMicrotask(() => setProgress(next));
    } catch {
      queueMicrotask(() => setProgress(EMPTY_PROGRESS));
    }
  }, []);

  useEffect(() => {
    read();
    window.addEventListener(JOURNEY_CHANGED_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(JOURNEY_CHANGED_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, [read]);

  return progress;
}

function ShellChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const guide = useGuide();
  const progress = useJourneyProgress();
  const [presenting, setPresenting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const position = getPulsePosition(pathname, progress);
  const workspace = workspaceLabel(pathname);

  useEffect(() => {
    const open = () => setDrawerOpen(true);
    window.addEventListener(OPEN_METHODOLOGY_EVENT, open);
    return () => window.removeEventListener(OPEN_METHODOLOGY_EVENT, open);
  }, []);

  function resetDemo() {
    setResetting(true);
    try {
      resetBrandPulseStorage(window.localStorage);
    } catch {
      // Nothing to clear when storage is unavailable.
    }
    router.push(`/opportunities`);
    router.refresh();
    window.setTimeout(() => setResetting(false), 400);
  }

  function toggleGuide() {
    if (guide.status === "running") guide.skip();
    // A finished tour restarts; a skipped one resumes where it stopped.
    else if (guide.status === "finished") guide.restart();
    else guide.start();
  }

  const GUIDE_LABELS = {
    inactive: "Start guide",
    running: "Skip guide",
    skipped: "Resume guide",
    finished: "Restart guide",
  } as const;
  const guideLabel = GUIDE_LABELS[guide.status];

  return (
    <div className={`app-shell${presenting ? " presentation-mode" : ""}`}>
      <header className="topbar">
        <div className="shell-frame topbar-inner">
          <Link className="brand-lockup" href="/">
            <span className="brand-mark" aria-hidden="true">
              <Activity size={17} strokeWidth={2.5} />
            </span>
            <span>
              <span className="brand-name">BrandPulse NEXT</span>
              <span className="brand-concept-note">
                Techtonic competition concept · Not an official HUL product
              </span>
            </span>
          </Link>

          {workspace ? (
            <span className="workspace-label">
              <span>Workspace</span>
              <strong>{workspace}</strong>
            </span>
          ) : (
            <span />
          )}

          <div className="topbar-actions">
            <span className="mode-chip is-synthetic" title="All HUL-like operating records are invented aggregates">
              Synthetic data
            </span>
            <button className="btn btn-quiet" onClick={() => setDrawerOpen(true)} type="button">
              <BookOpen aria-hidden="true" size={13} /> How it works
            </button>
            <button className="btn btn-quiet" onClick={toggleGuide} type="button">
              {guideLabel}
            </button>
            <button className="btn btn-quiet" onClick={resetDemo} type="button" disabled={resetting}>
              <RotateCcw aria-hidden="true" size={13} /> {resetting ? "Resetting…" : "Reset"}
            </button>
            <button
              className="btn btn-quiet"
              onClick={() => setPresenting(true)}
              type="button"
              aria-pressed={presenting}
            >
              <Maximize2 aria-hidden="true" size={13} /> Present
            </button>
          </div>
        </div>
      </header>

      <div className="disclosure-strip" role="note">
        <div className="shell-frame">
          Unofficial Techtonic Season 8 concept · Dated public observations and clearly labelled
          synthetic HUL-like data · No real HUL integration
        </div>
      </div>

      {position ? <DecisionPulse position={position} /> : null}

      <main className="shell-body">{children}</main>

      {presenting ? (
        <button className="btn btn-secondary presentation-exit" onClick={() => setPresenting(false)} type="button">
          <Minimize2 aria-hidden="true" size={15} /> Exit presentation
        </button>
      ) : null}

      {drawerOpen ? <MethodologyDrawer onClose={() => setDrawerOpen(false)} /> : null}
      <GuideBubble />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <GuideProvider>
      <ShellChrome>{children}</ShellChrome>
    </GuideProvider>
  );
}
