import { areas } from "./area-data";
export { areas };
export { featuredAreas } from "./area-data";
export type { Area } from "./area-data";

export const business = {
  name: "Tiling.ca",
  phone: "(833) 573-TILE (8453)",
  phoneHref: "+18335738453",
  email: "info@tiling.ca",
  domain: "https://tiling.ca",
  formspreeEndpoint: "https://formspree.io/f/xdeownaz",
  address: {
    street: "18 King Street East, Suite 1400",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M5C 1C4",
    country: "Canada",
  },
  primaryArea: "Newmarket",
};

export type Service = {
  slug: string;
  name: string;
  short: string;
  intro: string;
  features: string[];
  faq: { q: string; a: string }[];
  image: string;
  cardImage: string;
  homeImage: string;
  imageAlt: string;
  homeImageAlt: string;
  scopeHeading?: string;
  scopeNote?: string;
  projectSummary?: string;
};

export type Material = {
  slug: string;
  name: string;
  category: string;
  short: string;
  intro: string;
  character: string;
  bestFor: string[];
  considerations: string[];
  faq: { q: string; a: string }[];
};

export const materials: Material[] = [
  {
    slug: "marble-tile",
    name: "Marble Tile",
    category: "Natural stone",
    short: "Distinctive veining and a refined finish for bathrooms, entries and feature surfaces.",
    intro: "Every marble tile has natural variation, so the installation begins before mortar is mixed. A careful installer dry-plans the colour movement and veining, confirms edge details, and selects setting materials that suit light or translucent stone. The finished surface feels intentional because the pieces are composed as a whole rather than installed one box at a time.",
    character: "Marble develops character with use and needs a realistic care plan. Honed finishes can be more forgiving than polished surfaces in busy rooms, while wet areas require careful waterproofing, suitable slip resistance and stone-compatible products.",
    bestFor: ["Bathroom walls and vanity surrounds", "Powder-room floors", "Fireplace and feature walls", "Decorative borders and mosaics"],
    considerations: ["Vein direction and dry layout", "Stone-compatible mortar and grout", "Sealing and ongoing care", "Etching, staining and slip resistance"],
    faq: [
      {q:"Does marble tile need to be sealed?",a:"Most marble installations benefit from a penetrating sealer, but the right product and timing depend on the stone, finish, grout and location. Sealer helps with stain resistance; it does not make marble maintenance-free or prevent acid etching."},
      {q:"Can marble be installed in a shower?",a:"Yes, when the stone, finish and complete shower assembly are suitable. The plan should address waterproofing, drainage, mortar, grout and cleaning products together, with maintenance expectations explained before installation."},
    ],
  },
  {
    slug: "porcelain-tile",
    name: "Porcelain Tile",
    category: "High-density ceramic",
    short: "Low-absorption, durable tile for floors, showers, entries and large-format surfaces.",
    intro: "Porcelain is a versatile choice for Canadian homes because it is available in many sizes, textures and stone-look finishes. Its density and low water absorption support demanding applications, but large or rectified products still require a flat substrate, appropriate mortar coverage and carefully planned movement joints.",
    character: "Porcelain can deliver a quiet large-format surface or the texture of stone and concrete with simpler routine care. The tile format and finish should be matched to the room, with transitions, cuts and grout joints planned around actual dimensions rather than catalogue photography.",
    bestFor: ["Main floors and heated floors", "Showers and bathroom walls", "Mudrooms and busy entries", "Commercial and high-traffic areas"],
    considerations: ["Substrate flatness for large formats", "Slip rating for wet or exterior areas", "Edge finish and rectified joints", "Full mortar coverage and movement joints"],
    faq: [
      {q:"Is porcelain better than ceramic tile?",a:"Not automatically. Porcelain is denser and absorbs less water, which is useful for demanding floors and wet locations. Ceramic can be an excellent wall and backsplash choice. The better material is the one rated for the intended surface and supported by the correct installation system."},
      {q:"Can porcelain tile be used with floor heating?",a:"Yes. Porcelain transfers heat effectively and is commonly installed over approved electric or hydronic systems. The heating layer, membrane, sensor location, expansion space and finished elevation should be planned together."},
    ],
  },
  {
    slug: "ceramic-tile",
    name: "Ceramic Tile",
    category: "Glazed tile",
    short: "A flexible, design-rich choice for backsplashes, bathroom walls and lighter-duty floors.",
    intro: "Ceramic tile offers colour, texture and pattern across classic subway formats, handmade-look pieces and practical floor products. Because ratings vary, we confirm whether the selected tile is intended for walls, floors or wet locations before planning the installation.",
    character: "Ceramic is often easier to cut and detail around outlets, cabinets and plumbing than dense porcelain. Its visible edges and glaze variation need deliberate treatment, particularly with handmade-look tile where irregularity is part of the design.",
    bestFor: ["Kitchen backsplashes", "Bathroom and shower walls", "Powder rooms", "Decorative niches and feature areas"],
    considerations: ["Wall, floor and wet-area rating", "Glaze variation between pieces", "Trim availability and exposed edges", "Pattern, joint width and grout colour"],
    faq: [
      {q:"Can ceramic tile be used on a bathroom floor?",a:"Only when the product is rated for floor use and has a suitable surface for the room. Many ceramic tiles are wall-only, so we verify the manufacturer’s application and performance information before installation."},
      {q:"Is handmade-look ceramic supposed to be uneven?",a:"Often, yes. Variation in edges, surface and colour creates the intended character. Several boxes should be reviewed together, with joint width, layout and lighting planned so the variation feels balanced rather than accidental."},
    ],
  },
  {
    slug: "natural-stone-tile",
    name: "Natural Stone Tile",
    category: "Quarried material",
    short: "One-of-a-kind limestone, travertine, slate and other stone surfaces planned for lasting use.",
    intro: "Natural stone varies in density, texture, thickness and maintenance needs. The stone and intended application should be identified first, followed by compatible setting and grouting methods. Pieces are blended from multiple boxes so changes in tone and movement become part of a composed surface.",
    character: "Stone rewards thoughtful material selection. A honed limestone floor, textured slate entry and filled travertine wall each behave differently. The installation and care advice should reflect the exact product, finish, room conditions and exposure.",
    bestFor: ["Entries and feature floors", "Fireplace surrounds", "Bathroom accent surfaces", "Indoor architectural details"],
    considerations: ["Stone type, finish and porosity", "Thickness and dimensional variation", "Sealing and cleaning products", "Moisture, salt and freeze-thaw exposure"],
    faq: [
      {q:"What natural stone is easiest to maintain?",a:"Maintenance depends on the specific stone, finish, traffic and exposure. Denser stones with a honed or textured finish may be more forgiving, but every selection should be evaluated for staining, scratching, etching and sealing requirements."},
      {q:"Can natural stone be installed in a Canadian entry?",a:"Potentially, but winter moisture and de-icing salt make product choice important. Review absorption, finish, cleaning expectations and the substrate before selecting stone for a busy entrance."},
    ],
  },
  {
    slug: "granite-tile",
    name: "Granite Tile",
    category: "Dense natural stone",
    short: "Hard-wearing natural stone for selected floors, entries, hearths and feature applications.",
    intro: "Granite tile combines natural mineral movement with a dense, durable surface. The exact finish matters: polished, honed and flamed granite behave differently underfoot and in changing light. Pieces should be sorted, the layout established and stone-compatible products used to protect the intended appearance.",
    character: "Granite is often selected for strength, but the installation still depends on substrate preparation, coverage and movement accommodation. Colour variation, edge profiles and slip resistance should be approved from the actual tile rather than a small sample.",
    bestFor: ["Entries and durable floor areas", "Fireplace hearths and surrounds", "Feature walls", "Selected commercial surfaces"],
    considerations: ["Finish and slip resistance", "Batch and mineral variation", "Stone-compatible installation products", "Weight, substrate and finished height"],
    faq: [
      {q:"Is granite tile suitable for an entry floor?",a:"It can be when the finish provides suitable traction and the complete assembly is planned for moisture, winter grit and cleaning. Highly polished products may not be the right choice for a wet entrance."},
      {q:"Does granite tile need sealing?",a:"Some granite benefits from sealing and some dense products absorb very little. Follow the stone supplier’s guidance and test when appropriate rather than assuming every granite needs the same treatment."},
    ],
  },
];

