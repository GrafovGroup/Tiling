import { withSocialMetadata } from "../../seo";
import { AreaCoverage } from "../../area-coverage";
import { CommunityCoverage } from "../../community-coverage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { areas, business, getArea, services } from "../../data";
import { Breadcrumbs, Footer, Header, Link, StructuredData } from "../../components";

type Params = Promise<{ area: string }>;

export function generateStaticParams() {
  return areas.map((area) => ({ area: area.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) return withSocialMetadata({});

  const title = `Tile Installation & Supply in ${area.name}`;
  const description = `Request tile installation, repair or material supply in ${area.name}, ${area.province}. Serving ${area.surroundingAreas.slice(0,3).join(", ") || area.name} and nearby communities. Explore services and request your quote.`;
  const canonical = `${business.domain}/areas/${slug}`;
  return withSocialMetadata({
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: canonical, type: "website" },
  });
}

export default async function AreaPage({ params }: { params: Params }) {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const url = `${business.domain}/areas/${area.slug}`;
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: `Tile Installation & Supply in ${area.name}`,
    description: `Tile installation, repair and material supply in ${area.name}, ${area.province}.`,
    inLanguage: "en-CA",
    isPartOf: { "@id": `${business.domain}/#website` },
    about: { "@type": area.placeType || "City", name: area.name, containedInPlace: { "@type": "AdministrativeArea", name: area.province } },
  };

  return <>
    <Header />
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations", href: "/locations" }, ...(area.ontarioRegionSlug ? [{label:"Ontario",href:"/locations/ontario"},{label:area.region,href:`/locations/ontario/${area.ontarioRegionSlug}`}] : []), { label: area.name }]} />
      <section className="inner-hero">
        <p className="eyebrow">{area.region} · Tile services</p>
        <h1>Tile installation and supply in {area.name}</h1>
        <p>We install, repair and supply tile for homes and businesses in {area.name}. Work directly with Tiling.ca from the first assessment through preparation, installation and finishing.</p>
        <Link className="button button-primary" href="/request-a-quote">Request a quote</Link>
      </section>



      <section className="area-services section-pad">
        <div className="section-heading">
          <div><p className="section-kicker">{services.length} service categories</p><h2>Explore tile services in {area.name}.</h2></div>
          <p>Choose the work you need to see installation details and request a quote.</p>
        </div>
        <div className="service-card-grid">{services.map((service) => <Link key={service.slug} href={`/areas/${area.slug}/${service.slug}`}>
          <img className="location-service-card-photo" src={service.homeImage} alt={service.homeImageAlt} width="1536" height="1024" loading="lazy"/>
          <span>{service.name}</span>
          <p>{service.short}</p>
          <b>View {area.name} service →</b>
        </Link>)}</div>
      </section>

      <section className="local-context section-pad">
        <div>
          <p className="section-kicker">Local planning context</p>
          <h2>Planning tile work in {area.name}.</h2>
          <p>{area.context}</p>
          <p>Every property still needs a project-specific assessment. Tiling.ca uses these details to define preparation, access, product suitability, finished heights and scheduling before a quote is finalized.</p>
        </div>
        <aside>
          <h3>Topics to discuss</h3>
          {area.localFactors.map((item) => <p key={item}>{item}</p>)}
        </aside>
      </section>

      <CommunityCoverage areaSlug={area.slug}/>
      <AreaCoverage areaSlug={area.slug}/>

      <section className="launch-cta section-pad city-project-cta">
        <p className="section-kicker">Start a {area.name} project</p>
        <h2>Request installation, repair or tile supply.</h2>
        <p>Send the location, room, approximate size, material ideas and preferred timing. Tiling.ca will follow up about scope and current availability.</p>
        <div><Link className="button button-primary" href="/request-a-quote">Request a quote</Link><Link className="text-link" href="/locations">See all service areas →</Link></div>
      </section>
    </main>
    <Footer />
    <StructuredData data={pageSchema} />
  </>;
}
