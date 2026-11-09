import type { Metadata } from "next";
import { Header, Footer } from "./components";
import { HomeContent } from "./home-content";
import { homeMeta } from "./home-data";
import { withSocialMetadata } from "./seo";

export const metadata: Metadata = withSocialMetadata({ ...homeMeta.en, alternates: { canonical: "https://tiling.ca" } });
export default function Home() {
  return <><Header/><main id="main-content" className="home-content"><HomeContent/></main><Footer/></>;
}
