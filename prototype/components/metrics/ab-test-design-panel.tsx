import { calculateAbTestDiagnostics, REXONA_AB_EXAMPLE } from "@/lib/experiment/ab-design";

export function AbTestDesignPanel() {
  const result = calculateAbTestDiagnostics(REXONA_AB_EXAMPLE);
  const mde = result.minimumDetectableEffect === null
    ? "Unavailable"
    : `${(result.minimumDetectableEffect * 100).toFixed(2)}pp`;

  return (
    <section className="indicator-panel" aria-labelledby="ab-design-title">
      <div className="section-head">
        <div>
          <p className="section-kicker">Non-routing methodology check</p>
          <h3 id="ab-design-title">A/B test design · Rexona geo-holdout</h3>
        </div>
        <span className="mode-chip">Specified design</span>
      </div>
      <p className="small muted">
        Synthetic inputs: 5.9% baseline, 7,000 expected exposures per arm, α 0.05,
        80% power and a 1.2pp minimum effect of interest.
      </p>
      <div className="indicator-grid" style={{ marginTop: "var(--s3)" }}>
        <div><span>Minimum detectable effect</span><strong>{mde}</strong></div>
        <div><span>Exposure sufficiency</span><strong>{result.exposureSufficient ? "Sufficient" : "Insufficient"}</strong></div>
        <div><span>Contamination</span><strong>{result.contaminationWarnings.length ? `${result.contaminationWarnings.length} warning(s)` : "No flags"}</strong></div>
        <div><span>Pre-registration</span><strong>{result.preregistration.completed}/{result.preregistration.total}</strong></div>
      </div>
      <p className="small muted" style={{ marginTop: "var(--s3)" }}>
        These diagnostics cannot change Proof, Permission, Preparedness, the route, or the interactive bounded test.
      </p>
    </section>
  );
}
