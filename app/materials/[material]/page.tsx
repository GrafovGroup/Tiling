import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, Footer, Header } from "../../components";
import { business, getMaterial, materials } from "../../data";
import { withSocialMetadata } from "../../seo";
import { getMaterialGuide } from "../../material-guide-data";
import { MaterialLanding } from "../../material-content";
type Props={params:Promise<{material:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>};
export function generateStaticParams(){return materials.map(material=>({material:material.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const guide=getMaterialGuide((await params).material);
  if(!guide)return{title:"Material not found",robots:{index:false,follow:true}};
  return withSocialMetadata({title:guide.metaTitle.en,description:guide.metaDescription.en,alternates:{canonical:`${business.domain}/materials/${guide.slug}`},openGraph:{type:"article"}});
}
export default async function MaterialPage({params,searchParams}:Props){
  const {material:slug}=await params,material=getMaterial(slug),query=await searchParams;
  if(!material||!getMaterialGuide(slug))notFound();
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Tile supply",href:"/materials"},{label:material.name}]}/><MaterialLanding slug={slug} areaSlug={typeof query.area==="string"?query.area:undefined} serviceSlug={typeof query.service==="string"?query.service:undefined}/></main><Footer/></>;
}
