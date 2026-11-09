import publication from "./local-service-publication.json";

// Freeze the existing footprint. Adding a city or service does not automatically
// create an indexable city/service combination; publish reviewed pairs explicitly.
const approvedAreas = new Set<string>(publication.approvedAreas);
const approvedServices = new Set<string>(publication.approvedServices);
const additionalPages = new Set<string>(publication.additionalApprovedPages);
const merged: Record<string, string[]> = publication.mergedServices;

export function hasLocalServicePage(area: string, service: string): boolean {
  return !merged[area]?.includes(service) && (additionalPages.has(`${area}/${service}`)
    || (approvedAreas.has(area) && approvedServices.has(service)));
}

export function localServiceHref(area: string, service: string, locale: "en" | "fr" = "en"): string {
  const hub = `${locale === "fr" ? "/fr" : ""}/areas/${area}`;
  return hasLocalServicePage(area, service) ? `${hub}/${service}` : `${hub}#service-${service}`;
}
