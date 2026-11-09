import { getArea, services } from "./data";
import { frenchServices } from "./fr/content";
import { getServiceGuide } from "./service-guide-data";
import { guidesForService } from "./pricing-data";
import { hasLocalServicePage, localServiceHref } from "./local-service-publication";

export function LocalServiceMenu({ areaSlug, locale = "en" }: { areaSlug: string; locale?: "en" | "fr" }) {
  const fr = locale === "fr";
  return <nav className="local-service-menu" aria-label={fr ? "Choisir un service local" : "Choose a local service"}>
    {services.map(service => <a key={service.slug} href={localServiceHref(areaSlug,service.slug,locale)}>
      <strong>{fr ? frenchServices.find(item=>item.slug===service.slug)!.name : service.name}</strong>
      <span>{hasLocalServicePage(areaSlug,service.slug) ? (fr ? "Guide local →" : "Local guide →") : (fr ? "Détails sur cette page ↓" : "Details on this page ↓")}</span>
    </a>)}
  </nav>;
}

export function ConsolidatedLocalServices({ areaSlug, locale = "en" }: { areaSlug: string; locale?: "en" | "fr" }) {
  const area = getArea(areaSlug);
  if (!area) return null;
  const consolidated = services.filter(service => !hasLocalServicePage(areaSlug, service.slug));
  if (!consolidated.length) return null;
  const fr = locale === "fr", prefix = fr ? "/fr" : "";
  return <section className="consolidated-services section-pad" aria-labelledby="local-service-details">
    <p className="section-kicker">{fr ? "Préparer les travaux" : "Plan the work"}</p>
    <h2 id="local-service-details">{fr ? `Détails des services de carrelage à ${area.name}` : `Tile service details in ${area.name}`}</h2>
    <p>{fr ? "Consultez la portée du service, les repères de prix et les renseignements à préparer. Nous confirmons l’accès, les déplacements et les disponibilités pour votre propriété avant de convenir des travaux." : "Review the scope, pricing guide and details to prepare for your project. We confirm access, travel and availability for your property before agreeing the work."}</p>
    <div className="consolidated-service-list">{consolidated.map(service => {
      const copy = fr ? frenchServices.find(item => item.slug === service.slug)! : service;
      const guide = getServiceGuide(service.slug)!;
      const price = guidesForService(service.slug)[0];
      const query = new URLSearchParams({ area: areaSlug, service: service.slug });
      return <article className="consolidated-service" id={`service-${service.slug}`} key={service.slug}>
        <h3>{copy.name}</h3>
        <p>{copy.intro}</p>
        <p className="service-scope-note">{guide.scopeNote[locale]}</p>
        <details><summary>{fr ? "Préparation et détails pour la soumission" : "Preparation and quote details"}</summary>
          <ul>{guide.quoteChecklist.map(item => <li key={item.en}>{item[locale]}</li>)}</ul>
        </details>
        <div className="consolidated-service-links">
          <a href={`${prefix}/services/${service.slug}?area=${areaSlug}`}>{fr ? "Options et préparation →" : "Options and preparation →"}</a>
          <a href={`${prefix}/pricing/${price.slug}?${query}`}>{fr ? "Guide de prix →" : "Pricing guide →"}</a>
          <a className="button button-primary" href={`${prefix}/request-a-quote?${query}`}>{fr ? "Demander une soumission" : "Request a quote"}</a>
        </div>
      </article>;
    })}</div>
  </section>;
}
