import { municipalities } from "./ontario-data";
import nationalAreas from "./national-areas.json";
import ontarioSurrounding from "./ontario-surrounding.json";
export type Area = {
  ontarioRegionSlug?: string;
  placeType?: "City" | "AdministrativeArea" | "Place";
  province: string;
  provinceCode: string;
  surroundingAreas: string[];
  slug: string;
  name: string;
  region: string;
  group: string;
  lead: string;
  context: string;
  localFactors: string[];
  neighbourhoods: string[];
};

const ontarioAreas: Omit<Area, "province" | "provinceCode" | "surroundingAreas">[] = [
  {
    slug: "newmarket", name: "Newmarket", region: "York Region", group: "Greater Toronto Area",
    lead: "Planning guidance for tile projects in Newmarket homes, condos and storefronts.",
    context: "Newmarket projects range from older homes around Main Street to newer subdivisions near Stonehaven and Summerhill. Project planning should account for transitions, substrate preparation and tile layouts around the conditions already in the space. Our written scope should identify those decisions before installation begins.",
    localFactors: ["Older-home floor movement and uneven substrates", "Mudrooms and entries exposed to winter salt", "Fast scheduling for occupied homes and retail spaces"],
    neighbourhoods: ["Stonehaven", "Summerhill", "Glenway", "Armitage", "Main Street District", "Woodland Hill"],
  },
  {
    slug: "aurora", name: "Aurora", region: "York Region", group: "Greater Toronto Area",
    lead: "Planning guidance for detailed tile renovations and new interiors in Aurora.",
    context: "Aurora homes often need tile work that integrates with finished millwork, heated floors and open-concept renovations. Planning should start with the substrate and finished elevations so the tile aligns cleanly with adjacent hardwood, cabinetry and plumbing fixtures.",
    localFactors: ["Careful transitions beside hardwood flooring", "Large-format layouts for open main floors", "Waterproofing details for custom showers"],
    neighbourhoods: ["Aurora Village", "Bayview Northeast", "Aurora Highlands", "Aurora Grove", "Bayview Wellington", "Aurora Estates"],
  },
  {
    slug: "richmond-hill", name: "Richmond Hill", region: "York Region", group: "Greater Toronto Area",
    lead: "Planning guidance for residential and commercial tile projects in Richmond Hill.",
    context: "From condo bathrooms near Yonge Street to family homes in Oak Ridges, Richmond Hill projects call for efficient logistics and precise finishing. A complete scope should confirm access, material staging and building requirements early, then coordinate the tile work around the rest of the renovation.",
    localFactors: ["Condo access and material-staging requirements", "Large-format porcelain and stone-look tile", "Scheduling around multi-trade renovations"],
    neighbourhoods: ["Oak Ridges", "Mill Pond", "Langstaff", "Bayview Hill", "Jefferson", "Crosby"],
  },
  {
    slug: "north-york", name: "North York", region: "Toronto", group: "Greater Toronto Area",
    lead: "Planning guidance for North York condo, house and commercial tile projects.",
    context: "North York tile work often happens in active condo buildings, older houses and tightly scheduled commercial renovations. A complete scope should account for elevator bookings, protection of common areas, disposal rules and restricted work hours before materials arrive.",
    localFactors: ["Condo rules, elevators and restricted work hours", "Compact bathroom and backsplash layouts", "Protection of shared corridors and finished surfaces"],
    neighbourhoods: ["Willowdale", "Bayview Village", "Don Mills", "York Mills", "Bathurst Manor", "Newtonbrook"],
  },
  {
    slug: "vaughan", name: "Vaughan", region: "York Region", group: "Greater Toronto Area",
    lead: "Planning guidance for durable tile projects in Vaughan homes and businesses.",
    context: "Vaughan projects frequently combine generous floor areas with custom kitchens, finished basements and spa-style bathrooms. Layout planning should establish control lines before tile is set so long sightlines, stair landings and transitions remain balanced throughout the space.",
    localFactors: ["Long sightlines across open floor plans", "Basement slabs and moisture considerations", "Durable finishes for busy family entries"],
    neighbourhoods: ["Maple", "Woodbridge", "Kleinburg", "Thornhill", "Concord", "Vellore Village"],
  },
  {
    slug: "markham", name: "Markham", region: "York Region", group: "Greater Toronto Area",
    lead: "Planning guidance for tile projects in Markham houses, townhomes and commercial spaces.",
    context: "Markham combines historic houses near Unionville with newer subdivisions, townhomes and mixed-use buildings. A useful tile scope should distinguish wood-framed floors from concrete construction, confirm access early and coordinate finished heights with cabinetry, stairs and adjoining flooring.",
    localFactors: ["Mixed housing ages and construction systems", "Townhome and condominium access planning", "Detailed transitions beside hardwood and millwork"],
    neighbourhoods: ["Unionville", "Cornell", "Berczy Village", "Wismer", "Milliken", "Thornhill"],
  },
  {
    slug: "toronto", name: "Toronto", region: "City of Toronto", group: "Greater Toronto Area",
    lead: "Planning guidance for tile work in Toronto condos, houses and commercial interiors.",
    context: "Toronto projects can range from compact high-rise bathrooms to century homes and street-level retail renovations. Before tile is selected, the scope should account for building rules, delivery and parking constraints, older substrates, narrow access and coordination with other trades.",
    localFactors: ["Elevator bookings, loading access and work-hour rules", "Older-home substrates and limited staging space", "Compact layouts that concentrate cuts and details"],
    neighbourhoods: ["The Annex", "Leslieville", "High Park", "Etobicoke", "Scarborough", "Downtown"],
  },
  {
    slug: "mississauga", name: "Mississauga", region: "Peel Region", group: "Greater Toronto Area",
    lead: "Planning guidance for tile projects across Mississauga homes, condos and businesses.",
    context: "Mississauga includes lakeside houses, established suburban homes, newer towers and busy commercial properties. Tile planning should confirm whether the project is over a basement, slab or condominium structure, then address access, transitions and the demands of an occupied property.",
    localFactors: ["Condo logistics around the city centre", "Basement and slab moisture assessment", "Winter-ready entries in busy family homes"],
    neighbourhoods: ["Port Credit", "Streetsville", "Erin Mills", "Cooksville", "Clarkson", "Meadowvale"],
  },
  {
    slug: "brampton", name: "Brampton", region: "Peel Region", group: "Greater Toronto Area",
    lead: "Planning guidance for practical tile upgrades in Brampton homes and commercial spaces.",
    context: "Brampton projects often involve active family homes, finished basements, multi-room renovations and commercial units. The tile scope should make sequencing, dust protection, substrate preparation and movement accommodation explicit before installation begins.",
    localFactors: ["Phasing work in occupied family homes", "Basement slabs and finished-height transitions", "Durable entry and main-floor finishes"],
    neighbourhoods: ["Bramalea", "Mount Pleasant", "Heart Lake", "Credit Valley", "Springdale", "Downtown Brampton"],
  },
  {
    slug: "oakville", name: "Oakville", region: "Halton Region", group: "Greater Toronto Area",
    lead: "Planning guidance for refined tile renovations and durable surfaces in Oakville.",
    context: "Oakville tile work spans older lakeside houses, custom renovations, newer subdivisions and condominium interiors. Precise layout approval, protection of completed finishes and coordination with cabinetry, plumbing and heated floors are often as important as the tile selection itself.",
    localFactors: ["Custom layouts beside detailed millwork", "Heated-floor and finished-elevation coordination", "Protection of occupied and completed interiors"],
    neighbourhoods: ["Old Oakville", "Bronte", "Glen Abbey", "River Oaks", "Joshua Creek", "Palermo"],
  },
  {
    slug: "burlington", name: "Burlington", region: "Halton Region", group: "Greater Toronto Area",
    lead: "Planning guidance for tile projects in Burlington homes, condos and storefronts.",
    context: "Burlington combines mature neighbourhoods, lake-influenced properties, newer family housing and condominium construction. A project plan should address substrate condition, water and salt at entrances, condo access where relevant, and transitions to existing hardwood or resilient flooring.",
    localFactors: ["Mature-home substrate and transition conditions", "Wet and salt-exposed entrance floors", "Condo delivery and common-area protection"],
    neighbourhoods: ["Aldershot", "Brant Hills", "Headon Forest", "The Orchard", "Roseland", "Downtown Burlington"],
  },
  {
    slug: "pickering", name: "Pickering", region: "Durham Region", group: "Durham Region",
    lead: "Planning guidance for tile projects in established and growing Pickering communities.",
    context: "Pickering includes established lakeside neighbourhoods, suburban homes and rapid new construction around Seaton. Tile planning should reflect the actual floor system and building stage, with careful attention to movement, entry exposure and coordination with new cabinetry and plumbing.",
    localFactors: ["New-construction sequencing and settlement awareness", "Winter moisture at lakeside and family entries", "Substrate checks in established homes"],
    neighbourhoods: ["Bay Ridges", "Liverpool", "Amberlea", "Rosebank", "Seaton", "West Shore"],
  },
  {
    slug: "ajax", name: "Ajax", region: "Durham Region", group: "Durham Region",
    lead: "Planning guidance for tile renovations in Ajax homes and business interiors.",
    context: "Ajax tile projects often take place in postwar houses, newer subdivisions, townhomes and commercial units. A clear scope should identify the substrate, room access, demolition limits and transitions before materials arrive, especially when the home remains occupied.",
    localFactors: ["Occupied-home dust and access planning", "Transitions in renovated main floors and basements", "Durable finishes for high-use entries"],
    neighbourhoods: ["Southwood", "Pickering Village", "Westney Heights", "Audley", "Riverside", "Central Ajax"],
  },
  {
    slug: "whitby", name: "Whitby", region: "Durham Region", group: "Durham Region",
    lead: "Planning guidance for tile projects in Whitby and Brooklin properties.",
    context: "Whitby ranges from older central homes to Brooklin subdivisions, townhomes and growing commercial areas. Tile scopes should account for floor flatness, basement or slab conditions, winter entry exposure and the sequence of kitchen or bathroom renovation trades.",
    localFactors: ["Older central homes and newer subdivision construction", "Floor flatness across open renovated spaces", "Trade sequencing for kitchens and bathrooms"],
    neighbourhoods: ["Brooklin", "Port Whitby", "Williamsburg", "Pringle Creek", "Blue Grass Meadows", "Downtown Whitby"],
  },
  {
    slug: "oshawa", name: "Oshawa", region: "Durham Region", group: "Durham Region",
    lead: "Planning guidance for tile repairs and renovations across Oshawa.",
    context: "Oshawa includes older urban houses, mid-century neighbourhoods, new north-end construction and commercial properties. The age and condition of the substrate can vary widely, so repair history, floor movement, moisture and demolition findings should be addressed before setting tile.",
    localFactors: ["Variable substrates in older housing stock", "New-build and renovation movement considerations", "Moisture review for basements and entrances"],
    neighbourhoods: ["Lakeview", "Northglen", "McLaughlin", "Windfields", "Kedron", "Downtown Oshawa"],
  },
  {
    slug: "hamilton", name: "Hamilton", region: "City of Hamilton", group: "Hamilton & Niagara",
    lead: "Planning guidance for tile projects in Hamilton houses, condos and commercial properties.",
    context: "Hamilton projects span century homes below the escarpment, suburban properties, condominium units and converted commercial spaces. A tile scope should allow for older framing and substrates, uneven floors, access constraints and moisture conditions rather than assuming modern new-build tolerances.",
    localFactors: ["Older-home framing and uneven substrates", "Basement and lower-level moisture assessment", "Commercial and multi-unit access coordination"],
    neighbourhoods: ["Durand", "Westdale", "Ancaster", "Dundas", "Stoney Creek", "Waterdown"],
  },
  {
    slug: "niagara-falls", name: "Niagara Falls", region: "Niagara Region", group: "Hamilton & Niagara",
    lead: "Planning guidance for tile work in Niagara Falls homes and hospitality properties.",
    context: "Niagara Falls tile projects include established houses, newer subdivisions and hospitality or retail spaces with demanding schedules. Planning should distinguish residential needs from high-traffic commercial use, and should address moisture, cleaning, slip resistance and phased access where relevant.",
    localFactors: ["High-traffic hospitality and retail requirements", "Wet-entry slip resistance and cleaning needs", "Phased work around operating properties"],
    neighbourhoods: ["Chippawa", "Stamford", "Lundy's Lane", "Fallsview", "Mount Carmel", "Drummondville"],
  },
  {
    slug: "st-catharines", name: "St. Catharines", region: "Niagara Region", group: "Hamilton & Niagara",
    lead: "Planning guidance for tile projects in St. Catharines homes and commercial interiors.",
    context: "St. Catharines combines older central housing, lakeside neighbourhoods, suburban homes and commercial properties. Tile planning should account for substrate repairs, basement moisture, winter entry conditions and coordination with plumbing or cabinetry in occupied renovations.",
    localFactors: ["Older-home substrate preparation", "Basement and entry moisture conditions", "Renovation sequencing in occupied properties"],
    neighbourhoods: ["Port Dalhousie", "Old Glenridge", "North End", "Merritton", "Western Hill", "Downtown St. Catharines"],
  },
  {
    slug: "barrie", name: "Barrie", region: "Simcoe County", group: "Central Ontario",
    lead: "Planning guidance for tile projects in Barrie homes, condos and businesses.",
    context: "Barrie projects range from established homes and lake-area properties to new subdivisions, condominium units and growing commercial spaces. Tile scopes should plan for winter moisture and grit, floor transitions, building access and the differing substrate conditions found across those property types.",
    localFactors: ["Heavy winter moisture and grit at entries", "Mix of established and new-build floor systems", "Condo and commercial access requirements"],
    neighbourhoods: ["Allandale", "Ardagh Bluffs", "Holly", "East End", "Painswick", "Letitia Heights"],
  },
  {
    slug: "peterborough", name: "Peterborough", region: "Peterborough County", group: "Central Ontario",
    lead: "Planning guidance for tile work in Peterborough homes and small commercial properties.",
    context: "Peterborough includes century houses, mid-century neighbourhoods, newer construction and compact commercial interiors. Existing floors may need more investigation than their finishes suggest, so scopes should identify levelling, movement, moisture and transitions before a layout is approved.",
    localFactors: ["Older wood-framed floors and renovation layers", "Basement moisture and slab preparation", "Careful transitions in compact existing rooms"],
    neighbourhoods: ["East City", "West End", "The Avenues", "Ashburnham", "Northcrest", "Downtown Peterborough"],
  },
  {
    slug: "kitchener", name: "Kitchener", region: "Waterloo Region", group: "Waterloo & Wellington",
    lead: "Planning guidance for tile projects in Kitchener homes, condos and workplaces.",
    context: "Kitchener tile work spans older central houses, postwar neighbourhoods, fast-growing subdivisions, condominiums and converted commercial buildings. Planning should confirm the floor assembly, access and renovation sequence while allowing for the transitions and movement created by mixed construction ages.",
    localFactors: ["Mixed-age floor assemblies and renovation layers", "Condo and adaptive-reuse access planning", "Open-plan transitions in newer family homes"],
    neighbourhoods: ["Downtown Kitchener", "Forest Heights", "Doon", "Stanley Park", "Huron Park", "Victoria Hills"],
  },
  {
    slug: "waterloo", name: "Waterloo", region: "Waterloo Region", group: "Waterloo & Wellington",
    lead: "Planning guidance for tile work in Waterloo houses, condos and commercial spaces.",
    context: "Waterloo projects include established family homes, student-oriented properties, condominium towers and office interiors. Durable material selection matters, but so do access, work-hour constraints, floor preparation and a repairable layout for spaces that may see frequent turnover.",
    localFactors: ["Condo and multi-unit scheduling requirements", "Durable finishes for high-turnover properties", "Floor preparation beside existing hardwood"],
    neighbourhoods: ["Uptown Waterloo", "Beechwood", "Laurelwood", "Westvale", "Lakeshore", "Eastbridge"],
  },
  {
    slug: "cambridge", name: "Cambridge", region: "Waterloo Region", group: "Waterloo & Wellington",
    lead: "Planning guidance for tile renovations across Cambridge’s varied building stock.",
    context: "Cambridge brings together historic properties in Galt, Hespeler and Preston with suburban homes and industrial or commercial conversions. Tile planning should respond to the actual substrate, room geometry and moisture exposure, particularly where older buildings have accumulated multiple renovation layers.",
    localFactors: ["Historic and converted-building substrates", "Irregular room geometry and accumulated floor layers", "Moisture review near entries and lower levels"],
    neighbourhoods: ["Galt", "Hespeler", "Preston", "West Galt", "Shades Mills", "Blair"],
  },
  {
    slug: "guelph", name: "Guelph", region: "City of Guelph", group: "Waterloo & Wellington",
    lead: "Planning guidance for tile projects in Guelph homes and commercial interiors.",
    context: "Guelph includes stone and brick heritage properties, mature neighbourhoods, newer south-end housing and busy commercial spaces. A careful scope should address older framing or renovation layers where present, plus winter entry exposure, transitions and sequencing around occupied rooms.",
    localFactors: ["Heritage and mature-home floor conditions", "Newer open-plan layouts and long sightlines", "Winter salt and moisture at entrances"],
    neighbourhoods: ["Downtown Guelph", "Exhibition Park", "Kortright Hills", "Westminster Woods", "Grange Hill East", "South End"],
  },
  {
    slug: "london", name: "London", region: "Middlesex County", group: "Southwestern Ontario",
    lead: "Planning guidance for tile work in London houses, condos and commercial properties.",
    context: "London tile projects range from older central houses and rental properties to suburban homes, condominium buildings and commercial interiors. The scope should identify the substrate and previous renovation layers, then plan access, transitions and phasing for the way the property is occupied.",
    localFactors: ["Older-home and rental-property renovation layers", "Basement moisture and slab conditions", "Phased work in occupied homes and businesses"],
    neighbourhoods: ["Old North", "Wortley Village", "Byron", "Masonville", "Westmount", "Summerside"],
  },
  {
    slug: "windsor", name: "Windsor", region: "Essex County", group: "Southwestern Ontario",
    lead: "Planning guidance for tile projects in Windsor homes and commercial spaces.",
    context: "Windsor combines older urban houses, mid-century neighbourhoods, newer homes and active commercial properties. Tile planning should account for substrate repairs, basement and slab moisture, temperature changes at entrances and material availability before scheduling demolition.",
    localFactors: ["Basement and slab moisture assessment", "Substrate repairs in older urban homes", "Material lead times and replacement-stock planning"],
    neighbourhoods: ["Walkerville", "Riverside", "South Windsor", "Sandwich", "Forest Glade", "Downtown Windsor"],
  },
  {
    slug: "ottawa", name: "Ottawa", region: "City of Ottawa", group: "Eastern Ontario",
    lead: "Planning guidance for tile projects in Ottawa houses, condos and institutional spaces.",
    context: "Ottawa tile work spans older central homes, suburban properties, high-rise condominiums and office or institutional interiors. Strong freeze-thaw seasons make entry planning important, while multi-unit and commercial projects need early confirmation of loading, security and work-hour requirements.",
    localFactors: ["Winter salt, snow and freeze-thaw entry exposure", "Condo loading and elevator coordination", "Security and access rules in commercial properties"],
    neighbourhoods: ["Centretown", "The Glebe", "Westboro", "Orléans", "Kanata", "Barrhaven"],
  },
  {
    slug: "kingston", name: "Kingston", region: "Frontenac County", group: "Eastern Ontario",
    lead: "Planning guidance for tile work in Kingston’s historic, suburban and waterfront properties.",
    context: "Kingston includes limestone buildings, older wood-framed houses, student rentals, suburban homes and commercial spaces. Tile scopes should allow for uneven or layered substrates, limited access in older properties, winter moisture and maintenance needs in higher-turnover rooms.",
    localFactors: ["Historic and older-building substrate conditions", "Durable finishes for rental and student housing", "Winter moisture at entrances and lower levels"],
    neighbourhoods: ["Downtown Kingston", "Portsmouth", "Cataraqui North", "Williamsville", "Collins Bay", "Rideau Heights"],
  },
  {
    slug: "greater-sudbury", name: "Greater Sudbury", region: "Northern Ontario", group: "Northern Ontario",
    lead: "Planning guidance for durable tile projects across Greater Sudbury.",
    context: "Greater Sudbury projects face long winters, substantial entry moisture and a mix of older homes, newer suburban properties and commercial spaces. A tile plan should prioritize suitable wet-entry finishes, stable substrates, heated-floor coordination and realistic material delivery timing.",
    localFactors: ["Long winter exposure at entrances and mudrooms", "Heated-floor and finished-height coordination", "Material delivery and replacement-stock planning"],
    neighbourhoods: ["New Sudbury", "Minnow Lake", "South End", "Copper Cliff", "Hanmer", "Lively"],
  },
  {
    slug: "thunder-bay", name: "Thunder Bay", region: "Northwestern Ontario", group: "Northern Ontario",
    lead: "Planning guidance for tile work suited to Thunder Bay homes and businesses.",
    context: "Thunder Bay tile projects need to perform through demanding winter conditions and may involve older housing, slab-on-grade areas, busy entries or commercial interiors. The scope should address moisture and grit, floor temperature, substrate movement and material logistics before the installation date is set.",
    localFactors: ["Severe winter moisture and grit at entrances", "Cold-floor and substrate movement considerations", "Long-distance material and replacement-stock logistics"],
    neighbourhoods: ["Port Arthur", "Fort William", "Current River", "Westfort", "Northwood", "River Terrace"],
  },
];

