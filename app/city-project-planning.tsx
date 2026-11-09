import housingData from "./local-housing.json";
import { getArea, type Area } from "./data";
import { getOntarioMunicipality } from "./ontario-data";
import type { Locale } from "./pricing-data";

type Copy = { en: string; fr: string };
type HousingKind = "detached" | "semi" | "row" | "duplex" | "lowrise" | "highrise" | "other" | "movable";
type Housing = { geographies: { dguid: string; name: string }[]; counts: Record<HousingKind | "total", number | null> };
const housing: Record<string, Housing> = housingData;
const names: Record<HousingKind, Copy> = {
  detached: { en: "single-detached houses", fr: "maisons individuelles" },
  semi: { en: "semi-detached houses", fr: "maisons jumelées" },
  row: { en: "row houses", fr: "maisons en rangée" },
  duplex: { en: "apartments or flats in duplexes", fr: "appartements dans des duplex" },
  lowrise: { en: "apartments in buildings below five storeys", fr: "appartements dans des immeubles de moins de cinq étages" },
  highrise: { en: "apartments in buildings of five or more storeys", fr: "appartements dans des immeubles de cinq étages ou plus" },
  other: { en: "other single-attached houses", fr: "autres maisons individuelles attenantes" },
  movable: { en: "movable dwellings", fr: "logements mobiles" },
};
const propertyChecks: Record<HousingKind, { title: Copy; text: Copy }> = {
  detached: {
    title: { en: "Working through a house", fr: "Travaux dans une maison" },
    text: { en: "Show how the tiled room connects to hallways, stairs and the rest of the home. Record existing floor layers and threshold heights, and identify a usable route while the new assembly cures. A detached house can have wood floors, a slab or both; the support must be checked on site.", fr: "Montrez les raccords avec corridors, escaliers et pièces voisines. Relevez les couches de plancher et hauteurs des seuils, puis prévoyez un passage pendant la cure. Une maison individuelle peut avoir un plancher de bois, une dalle ou les deux; le support doit être vérifié sur place." },
  },
  semi: {
    title: { en: "A semi-detached renovation", fr: "Rénovation d’une maison jumelée" },
    text: { en: "Identify the floor level, shared access and the route for debris. Show adjoining finishes and any previous additions or repairs. Plan noisy removal, protection and return-to-use timing around the occupied home without assuming the neighbouring property has the same floor construction.", fr: "Précisez l’étage, les accès partagés et le trajet des débris. Montrez les finitions adjacentes, agrandissements ou réparations antérieures. Planifiez dépose, protection et remise en service sans supposer que la propriété voisine possède le même plancher." },
  },
  row: {
    title: { en: "Townhouse access and levels", fr: "Accès et niveaux d’une maison en rangée" },
    text: { en: "Send the stair width and any tight turns between unloading and the work area. Include door clearances, landings and rooms that must stay usable. If a property manager controls exterior access or work hours, obtain those requirements before arranging deliveries.", fr: "Indiquez la largeur des escaliers et les virages entre le déchargement et les travaux. Précisez dégagement des portes, paliers et pièces à garder utilisables. Si un gestionnaire encadre l’accès extérieur ou les horaires, obtenez ses exigences avant les livraisons." },
  },
  duplex: {
    title: { en: "Coordinating separate units", fr: "Coordonner des logements distincts" },
    text: { en: "Explain which unit contains the work and whether access, water shutoffs or rooms below are shared. Identify the actual wall and floor assembly before choosing tile preparation. Confirm permissions and notice arrangements with the owner or manager where another household is affected.", fr: "Précisez le logement concerné et les accès, coupures d’eau ou pièces inférieures partagés. Identifiez l’assemblage réel des murs et planchers avant de choisir la préparation. Confirmez autorisations et avis avec le propriétaire ou gestionnaire si un autre ménage est touché." },
  },
  lowrise: {
    title: { en: "Deliveries to an apartment", fr: "Livraisons en appartement" },
    text: { en: "Tell us whether the route uses stairs or an elevator and where materials can be staged. Obtain the building’s flooring and work-hour requirements if applicable. Apartment counts do not distinguish rental from condominium ownership, so confirm who authorizes the work for your address.", fr: "Précisez si l’accès passe par un escalier ou un ascenseur et où entreposer les matériaux. Obtenez les exigences de plancher et d’horaire applicables. Les données ne distinguent pas location et copropriété; confirmez qui autorise les travaux à votre adresse." },
  },
  highrise: {
    title: { en: "Planning work above ground level", fr: "Planifier des travaux en étage" },
    text: { en: "Ask management about loading, elevator reservations, corridor protection and permitted work hours. Obtain any written floor-assembly requirements before selecting an underlayment. Confirm water-shutoff arrangements for wet-room work and allow for carrying and setup time in the quote.", fr: "Vérifiez auprès de la gestion le déchargement, les réservations d’ascenseur, la protection des corridors et les horaires. Obtenez les exigences écrites de plancher avant de choisir une sous-couche. Pour les pièces d’eau, confirmez les coupures et prévoyez manutention et préparation dans la soumission." },
  },
  other: {
    title: { en: "An attached home with its own layout", fr: "Une habitation attenante avec son propre plan" },
    text: { en: "Describe how the home is attached and photograph the work area and access route. Confirm the support beneath the finish and any shared entry arrangements. The dwelling category alone does not establish the structure, approvals or installation method.", fr: "Décrivez la configuration attenante et photographiez la zone et le trajet d’accès. Confirmez le support et les entrées partagées. La catégorie du logement ne détermine pas à elle seule structure, autorisations ou méthode de pose." },
  },
  movable: {
    title: { en: "Confirm the assembly before choosing tile", fr: "Confirmer l’assemblage avant le carrelage" },
    text: { en: "Share the building or manufacturer information, floor construction and any known movement. Tile suitability needs an assessment of the actual support, finished weight and compatible products. A finish used successfully in a conventional house is not automatically suitable here.", fr: "Joignez les renseignements du bâtiment ou fabricant, la construction du plancher et les mouvements connus. Le carrelage exige une évaluation du support, du poids fini et des produits compatibles. Une finition convenant à une maison conventionnelle ne convient pas automatiquement ici." },
  },
};

