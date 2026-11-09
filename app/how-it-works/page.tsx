import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header } from "../components";
import { business } from "../data";
import { CompanyContent } from "../company-content";
import { companyMeta } from "../company-data";

export const metadata: Metadata = withSocialMetadata({ ...companyMeta["how-it-works"].en, alternates: { canonical: `${business.domain}/how-it-works` } });
export default function HowItWorksPage() {
  return <><Header/><main id="main-content" className="company-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Our process"}]}/><CompanyContent page="how-it-works"/></main><Footer/></>;
}
