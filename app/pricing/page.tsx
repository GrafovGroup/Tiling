import { Header, Footer, Breadcrumbs } from "../components";
import { PricingIndex } from "../pricing-content";
import { withSocialMetadata } from "../seo";
export const metadata = withSocialMetadata({ title: "Tile Pricing Guides: Installation, Repair & Supply", description: "Compare Canadian industry prices for installation, repairs, cleaning, tile supply and specialty surfaces. See scope, materials, labour and exclusions.", alternates: { canonical: "https://tiling.ca/pricing" } });
export default function PricingPage() {
  return <><Header/><main id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Pricing guides"}]}/><PricingIndex/></main><Footer/></>;
}
