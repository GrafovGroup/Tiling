import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header } from "../components";
import { business } from "../data";
import { EnquiryContent } from "../enquiry-content";
import { enquiryMeta, type EnquiryQuery } from "../enquiry-data";

export const metadata: Metadata = withSocialMetadata({ ...enquiryMeta["contact"].en, alternates: { canonical: `${business.domain}/contact` } });

export default async function ContactPage({ searchParams }: { searchParams: Promise<EnquiryQuery> }) {
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Contact"}]}/><EnquiryContent page="contact" query={await searchParams}/></main><Footer/></>;
}
