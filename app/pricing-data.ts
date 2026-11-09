import expandedPricing from "./pricing-expansion.json";
export type Locale = "en" | "fr";
type Copy = { en: string; fr: string };
export type PriceSource = { id: string; name: string; url: string; region: Copy };
export const pricingReviewed = "2026-11-08";
export const priceSources: Record<string, PriceSource> = {
  ...expandedPricing.sources,
  zelta: { id: "zelta", name: "Zelta", url: "https://zelta.ca/blog/tile-installation-cost-in-2023/", region: { en: "Toronto / GTA", fr: "Toronto / RGT" } },
  prime: { id: "prime", name: "Prime Tiling", url: "https://primetiling.ca/pricing-guide", region: { en: "Toronto / GTA", fr: "Toronto / RGT" } },
  superior: { id: "superior", name: "Superior Tile Contracting", url: "https://superiortilecontracting.ca/blog/tile-installation-cost-vancouver", region: { en: "Metro Vancouver", fr: "Grand Vancouver" } },
  vital: { id: "vital", name: "VitalTile & Stone", url: "https://vitaltiles.com/guides/tile-installation-cost-calgary/", region: { en: "Calgary", fr: "Calgary" } },
  name: { id: "name", name: "Name Flooring", url: "https://nameflooring.ca/apps/installers/cost/tile-installation-cost-vancouver", region: { en: "Metro Vancouver / Fraser Valley", fr: "Grand Vancouver / vallée du Fraser" } },
};
export type PriceGuide = {
  slug: string; service: string; title: Copy; description: Copy; summary: Copy; range: Copy;
  benchmarks: { source: string; scope: Copy; range: Copy; includes: Copy }[];
  factors: { title: Copy; text: Copy }[];
  example: { title: Copy; text: Copy };
  checklist: Copy[];
  faq: { question: Copy; answer: Copy }[];
};
export const pricingGuides: PriceGuide[] = [
  {
    slug: "tile-installation-cost", service: "floor-tile-installation",
    title: { en: "Tile installation cost in Canada", fr: "Coût de la pose de carrelage au Canada" },
    description: { en: "Compare published Canadian tile-floor pricing, labour-only rates, preparation costs and a worked budget example.", fr: "Comparez les prix publiés au Canada pour les planchers carrelés, la main-d’œuvre et la préparation, avec un exemple de budget." },
    range: { en: "$8–$34 / sq. ft.", fr: "8–34 $ / pi²" },
    summary: { en: "Selected Toronto and Vancouver guides publish floor-installation examples spanning $8–$34 per square foot with tile and labour. This is a comparison of different products and scopes, not a national average. Preparation, demolition and smaller-job minimums can change the total substantially.", fr: "Des guides de Toronto et de Vancouver présentent des exemples de planchers entre 8 et 34 $ le pied carré, carreaux et main-d’œuvre compris. Il s’agit de produits et de portées différents, et non d’une moyenne nationale. Préparation, démolition et frais minimaux peuvent modifier le total." },
    benchmarks: [
      { source: "zelta", scope: { en: "Standard ceramic / porcelain floor", fr: "Plancher courant en céramique ou porcelaine" }, range: { en: "$13–$34 / sq. ft.", fr: "13–34 $ / pi²" }, includes: { en: "Tile, labour and basic setting materials; before HST. Preparation, removal and specialty work extra.", fr: "Carreaux, main-d’œuvre et matériaux de pose de base; avant TVH. Préparation, dépose et travaux spécialisés en supplément." } },
      { source: "name", scope: { en: "Ceramic through stone / specialty floors", fr: "Planchers en céramique jusqu’à la pierre et aux produits spécialisés" }, range: { en: "$8–$27 / sq. ft.", fr: "8–27 $ / pi²" }, includes: { en: "Material and installation labour. Excludes removal, subfloor preparation, furniture moving, stairs and GST.", fr: "Matériaux et main-d’œuvre. Exclut dépose, préparation du support, déplacement du mobilier, escaliers et TPS." } },
      { source: "prime", scope: { en: "Installation labour only", fr: "Main-d’œuvre de pose seulement" }, range: { en: "$8–$15 / sq. ft.", fr: "8–15 $ / pi²" }, includes: { en: "Labour benchmark. Do not compare directly with a tile-and-installation package; confirm materials, preparation and tax.", fr: "Repère de main-d’œuvre. À distinguer d’un forfait fourniture et pose; confirmez matériaux, préparation et taxes." } },
    ],
    factors: [
      { title: { en: "The floor underneath", fr: "Le support existant" }, text: { en: "Describe what is down now, which storey the room is on and any movement or damage. Levelling, reinforcement, removal and disposal need their own scope before a square-foot rate becomes useful.", fr: "Précisez le revêtement actuel, l’étage et tout mouvement ou dommage. Ragréage, renforcement, dépose et évacuation doivent être définis avant d’utiliser un tarif au pied carré." } },
      { title: { en: "Tile size and layout", fr: "Format et disposition" }, text: { en: "Share the actual product and pattern. Oversized porcelain, diagonal layouts, borders and numerous doorways change handling, cuts, preparation and finishing time.", fr: "Indiquez le produit et le motif envisagés. Grande porcelaine, pose diagonale, bordures et nombreux seuils modifient la manutention, les coupes et la préparation." } },
      { title: { en: "The complete material allowance", fr: "L’ensemble des matériaux" }, text: { en: "Separate tile purchase quantities from the installed floor area. Confirm cutting allowance, trim, mortar, grout and any specified membrane or heating assembly. Avoid counting supplies twice when comparing bundled quotes.", fr: "Distinguez la quantité de carreaux commandée de la surface posée. Confirmez pertes de coupe, profilés, mortier, coulis, membrane et chauffage éventuels, sans compter deux fois les fournitures incluses." } },
    ],
    example: { title: { en: "Example: a 200 sq. ft. kitchen floor", fr: "Exemple : plancher de cuisine de 200 pi²" }, text: { en: "Using the Toronto $13–$34 installed benchmark, 200 × $13–$34 gives $2,600–$6,800 before HST. This arithmetic uses the source’s standard tile scope. Add any separately quoted removal, levelling, repairs, heating or complex pattern work. It is an illustration, not a Tiling.ca estimate.", fr: "Au repère torontois de 13 à 34 $ avec pose, 200 × 13–34 $ donne 2 600 à 6 800 $ avant TVH. Ce calcul reprend la portée courante de la source. Ajoutez les travaux exclus : dépose, ragréage, réparations, chauffage ou motifs complexes. Exemple indicatif, et non estimation de Tiling.ca." } },
    checklist: [
      { en: "Room dimensions, floor level and photographs of the existing surface", fr: "Dimensions, étage et photos du revêtement existant" },
      { en: "Tile product, size, layout and who supplies the materials", fr: "Produit, format, motif et responsable de la fourniture" },
      { en: "Removal, preparation, membranes, trim and waste disposal as separate items", fr: "Dépose, préparation, membranes, profilés et évacuation détaillés" },
      { en: "Access, parking, work hours, minimum charges and tax treatment", fr: "Accès, stationnement, horaires, frais minimaux et taxes" },
    ],
    faq: [
      { question: { en: "Does the square-foot price include the tile?", fr: "Le prix au pied carré comprend-il les carreaux?" }, answer: { en: "Sometimes. The benchmarks above distinguish labour-only pricing from material-and-labour examples. Ask for the tile allowance and setting supplies to be identified in the written quote.", fr: "Parfois. Le tableau distingue la main-d’œuvre seule des exemples avec matériaux. Faites préciser l’allocation de carreaux et les fournitures de pose dans la soumission." } },
      { question: { en: "Can I multiply a large-floor rate by a tiny bathroom?", fr: "Peut-on appliquer le tarif d’un grand plancher à une petite salle de bain?" }, answer: { en: "That can underestimate the project. Mobilization, curing visits, cuts and transitions remain necessary even when the floor area is small. Ask for a whole-project price and any minimum charge.", fr: "Ce calcul peut sous-estimer le projet. Déplacements, visites, coupes et transitions restent nécessaires même sur une petite surface. Demandez le total du projet et les frais minimaux." } },
    ],
  },
  {
    slug: "shower-tiling-cost", service: "bathroom-shower-tile",
    title: { en: "Shower tiling cost in Canada", fr: "Coût du carrelage de douche au Canada" },
    description: { en: "Published shower-tiling budget examples, waterproofing scope, custom-shower cost factors and what to include in a quote.", fr: "Exemples de budgets de carrelage de douche, étanchéité, facteurs de coût et éléments à inclure dans une soumission." },
    range: { en: "$3,000–$7,000 / project", fr: "3 000–7 000 $ / projet" },
    summary: { en: "Published Toronto and Vancouver examples for smaller or standard shower tiling span roughly $3,000–$7,000. Custom showers and slab work can cost considerably more. Compare the waterproofing and preparation scope before treating two shower prices as equivalent.", fr: "Des exemples publiés à Toronto et Vancouver situent le carrelage de petites douches ou de douches courantes autour de 3 000 à 7 000 $. Les douches sur mesure et les grandes dalles peuvent coûter nettement plus. Comparez l’étanchéité et la préparation avant de comparer les totaux." },
    benchmarks: [
      { source: "zelta", scope: { en: "36 × 36 in. shower", fr: "Douche de 36 × 36 po" }, range: { en: "$3,000–$5,500 / project", fr: "3 000–5 500 $ / projet" }, includes: { en: "Three walls, floor and basic waterproofing; about 70–85 sq. ft. of tile. Plumbing, glass and fixtures generally separate.", fr: "Trois murs, sol et étanchéité de base; environ 70–85 pi² de carrelage. Plomberie, vitrage et robinetterie généralement séparés." } },
      { source: "zelta", scope: { en: "Standard alcove shower", fr: "Douche courante en alcôve" }, range: { en: "$4,000–$7,000 / project", fr: "4 000–7 000 $ / projet" }, includes: { en: "Walls, base, waterproofing and a standard layout. Confirm demolition, repairs, tile allowance and tax.", fr: "Murs, base, étanchéité et disposition courante. Confirmez démolition, réparations, allocation de carreaux et taxes." } },
      { source: "superior", scope: { en: "Shower walls and floor", fr: "Murs et sol de douche" }, range: { en: "$3,500–$7,000 / project", fr: "3 500–7 000 $ / projet" }, includes: { en: "Published project range; waterproofing, backer board and preparation are also listed as possible extras. Confirm the complete assembly and tax.", fr: "Fourchette publiée par projet; étanchéité, panneaux et préparation figurent aussi parmi les suppléments possibles. Confirmez l’assemblage complet et les taxes." } },
    ],
    factors: [
      { title: { en: "Measure every tiled surface", fr: "Mesurer toutes les surfaces carrelées" }, text: { en: "A shower footprint is not its tile area. Measure each wall and the floor, then identify the curb, niche, bench, returns and ceiling separately. These details affect both quantity and installation effort.", fr: "L’emprise au sol n’est pas la surface totale à carreler. Mesurez chaque mur et le sol, puis détaillez seuil, niche, banc, retours et plafond. Ils influencent les quantités et le travail." } },
      { title: { en: "Price the assembly behind the tile", fr: "Chiffrer l’assemblage sous les carreaux" }, text: { en: "The quote should identify the substrate, waterproofing system, drain connection, slope and required testing or inspection. Replacing the visible tile alone may not resolve a leaking assembly.", fr: "La soumission doit préciser support, système d’étanchéité, raccord au drain, pente et vérifications requises. Remplacer seulement la finition peut ne pas corriger une fuite." } },
      { title: { en: "Separate tile work from a bathroom renovation", fr: "Distinguer carrelage et rénovation complète" }, text: { en: "Plumbing relocation, shower glass, electrical work, ventilation and fixtures are separate scopes unless expressly included. Demolition can expose damage that changes the agreed repair work.", fr: "Déplacement de plomberie, vitrage, électricité, ventilation et appareils sont des portées distinctes sauf inclusion explicite. La démolition peut révéler des dommages à réparer." } },
    ],
    example: { title: { en: "Compare the same shower scope", fr: "Comparer une même portée de douche" }, text: { en: "For a three-wall shower, record wall height, wall widths and floor dimensions before requesting pricing. Compare a complete line-item proposal against the project ranges above; multiplying only the shower-floor area by a tile rate will miss most of the work. Identify niches and benches separately.", fr: "Pour une douche à trois murs, notez hauteur, largeurs et dimensions du sol. Comparez une proposition détaillée aux fourchettes ci-dessus; multiplier seulement la surface du sol par un tarif de carrelage omet une grande partie des travaux. Détaillez niches et bancs." } },
    checklist: [
      { en: "Existing shower condition, leak history and demolition limits", fr: "État de la douche, historique de fuites et limites de démolition" },
      { en: "Wall and floor measurements, tile format, niches and benches", fr: "Mesures des murs et du sol, format, niches et bancs" },
      { en: "Substrate, waterproofing, drain, slope and verification responsibilities", fr: "Support, étanchéité, drain, pente et responsabilités de vérification" },
      { en: "Plumbing, glass, fixtures, repairs and taxes included or excluded", fr: "Plomberie, vitrage, appareils, réparations et taxes inclus ou exclus" },
    ],
    faq: [
      { question: { en: "Is this the price of a complete bathroom renovation?", fr: "S’agit-il du prix d’une rénovation complète de salle de bain?" }, answer: { en: "No. These examples concern shower tiling and the stated assembly work. A bathroom renovation may also include a vanity, plumbing, electrical work, ventilation, glass and painting.", fr: "Non. Ces exemples concernent le carrelage de douche et les travaux d’assemblage indiqués. Une rénovation peut aussi inclure meuble-lavabo, plomberie, électricité, ventilation, vitrage et peinture." } },
      { question: { en: "Why can a small shower cost more per square foot?", fr: "Pourquoi une petite douche peut-elle coûter davantage au pied carré?" }, answer: { en: "Waterproofing transitions, drains, corners and staged work take time regardless of area. A complete project quote is more useful than applying an open-floor labour rate to the shower.", fr: "Raccords d’étanchéité, drain, angles et étapes de travail prennent du temps quelle que soit la surface. Une soumission complète est plus utile qu’un tarif de grand plancher appliqué à la douche." } },
    ],
  },
  {
    slug: "backsplash-tiling-cost", service: "kitchen-backsplash",
    title: { en: "Kitchen backsplash installation cost", fr: "Coût de pose d’un dosseret de cuisine" },
    description: { en: "Compare published backsplash costs in Toronto, Vancouver and Calgary, with scope notes, size examples and quote questions.", fr: "Comparez les coûts publiés de dosserets à Toronto, Vancouver et Calgary : portée, dimensions et questions pour la soumission." },
    range: { en: "$780–$2,500 / project", fr: "780–2 500 $ / projet" },
    summary: { en: "Selected Canadian contractor guides publish backsplash project examples from $780 to $2,500. Larger walls, premium materials and detailed patterns can exceed this range. On a small backsplash, a project minimum may matter more than a per-square-foot price.", fr: "Des guides d’entrepreneurs canadiens présentent des exemples de dosserets de 780 à 2 500 $. Les grands murs, matériaux haut de gamme et motifs complexes peuvent dépasser cette fourchette. Sur une petite surface, le minimum par projet peut compter davantage que le tarif au pied carré." },
    benchmarks: [
      { source: "prime", scope: { en: "Small kitchen, standard tile, 20–30 sq. ft.", fr: "Petite cuisine, carreaux courants, 20–30 pi²" }, range: { en: "$800–$1,500 / project", fr: "800–1 500 $ / projet" }, includes: { en: "Published standard-tile package. Confirm removal, wall repairs, edge trim and taxes.", fr: "Forfait publié pour carreaux courants. Confirmez dépose, réparations murales, profilés et taxes." } },
      { source: "superior", scope: { en: "Kitchen backsplash", fr: "Dosseret de cuisine" }, range: { en: "$800–$2,500 / project", fr: "800–2 500 $ / projet" }, includes: { en: "Published project range; size and complete inclusions are not itemized. Confirm the selected tile and preparation.", fr: "Fourchette par projet; dimensions et inclusions complètes non détaillées. Confirmez carreaux et préparation." } },
      { source: "vital", scope: { en: "Kitchen backsplash", fr: "Dosseret de cuisine" }, range: { en: "$780–$1,600 / project", fr: "780–1 600 $ / projet" }, includes: { en: "Published project example; size and inclusions are not itemized. Confirm material allowance, wall repairs and tax.", fr: "Exemple publié; dimensions et inclusions non détaillées. Confirmez allocation de matériaux, réparations et taxes." } },
    ],
    factors: [
      { title: { en: "Wall condition and removal", fr: "État du mur et dépose" }, text: { en: "Photograph the existing finish and say whether it will be removed before installation. Damaged drywall, old adhesive and uneven areas may need preparation before a new layout can be set.", fr: "Photographiez la finition existante et précisez si elle sera retirée avant la pose. Gypse endommagé, ancien adhésif et irrégularités peuvent nécessiter une préparation." } },
      { title: { en: "Outlets, edges and the focal wall", fr: "Prises, bordures et mur principal" }, text: { en: "Measure returns, windows and the range wall as well as the straight counter run. Edge trim, many outlets, a ceiling-height section or an intricate pattern change the cutting and finishing work.", fr: "Mesurez retours, fenêtres et mur de cuisinière en plus de la longueur du comptoir. Profilés, prises nombreuses, pose jusqu’au plafond et motifs modifient coupes et finitions." } },
      { title: { en: "A small area still needs a full visit", fr: "Une petite surface nécessite aussi une intervention complète" }, text: { en: "Protection, setup, material handling, cutting and finishing do not shrink in proportion to the wall area. Ask about minimum charges, return visits and coordination with completed counters and cabinets.", fr: "Protection, préparation, manutention, coupes et finitions ne diminuent pas proportionnellement à la surface. Demandez les frais minimaux, les visites et la coordination avec comptoirs et armoires." } },
    ],
    example: { title: { en: "Example: 20 linear feet at 18 inches high", fr: "Exemple : 20 pieds linéaires sur 18 pouces de hauteur" }, text: { en: "20 ft × 1.5 ft gives 30 sq. ft. before adding returns or a taller range section. That falls within the cited Toronto small-kitchen size band of 20–30 sq. ft. Use its $800–$1,500 standard-tile example as a comparison point, then confirm the actual materials, removal, wall repairs and minimum charge.", fr: "20 pi × 1,5 pi donne 30 pi² avant les retours ou la section plus haute derrière la cuisinière. Cette surface correspond à la catégorie torontoise de 20–30 pi² citée ci-dessus. Comparez au repère de 800–1 500 $ puis confirmez matériaux, dépose, réparations et minimum." } },
    checklist: [
      { en: "Counter-run lengths, tile height and photographs of the whole kitchen", fr: "Longueurs, hauteur du carrelage et photos de toute la cuisine" },
      { en: "Tile sample or product link, pattern and grout preference", fr: "Échantillon ou lien produit, motif et choix de coulis" },
      { en: "Outlets, corners, exposed edges, windows and range-wall height", fr: "Prises, angles, bords exposés, fenêtres et hauteur du mur de cuisinière" },
      { en: "Removal, wall repair, minimum charge, finishing visits and taxes", fr: "Dépose, réparation murale, minimum, visites de finition et taxes" },
    ],
    faq: [
      { question: { en: "Is a square-foot price enough to budget a backsplash?", fr: "Un tarif au pied carré suffit-il pour budgéter un dosseret?" }, answer: { en: "It is only a starting point. Minimum charges and the number of cuts can dominate a small project. Compare a written project total with the same tile, preparation and finishing scope.", fr: "C’est un point de départ seulement. Minimums et nombre de coupes peuvent dominer un petit projet. Comparez des totaux écrits avec les mêmes carreaux, préparation et finitions." } },
      { question: { en: "Does supplying my own tile remove the material cost?", fr: "Fournir mes carreaux élimine-t-il le coût des matériaux?" }, answer: { en: "It removes the tile purchase from the contractor’s scope, but mortar, grout, trim, delivery and preparation may still be needed. Confirm quantities, suitability and availability before booking.", fr: "L’achat des carreaux sort de la portée de l’entrepreneur, mais mortier, coulis, profilés, livraison et préparation peuvent rester nécessaires. Confirmez quantités, compatibilité et disponibilité avant la réservation." } },
    ],
  },
  ...expandedPricing.guides,
];
export function getPricingGuide(slug: string) { return pricingGuides.find(guide => guide.slug === slug); }
export function guidesForService(service?: string) {
  return service ? pricingGuides.filter(guide => guide.service === service) : pricingGuides;
}
// Keep previously shared comparison URLs working without accepting arbitrary scope.
export function acceptsQuoteContext(guide: PriceGuide, service: string) {
  if (guide.service === service) return true;
  if (service === "tile-supply-delivery") return ["floor-tile-installation","bathroom-shower-tile","kitchen-backsplash"].includes(guide.service);
  if (["large-format-tile","heated-tile-floors","tile-removal-surface-preparation","commercial-tile"].includes(service)) return guide.service === "floor-tile-installation";
  return service === "tile-repair-regrouting" && ["floor-tile-installation","bathroom-shower-tile"].includes(guide.service);
}
export const pricingGroups = [
  { id: "interior-installation", title: { en: "Floors, kitchens & bathrooms", fr: "Planchers, cuisines et salles de bain" }, services: ["floor-tile-installation","bathroom-shower-tile","kitchen-backsplash","large-format-tile","heated-tile-floors"] },
  { id: "repair-preparation", title: { en: "Repairs, preparation & care", fr: "Réparation, préparation et entretien" }, services: ["tile-repair-regrouting","tile-removal-surface-preparation","tile-grout-stone-cleaning-sealing"] },
  { id: "specialty-surfaces", title: { en: "Specialty & commercial surfaces", fr: "Surfaces spécialisées et commerciales" }, services: ["commercial-tile","fireplace-feature-wall-tiling","tile-stairs-steps","outdoor-balcony-tiling","pool-spa-tiling","rooftop-terrace-pedestal-pavers"] },
  { id: "tile-supply", title: { en: "Tile supply & delivery", fr: "Fourniture et livraison" }, services: ["tile-supply-delivery"] },
];
const relatedServices: Record<string,string[]> = {
  "floor-tile-installation": ["tile-removal-surface-preparation","large-format-tile","heated-tile-floors"],
  "bathroom-shower-tile": ["tile-repair-regrouting","heated-tile-floors","tile-grout-stone-cleaning-sealing"],
  "kitchen-backsplash": ["tile-supply-delivery","tile-removal-surface-preparation","floor-tile-installation"],
  "large-format-tile": ["floor-tile-installation","tile-supply-delivery","fireplace-feature-wall-tiling"],
  "heated-tile-floors": ["floor-tile-installation","bathroom-shower-tile","tile-removal-surface-preparation"],
  "tile-repair-regrouting": ["tile-grout-stone-cleaning-sealing","bathroom-shower-tile","floor-tile-installation"],
  "tile-removal-surface-preparation": ["floor-tile-installation","large-format-tile","tile-repair-regrouting"],
  "tile-grout-stone-cleaning-sealing": ["tile-repair-regrouting","floor-tile-installation","bathroom-shower-tile"],
  "commercial-tile": ["tile-removal-surface-preparation","large-format-tile","tile-grout-stone-cleaning-sealing"],
  "fireplace-feature-wall-tiling": ["large-format-tile","tile-supply-delivery","tile-removal-surface-preparation"],
  "tile-stairs-steps": ["floor-tile-installation","outdoor-balcony-tiling","tile-removal-surface-preparation"],
  "outdoor-balcony-tiling": ["rooftop-terrace-pedestal-pavers","tile-stairs-steps","tile-supply-delivery"],
  "pool-spa-tiling": ["tile-repair-regrouting","tile-grout-stone-cleaning-sealing","outdoor-balcony-tiling"],
  "rooftop-terrace-pedestal-pavers": ["outdoor-balcony-tiling","tile-supply-delivery","commercial-tile"],
  "tile-supply-delivery": ["floor-tile-installation","large-format-tile","kitchen-backsplash"],
};
export function relatedPricingGuides(service: string) {
  return (relatedServices[service] ?? []).flatMap(slug => guidesForService(slug));
}
