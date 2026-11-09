import { localServiceHref } from "./local-service-publication";
import { areas, business, getArea, getService, getMaterial, materials } from "./data";
import { FAQ, Link, StructuredData } from "./components";
import { CommercialExamples } from "./commercial-examples";
import { QuoteForm } from "./quote-form";
import { PricingLinks } from "./pricing-content";
import { guidesForService, type Locale } from "./pricing-data";
import { frenchServices, frenchMaterials, provinceFr } from "./fr/content";
import { getServiceGuide, serviceReviewed } from "./service-guide-data";

export function ServiceReference({ slug, locale = "en", areaSlug }: { slug: string; locale?: Locale; areaSlug?: string }) {
  const guide = getServiceGuide(slug);
  if (!guide) return null;
  const area = areaSlug ? getArea(areaSlug) : undefined;
  const fr = locale === "fr";
  return <p className="service-reference"><a href={`${fr ? "/fr" : ""}/services/${slug}${area ? "?area=" + area.slug : ""}#service-options`}>{fr ? "Comparer les options, les étapes et les matériaux de ce service →" : "Compare this service’s options, preparation and materials →"}</a></p>;
}

export function ServiceLanding({ slug, locale = "en", areaSlug, materialSlug }: { slug: string; locale?: Locale; areaSlug?: string; materialSlug?: string }) {
  const service = getService(slug)!;
  const guide = getServiceGuide(slug)!;
  const fr = locale === "fr", prefix = fr ? "/fr" : "";
  const copy = fr ? frenchServices.find(item => item.slug === slug)! : service;
  const pricing = guidesForService(slug)[0];
  const url = `${business.domain}${prefix}/services/${slug}`;
  const area = areaSlug ? getArea(areaSlug) : undefined;
  const material = materialSlug ? getMaterial(materialSlug) : undefined;
  const materialName = material ? (fr ? frenchMaterials.find(item=>item.slug===material.slug)!.name : material.name) : undefined;
  const quoteParams = new URLSearchParams({service:slug});
  if (area) quoteParams.set("area",area.slug);
  if (material) quoteParams.set("material",material.slug);
  const quoteHref = `${prefix}/request-a-quote?${quoteParams}`;
  const quoteId = slug === "commercial-tile" ? "commercial-quote" : "service-quote";
  const questions = [...copy.faq, ...guide.faq.map(item => ({ q: item.q[locale], a: item.a[locale] }))];
  const related = guide.relatedServices.map(getService).filter(item => !!item);
  const selectedMaterials = guide.materials.map(id => (fr ? frenchMaterials : materials).find(item => item.slug === id)).filter(item => !!item);
  return <>
    <section className="inner-hero service-hero">
      <p className="eyebrow">{fr ? "TILING.CA · SERVICES DE CARRELAGE AU CANADA" : "TILING.CA · TILE SERVICES ACROSS CANADA"}</p>
      <h1>{copy.name}</h1><p>{copy.short}</p>{area && <p className="service-context">{fr ? "Votre projet : " : "Your project: "}<a href={localServiceHref(area.slug,slug,locale)}>{area.name} →</a></p>}
      {material && <p className="material-context">{fr ? "Matériau envisagé : " : "Material being considered: "}{materialName}</p>}
      <div className="service-hero-actions"><Link className="button button-primary" href={quoteHref}>{fr ? "Demander une soumission" : "Request a quote"}</Link><a className="service-price-link" href={`${prefix}/pricing/${pricing.slug}?${quoteParams}`}>{fr ? "Consulter les repères de prix →" : "Explore pricing and cost factors →"}</a></div>
    </section>
    <nav className="guide-jump-links service-jump-links" aria-label={fr ? "Dans ce service" : "On this service page"}>
      {[["service-options", fr ? "Options" : "Project options"], ["service-planning", fr ? "Étapes" : "Preparation & process"], ["service-pricing", fr ? "Prix" : "Pricing"], [quoteId, fr ? "Votre soumission" : "Quote checklist"], ["service-faq", fr ? "Questions" : "FAQs"]].map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
    </nav>
    <section className="service-detail section-pad">
      <figure className="service-photo"><img src={service.image} alt={fr ? copy.name : service.imageAlt} width="1536" height="1024" loading="lazy"/></figure>
      <div><p className="section-kicker">{fr ? "La portée des travaux" : "The project scope"}</p><h2>{fr ? "Un travail défini selon votre projet." : service.scopeHeading || "Plan the installation and materials together."}</h2><p>{copy.intro}</p>{!fr && <p>{service.scopeNote || "We assess the existing conditions, specify preparation and materials, and provide your quote. Our work includes the layout, installation, transitions and finishing details agreed for your project."}</p>}<ul className="check-list">{copy.features.map(item => <li key={item}>{item}</li>)}</ul></div>
    </section>
    <section className="service-options section-pad" id="service-options"><p className="section-kicker">{fr ? "Choisir la portée adaptée" : "Choose the right scope"}</p><h2>{guide.optionsHeading[locale]}</h2><div className="service-option-grid">{guide.options.map(option => <article key={option.title.en}><h3>{option.title[locale]}</h3><p>{option.text[locale]}</p></article>)}</div></section>
    {slug === "commercial-tile" && (fr ? <section className="section-pad service-commercial" id="commercial-applications"><h2>Des applications adaptées à votre entreprise.</h2><div className="fr-grid">{[["restaurant","Restaurants et cafés"],["hotel","Hôtels"],["retail","Commerces"],["washroom","Toilettes et vestiaires"],["office","Bureaux"],["kitchen","Cuisines de service"]].map(([id,label]) => <article className="fr-card" id={id} key={id}><h3>{label}</h3><p>Nous précisons les surfaces, la circulation, l’exposition à l’eau, l’entretien et les périodes d’accès pour définir un assemblage et un calendrier adaptés à vos activités.</p><a href="#commercial-quote">Discuter de ce projet →</a></article>)}</div></section> : <CommercialExamples/>)}
    <section className="service-planning section-pad" id="service-planning"><p className="section-kicker">{fr ? "Préparer le chantier" : "Plan the work"}</p><h2>{guide.planningHeading[locale]}</h2><ol>{guide.steps.map(step => <li key={step.title.en}><h3>{step.title[locale]}</h3><p>{step.text[locale]}</p></li>)}</ol></section>
    <div id="service-pricing" className="service-anchor"><PricingLinks locale={locale} service={slug} area={area?.slug} material={material?.slug}/></div>
    <section className="quote-section service-quote" id={quoteId}>
      <div className="quote-copy"><p className="section-kicker">{fr ? "Votre projet" : "Your project"}</p><h2>{fr ? "Les détails qui préparent une bonne soumission." : "The details behind a useful quote."}</h2><p>{fr ? "Indiquez la ville et les travaux souhaités. Pour préciser le projet, préparez aussi :" : "Start with the city and the work you need. These details help us define your project:"}</p><ul>{guide.quoteChecklist.map(item => <li key={item.en}>{item[locale]}</li>)}</ul><p className="service-scope-note">{guide.scopeNote[locale]}</p></div>
      <QuoteForm projectOptions locale={locale} serviceName={copy.name} defaultCity={area?.name} materialName={materialName}/>
    </section>
    <section className="faq-section section-pad" id="service-faq"><div><p className="section-kicker">{fr ? "Questions fréquentes" : "Common questions"}</p><h2>{fr ? "Préciser votre projet." : "Get the details clear."}</h2><p>{fr ? "Préparez vos choix, puis confirmez les produits et les conditions réelles du chantier dans votre soumission." : "Use these answers to plan your choices, then confirm the selected products and actual site conditions in your quote."}</p></div><FAQ items={questions}/></section>
    <section className="service-resources section-pad" aria-label={fr ? "Services et matériaux connexes" : "Related services and materials"}>
      <p className="section-kicker">{fr ? "Coordonner le projet" : "Plan the connected work"}</p><h2>{fr ? "Les services et matériaux à considérer." : "Related services and material choices."}</h2>
      <div className="service-related-grid">{related.map(item => {const localized = fr ? frenchServices.find(s => s.slug === item.slug)! : item;return <a key={item.slug} href={`${prefix}/services/${item.slug}${area || material ? "?" + new URLSearchParams({...(area?{area:area.slug}:{}),...(material?{material:material.slug}:{})}) : ""}`}><h3>{localized.name}</h3><p>{localized.short}</p><span>{fr ? "Voir le service →" : "Explore this service →"}</span></a>;})}</div>
      {selectedMaterials.length > 0 && <div className="service-material-links"><h3>{fr ? "Comprendre les matériaux" : "Understand the materials"}</h3><p>{fr ? "Le produit précis doit convenir à la surface et à l’usage prévus. Consultez ses caractéristiques et ses besoins d’entretien avant de choisir." : "The exact product must suit the surface and intended use. Compare material characteristics and care requirements before selecting."}</p><div className="coverage-tags">{selectedMaterials.map(item => <a key={item.slug} href={`${prefix}/materials/${item.slug}?service=${slug}${area ? "&area="+area.slug : ""}`}>{item.name} →</a>)}</div></div>}
    </section>
    <section className="service-area-links section-pad"><p className="section-kicker">{fr ? "Régions desservies au Canada" : "Canada-wide service areas"}</p><h2>{fr ? "Trouver les détails pour votre région." : "Find local details for your project."}</h2><p>{fr ? "Recherchez votre ville ou votre communauté, puis choisissez le service. Nous confirmons l’accès, les déplacements et les disponibilités pour votre propriété." : "Choose a province or territory, then find your city and the service you need. We confirm access, travel and scheduling for your property."}</p>{!fr && <nav className="coverage-tags" aria-label={fr ? "Parcourir les régions par province" : "Browse service areas by province"}>{[...new Set(areas.map(area => area.province))].sort().map(province => <a key={province} href={`${prefix}/locations#${province.toLowerCase().replace(/[^a-z]+/g,"-")}`}>{fr ? provinceFr[province] || province : province} →</a>)}</nav>}<a className="text-link" href={`${prefix}/locations`}>{fr ? "Rechercher toutes les villes et communautés →" : "Search all cities and communities →"}</a></section>
    <div className="page-review"><span>{fr ? "Publié et révisé par Tiling.ca" : "Published and reviewed by Tiling.ca"}</span><span>{fr ? "Mis à jour le 8 novembre 2026" : "Updated November 8, 2026"}</span><a href={`${prefix}/editorial-standards`}>{fr ? "Nos normes éditoriales →" : "How we review content →"}</a></div>
    <StructuredData data={{"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":url+"#webpage",url,name:guide.metaTitle[locale],description:guide.metaDescription[locale],inLanguage:fr?"fr-CA":"en-CA",dateModified:serviceReviewed,mainEntity:{"@id":url+"#service"},author:{"@id":business.domain+"/#organization"}},{"@type":"Service","@id":url+"#service",url,name:copy.name,description:guide.metaDescription[locale],serviceType:copy.name,provider:{"@id":business.domain+"/#organization"},areaServed:{"@type":"Country",name:"Canada"}}]}}/>
  </>;
}