// Practical project questions, not claims about municipal code or building condition.
const serviceChecks: Record<string, Copy> = {
  "bathroom-shower-tile": { en: "For the shower, show the drain, curb or entry, plumbing penetrations and any leak history. State whether another bathroom can be used during demolition, waterproofing and curing. Separate concealed repairs from the visible tile finish in the quote.", fr: "Pour la douche, montrez drain, seuil, traversées de plomberie et fuites antérieures. Précisez si une autre salle de bain reste disponible pendant dépose, étanchéité et cure. Distinguez réparations cachées et finition carrelée dans la soumission." },
  "floor-tile-installation": { en: "For the floor, provide a sketch linking the tiled rooms, doorways and adjoining finishes. Record any cracks, movement or moisture history. Ask for preparation and transition details to be priced separately from laying the selected tile.", fr: "Pour le plancher, joignez un croquis reliant zones carrelées, portes et finitions voisines. Signalez fissures, mouvement ou humidité. Faites préciser préparation et raccords séparément de la pose des carreaux choisis." },
  "kitchen-backsplash": { en: "For a backsplash, measure each counter run and tile height, then show outlets, windows, corners and exposed ends. Confirm that cabinets and counters are in their final positions. Small projects still need protection, setup and finishing time.", fr: "Pour un dosseret, mesurez chaque comptoir et la hauteur carrelée, puis montrez prises, fenêtres, angles et bords exposés. Confirmez la position définitive des armoires et comptoirs. Une petite surface exige aussi protection, préparation et finition." },
  "large-format-tile": { en: "For oversized tile, share the product dimensions and the full carrying route. Check doorways and stair turns before ordering. Surface flatness, handling and layout approval need their own allowance; a standard floor rate does not establish the cost of panels or complex wall work.", fr: "Pour les grands formats, indiquez dimensions du produit et trajet complet de manutention. Vérifiez portes et virages d’escalier avant la commande. Planéité, manutention et approbation du calepinage demandent leur propre budget; un tarif de plancher courant ne couvre pas automatiquement panneaux et murs complexes." },
  "heated-tile-floors": { en: "For a heated floor, mark the heated area, fixtures, thermostat and adjoining floor heights. Confirm the selected heating system and electrical coordination before closing the assembly. Include testing, sensors and the manufacturer’s first-start instructions in the scope.", fr: "Pour un plancher chauffant, indiquez zone chauffée, équipements, thermostat et hauteurs voisines. Confirmez système retenu et coordination électrique avant de fermer l’assemblage. Prévoyez essais, sondes et instructions de première mise en marche." },
  "tile-removal-surface-preparation": { en: "For removal, photograph all existing layers you can identify and state which finish will follow. Include containment, debris carrying and disposal in the scope. Preparation can only be finalized once the condition of the exposed support is known.", fr: "Pour la dépose, photographiez les couches identifiables et précisez la finition suivante. Incluez confinement, transport des débris et évacuation. La préparation définitive dépend de l’état du support mis à nu." },
  "tile-repair-regrouting": { en: "For repairs, include close-ups and a wider room view, the number of affected tiles and any spare material. Describe when movement, cracks or leaks appear. Compare repair and replacement only after the cause and matching-tile availability are understood.", fr: "Pour une réparation, joignez gros plans, vue générale, nombre de carreaux touchés et matériaux de réserve. Décrivez l’apparition des mouvements, fissures ou fuites. Comparez réparation et remplacement après avoir compris la cause et la disponibilité des carreaux." },
  "tile-grout-stone-cleaning-sealing": { en: "For cleaning or sealing, identify the surface and products already used. Show stains separately from cracks, etching or missing grout. Agree on a test area and drying time, and price cleaning, sealing and restoration separately.", fr: "Pour le nettoyage ou scellement, identifiez la surface et les produits déjà utilisés. Distinguez taches, gravures, fissures et coulis manquant. Convenez d’une zone d’essai et du séchage, et chiffrez nettoyage, scellement et restauration séparément." },
  "commercial-tile": { en: "For a commercial property, provide the operating hours, delivery route and entrances that must remain accessible. Separate public floors, washrooms and service areas in the scope. A residential price example does not account for commercial phasing, specifications or after-hours work.", fr: "Pour un commerce, précisez horaires, livraisons et entrées à maintenir accessibles. Distinguez planchers publics, toilettes et zones de service. Un exemple résidentiel ne couvre pas les phases commerciales, spécifications ou travaux hors horaires." },
  "outdoor-balcony-tiling": { en: "For a balcony or exterior surface, show thresholds, drainage, the existing waterproofing and access below. Confirm the approved assembly and weather window. Indoor floor prices cannot be applied directly to exterior preparation and exposure requirements.", fr: "Pour un balcon ou une surface extérieure, montrez seuils, drainage, étanchéité existante et accès inférieur. Confirmez l’assemblage approuvé et la période météo. Les prix de planchers intérieurs ne s’appliquent pas directement aux exigences extérieures." },
  "fireplace-feature-wall-tiling": { en: "For a feature wall or fireplace surround, share the wall dimensions, tile weight, exposed edges and appliance documentation where relevant. Confirm substrate and clearance requirements before approving the finish. Decorative tiling does not replace appliance installation requirements.", fr: "Pour un mur décoratif ou un foyer, joignez dimensions, poids des carreaux, bords exposés et documentation de l’appareil. Confirmez support et dégagements avant d’approuver la finition. Le carrelage ne remplace pas les exigences d’installation de l’appareil." },
  "tile-stairs-steps": { en: "For stairs, measure each tread, riser and landing and show the adjoining floors. Identify an alternative access route while work cures. Nosing, finished riser consistency and exterior exposure must be resolved before tile quantities and pricing are confirmed.", fr: "Pour les escaliers, mesurez marches, contremarches et paliers, puis montrez les planchers voisins. Prévoyez un autre passage pendant la cure. Nez de marche, régularité des hauteurs finies et exposition doivent être réglés avant quantités et prix." },
  "pool-spa-tiling": { en: "For a pool or spa, supply shell dimensions, waterline details, existing waterproofing information and photographs of damage. Confirm draining, access and refill arrangements. Shower-price examples do not establish the cost or suitability of an immersed pool assembly.", fr: "Pour une piscine ou un spa, joignez dimensions, ligne d’eau, renseignements d’étanchéité et photos des dommages. Confirmez vidange, accès et remplissage. Les exemples de douche ne déterminent ni coût ni compatibilité d’un assemblage immergé." },
  "tile-supply-delivery": { en: "For tile supply, send the intended application, measured coverage, selected format and delivery address. Confirm batch, trim, waste allowance and replacement stock together. Compare tile-only supply with a guide’s installed price only after separating labour and preparation.", fr: "Pour la fourniture, indiquez usage, surface mesurée, format et adresse de livraison. Confirmez ensemble lot, profilés, pertes et réserve. Comparez fourniture seule et prix posé uniquement après avoir séparé main-d’œuvre et préparation." },
  "rooftop-terrace-pedestal-pavers": { en: "For a rooftop terrace, send available roof drawings, approved loading, drainage positions and threshold heights. Describe lifting, storage and protection of the roof membrane. The support system and building requirements need a project-specific scope before paver supply or installation is priced.", fr: "Pour une terrasse en toiture, joignez plans disponibles, charges approuvées, drains et hauteurs des seuils. Décrivez levage, stockage et protection de la membrane. Le système de support et les exigences du bâtiment nécessitent une portée propre au projet avant de chiffrer fourniture et pose." },
};

