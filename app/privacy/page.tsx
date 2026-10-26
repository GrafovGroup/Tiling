import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header } from "../components";
import { business } from "../data";

export const metadata: Metadata = withSocialMetadata({ title:"Privacy", description:"How Tiling.ca handles information submitted for tile installation and supply requests.", alternates:{canonical:`${business.domain}/privacy`} });

export default function PrivacyPage() {
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Privacy"}]}/><section className="inner-hero"><p className="eyebrow">Privacy</p><h1>Project information is used to respond to your request.</h1><p>Last updated October 25, 2026.</p></section><section className="material-intro section-pad"><div><p className="section-kicker">What we receive</p><h2>Information you choose to send.</h2></div><div><p>When you submit the quote form, the information is transmitted to Formspree for form processing and delivered to Tiling.ca. It may include your name, contact details, location, service selection, timing and project description.</p><p>Tiling.ca uses that information to respond, assess availability, prepare a quote, and communicate about the requested work. We use project details to plan and carry out the requested installation, repairs or material supply.</p><p>Do not send payment-card information through the quote form. You may request access, correction or deletion of your inquiry by emailing <a href={`mailto:${business.email}`}>{business.email}</a>.</p><h2>Mailing address</h2><address>Tiling.ca<br/>{business.address.street}<br/>{business.address.city}, {business.address.province} {business.address.postalCode}<br/>{business.address.country}</address></div></section></main><Footer/></>;
}
