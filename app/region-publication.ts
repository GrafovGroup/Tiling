import policy from "./region-publication.json";

// Explicitly reviewed aliases: adding a region never silently retires its URL.
const mergedRegions: Record<string, string> = policy.mergedRegions;
export function mergedRegionArea(slug: string): string | undefined { return Object.hasOwn(mergedRegions, slug) ? mergedRegions[slug] : undefined; }
export function hasRegionDirectory(slug: string): boolean { return !mergedRegionArea(slug); }
export function regionHref(slug: string, locale: "en" | "fr" = "en"): string {
  const area = mergedRegionArea(slug);
  return `${locale === "fr" ? "/fr" : ""}${area ? `/areas/${area}` : `/locations/ontario/${slug}`}`;
}
