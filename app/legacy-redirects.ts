import { getArea, getService } from "./data";
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

/** Consolidate public aliases in one hop, retaining paths and project context. */
export function canonicalRedirect(input: URL): URL | null {
  const target = new URL(input);
  if (target.hostname === "tiling.ca" || target.hostname === "www.tiling.ca") {
    target.protocol = "https:";
    target.hostname = "tiling.ca";
    target.port = "";
  }
  const moved = legacyDestination(target.pathname);
  if (moved) target.pathname = moved;
  const query = Object.fromEntries([...new Set(target.searchParams.keys())].map(key => [key, target.searchParams.getAll(key)]));
  const consolidated = localServiceRedirect(target.pathname, query);
  if (consolidated) {
    const destination = new URL(consolidated, target);
    target.pathname = destination.pathname;
    target.search = destination.search;
    target.hash = destination.hash;
  }
  return target.href === input.href ? null : target;
}
