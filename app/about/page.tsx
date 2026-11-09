import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header } from "../components";
import { business } from "../data";
import { CompanyContent } from "../company-content";
import { companyMeta } from "../company-data";

export const metadata: Metadata = withSocialMetadata({ ...companyMeta["about"].en, alternates: { canonical: `${business.domain}/about` } });
export default function AboutPage() {
  return <><Header/><main id="main-content" className="company-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"About"}]}/><CompanyContent page="about"/></main><Footer/></>;
}
