import { getArea, getMaterial, getService } from "./data";
import { getServiceGuide } from "./service-guide-data";
import type { Locale } from "./pricing-data";

export type EnquiryPage = "contact" | "request-a-quote";
export type EnquiryQuery = Record<string, string | string[] | undefined>;
export const enquiryReviewed = "2026-11-08";
export const enquiryMeta = {
  contact: {
    en: { title: "Contact Us for Tile Projects & Quotes", description: "Call, email or send Tiling.ca your tile project details. Get help with installation, repair, cleaning, tile supply and delivery across Canada." },
    fr: { title: "Nous joindre pour un projet de carrelage", description: "Appelez, écrivez ou décrivez votre projet à Tiling.ca : pose, réparation, nettoyage, fourniture et livraison de carreaux au Canada." },
  },
  "request-a-quote": {
    en: { title: "Request a Free Tile Quote", description: "Start your Tiling.ca quote with your name, email and project city. Add optional project notes or email photos to discuss scope, materials and availability." },
    fr: { title: "Soumission pour vos travaux de carrelage", description: "Indiquez votre nom, votre courriel et la ville du projet. Ajoutez des détails ou envoyez des photos pour discuter des travaux et des disponibilités." },
  },
};

// Query values are only accepted when they identify published site content.
export function enquiryContext(query: EnquiryQuery = {}) {
  const area = typeof query.area === "string" ? getArea(query.area) : undefined;
  const material = typeof query.material === "string" ? getMaterial(query.material) : undefined;
  const service = (typeof query.service === "string" ? getService(query.service) : undefined) || (material ? getService("tile-supply-delivery") : undefined);
  const params = new URLSearchParams();
  if (area) params.set("area", area.slug);
  if (service) params.set("service", service.slug);
  if (material) params.set("material", material.slug);
  return { area, material, service, suffix: params.size ? "?" + params.toString() : "" };
}

export function enquiryGuidance(locale: Locale, service?: string) {
  const fr = locale === "fr";
  const hints = getServiceGuide(service || "")?.quoteChecklist.slice(0, 4).map(item => item[locale]) || (fr ? [
    "La pièce ou la surface et les travaux souhaités.",
    "Les dimensions approximatives, en précisant pieds ou mètres.",
    "Le revêtement actuel, les dommages ou la dépose à prévoir.",
    "Les dates souhaitées et les contraintes d’accès, si connues.",
  ] : [
    "The room or surface and the work you need.",
    "Approximate dimensions, including feet or metres.",
    "The existing finish, damage or removal needed.",
    "Preferred timing and any access restrictions, if known.",
  ]);
  const placeholders: Record<string, [string, string]> = {
    "tile-supply-delivery": ["Tile or product reference, quantity and delivery needs, if known.", "Carreau ou référence du produit, quantité et besoins de livraison, si connus."],
    "tile-repair-regrouting": ["Where is the damage, how much is affected, and do you have spare tiles?", "Où se trouvent les dommages, quelle surface est touchée et avez-vous des carreaux de rechange?"],
    "tile-grout-stone-cleaning-sealing": ["Surface or stone type, approximate area and stains or previous treatments.", "Type de surface ou de pierre, superficie approximative, taches et traitements antérieurs."],
    "commercial-tile": ["Business use, approximate area, operating hours and access constraints.", "Usage commercial, superficie approximative, heures d’activité et contraintes d’accès."],
  };
  return { hints, placeholder: placeholders[service || ""]?.[fr ? 1 : 0] || (fr ? "Pièce, travaux souhaités, dimensions approximatives et dates envisagées." : "Room, work needed, approximate dimensions and preferred timing.") };
}

export function enquiryFaq(page: EnquiryPage, locale: Locale) {
  const fr = locale === "fr";
  return [
    { q: fr ? "Puis-je vous joindre avant d’avoir choisi les carreaux?" : "Can I get in touch before choosing tile?", a: fr ? "Oui. Indiquez la ville et les travaux envisagés, même si les dimensions, le produit ou les dates restent à préciser. Nous pourrons discuter des renseignements nécessaires pour la suite." : "Yes. Tell us the project city and the work you have in mind, even if dimensions, products or dates are still undecided. We can discuss the information needed for the next step." },
    { q: fr ? "Comment envoyer des photos ou des plans?" : "How do I send photos or plans?", a: fr ? "Envoyez-les à info@tiling.ca en indiquant le même nom et la même ville que dans le formulaire. Une vue d’ensemble et des gros plans des zones concernées aident à expliquer le projet. Les photos ne remplacent pas une évaluation sur place lorsqu’elle est nécessaire." : "Email them to info@tiling.ca using the same name and city as your form submission. An overall view and close-ups of the areas involved help explain the project. Photos do not replace a site assessment when one is needed." },
    page === "contact" ?
      { q: fr ? "Pouvez-vous examiner un projet dans ma ville?" : "Can you review a project in my city?", a: fr ? "Nous examinons les demandes de pose, de réparation et de fourniture partout au Canada. Indiquez la ville : l’adresse, l’accès, les déplacements ou la livraison et les disponibilités sont confirmés pour chaque projet." : "We review installation, repair and supply enquiries across Canada. Include your city: the exact address, access, travel or delivery, and availability are confirmed for each project." } :
      { q: fr ? "La demande réserve-t-elle une date ou un prix?" : "Does submitting reserve a date or a price?", a: fr ? "Non. La demande ouvre la discussion. La portée, les matériaux, le prix et les dates doivent être confirmés pour votre projet. Les guides de prix présentent des repères de l’industrie, pas une soumission de Tiling.ca." : "The request starts a conversation. Scope, materials, price and dates need to be confirmed for your project. Pricing guides provide industry benchmarks, not a Tiling.ca quote." },
  ];
}
