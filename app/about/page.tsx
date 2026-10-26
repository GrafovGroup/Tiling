import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, Link, StructuredData } from "../components";
import { business } from "../data";

export const metadata: Metadata = withSocialMetadata({
  title: "Your Tile Contractor Across Canada",
  description: "Tiling.ca installs, repairs and supplies tile for homes and businesses across Canada. One contractor from preparation to the finished surface.",
  alternates: { canonical: `${business.domain}/about` },
});

export default function AboutPage() {
  const schema = { "@context":"https://schema.org", "@type":"AboutPage", url:`${business.domain}/about`, name:"About Tiling.ca", about:{"@id":`${business.domain}/#organization`} };
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"About"}]}/>
    <section className="inner-hero visual-hero visual-hero-about"><p className="eyebrow">Your Canada-wide tile contractor</p><h1>One contractor. Every detail of your tile project.</h1><p>We install, repair and supply tile for homes and businesses across Canada. You work directly with Tiling.ca, from choosing materials and preparing the surface to installation and the final walkthrough.</p><Link className="button button-primary" href="/request-a-quote">Discuss your project</Link></section>
    <section className="local-context section-pad"><div><p className="section-kicker">What we do</p><h2>We take care of the work from start to finish.</h2><p>Bathrooms, showers, floors, backsplashes and commercial spaces each need a different approach. We assess the existing conditions, plan the layout, prepare the substrate and install the tile to suit the room and its use.</p><p>Need materials too? We can supply porcelain, ceramic and natural stone, with quantities, trim and delivery planned alongside your installation. Repairs and supply-only enquiries are welcome.</p></div><aside><h3>A clear quote from us</h3><p>Preparation and waterproofing</p><p>Tile, trim and setting materials</p><p>Installation and finishing details</p><p>Schedule, price and payment terms</p></aside></section><p className="compact-page-links section-link-row"><Link href="/how-it-works">OUR INSTALLATION PROCESS →</Link><Link href="/locations">EXPLORE SERVICE AREAS →</Link></p>


    <section className="launch-cta section-pad"><p className="section-kicker">Let’s talk tile</p><h2>Your project starts with a conversation.</h2><p>Call <a href={`tel:${business.phoneHref}`}>{business.phone}</a> or email <a href={`mailto:${business.email}`}>{business.email}</a>.</p><Link className="button button-primary" href="/request-a-quote">Request a free quote</Link></section>
  </main><Footer/><StructuredData data={schema}/></>;
}
