import dates from "./content-dates.json";
import { ontarioRegions } from "./ontario-data";
import type { MetadataRoute } from "next";
import { areas, business, materials, services } from "./data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {url:business.domain,lastModified:dates.home,changeFrequency:"monthly",priority:1},
    {url:`${business.domain}/services`,lastModified:dates.services,changeFrequency:"monthly",priority:.9},
    {url:`${business.domain}/materials`,lastModified:dates.materials,changeFrequency:"monthly",priority:.9},
    {url:`${business.domain}/how-it-works`,lastModified:dates.pages["how-it-works"],changeFrequency:"monthly",priority:.8},
    {url:`${business.domain}/locations`,lastModified:dates.pages["locations"],changeFrequency:"monthly",priority:.8},
    {url:`${business.domain}/request-a-quote`,lastModified:dates.pages["request-a-quote"],changeFrequency:"monthly",priority:.9},
    {url:`${business.domain}/about`,lastModified:dates.pages["about"],changeFrequency:"monthly",priority:.7},
    {url:`${business.domain}/contact`,lastModified:dates.pages["contact"],changeFrequency:"monthly",priority:.7},
    {url:`${business.domain}/editorial-standards`,lastModified:dates.pages["editorial-standards"],changeFrequency:"yearly",priority:.5},
    {url:`${business.domain}/privacy`,lastModified:dates.pages["privacy"],changeFrequency:"yearly",priority:.3},
    {url:`${business.domain}/terms`,lastModified:dates.pages["terms"],changeFrequency:"yearly",priority:.3},
    {url:`${business.domain}/locations/ontario`,lastModified:dates.regions,changeFrequency:"monthly",priority:.8},
    ...ontarioRegions.map(region=>({url:`${business.domain}/locations/ontario/${region.slug}`,lastModified:dates.regions,changeFrequency:"monthly" as const,priority:.7})),
    ...services.map(service=>({url:`${business.domain}/services/${service.slug}`,lastModified:dates.services,changeFrequency:"monthly" as const,priority:.8})),
    ...materials.map(material=>({url:`${business.domain}/materials/${material.slug}`,lastModified:dates.materials,changeFrequency:"monthly" as const,priority:.8})),
    ...areas.map(area=>({url:`${business.domain}/areas/${area.slug}`,lastModified:dates.areas,changeFrequency:"monthly" as const,priority:.8})),
    ...areas.flatMap(area=>services.map(service=>({url:`${business.domain}/areas/${area.slug}/${service.slug}`,lastModified:dates.localServices,changeFrequency:"monthly" as const,priority:.7}))),
  ];
}
