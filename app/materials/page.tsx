import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header } from "../components";
import { business } from "../data";
import { withSocialMetadata } from "../seo";
import { MaterialsIndex } from "../material-content";
export const metadata:Metadata=withSocialMetadata({title:"Tile Materials: Porcelain, Ceramic & Natural Stone",description:"Compare tile materials, finishes, suitable applications and care. Explore porcelain, ceramic, marble, granite and natural stone with service and pricing guides.",alternates:{canonical:business.domain+"/materials"}});
export default function MaterialsPage(){return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Tile supply"}]}/><MaterialsIndex/></main><Footer/></>;}
