import { withSocialMetadata } from "../../seo";
import { CommercialExamples } from "../../commercial-examples";
import { QuoteForm } from "../../quote-form";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { areas, business, getService, services } from "../../data";
import { Breadcrumbs, FAQ, Footer, Header, Link, StructuredData } from "../../components";

type Params = Promise<{ service: string }>;

export function generateStaticParams() {
  return services.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) return withSocialMetadata({});

  const title = `${service.name} Services across Canada`;
  const description = `${service.short} Request installation or supply from Tiling.ca across Canada.`;
  const canonical = `${business.domain}/services/${slug}`;
  return withSocialMetadata({
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "article" },
  });
}

export default async function ServicePage({ params }: { params: Params }) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const url = `${business.domain}/services/${service.slug}`;
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#webpage`,
    url,
    name: service.name,
    description: service.short,
    inLanguage: "en-CA",
    provider: { "@id": `${business.domain}/#organization` },
    areaServed: { "@type": "Country", name: "Canada" },
  };

  return <>
    <Header />
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.name }]} />
      <section className="inner-hero">
        <p className="eyebrow">Canada-wide tile installation & supply</p>
        <h1>{service.name}</h1>
        <p>{service.short}</p>
        <Link className="button button-primary" href="/request-a-quote">Request a quote</Link>
      </section>

      <section className="service-detail section-pad">
        <figure className="service-photo"><img src={service.image} alt={service.imageAlt} width="1536" height="1024" loading="lazy"/></figure>
        <div>
          <p className="section-kicker">Complete scope</p>
          <h2>{service.scopeHeading || "Plan the installation and materials together."}</h2>
          <p>{service.intro}</p>
          <p>{service.scopeNote || "We assess the existing conditions, specify preparation and materials, and provide your quote. Our work includes the layout, installation, transitions and finishing details agreed for your project."}</p>
          <ul className="check-list">{service.features.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      {service.slug === "commercial-tile" && <><CommercialExamples/><section className="local-note section-pad"><div><p className="section-kicker">WORKING AROUND YOUR OPERATIONS</p><h2>A practical installation plan.</h2></div><p>We confirm the existing floor or wall condition, delivery access, product requirements and the installation sequence. For occupied premises, we agree on work zones, dust protection and available work hours. Reopening follows the required curing and protection period for the selected products.</p></section><section className="quote-section" id="commercial-quote"><div className="quote-copy"><p className="section-kicker">YOUR COMMERCIAL PROJECT</p><h2>Tell us about your space.</h2><p>Share the location and what you are planning. We’ll follow up about the scope, materials and schedule.</p></div><QuoteForm serviceName="Commercial Tile"/></section></>}
      <section className="city-links section-pad">
        <p className="section-kicker">Canada-wide service areas</p>
        <h2>{service.name} by city.</h2>
        <p className="section-copy">We serve customers across Canada. Browse our Canada-wide service areas below, or send us your project location for a quote anywhere in the country.</p>
        <div className="province-service-links">{[...new Set(areas.map(area=>area.province))].sort().map(province=><details key={province}><summary>{province}</summary><div>{areas.filter(area=>area.province===province).map(area=><Link key={area.slug} href={`/areas/${area.slug}/${service.slug}`}>{area.name} &amp; area</Link>)}</div></details>)}</div>
      </section>

      <section className="faq-section section-pad">
        <div>
          <p className="section-kicker">Common questions</p>
          <h2>Clarify the scope before work starts.</h2>
          <p>We confirm the preparation, materials, installation scope and schedule with you before work begins.</p>
        </div>
        <FAQ items={service.faq} />
      </section>

      <section className="other-services section-pad">
        <p className="section-kicker">More tile services</p>
        <h2>Coordinate related work.</h2>
        <div>{services.filter((item) => item.slug !== service.slug).map((item) => <Link key={item.slug} href={`/services/${item.slug}`}>{item.name}<span>View service →</span></Link>)}</div>
      </section>
      {service.slug !== "commercial-tile" && <section className="launch-cta section-pad"><p className="section-kicker">Request {service.name.toLowerCase()}</p><h2>Tell us about the location, room and timing.</h2><p>Tiling.ca will review the project and follow up about scope, materials and current availability.</p><Link className="button button-primary" href="/request-a-quote">Get a quote</Link></section>}
    </main>
    <Footer />
    <StructuredData data={pageSchema} />
  </>;
}
