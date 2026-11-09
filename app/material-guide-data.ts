import data from "./material-guides.json";
import type { Locale } from "./pricing-data";
type Copy = Record<Locale,string>;
type Item = {title:Copy;text:Copy};
export type MaterialGuide = {
  slug:string;metaTitle:Copy;metaDescription:Copy;category:Copy;intro:Copy;selectionHeading:Copy;
  choices:Item[];applications:(Item & {service:string})[];care:Item;orderChecklist:Copy[];
  faq:{q:Copy;a:Copy}[];relatedServices:string[];pricingServices:string[];
  comparisons:{material:string;text:Copy}[];references?:{name:string;url:string}[];
};
export const materialGuides:MaterialGuide[]=data;
export const materialReviewed="2026-11-08";
export function getMaterialGuide(slug:string){return materialGuides.find(guide=>guide.slug===slug);}
