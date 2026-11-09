import { PricingCalculator } from "./pricing-calculator";
import { floorBudgetRates } from "./planning-calculations";
import { localServiceHref } from "./local-service-publication";
import { frenchMaterials } from "./fr/content";
import { business, getArea, getService, getMaterial } from "./data";
import { FAQ, StructuredData } from "./components";
import { pricingGuides, priceSources, pricingReviewed, guidesForService, acceptsQuoteContext, pricingGroups, relatedPricingGuides, type Locale, type PriceGuide } from "./pricing-data";

function guideHref(slug: string, locale: Locale, area?: string, service?: string, material?: string) {
  const query = new URLSearchParams();
  if (area) query.set("area", area);
  if (service) query.set("service", service);
  if (material) query.set("material", material);
  return (locale === "fr" ? "/fr" : "") + "/pricing/" + slug + (query.size ? "?" + query : "");
}
const comparisonNotes: Record<string, { en: string; fr: string }> = {
  "large-format-tile": { en: "Use the floor guide for preparation and scope comparisons. Oversized panels, wall installation and specialist handling need a separate project quote.", fr: "Le guide de plancher aide à comparer préparation et portée. Panneaux surdimensionnés, pose murale et manutention spécialisée nécessitent une soumission distincte." },
  "heated-tile-floors": { en: "The floor examples are a starting point for the tile work. Heating products, controls, testing and electrical work must be identified separately.", fr: "Les exemples de plancher servent de point de départ pour le carrelage. Chauffage, commandes, essais et électricité doivent être précisés séparément." },
  "tile-removal-surface-preparation": { en: "The guide explains how removal and preparation affect a new floor. Its installed-price examples are not standalone demolition or levelling rates.", fr: "Le guide explique l’effet de la dépose et de la préparation sur un nouveau plancher. Ses prix posés ne sont pas des tarifs de démolition ou de ragréage seuls." },
  "commercial-tile": { en: "These are residential floor benchmarks. Commercial specifications, phasing, access and after-hours work require a separate quote for your premises.", fr: "Ces repères concernent des planchers résidentiels. Spécifications commerciales, phases, accès et travaux hors horaires exigent une soumission pour vos locaux." },
  "tile-repair-regrouting": { en: "Use these replacement examples when comparing repair with a new installation. They are not repair or regrouting rates; diagnosis, tile matching and minimum charges need their own scope.", fr: "Ces exemples de remplacement aident à comparer réparation et nouvelle pose. Ils ne sont pas des tarifs de réparation ou rejointoiement; diagnostic, carreaux assortis et minimums ont leur propre portée." },
  "tile-supply-delivery": { en: "Installed prices may include labour and setting materials. For supply only, ask for tile, trims, quantities and delivery to be itemized separately.", fr: "Les prix posés peuvent inclure main-d’œuvre et produits de pose. Pour la fourniture seule, demandez des postes distincts pour carreaux, profilés, quantités et livraison." },
};
function PricingCards({guides,locale,area,service,material}: {guides: PriceGuide[];locale: Locale;area?: string;service?: string;material?: string}) {
  return <div className={"pricing-card-grid" + (guides.length === 1 ? " is-single" : "")}>{guides.map(guide => <a key={guide.slug} className="pricing-card" href={guideHref(guide.slug,locale,area,service,material)}><span>{guide.range[locale]}</span><h3>{guide.title[locale]}</h3><p>{guide.description[locale]}</p><b>{locale === "fr" ? "Consulter le guide →" : "Read the cost guide →"}</b></a>)}</div>;
}
export function PricingLinks({ locale = "en", service, area, material }: { locale?: Locale; service?: string; area?: string; material?: string }) {
  const primary = ["floor-tile-installation","bathroom-shower-tile","kitchen-backsplash"];
  const guides = service ? guidesForService(service) : pricingGuides.filter(guide => primary.includes(guide.service));
  const moreGuides = service ? [] : pricingGuides.filter(guide => !primary.includes(guide.service));
  const place = area ? getArea(area) : undefined;
  const fr = locale === "fr";
  const prefix = fr ? "/fr" : "";
  if (!guides.length) {
    if (!place) return null;
    const quote = new URLSearchParams({area: place.slug});
    if (service && getService(service)) quote.set("service", service);
    return <section className="pricing-links section-pad" aria-label={fr ? "Budget du projet" : "Project budget"}>
      <p className="section-kicker">{fr ? "Une portée propre à votre projet" : "A scope specific to your project"}</p>
      <h2>{fr ? `Chiffrer ces travaux à ${place.name}.` : `Pricing this work in ${place.name}.`}</h2>
      <p className="guide-lead">{fr ? "Ce service nécessite une soumission adaptée aux matériaux, à l’état du support, à l’accès et à la préparation de votre propriété." : "This service needs a quote based on your materials, support condition, access and preparation."}</p>
      <a className="button button-primary" href={prefix + "/request-a-quote?" + quote}>{fr ? "Obtenir une soumission pour ces travaux" : "Get a quote for this work"}</a>
      <p><a href={prefix + "/pricing"}>{fr ? "Guides pour d’autres projets de carrelage →" : "Cost guides for other tile projects →"}</a></p>
    </section>;
  }
  return <section className="pricing-links section-pad" aria-label={fr ? "Guides de prix" : "Pricing guides"}>
    <div className="section-heading"><div><p className="section-kicker">{fr ? "Préparer votre budget" : "Plan your budget"}</p><h2>{fr ? "Comprendre le coût des travaux." : "Know what goes into the price."}</h2></div><p>{fr ? "Repères de prix publiés au Canada, portées comparables et questions à poser avant une soumission." : "Published Canadian price examples, clear scope comparisons and questions to ask before requesting a quote."}</p></div>
    {place && <div className="local-pricing-note"><h3>{fr ? `Votre budget à ${place.name}` : `Budgeting for ${place.name}`}</h3><p>{fr ? `Ces guides citent des sources régionales précises; ils ne constituent pas une enquête de prix pour ${place.name}. Confirmez les matériaux disponibles, la livraison, les déplacements, la préparation et les taxes dans votre soumission locale.` : `These guides cite named regional sources; they are not a price survey for ${place.name}. Confirm material availability, delivery, travel, preparation and taxes in your local quote.`}</p></div>}
    <PricingCards guides={guides} locale={locale} area={place?.slug} service={service} material={material ? getMaterial(material)?.slug : undefined}/>
    {moreGuides.length > 0 && <details className="pricing-more-guides"><summary>{fr ? "Autres guides de prix pour votre projet" : "More cost guides for your project"}</summary><div className="pricing-guide-list">{moreGuides.map(guide => <a href={guideHref(guide.slug,locale,place?.slug)} key={guide.slug}>{guide.title[locale]} →</a>)}</div></details>}
    <p className="pricing-disclosure">{fr ? "Fourchettes de tiers en dollars canadiens; elles ne constituent pas des tarifs ou des soumissions de Tiling.ca." : "Third-party ranges in Canadian dollars; these are not Tiling.ca rates or quotations."}</p>
  </section>;
}
export function PricingIndex({ locale = "en" }: { locale?: Locale }) {
  return <>
    <section className="inner-hero"><p className="eyebrow">{locale === "fr" ? "PRIX ET PLANIFICATION" : "PRICING & PLANNING"}</p><h1>{locale === "fr" ? "Un budget de carrelage, bien préparé." : "A clearer budget for your tile project."}</h1><p>{locale === "fr" ? "Comparez des fourchettes publiées par des entreprises canadiennes et voyez ce qui doit figurer dans votre soumission." : "Compare ranges published by Canadian businesses and understand what your own quote needs to cover."}</p></section>
    <nav className="guide-jump-links" aria-label={locale === "fr" ? "Catégories de guides" : "Guide categories"}>{pricingGroups.map(group => <a key={group.id} href={"#"+group.id}>{group.title[locale]}</a>)}</nav>
    {pricingGroups.map(group => <section className="pricing-catalog-group section-pad" id={group.id} key={group.id}><p className="section-kicker">{locale === "fr" ? "Prix et portée des travaux" : "Prices and project scope"}</p><h2>{group.title[locale]}</h2><PricingCards guides={pricingGuides.filter(guide=>group.services.includes(guide.service))} locale={locale}/></section>)}
    <section className="pricing-prose section-pad"><h2>{locale === "fr" ? "Comment lire ces repères" : "How to use these benchmarks"}</h2><p>{locale === "fr" ? "Sources consultées le 8 novembre 2026. Chaque guide précise la région, le type de prix et les inclusions connues. Les repères distinguent main-d’œuvre, fournitures seules et projets avec pose. Certains services spécialisés disposent seulement de prix de composants ou d’exemples ponctuels. Cet échantillon ne constitue pas une enquête statistique ni une moyenne nationale. Le coût final dépend de votre adresse, des matériaux et des conditions réelles." : "Sources checked November 8, 2026. Each guide identifies the region, pricing basis and known inclusions. The benchmarks distinguish labour, supply-only prices and installed projects. Some specialist services have only component prices or individual published examples. This sample is not a statistical survey or a national average. Your final cost depends on the property address, materials and actual site conditions."}</p><a className="button button-primary" href={locale === "fr" ? "/fr/request-a-quote" : "/request-a-quote"}>{locale === "fr" ? "Demander le prix de mon projet" : "Get pricing for my project"}</a></section>
  </>;
}
export function PricingArticle({ guide, locale = "en", areaSlug, serviceSlug, materialSlug }: { guide: PriceGuide; locale?: Locale; areaSlug?: string; serviceSlug?: string; materialSlug?: string }) {
  const fr = locale === "fr";
  const prefix = fr ? "/fr" : "";
  const area = areaSlug ? getArea(areaSlug) : undefined;
  const selectedService = serviceSlug && getService(serviceSlug) && acceptsQuoteContext(guide, serviceSlug) ? serviceSlug : guide.service;
  const material = materialSlug ? getMaterial(materialSlug) : undefined;
  const materialName = material ? (fr ? frenchMaterials.find(item=>item.slug===material.slug)!.name : material.name) : undefined;
  const query = new URLSearchParams({ service: selectedService });
  if (area) query.set("area", area.slug);
  if (material) query.set("material", material.slug);
  const quoteHref = prefix + "/request-a-quote?" + query;
  const sourceIds = [...new Set(guide.benchmarks.map(row => row.source))];
  const url = business.domain + prefix + "/pricing/" + guide.slug;
  const quantityTool = !["tile-repair-regrouting", "tile-removal-surface-preparation", "tile-grout-stone-cleaning-sealing"].includes(guide.service);
  const calculatorBenchmarks = guide.service === "floor-tile-installation" ? floorBudgetRates.map(rate => {
    const row = guide.benchmarks.find(item => item.source === rate.id)!;
    const source = priceSources[rate.id];
    return { id: rate.id, name: source.name, region: source.region[locale], scope: row.scope[locale], range: row.range[locale], includes: row.includes[locale], url: source.url };
  }) : [];
  return <>
    <section className="inner-hero pricing-hero"><p className="eyebrow">{fr ? "GUIDE DE PRIX · CANADA" : "COST GUIDE · CANADA"}</p><h1>{guide.title[locale]}</h1><p>{guide.description[locale]}</p><p className="pricing-reviewed">{fr ? "Par Tiling.ca · Sources consultées le 8 novembre 2026" : "By Tiling.ca · Sources checked November 8, 2026"}</p><a className="button button-primary" href={quoteHref}>{fr ? "Demander une soumission" : "Request a project quote"}</a></section>
    <nav className="guide-jump-links" aria-label={fr ? "Dans ce guide" : "In this guide"}>{[...(quantityTool ? [["project-calculator", fr ? "Calculateur" : "Calculator"]] : []),["industry-prices", fr ? "Fourchettes" : "Price ranges"],["cost-factors",fr ? "Facteurs de coût" : "Cost factors"],["budget-example",fr ? "Exemple" : "Budget example"],["quote-checklist",fr ? "Votre soumission" : "Quote checklist"],["sources",fr ? "Sources" : "Sources"]].map(([id,label]) => <a key={id} href={"#" + id}>{label}</a>)}</nav>
    <section id="industry-prices" className="pricing-benchmarks section-pad"><p className="section-kicker">{fr ? "Repères publiés dans l’industrie" : "Published industry benchmarks"}</p><h2>{guide.range[locale]}</h2><p className="guide-lead">{guide.summary[locale]}</p><p className="pricing-disclosure">{fr ? "Dollars canadiens. Ces prix proviennent de tiers et ne constituent pas une soumission de Tiling.ca. Les inclusions et le traitement des taxes varient selon la source." : "Canadian dollars. These third-party prices are not Tiling.ca quotations. Inclusions and tax treatment vary by source."}</p>
      {material && <p className="pricing-disclosure material-price-context">{fr ? "Matériau envisagé : " : "Material being considered: "}<a href={`${prefix}/materials/${material.slug}`}>{materialName}</a>. {fr ? "Les exemples ci-dessous couvrent des produits et portées différents; ils ne constituent pas un tarif propre à ce matériau." : "The examples below cover different products and scopes; they do not establish a rate specific to this material."}</p>}
      <div className="pricing-table-scroll" role="region" aria-label={fr ? "Tableau des prix publiés" : "Published pricing comparison"} tabIndex={0}><table className="pricing-table"><caption>{fr ? "Comparaison par région et portée des travaux" : "Compare region and project scope"}</caption><thead><tr>{(fr ? ["Région et source","Travaux","Prix publié","Portée et exclusions"] : ["Region and source","Work","Published price","Scope and exclusions"]).map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{guide.benchmarks.map((row,i) => { const source = priceSources[row.source]; return <tr key={i}><th scope="row">{source.region[locale]}<a href={source.url} target="_blank" rel="noopener noreferrer">{source.name} ↗</a></th><td>{row.scope[locale]}</td><td className="price-cell">{row.range[locale]}</td><td>{row.includes[locale]}</td></tr>; })}</tbody></table></div>
    </section>
    {quantityTool && <PricingCalculator locale={locale} quoteHref={quoteHref} benchmarks={calculatorBenchmarks}/>}
    <section id="cost-factors" className="pricing-prose section-pad"><p className="section-kicker">{fr ? "Préparer le bon budget" : "Build the right budget"}</p><h2>{fr ? "Ce qui change votre prix" : "What changes your price"}</h2><div className="pricing-factor-grid">{guide.factors.map(factor => <article key={factor.title.en}><h3>{factor.title[locale]}</h3><p>{factor.text[locale]}</p></article>)}</div></section>
    <section id="budget-example" className="pricing-example section-pad"><p className="section-kicker">{fr ? "Exemple de planification" : "Planning example"}</p><h2>{guide.example.title[locale]}</h2><p>{guide.example.text[locale]}</p></section>
    <section id="quote-checklist" className="pricing-prose section-pad">{selectedService !== guide.service && comparisonNotes[selectedService] && <p className="pricing-disclosure">{comparisonNotes[selectedService][locale]}</p>}<h2>{fr ? "À préciser dans votre soumission" : "What your quote should spell out"}</h2><ul className="guide-checklist">{guide.checklist.map(item => <li key={item.en}>{item[locale]}</li>)}</ul><p>{fr ? "Comparez des portées identiques et confirmez par écrit les exclusions, les modalités de paiement et le traitement des imprévus." : "Compare like-for-like scopes and confirm exclusions, payment terms and how unforeseen work is handled in writing."}</p>{area && <p>{fr ? "Votre projet :" : "Your project:"} <a href={prefix + "/areas/" + area.slug}>{area.name}</a></p>}<a className="button button-primary" href={quoteHref}>{fr ? "Obtenir une soumission pour ces travaux" : "Get a quote for this work"}</a><p><a href={material ? prefix+"/services/"+selectedService+"?"+new URLSearchParams({material:material.slug,...(area?{area:area.slug}:{})}) : area ? localServiceHref(area.slug,selectedService,locale) : prefix+"/services/"+selectedService}>{fr ? "Voir le service et la préparation →" : "See the service and preparation details →"}</a></p></section>
    <section className="faq-section section-pad"><div><p className="section-kicker">{fr ? "Questions fréquentes" : "Common questions"}</p><h2>{fr ? "Comparer avec confiance." : "Compare with confidence."}</h2></div><FAQ items={guide.faq.map(item => ({ q: item.question[locale], a: item.answer[locale] }))}/></section>
    <section id="sources" className="pricing-sources section-pad"><h2>{fr ? "Sources et méthode" : "Sources and method"}</h2><p>{fr ? "Relevé de guides de prix et de fiches produits publics, consultés le 8 novembre 2026. Les fourchettes ne sont pas pondérées ni vérifiées au moyen de factures. Les différences peuvent refléter les produits et les inclusions autant que la région. Une portée non précisée reste à confirmer; elle n’est pas considérée comme incluse." : "A snapshot of public pricing guides and product listings checked November 8, 2026. Ranges are not weighted or independently verified against invoices. Differences may reflect products and inclusions as much as geography. An unspecified item is left for confirmation rather than assumed included."}</p><ul>{sourceIds.map(id => <li key={id}><a href={priceSources[id].url} target="_blank" rel="noopener noreferrer">{priceSources[id].name} — {priceSources[id].region[locale]} ↗</a></li>)}</ul><p><a href={prefix + "/editorial-standards"}>{fr ? "Nos normes éditoriales" : "Our editorial standards"}</a></p></section>
    <section className="pricing-related section-pad"><h2>{fr ? "Autres guides de prix" : "More pricing guides"}</h2><div className="coverage-tags">{relatedPricingGuides(guide.service).map(item => <a key={item.slug} href={guideHref(item.slug,locale,area?.slug,undefined,material?.slug)}>{item.title[locale]} →</a>)}</div></section>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.title[locale], description: guide.description[locale], url, mainEntityOfPage: url, inLanguage: fr ? "fr-CA" : "en-CA", datePublished: pricingReviewed, dateModified: pricingReviewed, author: { "@type": "Organization", name: business.name, url: business.domain }, publisher: { "@id": business.domain + "/#organization" }, citation: sourceIds.map(id => priceSources[id].url) }}/>
  </>;
}
