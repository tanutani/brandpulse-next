"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useGuide } from "@/components/guide/guide-provider";

/**
 * Anchors the current guide message to its real control. When the anchor is not
 * on this screen the message docks to the bottom and offers the way back, so a
 * direct link never leaves a viewer stranded mid-tour.
 */

const BUBBLE_WIDTH = 320;
const GAP = 12;
const MARGIN = 16;

interface Placement {
  top: number;
  left: number;
  anchored: boolean;
}

export function GuideBubble() {
  const guide = useGuide();
  const pathname = usePathname();
  const [placement, setPlacement] = useState<Placement | null>(null);

  const anchorId = guide.step?.id ?? null;

  const reposition = useCallback(() => {
    if (!anchorId) {
      setPlacement(null);
      return;
    }
    const target = document.querySelector<HTMLElement>(`[data-guide-anchor="${anchorId}"]`);
    if (!target) {
      setPlacement(null);
      return;
    }

    const rect = target.getBoundingClientRect();
    const bubbleHeight = document.querySelector<HTMLElement>("[data-testid='guide-bubble']")
      ?.getBoundingClientRect().height ?? 190;
    // Prefer below the control; flip above when there is not enough room.
    const below = rect.bottom + GAP;
    const fitsBelow = below + bubbleHeight < window.innerHeight;
    const top = fitsBelow ? below : Math.max(MARGIN, rect.top - bubbleHeight - GAP);
    const left = Math.min(
      Math.max(MARGIN, rect.left + rect.width / 2 - BUBBLE_WIDTH / 2),
      Math.max(MARGIN, window.innerWidth - BUBBLE_WIDTH - MARGIN),
    );
    setPlacement({ top, left, anchored: true });
  }, [anchorId]);

  // Highlight the anchored control while its message is showing.
  useEffect(() => {
    if (!anchorId) return;
    const target = document.querySelector<HTMLElement>(`[data-guide-anchor="${anchorId}"]`);
    target?.classList.add("guide-anchor-active");
    return () => target?.classList.remove("guide-anchor-active");
  }, [anchorId, pathname]);

  useEffect(() => {
    if (!anchorId) return;
    // Deferred so a late-mounting control (client state, drawer) is measured
    // after paint rather than during the effect.
    const first = window.setTimeout(reposition, 0);
    const timer = window.setTimeout(reposition, 60);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(timer);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [anchorId, pathname, reposition]);

  const step = guide.step;
  if (!step) return null;

  const style = placement
    ? { top: `${placement.top}px`, left: `${placement.left}px` }
    : { bottom: `${MARGIN}px`, left: "50%", transform: "translateX(-50%)" };

  const onThisScreen = placement !== null;

  return (
    <aside
      className="guide-bubble"
      style={style}
      role="region"
      aria-label="BrandPulse guide"
      data-testid="guide-bubble"
    >
      <div className="guide-bubble-head">
        <span className="guide-voice">
          <MessageSquare aria-hidden="true" size={12} /> BrandPulse guide
        </span>
        <span className="guide-step-count">
          {guide.index + 1}/{guide.totalSteps}
        </span>
      </div>
      <p aria-live="polite">{step.message}</p>
      {!onThisScreen ? (
        <p className="muted small" style={{ marginTop: 8 }}>
          This step is on the {step.screen}.
        </p>
      ) : null}
      <div className="guide-bubble-actions">
        <button className="btn btn-ghost" onClick={guide.skip} type="button">
          Skip tour
        </button>
        {!onThisScreen ? (
          <Link className="btn btn-secondary" href={step.href}>
            Go to {step.screen}
          </Link>
        ) : step.acknowledge ? (
          <button
            className="btn btn-primary"
            onClick={() => guide.completeAction(step.id)}
            type="button"
          >
            {step.acknowledge}
          </button>
        ) : (
          <span className="muted small">Complete the highlighted action</span>
        )}
      </div>
    </aside>
  );
}
