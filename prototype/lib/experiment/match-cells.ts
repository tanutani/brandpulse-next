export interface CellProfile {
  id: string;
  serviceLevel: number;
  baselineConversion: number;
  categorySearchIndex: number;
}

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

export function scoreCellComparability(treatment: CellProfile[], comparison: CellProfile[]): number {
  if (!treatment.length || !comparison.length) return 0;
  const serviceGap = Math.abs(average(treatment.map((cell) => cell.serviceLevel)) - average(comparison.map((cell) => cell.serviceLevel)));
  const conversionGap = Math.abs(average(treatment.map((cell) => cell.baselineConversion)) - average(comparison.map((cell) => cell.baselineConversion)));
  const searchGap = Math.abs(average(treatment.map((cell) => cell.categorySearchIndex)) - average(comparison.map((cell) => cell.categorySearchIndex)));
  return Math.round(Math.max(0, Math.min(100, 100 - serviceGap * 400 - conversionGap * 1000 - searchGap * 1.5)));
}
