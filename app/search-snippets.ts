import labels from "./search-service-labels.json";

type Locale = "en" | "fr";
type Locality = { name: string; provinceCode: string };
const scopes: Record<string, Record<Locale, string>> = {
  "bathroom-shower-tile": { en: "Plan shower waterproofing, layout and finishes.", fr: "Préparez la douche, l’étanchéité et les finis." },
  "floor-tile-installation": { en: "Compare substrates, layouts and floor preparation.", fr: "Comparez les supports, le calepinage et la préparation." },
  "kitchen-backsplash": { en: "Plan wall preparation, outlets and tile layouts.", fr: "Préparez les murs, les prises et le calepinage." },
  "large-format-tile": { en: "Plan flatness, handling and large tile layouts.", fr: "Prévoyez la planéité, la manutention et les grands formats." },
  "heated-tile-floors": { en: "Plan electric heating, floor height and tile finishes.", fr: "Prévoyez le chauffage électrique et la hauteur du plancher." },
  "tile-repair-regrouting": { en: "Discuss cracked tiles, grout repairs and replacement.", fr: "Discutez des carreaux fissurés, des joints et du remplacement." },
  "commercial-tile": { en: "Plan traffic, access, durability and work phases.", fr: "Prévoyez la circulation, l’accès et les phases de travaux." },
  "outdoor-balcony-tiling": { en: "Plan patios, balconies, drainage and frost exposure.", fr: "Préparez les balcons et terrasses : drainage et gel." },
  "fireplace-feature-wall-tiling": { en: "Plan fireplaces, feature walls, trims and heat exposure.", fr: "Préparez les foyers et murs décoratifs : chaleur et profils." },
  "pool-spa-tiling": { en: "Plan submerged surfaces, waterlines and repairs.", fr: "Préparez les surfaces immergées et les lignes d’eau." },
  "tile-stairs-steps": { en: "Plan stair dimensions, edges and slip resistance.", fr: "Prévoyez les dimensions, les nez de marche et l’adhérence." },
  "tile-removal-surface-preparation": { en: "Discuss tile removal, dust control and substrate repairs.", fr: "Prévoyez la dépose, la poussière et la réparation du support." },
  "tile-grout-stone-cleaning-sealing": { en: "Compare cleaning and sealing for tile, grout and stone.", fr: "Comparez les soins des carreaux, des joints et des pierres." },
  "rooftop-terrace-pedestal-pavers": { en: "Plan rooftop terraces, pedestal supports and drainage.", fr: "Préparez les toits-terrasses, les supports et le drainage." },
  "tile-supply-delivery": { en: "Discuss material quantities, delivery and access.", fr: "Précisez les quantités, la livraison et l’accès." },
};

/** Keep the complete place name; omit the brand when it would crowd the title. */
export function searchTitle(title: string): string | { absolute: string } {
  return title.length + " | Tiling.ca".length > 65 ? { absolute: title } : title;
}

export function localSnippet(area: Locality, service: string | undefined, locale: Locale) {
  const place = `${area.name}, ${area.provinceCode}`;
  const label = service ? labels[service as keyof typeof labels]?.[locale] : undefined;
  if (!label || !service) return {
    title: locale === "fr" ? `Carrelage — ${place}` : `Tile Services in ${place}`,
    description: locale === "fr" ? `Pose, réparation et fourniture de carrelage — ${place}. Services, prix indicatifs et soumission.` : `Tile installation, repairs and supply in ${place}. Explore services, industry prices and quote details.`,
  };
  const title = locale === "fr" ? `${label} — ${place}` : `${label} in ${place}`;
  const core = `${title}. ${scopes[service][locale]}`;
  const next = locale === "fr" ? " Demandez une soumission." : " Request a quote.";
  return { title, description: core.length + next.length <= 165 ? core + next : core };
}

export function regionSnippet(name: string, locale: Locale) {
  return locale === "fr" ? {
    title: `Carrelage : région de ${name}, ON`,
    description: `Services de carrelage et guides de prix pour les municipalités de ${name}, Ontario. Préparez votre demande de soumission.`,
  } : {
    title: `Tile Services — ${name}, ON`,
    description: `Browse tile services, pricing guides and project enquiries for municipalities in ${name}, Ontario.`,
  };
}

export const pricingSearchTitles: Record<string, Partial<Record<Locale, string>>> = {
  "tile-repair-regrouting-cost": { fr: "Prix des réparations de carreaux et de joints" },
  "tile-cleaning-sealing-cost": { fr: "Prix du nettoyage et du scellement" },
  "tile-supply-delivery-cost": { fr: "Prix des carreaux et de la livraison" },
  "tile-stairs-cost": { fr: "Prix du carrelage d’escalier" },
  "pool-spa-tiling-cost": { fr: "Prix du carrelage de piscine et spa" },
  "rooftop-terrace-pedestal-paver-cost": { en: "Rooftop Paver Costs & Installation", fr: "Prix des dalles sur plots en toit-terrasse" },
};
