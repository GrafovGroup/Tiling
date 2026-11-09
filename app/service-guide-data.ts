import data from "./service-guides.json";
import type { Locale } from "./pricing-data";

type Copy = Record<Locale, string>;
type SectionItem = { title: Copy; text: Copy };
export type ServiceGuide = {
  slug: string;
  metaTitle: Copy;
  metaDescription: Copy;
  optionsHeading: Copy;
  options: SectionItem[];
  planningHeading: Copy;
  steps: SectionItem[];
  quoteChecklist: Copy[];
  scopeNote: Copy;
  faq: { q: Copy; a: Copy }[];
  relatedServices: string[];
  materials: string[];
};
export const serviceGuides: ServiceGuide[] = data;
export const serviceReviewed = "2026-11-08";
export function getServiceGuide(slug: string) {
  return serviceGuides.find(guide => guide.slug === slug);
}
