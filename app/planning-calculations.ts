export const SQ_FT_PER_SQ_M = 1 / (0.3048 * 0.3048);
export type MeasurementUnit = "ft" | "m";
export type Surface = { length: string; width: string };
export function parseAmount(value: string): number | null {
  const clean = value.trim().replace(",", ".");
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(clean)) return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
}
export function calculateQuantity(input: { mode: "dimensions" | "area"; unit: MeasurementUnit; surfaces: Surface[]; area: string; waste: string; boxCoverage: string }) {
  const waste = parseAmount(input.waste);
  if (waste === null || waste < 0 || waste > 30) return { error: "waste" as const };
  let area: number;
  if (input.mode === "area") {
    const parsed = parseAmount(input.area);
    if (parsed === null || parsed <= 0) return { error: "area" as const };
    area = parsed;
  } else {
    if (!input.surfaces.length || input.surfaces.length > 10) return { error: "dimensions" as const };
    area = 0;
    for (const surface of input.surfaces) {
      const length = parseAmount(surface.length), width = parseAmount(surface.width);
      if (length === null || width === null || length <= 0 || width <= 0 || length > 1000 || width > 1000) return { error: "dimensions" as const };
      area += length * width;
    }
  }
  const areaSqFt = area * (input.unit === "m" ? SQ_FT_PER_SQ_M : 1);
  if (!Number.isFinite(areaSqFt) || areaSqFt > 1_000_000) return { error: "area" as const };
  const orderArea = area * (1 + waste / 100);
  const boxCoverage = input.boxCoverage.trim() ? parseAmount(input.boxCoverage) : null;
  if (input.boxCoverage.trim() && (boxCoverage === null || boxCoverage <= 0 || boxCoverage > 10000)) return { error: "box" as const };
  // Remove machine-precision noise at exact carton boundaries, then round up.
  const cartons = boxCoverage ? Math.ceil(Number((orderArea / boxCoverage).toPrecision(12))) : null;
  return { area, areaSqFt, waste, orderArea, cartons };
}
export function convertMeasurement(value: string, from: MeasurementUnit, to: MeasurementUnit, squared = false) {
  const n = parseAmount(value);
  if (n === null || from === to) return value;
  const factor = from === "ft" ? 0.3048 : 1 / 0.3048;
  return String(Number((n * (squared ? factor * factor : factor)).toPrecision(14)));
}
export const floorBudgetRates = [
  { id: "zelta", low: 13, high: 34 },
  { id: "name", low: 8, high: 27 },
  { id: "prime", low: 8, high: 15 },
];
export function floorBudget(areaSqFt: number, source: string) {
  const rate = floorBudgetRates.find(item => item.id === source);
  if (!rate || !Number.isFinite(areaSqFt) || areaSqFt <= 0 || areaSqFt > 1_000_000) return null;
  return { low: areaSqFt * rate.low, high: areaSqFt * rate.high };
}
export function planningContext(query: Record<string, string | string[] | undefined>, locale: "en" | "fr") {
  if (typeof query.calc_area !== "string" || typeof query.calc_waste !== "string" || (typeof query.calc_unit !== "string" || !["ft", "m"].includes(query.calc_unit))) return null;
  const areaSqFt = parseAmount(query.calc_area), waste = parseAmount(query.calc_waste);
  if (areaSqFt === null || areaSqFt <= 0 || areaSqFt > 1_000_000 || waste === null || waste > 30) return null;
  const unit = query.calc_unit as MeasurementUnit, fr = locale === "fr";
  const n = (value: number) => new Intl.NumberFormat(fr ? "fr-CA" : "en-CA", { maximumFractionDigits: 2 }).format(value);
  const area = areaSqFt / (unit === "m" ? SQ_FT_PER_SQ_M : 1), label = unit === "m" ? "m²" : fr ? "pi²" : "sq. ft.";
  return {
    areaSqFt, waste, unit,
    summary: fr ? `Mesures indicatives du calculateur : ${n(area)} ${label} de surface; avec ${n(waste)} % de pertes, ${n(area * (1 + waste / 100))} ${label} de carreaux avant l’arrondi aux boîtes. À vérifier sur place; il ne s’agit pas d’une soumission.` : `Planning measurements from the calculator: ${n(area)} ${label} of surface; with ${n(waste)}% allowance, ${n(area * (1 + waste / 100))} ${label} of tile before rounding to full boxes. Measurements need verification; this is not a quote.`,
  };
}
