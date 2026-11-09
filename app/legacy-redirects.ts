import { areas, getArea, getService, materials, services } from "./data";
import { pricingGuides } from "./pricing-data";
import { ontarioRegions } from "./ontario-data";
import { mergedRegionArea, regionHref } from "./region-publication";
import { hasLocalServicePage } from "./local-service-publication";

export const legacyRoutes: Record<string, string> = {
  "/areas": "/locations",
  "/request-a-match": "/request-a-quote",
  "/for-contractors": "/about",
  "/contractor-review-process": "/how-it-works",
};

export type RouteQuery = Record<string, string | string[] | undefined>;

export function legacyDestination(path: string, query: RouteQuery = {}): string | undefined {
  const french = path.startsWith("/fr/");
  const target = legacyRoutes[(french ? path.slice(3) : path).replace(/\/$/, "")];
  if (!target) return undefined;
  const search = new URLSearchParams();
  for (const [key, values] of Object.entries(query)) {
    for (const value of Array.isArray(values) ? values : values === undefined ? [] : [values]) search.append(key, value);
  }
  return `${french ? "/fr" : ""}${target}${search.size ? `?${search}` : ""}`;
}

/** Only valid, intentionally consolidated routes move; misspellings remain 404s. */
export function localServiceRedirect(path: string, query: RouteQuery = {}): string | undefined {
  const match = path.match(/^(\/fr)?\/areas\/([^/]+)\/([^/]+)\/?$/);
  if (!match) return undefined;
  const [, prefix = "", area, service] = match;
  if (!getArea(area) || !getService(service) || hasLocalServicePage(area, service)) return undefined;
  const search = new URLSearchParams();
  for (const [key, values] of Object.entries(query)) {
    for (const value of Array.isArray(values) ? values : values === undefined ? [] : [values]) search.append(key, value);
  }
  // The original service remains selected in the hub form. Marketing/material
  // context survives, while canonical and language links remain query-free.
  search.set("service", service);
  return `${prefix}/areas/${area}?${search}#service-${service}`;
}

export function regionRedirect(path: string, query: RouteQuery = {}): string | undefined {
  const match = path.match(/^(\/fr)?\/locations\/ontario\/([^/]+)\/?$/);
  if (!match || !mergedRegionArea(match[2])) return undefined;
  const search = new URLSearchParams();
  for (const [key, values] of Object.entries(query)) {
    for (const value of Array.isArray(values) ? values : values === undefined ? [] : [values]) search.append(key, value);
  }
  return regionHref(match[2], match[1] ? "fr" : "en") + (search.size ? `?${search}` : "");
}

const staticPaths = new Set(["/", "/services", "/materials", "/pricing", "/locations", "/locations/ontario", "/about", "/contact", "/how-it-works", "/request-a-quote", "/editorial-standards", "/privacy", "/terms", ...Object.keys(legacyRoutes)]);
const areaSlugs = new Set(areas.map(item => item.slug));
const serviceSlugs = new Set(services.map(item => item.slug));
const materialSlugs = new Set(materials.map(item => item.slug));
const guideSlugs = new Set(pricingGuides.map(item => item.slug));
const regionSlugs = new Set(ontarioRegions.map(item => item.slug));

/** Normalize only aliases of registered content. Leave assets, API and transport routes alone. */
function normalizedPublicPath(path: string): string {
  const candidate = path.replace(/%[0-9a-f]{2}/gi, encoded => {
    const character = String.fromCharCode(parseInt(encoded.slice(1), 16));
    return /^[a-z0-9._~-]$/i.test(character) ? character : encoded;
  }).replace(/\/+/g, "/").replace(/\/$/, "").toLowerCase() || "/";
  const base = candidate === "/fr" ? "/" : candidate.startsWith("/fr/") ? candidate.slice(3) : candidate;
  const parts = base.split("/").slice(1);
  const known = staticPaths.has(base)
    || parts.length === 2 && (parts[0] === "areas" && areaSlugs.has(parts[1]) || parts[0] === "services" && serviceSlugs.has(parts[1]) || parts[0] === "materials" && materialSlugs.has(parts[1]) || parts[0] === "pricing" && guideSlugs.has(parts[1]))
    || parts.length === 3 && (parts[0] === "areas" && areaSlugs.has(parts[1]) && serviceSlugs.has(parts[2]) || parts[0] === "locations" && parts[1] === "ontario" && regionSlugs.has(parts[2]));
  return known ? candidate : path;
}

/** Consolidate public aliases in one hop, retaining paths and project context. */
export function canonicalRedirect(input: URL): URL | null {
  const target = new URL(input);
  if (target.hostname === "tiling.ca" || target.hostname === "www.tiling.ca") {
    target.protocol = "https:";
    target.hostname = "tiling.ca";
    target.port = "";
  }
  target.pathname = normalizedPublicPath(target.pathname);
  const moved = legacyDestination(target.pathname);
  if (moved) target.pathname = moved;
  const query = Object.fromEntries([...new Set(target.searchParams.keys())].map(key => [key, target.searchParams.getAll(key)]));
  const consolidated = regionRedirect(target.pathname, query) || localServiceRedirect(target.pathname, query);
  if (consolidated) {
    const destination = new URL(consolidated, target);
    target.pathname = destination.pathname;
    target.search = destination.search;
    target.hash = destination.hash;
  }
  return target.href === input.href ? null : target;
}
