import { CircleAlert } from "lucide-react";

export const SYSTEM_STATE_COPY = {
  loading: { title: "Restoring the decision contract", detail: "The checked-in snapshot and local version history are loading." },
  empty: { title: "No bundled decision is available", detail: "Choose a validated opportunity from the Pulse Board." },
  insufficient_evidence: { title: "Evidence is insufficient", detail: "The system will not manufacture confidence; add an independent source family or wait for the stated review trigger." },
  expired: { title: "The useful window has expired", detail: "This opportunity cannot advance. Its evidence and rejection reason remain available for replay." },
  policy_blocked: { title: "Policy blocks this activation", detail: "Resolve the named rights, claims, disclosure, inclusion, or expiry rule before requesting approval." },
  service_degraded: { title: "Live synthesis is unavailable", detail: "The checked-in evidence summary is active; no score, route, or approval has changed." },
} as const;

export type SystemStateKind = keyof typeof SYSTEM_STATE_COPY;

export function SystemState({
  variant = "service_degraded",
  title,
  detail,
}: {
  variant?: SystemStateKind;
  title?: string;
  detail?: string;
}) {
  const copy = SYSTEM_STATE_COPY[variant];
  return (
    <section className={`system-state system-state-${variant}`} role="status">
      <CircleAlert aria-hidden="true" size={22} />
      <h2>{title ?? copy.title}</h2>
      <p>{detail ?? copy.detail}</p>
    </section>
  );
}
