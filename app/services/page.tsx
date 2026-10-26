import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, Link } from "../components";
import { business, materials, services } from "../data";

export const metadata: Metadata = withSocialMetadata({ title:"Tile Installation & Supply Services", description:"Bathroom tile, floor tile, backsplashes, large-format tile, repairs, commercial installation and tile supply across Canada.", alternates:{canonical:`${business.domain}/services`} });

export default function ServicesPage() {
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Services"}]}/>
    <section className="inner-hero"><p className="eyebrow">Residential & commercial tile</p><h1>Installation, repair and tile supply.</h1><p>We install, repair and supply tile across Canada—from surface preparation and waterproofing to precise cuts, grout and finishing details.</p><Link className="button button-primary" href="/request-a-quote">Request a free quote</Link></section>
    <section className="area-services section-pad"><div className="section-heading"><div><p className="section-kicker">Our services</p><h2>Start with the room. Plan the whole assembly.</h2></div><p>Preparation, waterproofing, transitions, movement details and material selection often matter as much as the tile itself.</p></div><div className="service-card-grid">{services.map(service=><Link key={service.slug} href={`/services/${service.slug}`}><div style={{backgroundImage:`url("${service.cardImage}")`}} role="img" aria-label={`${service.name} service`}/><span>{service.name}</span><p>{service.short}</p><b>View service →</b></Link>)}</div></section>
    <section className="other-services section-pad"><p className="section-kicker">Tile materials</p><h2>Coordinate supply with the application.</h2><div>{materials.map(material=><Link key={material.slug} href={`/materials/${material.slug}`}>{material.name}<span>Material options →</span></Link>)}</div></section>
    <section className="launch-cta section-pad"><p className="section-kicker">Have a project in mind?</p><h2>Send the room, location and timing.</h2><p>We will follow up about installation, material supply and current availability.</p><Link className="button button-primary" href="/request-a-quote">Get a quote</Link></section>
  </main><Footer/></>;
}
