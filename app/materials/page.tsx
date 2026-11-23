import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header } from "../components";
import { business } from "../data";
import { withSocialMetadata } from "../seo";
import { MaterialsIndex } from "../material-content";
export const metadata:Metadata=withSocialMetadata({title:"Tile Products | Carpet Tile, Interlocking, Vinyl, Stone & Ceramic",description:"Browse carpet tile, interlocking flooring, concrete pavers, luxury vinyl tile, porcelain, ceramic and natural stone. Request materials only or supply and installation.",alternates:{canonical:business.domain+"/materials"}});
export default function MaterialsPage(){return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Tile supply"}]}/><MaterialsIndex/></main><Footer/></>;}
