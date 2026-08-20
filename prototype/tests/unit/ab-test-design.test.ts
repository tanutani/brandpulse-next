import { describe, expect, it } from "vitest";

import { calculateAbTestDiagnostics, REXONA_AB_EXAMPLE } from "@/lib/experiment/ab-design";

describe("A/B design diagnostics", () => {
  it("returns no MDE and insufficient exposure at zero exposure", () => {
    const result = calculateAbTestDiagnostics({ ...REXONA_AB_EXAMPLE, expectedExposurePerArm: 0 });
    expect(result.minimumDetectableEffect).toBeNull();
    expect(result.exposureSufficient).toBe(false);
  });

  it("flags requested power below the 0.80 design floor", () => {
    const result = calculateAbTestDiagnostics({ ...REXONA_AB_EXAMPLE, power: 0.7 });
    expect(result.powerAdequate).toBe(false);
    expect(result.exposureSufficient).toBe(false);
  });

  it("reports both contamination mechanisms", () => {
    const result = calculateAbTestDiagnostics({
      ...REXONA_AB_EXAMPLE,
      mediaOverlap: true,
      deliveryCatchmentOverlap: true,
    });
    expect(result.contaminationWarnings).toHaveLength(2);
  });

  it("reports incomplete registration as a literal fraction", () => {
    const result = calculateAbTestDiagnostics({
      ...REXONA_AB_EXAMPLE,
      preregisteredFields: { hypothesis: true, primaryMetric: false, stopRule: false },
    });
    expect(result.preregistration).toEqual({ completed: 1, total: 3, fraction: 1 / 3 });
  });

  it("keeps the worked example sufficient and deterministic", () => {
    const result = calculateAbTestDiagnostics(REXONA_AB_EXAMPLE);
    expect(result.minimumDetectableEffect).toBeCloseTo(0.0112, 3);
    expect(result.exposureSufficient).toBe(true);
    expect(result.contaminationWarnings).toEqual([]);
  });
});
