import type { Area } from "./area-data";
import { municipalities } from "./ontario-data";
import { provinceFr } from "./fr/content";

const communitiesBySlug = new Map(municipalities.map(item => [item.slug, item.communities.map(community => community.name)]));
export function locationCommunities(area: Area) {
  return [...new Set([...area.neighbourhoods, ...(communitiesBySlug.get(area.slug) || [])])];
}
export function locationSearchText(area: Area) {
  return [area.name, area.province, provinceFr[area.province] || "", area.region, ...locationCommunities(area), ...area.surroundingAreas].join(" ");
}
