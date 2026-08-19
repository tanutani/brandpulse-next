"use client";

/**
 * The ?static=1 escape hatch.
 *
 * Forces every live step to serve its checked-in answer without touching the
 * network, whatever the server env says. This exists so a presenter on bad
 * conference wifi can guarantee the offline path in one keystroke, rather than
 * discovering mid-demo that a provider is slow.
 *
 * The flag only ever removes network access. There is deliberately no inverse
 * flag that forces live mode from the URL: enabling a paid provider call must
 * stay a server-side decision.
 */

export const STATIC_MODE_PARAM = "static";

/** Reads the flag from a query string. Exported pure so it is testable. */
export function isStaticModeQuery(search: string): boolean {
  const value = new URLSearchParams(search).get(STATIC_MODE_PARAM);
  if (value === null) return false;
  // Bare ?static counts as on; ?static=0 and ?static=false are the only offs.
  return value !== "0" && value.toLowerCase() !== "false";
}

/** False during server rendering, where there is no URL to read. */
export function isStaticMode(): boolean {
  if (typeof window === "undefined") return false;
  return isStaticModeQuery(window.location.search);
}
