import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header } from "../components";
import { business } from "../data";

export const metadata: Metadata = withSocialMetadata({ title:"Website Terms", description:"Terms governing use of the Tiling.ca website and project inquiry process.", alternates:{canonical:`${business.domain}/terms`} });

export default function TermsPage() {
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Website terms"}]}/>
    <section className="inner-hero"><p className="eyebrow">Website terms</p><h1>Clear boundaries for website guidance and project inquiries.</h1><p>Last updated October 11, 2026. By using this website, you agree to the terms below.</p></section>
    <section className="terms-content section-pad">
      <article><h2>General information</h2><p>Website content is general planning information and is not a site assessment, engineering advice or a substitute for product instructions, applicable codes, permits or professional advice required for a specific property.</p></article>
      <article><h2>Quotes and availability</h2><p>An inquiry, email or preliminary discussion is not a binding quote or promise of availability. Scope, price, schedule, responsible parties, exclusions and payment terms become binding only when stated in an accepted project-specific agreement.</p></article>
      <article><h2>Your project with Tiling.ca</h2><p>We provide tile installation, repair and material supply. Your accepted project-specific agreement sets out our work, the materials included, the schedule and payment terms.</p></article>
      <article><h2>Products and site conditions</h2><p>Colours, batches, dimensions, stock, lead times and performance information can change. Final product suitability and installation methods depend on the actual product data and conditions found at the property.</p></article>
      <article><h2>Website accuracy and links</h2><p>We work to keep information useful and current but do not warrant that every page is complete or error-free. External resources remain controlled by their publishers. Please report a suspected error to <a href={`mailto:${business.email}`}>{business.email}</a>.</p></article>
      <article><h2>Permitted use</h2><p>You may use the site for personal or internal project planning. Tiling.ca names, writing, graphics and site design may not be reproduced commercially without permission.</p></article>
      <article><h2>Ontario law</h2><p>These website terms are governed by the laws of Ontario and the applicable laws of Canada. Project-specific agreements may contain additional terms and will control where they conflict with these general website terms.</p></article>
      <article><h2>Contact</h2><p>Questions about these terms may be sent to <a href={`mailto:${business.email}`}>{business.email}</a> or discussed by phone at <a href={`tel:${business.phoneHref}`}>{business.phone}</a>.</p></article>
    </section>
  </main><Footer/></>;
}
