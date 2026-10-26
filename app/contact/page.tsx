import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, Link, StructuredData } from "../components";
import { business } from "../data";

export const metadata: Metadata = withSocialMetadata({
  title: "Contact Tiling.ca",
  description: "Contact Tiling.ca about tile installation, repairs, material supply and delivery across Canada.",
  alternates: { canonical: `${business.domain}/contact` },
});

export default function ContactPage() {
  const schema = { "@context":"https://schema.org", "@type":"ContactPage", "@id":`${business.domain}/contact#webpage`, url:`${business.domain}/contact`, name:"Contact Tiling.ca", about:{"@id":`${business.domain}/#organization`} };
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Contact"}]}/>
    <section className="inner-hero"><p className="eyebrow">Contact Tiling.ca</p><h1>Talk directly to your tile contractor.</h1><p>We review installation, repair, supply and delivery requests across Canada. Call, email or use the quote form. Include your city, room, approximate size and preferred timing.</p><Link className="button button-primary" href="/request-a-quote">Request a quote</Link></section>
    <section className="contact-grid section-pad">
      <article><p className="section-kicker">Phone</p><h2><a href={`tel:${business.phoneHref}`}>{business.phone}</a></h2><p>Call to discuss the city, room, approximate size, material and preferred timing.</p></article>
      <article><p className="section-kicker">Email</p><h2><a href={`mailto:${business.email}`}>{business.email}</a></h2><p>Send project details and photographs. Do not email payment-card information.</p></article>
      <article><p className="section-kicker">Business address</p><h2>{business.address.city}</h2><address>{business.address.street}<br/>{business.address.city}, {business.address.province}<br/>{business.address.country} {business.address.postalCode}</address></article>
      <article><p className="section-kicker">Project intake</p><h2><Link href="/request-a-quote">Quote form</Link></h2><p>Submit the details needed for an initial review and receive a direct follow-up.</p></article>
    </section>

  </main><Footer/><StructuredData data={schema}/></>;
}
