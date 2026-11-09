import type { Metadata } from "next";
import { headers } from "next/headers";
import { NotFoundContent } from "./not-found-content";

export async function generateMetadata(): Promise<Metadata> {
  const fr = (await headers()).get("x-tiling-locale") === "fr";
  return { title: fr ? "Page introuvable" : "Page not found", robots: { index: false, follow: true }, alternates: { languages: {} } };
}

export default async function NotFound() {
  const locale = (await headers()).get("x-tiling-locale") === "fr" ? "fr" : "en";
  return <NotFoundContent locale={locale}/>;
}
