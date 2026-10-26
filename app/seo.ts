import type { Metadata } from "next";
export function withSocialMetadata(metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : undefined;
  if (!title) return metadata;
  const description = metadata.description || undefined;
  const canonical = metadata.alternates?.canonical;
  const path = typeof canonical === "string" ? new URL(canonical, "https://tiling.ca").pathname : "/";
  const en = `https://tiling.ca${path === "/" ? "" : path}`;
  const fr = `https://tiling.ca/fr${path === "/" ? "" : path}`;
  return { ...metadata, alternates: { ...metadata.alternates, languages: { "en-CA": en, "fr-CA": fr, "x-default": en } }, openGraph: { type: "website", locale: "en_CA", siteName: "Tiling.ca", images: [{ url: "/og-canada-v2.jpg", width: 1536, height: 1024, alt: "Tiling.ca tile installation and supply" }], ...metadata.openGraph, title, description, ...(typeof canonical === "string" ? { url: canonical } : {}) }, twitter: { card: "summary_large_image", images: ["/og-canada-v2.jpg"], ...metadata.twitter, title, description } };
}
