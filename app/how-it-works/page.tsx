import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, Link } from "../components";
import { business } from "../data";

export const metadata: Metadata = withSocialMetadata({ title: "Our Tile Installation & Supply Process", description: "Work directly with Tiling.ca from your first enquiry through preparation, tile installation and the final walkthrough. Serving Canada.", alternates: { canonical: `${business.domain}/how-it-works` } });

export default function HowItWorksPage() {
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Our process"}]}/>
    <section className="inner-hero visual-hero visual-hero-process"><p className="eyebrow">Your project. Our workmanship.</p><h1>From your first idea to the final finish.</h1><p>We handle your tile project from start to finish. Work directly with Tiling.ca for assessment, materials, preparation, installation and the final walkthrough, anywhere in Canada.</p><Link className="button button-primary" href="/request-a-quote">Request a quote</Link></section>
    <section className="process section-pad"><p className="section-kicker">Four project stages</p><h2>Know what happens next.</h2><ol>
      <li><span>1</span><div><h3>Tell us about your space</h3><p>Share your location, room, approximate dimensions, tile ideas and preferred timing. Photos help us understand the existing conditions.</p></div></li>
      <li><span>2</span><div><h3>Get your installation plan and quote</h3><p>We assess preparation, waterproofing, layout and site access, then confirm the work, materials, price and schedule with you.</p></div></li>
      <li><span>3</span><div><h3>We prepare and install</h3><p>We protect the work area, prepare the surface and install your tile, with attention to cuts, coverage, joints, edges and transitions.</p></div></li>
      <li><span>4</span><div><h3>Review the finished work</h3><p>We walk through the completed scope with you and explain curing times, cleaning and care for your selected tile and grout.</p></div></li>
    </ol></section>

    <section className="launch-cta section-pad"><p className="section-kicker">Let’s get started</p><h2>Tell us about the room, tile and timing.</h2><p>We will follow up to discuss your project and the next steps for a quote.</p><div><Link className="button button-primary" href="/request-a-quote">Request a free quote</Link><Link className="text-link" href="/services">Explore tile services →</Link></div></section>
  </main><Footer/></>;
}
