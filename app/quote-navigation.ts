import { getService } from "./data";
import { enquiryContext, type EnquiryQuery } from "./enquiry-data";
import { acceptsQuoteContext, getPricingGuide } from "./pricing-data";

/** Match the page's primary quote action, keeping only validated project details. */
export function navigationQuoteHref(url: URL): string {
  // Vinext serves the same route’s React navigation payload at a .rsc URL.
  const parts = url.pathname.replace(/\.rsc$/, "").split("/").filter(Boolean);
  const prefix = parts[0] === "fr" ? "/fr" : "";
  if (prefix) parts.shift();
  const [section, slug, localService] = parts;
  const query: EnquiryQuery = Object.create(null);
  for (const [key, value] of url.searchParams) {
    // Repeated fields are ambiguous, just as they are in page searchParams.
    query[key] = query[key] === undefined ? value : [];
  }

  if (section === "areas" && slug) {
    query.area = slug;
    if (localService) query.service = localService;
  } else if (section === "services" && slug) {
    query.service = slug;
  } else if (section === "materials") {
    if (slug) query.material = slug;
    if (typeof query.service !== "string" || !getService(query.service)) query.service = "tile-supply-delivery";
  } else if (section === "pricing" && slug) {
    const guide = getPricingGuide(slug);
    if (guide && (typeof query.service !== "string" || !acceptsQuoteContext(guide, query.service))) {
      query.service = guide.service;
    }
  }
  return prefix + "/request-a-quote" + enquiryContext(query).suffix;
}
