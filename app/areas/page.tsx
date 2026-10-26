import { withSocialMetadata } from "../seo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata:Metadata=withSocialMetadata({robots:{index:false,follow:true}});
export default function AreasPage(){redirect("/locations")}
