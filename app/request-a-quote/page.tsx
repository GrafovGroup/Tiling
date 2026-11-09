import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header } from "../components";
import { business } from "../data";
import { EnquiryContent } from "../enquiry-content";
import { enquiryMeta, type EnquiryQuery } from "../enquiry-data";

export const metadata: Metadata = withSocialMetadata({ ...enquiryMeta["request-a-quote"].en, alternates: { canonical: `${business.domain}/request-a-quote` } });

export default async function RequestQuotePage({ searchParams }: { searchParams: Promise<EnquiryQuery> }) {
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Request a quote"}]}/><EnquiryContent page="request-a-quote" query={await searchParams}/></main><Footer/></>;
}
