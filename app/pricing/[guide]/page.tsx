import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header, Footer, Breadcrumbs } from "../../components";
import { PricingArticle } from "../../pricing-content";
import { getPricingGuide, pricingGuides } from "../../pricing-data";
import { withSocialMetadata } from "../../seo";
import { pricingSearchTitles, searchTitle } from "../../search-snippets";
type Props = { params: Promise<{ guide: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export function generateStaticParams() { return pricingGuides.map(guide => ({ guide: guide.slug })); }
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const guide = getPricingGuide((await params).guide);
  if (!guide) return { title: "Guide not found", robots: {index: false, follow: true} };
  return withSocialMetadata({ title: searchTitle(pricingSearchTitles[guide.slug]?.en || guide.title.en), description: guide.description.en, alternates: { canonical: "https://tiling.ca/pricing/" + guide.slug }, openGraph: { type: "article" } });
}
export default async function GuidePage({params,searchParams}: Props) {
  const guide = getPricingGuide((await params).guide);
  if (!guide) notFound();
  const query = await searchParams;
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Pricing guides",href:"/pricing"},{label:guide.title.en}]}/><PricingArticle guide={guide} materialSlug={typeof query.material === "string" ? query.material : undefined} serviceSlug={typeof query.service === "string" ? query.service : undefined} areaSlug={typeof query.area === "string" ? query.area : undefined}/></main><Footer/></>;
}