function number(value: number, locale: Locale) { return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA").format(value); }
function leaders(record: Housing): HousingKind[] {
  return (Object.keys(names) as HousingKind[]).filter(key => (record.counts[key] ?? 0) > 0).sort((a,b) => (record.counts[b] ?? 0) - (record.counts[a] ?? 0)).slice(0,2);
}
function scopeName(area: Area, locale: Locale) {
  const special: Record<string, Copy> = {
    "north-york": { en: "the City of Toronto as a whole", fr: "l’ensemble de la ville de Toronto" },
    "fort-mcmurray": { en: "the Regional Municipality of Wood Buffalo", fr: "la municipalité régionale de Wood Buffalo" },
    "sydney": { en: "Cape Breton Regional Municipality", fr: "la municipalité régionale du Cap-Breton" },
    "langley": { en: "Langley City and the Township of Langley combined", fr: "la ville et le canton de Langley réunis" },
    "north-vancouver": { en: "the City and District of North Vancouver combined", fr: "la ville et le district de North Vancouver réunis" },
  };
  return special[area.slug]?.[locale] ?? area.name;
}
function sourceUrl(dguid: string, locale: Locale) {
  return `https://www150.statcan.gc.ca/t1/tbl1/${locale}/tv.action?pid=9810004101&geocode=${dguid.slice(4)}`;
}
function HousingSnapshot({area, locale}: {area: Area; locale: Locale}) {
  const record = housing[area.slug];
  if (!record) return null;
  const fr = locale === "fr";
  const top = leaders(record);
  const scope = scopeName(area, locale);
  const wider = ["north-york","fort-mcmurray","sydney"].includes(area.slug);
  const description = record.counts.total === null
    ? (fr ? `Les données de types de logements de ${area.name} sont supprimées dans ce tableau du recensement. Nous préparons les travaux à partir des renseignements de votre propriété.` : `Housing-type counts for ${area.name} are suppressed in this census table. We plan the work from your property's own details.`)
    : (fr ? `Le recensement de 2021 indiquait ${number(record.counts.total,locale)} logements privés occupés pour ${scope}, dont ` : `The 2021 Census recorded ${number(record.counts.total,locale)} occupied private dwellings in ${scope}, including `)
      + top.map(key => `${number(record.counts[key]!,locale)} ${names[key][locale]}`).join(fr ? " et " : " and ") + ".";
  return <div className="local-housing-snapshot">
    <p className="section-kicker">{fr ? "Contexte résidentiel · Recensement de 2021" : "Local housing context · 2021 Census"}</p>
    <p>{description}</p>
    {wider && <p className="local-scope-note">{fr ? `Ce repère couvre ${scope}; il ne s’agit pas de chiffres propres à ${area.name}.` : `This reference covers ${scope}; these are not ${area.name}-only figures.`}</p>}
    <p className="local-data-source">{fr ? "Source : Statistique Canada, tableau 98-10-0041-01. " : "Source: Statistics Canada, table 98-10-0041-01. "}{record.geographies.map((geo,i) => <a key={geo.dguid} href={sourceUrl(geo.dguid,locale)} target="_blank" rel="noopener noreferrer">{geo.name}{record.geographies.length > 1 ? ` (${geo.dguid.slice(-7)})` : ""} ↗{i < record.geographies.length - 1 ? " · " : ""}</a>)} {fr ? "Chiffres arrondis et limites de 2021. Ils ne décrivent ni l’état de votre bâtiment ni son statut locatif ou de copropriété." : "Rounded counts and 2021 boundaries. These figures do not establish your building’s condition or rental/condominium status."}</p>
  </div>;
}

function AccessPlanning({area, locale}: {area: Area; locale: Locale}) {
  const fr = locale === "fr";
  const municipality = getOntarioMunicipality(area.slug);
  const communities = [...new Set([...(municipality?.communities.map(c => c.name) ?? []), ...area.neighbourhoods])].slice(0,3);
  const special: Record<string, Copy> = {
    "langley": { en: "Specify Langley City or the Township of Langley with the full street address. This page covers both; their building and delivery arrangements must be confirmed for the particular property.", fr: "Précisez ville ou canton de Langley avec l’adresse complète. Cette page couvre les deux; les modalités du bâtiment et de livraison doivent être confirmées pour la propriété." },
    "north-vancouver": { en: "Specify the City or District of North Vancouver. Include driveway slope, stairs and the unloading-to-room route when these affect material handling.", fr: "Précisez ville ou district de North Vancouver. Indiquez pente de l’entrée, escaliers et trajet jusqu’à la pièce lorsqu’ils influencent la manutention." },
    "hamilton-township": { en: "Use the Hamilton Township address in Northumberland County. This is a separate service area from the City of Hamilton; include the community and postal code to route the enquiry correctly.", fr: "Utilisez l’adresse du canton de Hamilton, dans Northumberland. Cette région est distincte de la ville de Hamilton; précisez communauté et code postal pour acheminer la demande." },
    "cockburn-island": { en: "For a Cockburn Island property, describe how materials and workers will reach the site, unloading arrangements, available utilities and occupied dates. Confirm transport and accommodation needs before agreeing a work window.", fr: "Pour une propriété de Cockburn Island, décrivez l’acheminement des matériaux et travailleurs, le déchargement, les services disponibles et les dates d’occupation. Confirmez transport et hébergement avant de convenir d’une période de travaux." },
  };
  const location = special[area.slug]?.[locale] ?? (communities.length
    ? (fr ? `Pour un projet à ${area.name}, précisez la communauté ou le quartier (par exemple ${communities.join(", ")}) et l’adresse complète. ` : `For a property in ${communities.join(", ")} or elsewhere in ${area.name}, include the community and full address. `)
    : (fr ? `Précisez l’adresse de votre propriété à ${area.name}, dans la région de ${area.region}, ainsi que le code postal. ` : `Identify the property address in ${area.name}, ${area.region}, together with its postal code. `));
  return <article><h3>{fr ? `Accès au chantier — ${area.name}` : `Getting to your ${area.name} project`}</h3><p>{location}</p><p>{fr ? "Joignez une photo du trajet entre le déchargement et la pièce, puis précisez escaliers, accès partagés et espace pour les matériaux. Ces détails permettent de chiffrer la manutention avec les travaux." : "Include a photo of the route from unloading to the room, and identify stairs, shared access and material-staging space. These details let handling be priced alongside the tile work."}</p>{municipality?.website && <a className="local-municipal-link" href={municipality.website} target="_blank" rel="noopener noreferrer">{fr ? `Renseignements municipaux : ${area.name} ↗` : `${area.name} municipal information ↗`}</a>}</article>;
}

export function CityProjectPlanning({areaSlug, service, locale = "en"}: {areaSlug: string; service?: string; locale?: Locale}) {
  const area = getArea(areaSlug);
  if (!area) return null;
  const record = housing[areaSlug];
  const fr = locale === "fr";
  const top = record ? leaders(record) : [];
  // No census category is used as a claim about a particular building or commercial site.
  const relevantHousing = !service || ["bathroom-shower-tile","floor-tile-installation","kitchen-backsplash","large-format-tile","heated-tile-floors","tile-repair-regrouting","tile-removal-surface-preparation"].includes(service);
  const question = service ? serviceChecks[service] : undefined;
  return <section className="local-project-brief section-pad" data-local-area={areaSlug}>
    <p className="section-kicker">{fr ? "Planifier selon votre propriété" : "Plan around your property"}</p>
    <h2>{fr ? `Préparer vos travaux à ${area.name}` : `Planning your ${area.name} project`}</h2>
    {question && <p className="guide-lead">{question[locale]}</p>}
    {!service && <HousingSnapshot area={area} locale={locale}/>}
    <div className="pricing-factor-grid">
      {relevantHousing && top.slice(0, service ? 1 : 2).map(kind => <article key={kind}><h3>{propertyChecks[kind].title[locale]}</h3><p>{propertyChecks[kind].text[locale]}</p></article>)}
      <AccessPlanning area={area} locale={locale}/>
    </div>
    {service && relevantHousing && <details className="local-housing-details"><summary>{fr ? `Contexte résidentiel pour ${area.name}` : `Housing context for ${area.name}`}</summary><HousingSnapshot area={area} locale={locale}/></details>}
    <p className="local-brief-note">{fr ? "Les conseils ci-dessus sont des questions de préparation adaptées au contexte local, pas un diagnostic du bâtiment. Nous confirmons support, accès et disponibilité pour votre adresse avant de convenir des travaux." : "The advice above identifies planning questions for the local context, not a diagnosis of the building. We confirm the support, access and availability for your address before agreeing the work."}</p>
  </section>;
}
