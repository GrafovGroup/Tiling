import { withSocialMetadata } from "../../seo";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, Link, StructuredData } from "../../components";
import { business } from "../../data";
import { municipalities, communityCount, ontarioRegions } from "../../ontario-data";
import { OntarioDirectory } from "../../ontario-directory";
export const metadata:Metadata=withSocialMetadata({title:"Ontario Tile Services | Towns, Villages & Communities",description:"Find tile installation, shower tiling, backsplashes, repairs, commercial tile and material supply throughout Ontario’s towns, villages and communities.",alternates:{canonical:`${business.domain}/locations/ontario`}});
export default function OntarioLocations(){
 return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Service areas",href:"/locations"},{label:"Ontario"}]}/>
 <section className="inner-hero ontario-hero"><p className="eyebrow">ONTARIO · TOWNS &amp; COMMUNITIES</p><h1>Tile services, closer to home.</h1><p>Find installation, repairs and tile supply in your town, village or township. Work directly with Tiling.ca on the preparation, materials and finish for your property.</p><Link className="button button-primary" href="/request-a-quote">REQUEST A QUOTE</Link></section>
 <section className="section-pad"><div className="section-heading"><div><p className="section-kicker">{municipalities.length} municipalities · {communityCount} named communities</p><h2>Find your Ontario location.</h2></div><p>Choose your location and service. We cover all local municipalities in Ontario’s official directory, with named village and community entries to help you find the right area. Exact-address access and scheduling are confirmed with your quote.</p></div><OntarioDirectory/></section>
 <section className="local-note section-pad"><div><p className="section-kicker">Your property, your scope</p><h2>From a village kitchen to a rural renovation.</h2></div><p>For a rural or seasonal address, tell us about driveway access, heating, water and material storage. For an occupied home or business, we plan protection, work hours and curing time. Some communities cross municipal boundaries; your full address identifies the correct project location.</p></section>
 </main><Footer/><StructuredData data={{"@context":"https://schema.org","@type":"CollectionPage",name:"Ontario Tile Service Areas",url:`${business.domain}/locations/ontario`,mainEntity:{"@type":"ItemList",itemListElement:ontarioRegions.map((region,index)=>({"@type":"ListItem",position:index+1,name:region.name,url:`${business.domain}/locations/ontario/${region.slug}`}))}}}/></>;
}
