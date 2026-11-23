import { getMaterial, getService } from "./data";
import { frenchMaterials, frenchServices } from "./fr/content";
import type { Locale } from "./pricing-data";

const rooms = [
  {
    title: { en: "Kitchens and entryways", fr: "Cuisines et entrées" },
    detail: {
      en: "Choose a floor-rated ceramic, porcelain or natural stone tile. Compare traction under wet shoes and how much care each finish needs.",
      fr: "Choisissez une céramique, une porcelaine ou une pierre naturelle conçue pour le sol. Comparez l’adhérence sous les chaussures mouillées et l’entretien de chaque fini.",
    },
    service: "floor-tile-installation",
    materials: ["ceramic-tile", "porcelain-tile", "natural-stone-tile"],
  },
  {
    title: { en: "Offices and meeting rooms", fr: "Bureaux et salles de réunion" },
    detail: {
      en: "Carpet tile gives workspaces a soft surface. Check the pile for rolling chairs and keep a few matching tiles to replace worn sections.",
      fr: "Les dalles de moquette offrent une surface souple. Vérifiez que le velours convient aux chaises à roulettes et gardez quelques dalles du même lot pour les zones usées.",
    },
    service: "carpet-tile-installation",
    materials: ["carpet-tile"],
  },
  {
    title: { en: "Garages and home gyms", fr: "Garages et salles d’entraînement" },
    detail: {
      en: "For a garage, check interlocking PVC tiles rated for vehicles and turning wheels. For a gym, choose interlocking rubber rated for your equipment and impact loads.",
      fr: "Au garage, choisissez des dalles de PVC emboîtables adaptées au poids des véhicules et aux roues qui pivotent. Pour l’entraînement, vérifiez que le caoutchouc convient aux appareils et aux impacts prévus.",
    },
    service: "interlocking-floor-tile-installation",
    materials: ["interlocking-floor-tile"],
  },
  {
    title: { en: "Living rooms and finished basements", fr: "Salons et sous-sols aménagés" },
    detail: {
      en: "Luxury vinyl tile (LVT) offers a smooth, easy-to-clean floor. Check slab moisture and door clearances before choosing a glue-down or click system.",
      fr: "Les carreaux de vinyle de luxe (LVT) offrent une surface lisse et facile à nettoyer. Vérifiez l’humidité du support et le dégagement des portes avant de choisir une pose collée ou à encliqueter.",
    },
    service: "vinyl-tile-installation",
    materials: ["vinyl-tile"],
  },
];

export function FloorMaterialChoices({ locale, area }: { locale: Locale; area?: string }) {
  const fr = locale === "fr";
  const prefix = fr ? "/fr" : "";
  return <section className="service-options section-pad" aria-labelledby="floor-materials">
    <h2 id="floor-materials">{fr ? "Quel revêtement choisir pour votre pièce?" : "Which tile suits your room?"}</h2>
    <div className="material-comparison-grid">{rooms.map(room => {
      const installation = fr ? frenchServices.find(item => item.slug === room.service) : getService(room.service);
      const productContext = new URLSearchParams({ service: room.service });
      const installationContext = new URLSearchParams({ material: room.materials[0] });
      if (area) {
        productContext.set("area", area);
        installationContext.set("area", area);
      }
      return <article key={room.service}>
        <h3>{room.title[locale]}</h3>
        <p>{room.detail[locale]}</p>
        <div className="coverage-tags">{room.materials.map(slug => {
          const material = fr ? frenchMaterials.find(item => item.slug === slug) : getMaterial(slug);
          return <a key={slug} href={`${prefix}/materials/${slug}?${productContext}`}>{material!.name}</a>;
        })}
          {room.service !== "floor-tile-installation" && <a href={`${prefix}/services/${room.service}?${installationContext}`}>{installation!.name} →</a>}
        </div>
      </article>;
    })}</div>
  </section>;
}
