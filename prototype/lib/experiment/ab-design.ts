export interface AbTestDesignInputs {
  baselineConversion: number;
  expectedExposurePerArm: number;
  alpha: number;
  power: number;
  minimumEffectOfInterest: number;
  treatmentCells: string[];
  comparisonCells: string[];
  mediaOverlap: boolean;
  deliveryCatchmentOverlap: boolean;
  preregisteredFields: Record<string, boolean>;
}

export interface AbTestDiagnostics {
  minimumDetectableEffect: number | null;
  exposureSufficient: boolean;
  powerAdequate: boolean;
  contaminationWarnings: string[];
  preregistration: { completed: number; total: number; fraction: number };
}

/** Acklam approximation; deterministic and sufficiently precise for a design diagnostic. */
function inverseNormal(probability: number): number {
  if (probability <= 0 || probability >= 1) return Number.NaN;
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const low = 0.02425;
  const high = 1 - low;
  if (probability < low) {
    const q = Math.sqrt(-2 * Math.log(probability));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (probability > high) return -inverseNormal(1 - probability);
  const q = probability - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
    / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

export function calculateAbTestDiagnostics(inputs: AbTestDesignInputs): AbTestDiagnostics {
  const validRate = inputs.baselineConversion > 0 && inputs.baselineConversion < 1;
  const validExposure = Number.isFinite(inputs.expectedExposurePerArm) && inputs.expectedExposurePerArm > 0;
  const validAlpha = inputs.alpha > 0 && inputs.alpha < 1;
  const validPower = inputs.power > 0.5 && inputs.power < 1;
  const powerAdequate = validPower && inputs.power >= 0.8;

  const zAlpha = validAlpha ? inverseNormal(1 - inputs.alpha / 2) : Number.NaN;
  const zPower = validPower ? inverseNormal(inputs.power) : Number.NaN;
  const standardError = validRate && validExposure
    ? Math.sqrt((2 * inputs.baselineConversion * (1 - inputs.baselineConversion)) / inputs.expectedExposurePerArm)
    : Number.NaN;
  const rawMde = (zAlpha + zPower) * standardError;
  const minimumDetectableEffect = Number.isFinite(rawMde) ? rawMde : null;

  const contaminationWarnings = [
    ...(inputs.mediaOverlap ? ["Treatment and comparison cells share media delivery."] : []),
    ...(inputs.deliveryCatchmentOverlap ? ["Delivery catchments overlap across treatment and comparison cells."] : []),
    ...(inputs.treatmentCells.length === 0 || inputs.comparisonCells.length === 0
      ? ["At least one treatment and one comparison cell are required."]
      : []),
  ];
  const registrations = Object.values(inputs.preregisteredFields);
  const completed = registrations.filter(Boolean).length;
  const total = registrations.length;

  return {
    minimumDetectableEffect,
    exposureSufficient: Boolean(
      powerAdequate
      && minimumDetectableEffect !== null
      && inputs.minimumEffectOfInterest > 0
      && minimumDetectableEffect <= inputs.minimumEffectOfInterest,
    ),
    powerAdequate,
    contaminationWarnings,
    preregistration: { completed, total, fraction: total ? completed / total : 0 },
  };
}

export const REXONA_AB_EXAMPLE: AbTestDesignInputs = {
  baselineConversion: 0.059,
  expectedExposurePerArm: 7_000,
  alpha: 0.05,
  power: 0.8,
  minimumEffectOfInterest: 0.012,
  treatmentCells: ["Mumbai-West", "Delhi-NCR"],
  comparisonCells: ["Pune", "Ahmedabad"],
  mediaOverlap: false,
  deliveryCatchmentOverlap: false,
  preregisteredFields: {
    hypothesis: true,
    primaryMetric: true,
    treatmentCells: true,
    comparisonCells: true,
    measurementWindow: true,
    scaleRule: true,
    killRule: true,
    budgetCap: true,
  },
};
