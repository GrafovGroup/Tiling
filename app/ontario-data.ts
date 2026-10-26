import municipalities from "./ontario-coverage.json";
export { municipalities };
export const ontarioRegions = [...new Set(municipalities.map(item => item.region))].sort().map(name => ({
  name,
  slug: municipalities.find(item => item.region === name)!.regionSlug,
  municipalities: municipalities.filter(item => item.region === name).sort((a,b)=>a.name.localeCompare(b.name)),
}));
export const communityCount = new Set(municipalities.flatMap(item=>item.communities.map(community=>community.name.toLocaleLowerCase()))).size;
export function getOntarioMunicipality(slug: string) { return municipalities.find(item=>item.slug===slug); }