export const services: Service[] = [
  {
    slug: "bathroom-shower-tile", name: "Bathroom & Shower Tile",
    short: "Waterproof shower assemblies, bathroom floors, niches, curbs and feature walls.",
    intro: "A successful tiled shower is built behind the tile first. The scope should treat drainage, waterproofing, penetrations, niches and edge profiles as one assembly, then set the visible tile to balanced lines. Bathroom floors should be prepared for the selected tile format and matched carefully to doorways, tubs and vanities.",
    features: ["Shower waterproofing systems", "Custom niches and benches", "Bathroom floor tile", "Curbs, jambs and edge profiles", "Large-format porcelain", "Grout and movement joints"],
    faq: [{q:"How long does a tiled shower take?",a:"Timing depends on demolition, substrate condition, waterproofing and tile format. A straightforward installation is often completed in several working days, while custom niches, large-format tile or repair work can extend the schedule. Your written scope should identify the stages before work starts."},{q:"Can you tile over existing tile?",a:"Sometimes, but only when the existing installation is sound, flat, well bonded and compatible with the new finished height. The existing surface should be inspected first. Removing failed or uncertain material is usually the safer choice for wet areas."}],
    image: "/services/bathroom-shower.jpg",
    cardImage: "/services/cards/bathroom-shower-card.jpg",
    homeImage: "/services/home/bathroom.webp",
    imageAlt: "Bathroom with porcelain walls and a tiled shower",
    homeImageAlt: "Ivory porcelain shower walls with a recessed niche and mosaic floor",
  },
  {
    slug: "floor-tile-installation", name: "Floor Tile Installation",
    short: "Porcelain, ceramic and stone-look floors prepared for a flat, durable finish.",
    intro: "Floor tile performs best when the surface below it is stable, flat and planned for movement. The scope should assess the substrate, finished height and transitions before tile is set. Layout decisions should follow the room’s longest sightlines so cuts feel intentional at walls, doorways, islands and stairs.",
    features: ["Substrate assessment", "Uncoupling membranes", "Large-format floor tile", "Heated-floor compatible installation", "Transitions and edge finishing", "Grout and movement joints"],
    faq: [{q:"Do floors need to be perfectly level?",a:"Tile needs a sufficiently flat and stable substrate; level is a separate condition. The floor should be checked against the requirements of the tile size and installation system, with patching, levelling or membrane work specified where needed."},{q:"Can tile work with in-floor heating?",a:"Yes. Many electric and hydronic heating systems are designed for tile, but the assembly must be planned as a system. The heating layer, sensor location, membrane and finished tile height should be coordinated before installation."}],
    image: "/services/floor-tile-installation.jpg",
    cardImage: "/services/cards/floor-tile-installation-card.jpg",
    homeImage: "/services/home/floor.webp",
    imageAlt: "Large stone-look porcelain tiles in an entry hall",
    homeImageAlt: "Grey porcelain entry floor with aligned joints beside oak storage",
  },
  {
    slug: "kitchen-backsplash", name: "Kitchen Backsplash",
    short: "Balanced layouts around outlets, corners, cabinets and focal areas.",
    intro: "Backsplashes are small surfaces with a high concentration of details. A deliberate layout centres patterns where the eye lands, plans cuts around outlets and under cabinets, and finishes exposed edges cleanly. The result should support the kitchen rather than compete with cabinetry and countertops.",
    features: ["Subway and stacked layouts", "Mosaics and patterned tile", "Outlet and corner detailing", "Edge trim and finished returns", "Range feature panels", "Grout colour coordination"],
    faq: [{q:"How much tile should I order?",a:"A typical order includes measured coverage plus an allowance for cuts, breakage and pattern matching. The exact waste factor depends on layout and tile type. The quantity can be confirmed after the space and selected material are reviewed."},{q:"When should a backsplash be installed?",a:"Usually after base and wall cabinets and countertops are installed, but before final electrical cover plates and some finishing work. This gives accurate dimensions and avoids unnecessary cuts or damage."}],
    image: "/services/detail-kitchen-v2.webp",
    cardImage: "/services/cards/kitchen-backsplash-card.jpg",
    homeImage: "/services/home/backsplash.webp",
    imageAlt: "Deep teal ceramic backsplash with walnut shelves",
    homeImageAlt: "Vertical terracotta ceramic backsplash above a kitchen counter",
  },
  {
    slug: "large-format-tile", name: "Large-Format Tile",
    short: "Careful handling, surface preparation and alignment for oversized porcelain tile.",
    intro: "Large-format tile creates quiet surfaces, but it makes substrate and layout problems more visible. The scope should verify flatness, plan movement accommodation and specify handling and setting methods suited to the tile. The goal is consistent plane, joint alignment and coverage across the full installation.",
    features: ["Large-format porcelain", "Wall and floor applications", "Surface flatness planning", "Specialized handling", "Levelling-system installation", "Book-matched layout planning"],
    faq: [{q:"What counts as large-format tile?",a:"Industry definitions vary, but tile with at least one edge 15 inches or longer is commonly treated as large format. These products usually require tighter substrate flatness, more deliberate mortar coverage and different handling than smaller tile."},{q:"Can large tile go in a small room?",a:"Yes. Large tile can make a small room feel calmer by reducing grout lines, but the layout must be tested against drains, slopes, fixtures and wall dimensions. Sometimes a smaller coordinating tile is better in a shower floor."}],
    image: "/services/detail-large-v2.webp",
    cardImage: "/services/cards/large-format-card.jpg",
    homeImage: "/services/home/large.webp",
    imageAlt: "Full-height marble-look porcelain slabs beside a bathroom vanity",
    homeImageAlt: "Large porcelain panels on a full-height living room feature wall",
  },
  {
    slug: "tile-repair-regrouting", name: "Tile Repair & Regrouting",
    short: "Targeted repairs for cracked tile, failed grout, loose areas and worn sealant.",
    intro: "A visible crack or loose tile may be a symptom rather than the whole problem. The surrounding area, movement and moisture exposure should be assessed before a targeted repair is recommended. Where repair is appropriate, replacement material should match the dimensions and colour as closely as availability allows.",
    features: ["Cracked tile replacement", "Loose tile assessment", "Grout repair and renewal", "Silicone joint replacement", "Localized water-damage review", "Transition and trim repairs"],
    faq: [{q:"Can you match an older tile?",a:"We can work with your spare tile or search for a close current match, but exact matches are not always available. A good repair plan considers size, thickness, colour and finish, and sometimes uses a deliberate contrast instead."},{q:"Will regrouting fix a leaking shower?",a:"Not if the waterproofing or plumbing assembly has failed. Grout is not the waterproof layer. The assessment should first look for movement, failed sealant and signs that the issue extends behind the tile before cosmetic work is recommended."}],
    image: "/services/tile-repair-regrouting.jpg",
    cardImage: "/services/cards/tile-repair-regrouting-card.jpg",
    homeImage: "/services/home/repair.webp",
    imageAlt: "A tile joint being repaired with hand tools",
    homeImageAlt: "Grout being applied across blue-grey ceramic floor tiles",
  },
  {
    slug: "commercial-tile", name: "Commercial Tile",
    short: "Coordinated tile installation for retail, office, hospitality and common areas.",
    intro: "Commercial tile work needs clear phasing, durable materials and dependable communication. The scope should coordinate access, site protection, deliveries and curing time around other trades and operating hours. Layouts should account for high-visibility entrances, counters, washrooms and long public sightlines.",
    features: ["Retail and office tile", "Commercial washrooms", "Entry and common-area floors", "After-hours coordination", "Phased installation planning", "Written scope and site communication"],
    faq: [{q:"Can work be scheduled outside business hours?",a:"Depending on scope and site requirements, evening or phased work may be possible. The schedule should account for access, noise limits, security, cure times and cleanup expectations before work is confirmed."},{q:"Do you supply tile for commercial projects?",a:"Yes. We can supply tile for commercial installations or work with materials specified by you or your designer. Availability, lead time, slip resistance, maintenance and replacement stock should be confirmed before the project schedule is locked."}],
    image: "/services/detail-commercial-v2.webp",
    cardImage: "/services/cards/commercial-tile-card.jpg",
    homeImage: "/services/home/commercial.webp",
    imageAlt: "Charcoal porcelain tile floor in a commercial reception",
    homeImageAlt: "Terrazzo-look porcelain floor in a hotel reception lobby",
  },
  {
    slug: "tile-supply-delivery", name: "Tile Supply & Delivery",
    short: "Porcelain, ceramic, marble and natural stone sourced for residential and commercial projects.",
    intro: "Good tile supply begins with the application, not only the colour. We source the tile, confirm quantities and trim, and plan delivery alongside the installation. Samples, batch variation, lead times and replacement stock should be confirmed before an order is finalized.",
    features: ["Porcelain and ceramic tile", "Marble and natural stone", "Large-format and specialty products", "Quantity and waste-factor planning", "Trim and setting-material coordination", "Delivery scheduling"],
    faq: [{q:"Can Tiling.ca supply tile without installation?",a:"Yes. Supply-only requests can be reviewed where suitable product and delivery options are available. Share the application, approximate quantity, preferred style and project location so the order can be assessed."},{q:"Can tile supply and installation be coordinated together?",a:"Yes. Coordinating both can reduce quantity, trim and scheduling surprises. The final quote should identify the selected product, allowance or purchase price, delivery responsibility and installation scope separately."}],
    image: "/services/tile-supply-delivery.jpg",
    cardImage: "/services/cards/tile-supply-delivery-card.jpg",
    homeImage: "/services/home/supply.webp",
    imageAlt: "Tile samples and packaged materials ready for selection and delivery",
    homeImageAlt: "Porcelain, ceramic and stone samples with trims and grout colours",
  },
  {"slug": "outdoor-balcony-tiling", "name": "Outdoor & Balcony Tiling", "short": "Bonded exterior tile for patios, balconies and covered entrances, planned for exposure and drainage.", "intro": "Outdoor tile needs a suitable substrate and a complete exterior-rated assembly. We review drainage, existing waterproofing, movement, thresholds and weather exposure before recommending tile and installation materials. Balcony work is subject to structural suitability, building approvals and access; installation and curing must stay within product temperature and weather limits.", "features": ["Exterior-rated porcelain selection", "Patio and balcony tile", "Drainage and threshold planning", "Waterproofing interface review", "Movement and perimeter joints", "Weather-dependent scheduling"], "faq": [{"q": "Can outdoor tile handle Canadian winters?", "a": "Suitable products can, when the complete installation is designed for local exposure, drainage and freeze-thaw conditions. We confirm tile and setting-system suitability for the specific site."}, {"q": "Can you tile any balcony?", "a": "Suitability depends on the structure, substrate, waterproofing, drainage and building requirements. We assess these first and confirm any necessary approvals before quoting installation."}], "image": "/services/outdoor.webp", "cardImage": "/services/cards/outdoor.webp", "homeImage": "/services/home/outdoor.webp", "imageAlt": "Grey porcelain terrace tiles beside a glass railing and garden", "homeImageAlt": "Charcoal tile patio beneath a timber pergola"},
  {"slug": "fireplace-feature-wall-tiling", "name": "Fireplace & Feature-Wall Tiling", "short": "Tile surrounds, hearth finishes and decorative walls with carefully planned cuts and edges.", "intro": "We install tile on fireplace surrounds, hearth surfaces and decorative feature walls. We plan the layout, substrate, exposed edges and transitions around the room. Fireplace work must respect the appliance manufacturer’s clearances and approved materials; tile alone does not make a combustible assembly safe. Appliance installation or modification is outside this tile-finishing scope.", "features": ["Fireplace surround tiling", "Hearth tile finishes", "Decorative feature walls", "Pattern and focal-point layouts", "Edge profiles and mitred details", "Appliance-clearance coordination"], "faq": [{"q": "Can any tile go around a fireplace?", "a": "The tile, adhesive, grout and substrate must suit the temperatures and the appliance installation requirements. We check the specified clearances and materials before agreeing the scope."}, {"q": "Do you also tile walls without a fireplace?", "a": "Yes. We install decorative tile feature walls in entries, living spaces and commercial interiors, with substrate and weight suitability assessed first."}], "image": "/services/fireplace.webp", "cardImage": "/services/cards/fireplace.webp", "homeImage": "/services/home/fireplace.webp", "imageAlt": "Ivory tile fireplace surround with an unlit black firebox", "homeImageAlt": "Terracotta geometric tile feature wall beside an oak bench"},
  {"slug": "heated-tile-floors", "name": "Heated Tile Floors", "short": "Tile floors planned around underfloor heating, finished heights and comfortable everyday use.", "intro": "We install tile finishes with compatible underfloor heating assemblies for bathrooms, kitchens, entries and living spaces. The scope covers substrate preparation, insulation or uncoupling where specified, tile layout and finished transitions. Heating-system selection, electrical capacity, sensor locations and testing are coordinated before covering the system. Electrical connections and commissioning require appropriately qualified personnel; the tile assembly must follow the selected system’s instructions.", "features": ["Heating-compatible floor preparation", "Electric mat and cable assembly coordination", "Floor sensor and thermostat planning", "Tile and adjacent-floor transitions", "System testing checkpoints before covering", "Curing and first-start scheduling"], "faq": [{"q": "Can heating be added beneath existing tile?", "a": "A new heated assembly usually requires removing the existing finish or verifying a suitable overlay approach. We assess floor height, substrate condition, doors and electrical requirements before confirming the scope."}, {"q": "When can the heating be switched on?", "a": "Only after the specified curing period and the heating manufacturer’s commissioning procedure. Early heating can affect mortar, grout and the installation."}], "imageAlt": "Ivory porcelain bathroom floor beside a freestanding bathtub", "homeImageAlt": "Terracotta-look porcelain mudroom floor beside timber storage", "image": "/services/heated.webp", "cardImage": "/services/cards/heated.webp", "homeImage": "/services/home/heated.webp"},
  {"slug": "pool-spa-tiling", "name": "Swimming Pool & Spa Tiling", "short": "Mosaic and porcelain finishes for pool interiors, waterlines and spas, using suitable submerged assemblies.", "intro": "Pool and spa tile must work as part of a complete water-retaining assembly. We assess the shell, existing finish, waterproofing interfaces, penetrations and movement joints before selecting tile, mortar and grout rated for the intended immersion and water conditions. Scope can include waterline tile, tiled spa surfaces and pool interiors. Structural repairs, pool equipment and water treatment are assessed separately; filling and returning to service follow the installation products’ curing requirements.", "features": ["Pool waterline tile replacement", "Mosaic pool and spa finishes", "Immersion-rated material selection", "Shell and waterproofing interface review", "Penetration and movement-joint detailing", "Curing and refill planning"], "faq": [{"q": "Can ordinary bathroom tile be used in a pool?", "a": "Not automatically. Tile, backing, mortar, grout and waterproofing must be suitable for continuous immersion and the pool’s operating conditions. We confirm product suitability for the specific assembly."}, {"q": "Can you replace only the waterline tiles?", "a": "Where the shell and surrounding assembly are sound, a limited waterline scope may be possible. We inspect visible defects and interfaces first; concealed damage can change the preparation required."}], "imageAlt": "Blue mosaic waterline tiles in a bright indoor swimming pool", "homeImageAlt": "Cobalt tiled outdoor pool with a pale porcelain deck", "image": "/services/pool.webp", "cardImage": "/services/cards/pool.webp", "homeImage": "/services/home/pool.webp"},
  {"slug": "tile-stairs-steps", "name": "Tile Stair & Step Installation", "short": "Tiled treads, risers and landings with careful attention to nosing, traction and consistent finished dimensions.", "intro": "We tile stairs, entrance steps and landings after checking their structure, existing dimensions and surface condition. The layout must maintain consistent finished risers and treads, suitable edge protection and a finish appropriate for foot traffic and exposure. We plan visible cuts, nosing profiles, transitions and handrail interfaces before installation. Changes affecting stair geometry or structure need review against applicable requirements before tile work proceeds.", "features": ["Interior stair treads and risers", "Entrance step and landing tile", "Nosing profiles and edge protection", "Traction and contrast planning", "Consistent finished stair dimensions", "Handrail and adjacent-floor interfaces"], "faq": [{"q": "Can tile be installed over wooden stairs?", "a": "Only when the stair structure and a compatible assembly provide adequate stability and suitable finished dimensions. Movement, deflection and added height must be assessed first."}, {"q": "What finish is suitable for entrance steps?", "a": "The selection depends on wet exposure, local weather, drainage and traffic. We review traction, exterior suitability, edge details and maintenance instead of choosing by appearance alone."}], "imageAlt": "Light porcelain tiled staircase with a slim black handrail", "homeImageAlt": "Grey porcelain entrance steps with a handrail beside brick walls", "image": "/services/stairs.webp", "cardImage": "/services/cards/stairs.webp", "homeImage": "/services/home/stairs.webp"},
  {"slug": "tile-removal-surface-preparation", "name": "Tile Removal & Surface Preparation", "short": "Existing tile removal, adhesive removal and substrate preparation for a fresh installation.", "intro": "We remove existing tile and prepare the exposed surface for the next finish. The scope starts with the floor or wall construction, bonded layers, access and the required finished height. We plan dust control, protection, debris handling and suitable patching or flattening before new tile work begins. Concealed damage or materials requiring specialist assessment are identified separately before further work.", "features": ["Floor and wall tile removal", "Adhesive and mortar residue removal", "Work-area protection and dust control", "Debris handling and disposal planning", "Substrate patching and flattening", "Preparation for replacement tile"], "faq": [{"q": "Can I book tile removal without new installation?", "a": "Yes. We can quote removal and preparation as a separate scope. Tell us the existing tile area, substrate if known, access route and the finish planned next so we can agree on the condition in which the surface will be left."}, {"q": "Does removing tile leave a floor ready for new tile?", "a": "Not always. Removal can reveal cracks, loose layers, moisture damage or uneven areas. We assess the exposed substrate and confirm the repairs or preparation needed before the next installation."}, {"q": "Does the quote include disposal?", "a": "Debris handling, removal from the property and disposal are identified in the written quote. Building access, elevator bookings, parking and disposal arrangements affect the scope."}], "scopeHeading": "Prepare a sound surface for the next finish.", "scopeNote": "We agree on protection, removal, debris handling and the required substrate condition before work starts.", "projectSummary": "We plan removal, protection and preparation around the existing surface and the finish you want next.", "imageAlt": "Prepared floor substrate with a straightedge beside remaining dark tiles", "homeImageAlt": "Kitchen renovation with removed terracotta tiles and exposed concrete substrate", "image": "/services/removal.webp", "cardImage": "/services/cards/removal.webp", "homeImage": "/services/home/removal.webp"},
  {"slug": "tile-grout-stone-cleaning-sealing", "name": "Tile, Grout & Stone Cleaning and Sealing", "short": "Deep cleaning and suitable sealing treatments for existing tile, grout and natural stone.", "intro": "We clean existing tiled and stone surfaces using methods matched to the material, finish and type of soiling. Before treatment, we identify the surface and grout, review any previous coating and test a small area where appropriate. Sealing is recommended only for materials that benefit from it. Cleaning and sealing improve care and stain resistance where suitable; they do not repair failed waterproofing, cracks or acid etching.", "features": ["Tile and grout deep cleaning", "Natural stone surface care", "Residue and stain assessment", "Existing sealer or coating review", "Suitable penetrating-sealer application", "Material-specific maintenance guidance"], "faq": [{"q": "Does every tile or grout need sealing?", "a": "No. Porcelain, glazed tile, epoxy grout and natural stone have different care requirements. We check the product, finish and absorbency before recommending a sealer, following the relevant manufacturer guidance."}, {"q": "Is cleaning the same as regrouting?", "a": "No. Cleaning treats dirt and residues on existing sound surfaces. Crumbling, missing or damaged grout may need repair or replacement, which is covered by our tile repair and regrouting service."}, {"q": "Will sealing make my shower waterproof?", "a": "No. A suitable sealer can help with stain resistance in absorbent materials, but it does not replace the waterproofing assembly or repair leaks behind the tile."}], "scopeHeading": "Choose the treatment for your tile and stone.", "scopeNote": "We confirm the surface, treatment, test area and drying or return-to-use requirements before cleaning or sealing.", "projectSummary": "We assess the surface and select a cleaning or sealing treatment suited to its material and condition.", "imageAlt": "Marble lobby floor with a cleaning trolley and floor scrubber at one side", "homeImageAlt": "Tiled entry floor with a compact cleaning machine and microfibre pads", "image": "/services/cleaning.webp", "cardImage": "/services/cards/cleaning.webp", "homeImage": "/services/home/cleaning.webp"},
  {"slug": "rooftop-terrace-pedestal-pavers", "name": "Rooftop Terrace & Pedestal Pavers", "short": "Walkable rooftop terraces with porcelain pavers and raised pedestal systems.", "intro": "We supply and install pavers for suitable rooftop terraces using a specified support system. Raised pedestals can create a level walking surface above a sloping roof while allowing drainage below and access to service points. We review the roof assembly, approved loading, wind exposure, edge restraint, threshold heights and material handling before finalizing the scope. Structural suitability, roof-membrane compatibility and required building approvals must be confirmed for the property.", "features": ["Rooftop porcelain paver supply", "Adjustable pedestal systems", "Paver layout and finished-height planning", "Drainage access and membrane protection", "Perimeter and edge-restraint coordination", "Delivery, lifting and access planning"], "faq": [{"q": "Are rooftop pavers the same as roofing tiles?", "a": "No. This service creates a walkable terrace above a suitable roof assembly. It does not cover pitched-roof clay or concrete roofing tiles, or replace the roof waterproofing system."}, {"q": "Can pedestal pavers be installed on any flat roof?", "a": "No. The roof structure, membrane, loading, wind exposure, drainage, thresholds and edge protection must support the proposed terrace. We confirm the applicable design and building requirements before quoting an installation."}, {"q": "Can you supply the pavers and pedestals?", "a": "Yes. We can include suitable pavers and the specified pedestal system in the quote. Quantities, edge details, delivery, unloading and lifting arrangements are agreed for the property."}], "scopeHeading": "Plan the terrace and its support system together.", "scopeNote": "We confirm the approved assembly, material supply, access, lifting and installation details before work starts.", "projectSummary": "We coordinate paver supply, pedestal layout and installation around the approved rooftop assembly.", "imageAlt": "Grey porcelain rooftop terrace with cedar seating and raised planters", "homeImageAlt": "Cream porcelain rooftop pavers beside planted borders and a glass balustrade", "image": "/services/rooftop.webp", "cardImage": "/services/cards/rooftop.webp", "homeImage": "/services/home/rooftop.webp"},
];

export function getArea(slug: string) { return areas.find((area) => area.slug === slug); }
export function getRelatedAreas(slug: string, limit = 6) {
  const current = getArea(slug);
  if (!current) return [];
  const candidates=areas.filter(area=>area.slug!==slug);
  const score=(area:typeof current)=> !area ? 0 : current.surroundingAreas.includes(area.name) || area.surroundingAreas.includes(current.name) ? 3 : current.ontarioRegionSlug && area.ontarioRegionSlug===current.ontarioRegionSlug ? 2 : area.region===current.region ? 1 : 0;
  return candidates.filter(area=>area.province===current.province).sort((a,b)=>score(b)-score(a)).slice(0,limit);
}
export function getService(slug: string) { return services.find((service) => service.slug === slug); }
export function getMaterial(slug: string) { return materials.find((material) => material.slug === slug); }
