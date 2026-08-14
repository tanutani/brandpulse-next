import { Radio, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand-lockup" href="/">
          <span className="brand-mark"><Radio aria-hidden="true" size={18} /></span>
          <span className="brand-word">BrandPulse NEXT<small>Causal opportunity router</small></span>
        </Link>
        <div className="topbar-meta">
          <span className="snapshot-date">Snapshot · 15 Aug 2026</span>
          <span className="mode-badge"><ShieldCheck aria-hidden="true" size={13} /> Static mode</span>
        </div>
      </header>
      <div className="disclosure-banner" role="note">
        Competition prototype · Public observations and clearly labeled synthetic HUL-like data · No real HUL integration
      </div>
      {children}
    </div>
  );
}