const originalAreas: Area[] = [...ontarioAreas.map(area => ({...area, province: "Ontario", provinceCode: "ON", group: "Ontario", surroundingAreas: (ontarioSurrounding as Record<string, string[]>)[area.slug] ?? []})), ...nationalAreas];

const enrichedAreas: Area[] = originalAreas.map(area => {
  const municipality = area.province === "Ontario" ? municipalities.find(item => item.slug === area.slug) : undefined;
  return municipality ? {...area, ontarioRegionSlug: municipality.regionSlug, placeType: "AdministrativeArea",
    neighbourhoods: area.neighbourhoods.filter(name=>!municipality.communities.some(item=>item.name===name))} : area;
});
export const featuredAreas = enrichedAreas;
const additions: Area[] = municipalities.filter(item => !originalAreas.some(area=>area.slug===item.slug)).map(item => {
  const communities = item.communities.map(community=>community.name);
  return {slug:item.slug, name:item.name, province:"Ontario", provinceCode:"ON", group:"Ontario", region:item.region,
    ontarioRegionSlug:item.regionSlug, placeType:"AdministrativeArea",
    lead:`Tile installation, repairs and supply in ${item.name}${communities.length ? `, including ${communities.slice(0,3).join(", ")}` : `, ${item.region}`}.`,
    context:`${item.name} is listed in Ontario’s municipal directory in the ${item.region} geographic area.${communities.length ? ` Our local coverage includes requests from ${communities.join(", ")}.` : " We assess projects throughout the municipality, including addresses outside the main settlement."} ${item.planningNote || "Tell us the property address, the room and whether the space will remain occupied during the work. We will assess the existing surface, material access and preparation before confirming the scope."}`,
    localFactors:["Confirm the civic address and material unloading access", "Check the existing surface and finished floor heights", "Agree on preparation, product requirements and available work dates"],
    neighbourhoods:[], surroundingAreas:[]};
});
export const areas: Area[] = [...enrichedAreas, ...additions];
