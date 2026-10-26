import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, Link } from "../components";
import { business, getArea, getService } from "../data";
import { QuoteForm } from "../quote-form";

export const metadata: Metadata = withSocialMetadata({
  title: "Request a Tile Installation or Supply Quote",
  description: "Request a quote for tile installation, repair or material supply anywhere across Canada. Send your project details to Tiling.ca.",
  alternates: { canonical: `${business.domain}/request-a-quote` },
});

export default async function RequestQuotePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const area = typeof query.area === "string" ? getArea(query.area) : undefined;
  const service = typeof query.service === "string" ? getService(query.service) : undefined;
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Request a quote"}]}/>
    <section className="simple-quote-page"><div className="simple-quote-intro"><p className="eyebrow">LET’S GET STARTED</p><h1>Request a free quote.</h1><p>Tell us where your project is and what you have in mind. We’ll follow up by email to discuss scope, materials and availability.</p></div><QuoteForm defaultCity={area?.name} serviceName={service?.name}/>
      <p className="simple-quote-contact">Prefer to talk? <Link href={`tel:${business.phoneHref}`}>{business.phone}</Link><br/><Link href={`mailto:${business.email}`}>{business.email}</Link></p>
    </section>
  </main><Footer/></>;
}
