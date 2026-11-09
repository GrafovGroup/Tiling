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
  return target.href === input.href ? null : target;
}
