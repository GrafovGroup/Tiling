import { withSocialMetadata } from "../../../seo";
import { AreaCoverage } from "../../../area-coverage";
import { CommunityCoverage } from "../../../community-coverage";
import { QuoteForm } from "../../../quote-form";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { areas, business, getArea, getService, services } from "../../../data";
import { Breadcrumbs, FAQ, Footer, Header, Link, StructuredData } from "../../../components";
import { getLocalServiceGuidance } from "../../../local-guidance";

type Params = Promise<{ area: string; service: string }>;

export function generateStaticParams() {
  return areas.flatMap((area) => services.map((service) => ({ area: area.slug, service: service.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const route = await params;
  const area = getArea(route.area);
  const service = getService(route.service);
  if (!area || !service) return withSocialMetadata({});

  const title = `${service.name} in ${area.name}, ${area.province}`;
  const description = `Request ${service.name.toLowerCase()} in ${area.name}. We provide tile installation and supply directly to homes and businesses.`;
  const canonical = `${business.domain}/areas/${area.slug}/${service.slug}`;

  return withSocialMetadata({
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { title: `${service.name} in ${area.name}`, description, url: canonical, type: "website" },
  });
}

export default async function LocalServicePage({ params }: { params: Params }) {
  const route = await params;
  const area = getArea(route.area);
  const service = getService(route.service);
  if (!area || !service) notFound();

  const url = `${business.domain}/areas/${area.slug}/${service.slug}`;
  const otherServices = services.filter((item) => item.slug !== service.slug);
  const guidance = getLocalServiceGuidance(service.slug);
  const localFaq = [
    {
      q: `What should I discuss before planning ${service.name.toLowerCase()} in ${area.name}?`,
      a: `Start with ${guidance.quoteDetails.slice(0, 3).join(", ").toLowerCase()}. In ${area.name}, the conversation should also cover ${area.localFactors.slice(0, 2).join(" and ").toLowerCase()}. For this project type, confirm ${service.features.slice(0, 3).join(", ").toLowerCase()}.`,
    },
    {
      q: `Can I request ${service.name.toLowerCase()} from Tiling.ca in ${area.name}?`,
      a: `Yes. We provide ${service.name.toLowerCase()} in ${area.name}. You work directly with Tiling.ca for your project. Availability is confirmed for the specific scope and schedule.`,
    },
    ...service.faq,
  ];
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url, name: `${service.name} in ${area.name}`,
        description: `Professional ${service.name.toLowerCase()} in ${area.name}, ${area.province}.`,
        dateModified: "2026-10-11", author: { "@id": `${business.domain}/#organization` },
        reviewedBy: { "@id": `${business.domain}/#organization` }, mainEntity: { "@id": `${url}#service` },
      },
      {
        "@type": "Service", "@id": `${url}#service`, name: `${service.name} in ${area.name}`,
        description: `Professional ${service.name.toLowerCase()} in ${area.name}, ${area.province}.`,
        provider: { "@id": `${business.domain}/#organization` },
        areaServed: { "@type": area.placeType || "City", name: area.name, containedInPlace: { "@type": "AdministrativeArea", name: area.province } },
      },
    ],
  };

  return <>
    <Header />
    <main id="main-content">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Locations", href: "/locations" },
        ...(area.ontarioRegionSlug ? [{label:"Ontario",href:"/locations/ontario"}] : []),
        { label: area.name, href: `/areas/${area.slug}` },
        { label: service.name },
      ]} />

      <section className="inner-hero local-service-hero">
        <p className="eyebrow">{area.name} · {area.region} tile services</p>
        <h1>{service.name} in {area.name}</h1>
        <p>{service.short} {service.projectSummary || "We handle your project from the assessment and materials to installation and finishing."}</p>
        <Link className="button button-primary" href="#local-quote">Request a quote</Link>
      </section>


      <section className="service-detail section-pad">
        <img className="local-service-photo" src={service.image} alt={service.imageAlt} width="1536" height="1024" loading="lazy"/>
        <div>
          <p className="section-kicker">Plan the complete assembly</p>
          <h2>{service.scopeHeading || "Start with the conditions in the space."}</h2>
          <p>{service.intro}</p>
          <p>{area.context}</p><p className="provider-note">{service.scopeNote || "We carry out your tile work to the agreed scope. We confirm materials, preparation, pricing and scheduling with you before installation begins."}</p>
          {service.slug === "commercial-tile" && <p><Link className="text-link" href="/services/commercial-tile#commercial-applications">EXPLORE RESTAURANT, HOTEL, RETAIL &amp; WORKPLACE TILING →</Link></p>}
          <ul className="check-list">{service.features.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section id="local-quote" className="quote-section"><div className="quote-copy"><p className="section-kicker">YOUR LOCAL PROJECT</p><h2>Let’s plan your {area.name} project.</h2><p>We’ll follow up about your {service.name.toLowerCase()} request. Add your village or community name if it differs from the municipality shown.</p><Link className="text-link" href={`/areas/${area.slug}`}>ALL {area.name} SERVICES →</Link></div><QuoteForm defaultCity={area.name} serviceName={service.name}/></section>

      <details className="planning-details"><summary>PLANNING, PREPARATION &amp; QUOTE DETAILS</summary><div>


      <section className="local-depth section-pad">
        <div className="section-heading">
          <div><p className="section-kicker">A project-specific local brief</p><h2>What should be checked before {service.name.toLowerCase()} in {area.name}?</h2></div>
          <p>{guidance.focus} The notes below combine that service requirement with the property and access conditions commonly raised in {area.name}; the actual site still controls the final method.</p>
        </div>
        <div className="planning-grid">
          <article><span>01</span><h3>Property and substrate</h3><p><strong>{area.localFactors[0]}.</strong> {guidance.propertyCheck}</p></article>
          <article><span>02</span><h3>Access and sequence</h3><p><strong>{area.localFactors[1]}.</strong> {guidance.accessCheck}</p></article>
          <article><span>03</span><h3>{area.province} project conditions</h3><p><strong>{area.localFactors[2]}.</strong> {guidance.seasonalCheck}</p></article>
        </div>
      </section>

      <section className="diagnostic-section section-pad">
        <div>
          <p className="section-kicker">Failure prevention</p>
          <h2>What commonly causes this work to fail?</h2>
          <p>These are not a diagnosis of a particular property. They are prompts for the {area.name} site review and written scope.</p>
          <ul>{guidance.failurePoints.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <p className="section-kicker">Quote checklist</p>
          <h2>What should I send for a useful quote?</h2>
          <p>Start with the property address in {area.name}, the building type and the details below. Site verification may still be required.</p>
          <ul>{guidance.quoteDetails.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <div className="page-review" aria-label="Content responsibility"><span>Published and reviewed by Tiling.ca</span><span>Updated October 11, 2026</span><Link href="/editorial-standards">How we review content →</Link></div>
      </div></details>

      <CommunityCoverage areaSlug={area.slug} serviceSlug={service.slug}/>
      <AreaCoverage areaSlug={area.slug} serviceSlug={service.slug}/>
      <section className="faq-section section-pad">
        <div>
          <p className="section-kicker">Common questions</p>
          <h2>Prepare before requesting a quote.</h2>
          <p>Use the answers as a starting point and confirm the complete installation method for the actual property and product.</p>
        </div>
        <FAQ items={localFaq} />
      </section>

      <section className="other-services section-pad">
        <p className="section-kicker">More guides for {area.name}</p>
        <h2>Explore another tile project.</h2>
        <div>{otherServices.map((item) => <Link key={item.slug} href={`/areas/${area.slug}/${item.slug}`}>{item.name}<span>{area.name} guide →</span></Link>)}</div>
      </section>



    </main>
    <Footer />
    <StructuredData data={pageSchema} />
  </>;
}
