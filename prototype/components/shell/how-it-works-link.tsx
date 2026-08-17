"use client";

import { BookOpen } from "lucide-react";

/** Event the shell listens for, so any screen can open the methodology drawer. */
export const OPEN_METHODOLOGY_EVENT = "brandpulse:open-methodology";

export function openMethodologyDrawer(): void {
  window.dispatchEvent(new Event(OPEN_METHODOLOGY_EVENT));
}

export function HowItWorksLink({ className = "btn btn-secondary" }: { className?: string }) {
  return (
    <button className={className} onClick={openMethodologyDrawer} type="button">
      <BookOpen aria-hidden="true" size={15} /> How BrandPulse works
    </button>
  );
}
