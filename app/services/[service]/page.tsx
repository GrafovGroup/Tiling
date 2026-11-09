import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { business, getService, services } from "../../data";
import { Breadcrumbs, Footer, Header } from "../../components";
import { withSocialMetadata } from "../../seo";
import { getServiceGuide } from "../../service-guide-data";
import { ServiceLanding } from "../../service-content";

type Params = Promise<{ service: string }>;
export function generateStaticParams() {
  return services.map(service => ({ service: service.slug }));
}
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(slug), guide = getServiceGuide(slug);
  if (!service || !guide) return withSocialMetadata({});
  const title = guide.metaTitle.en, description = guide.metaDescription.en;
  const canonical = `${business.domain}/services/${slug}`;
  return withSocialMetadata({title, description, alternates: {canonical}, openGraph: {title, description, url: canonical, type: "website"}});
}
export default async function ServicePage({ params, searchParams }: { params: Params; searchParams: Promise<{area?:string|string[];material?:string|string[]}> }) {
  const { service: slug } = await params;
  const service = getService(slug);
  const query = await searchParams;
  if (!service || !getServiceGuide(slug)) notFound();
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Services",href:"/services"},{label:service.name}]}/><ServiceLanding slug={slug} materialSlug={typeof query.material === "string" ? query.material : undefined} areaSlug={typeof query.area === "string" ? query.area : undefined}/></main><Footer/></>;
}
