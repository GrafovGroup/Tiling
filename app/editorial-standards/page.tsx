import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, StructuredData } from "../components";
import { business } from "../data";

export const metadata: Metadata = withSocialMetadata({
  title: "Editorial Standards",
  description: "How Tiling.ca creates, reviews, updates and corrects tile installation and supply guidance.",
  alternates: { canonical: `${business.domain}/editorial-standards` },
});

export default function EditorialStandardsPage() {
  const schema = { "@context":"https://schema.org", "@type":"WebPage", "@id":`${business.domain}/editorial-standards#webpage`, url:`${business.domain}/editorial-standards`, name:"Tiling.ca Editorial Standards", dateModified:"2026-10-11", publisher:{"@id":`${business.domain}/#organization`} };
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Editorial standards"}]}/>
    <section className="inner-hero"><p className="eyebrow">Editorial standards</p><h1>Useful tile guidance, with clear limits and accountable ownership.</h1><p>Tiling.ca is responsible for the planning content published on this website. Our goal is to help a property owner ask better questions and define a safer, clearer scope.</p></section>
    <section className="policy-grid section-pad">
      <article><span>01</span><h2>Who creates the content?</h2><p>Guides are prepared and reviewed by the Tiling.ca team. Drafting and editing tools may help organize material, but Tiling.ca remains responsible for what is published, corrected and removed.</p></article>
      <article><span>02</span><h2>What informs it?</h2><p>We use practical scope-review experience, product limitations, manufacturer instructions and recognized installation principles. Product-specific instructions, approved assemblies, applicable codes and the actual site conditions take priority over general website guidance.</p></article>
      <article><span>03</span><h2>How is local content handled?</h2><p>City pages discuss building types, access patterns and Ontario conditions that may affect planning. They are not claims that every property has those conditions, that Tiling.ca operates a local office, or that a named project was completed there.</p></article>
      <article><span>04</span><h2>How are examples verified?</h2><p>We do not invent testimonials, project results or local case studies. A case study or original project photograph will only be labelled as such when its source, scope and permission to publish have been confirmed.</p></article>
      <article><span>05</span><h2>How are pages updated?</h2><p>Material changes receive a visible update date. Service and local pages are reviewed when methods, product guidance or operating details change, and before new evidence is presented as a project example.</p></article>
      <article><span>06</span><h2>How can I request a correction?</h2><p>Email <a href={`mailto:${business.email}?subject=Tiling.ca%20content%20correction`}>{business.email}</a> with the page URL and the detail you believe should change. We review corrections separately from sales inquiries.</p></article>
    </section>


  </main><Footer/><StructuredData data={schema}/></>;
}
