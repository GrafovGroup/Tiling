import type { Metadata } from "next";
import "./globals.css";
import { headers } from "next/headers";

export const metadata: Metadata = {
  metadataBase: new URL("https://tiling.ca"),
  title: { default: "Tile Installation & Tile Supply across Canada | Tiling.ca", template: "%s | Tiling.ca" },
  description: "Professional tile installation, repair and material supply for homes and businesses across Canada. Request a quote from Tiling.ca.",
  alternates: { canonical: "https://tiling.ca", languages: { "en-CA": "https://tiling.ca", "fr-CA": "https://tiling.ca/fr", "x-default": "https://tiling.ca" } },
  verification: { other: { "msvalidate.01": "8540AF3FE8C8197267E84BBE602115F7" } },
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "en_CA", siteName: "Tiling.ca", title: "Tile Installation & Tile Supply across Canada", description: "Professional tile services for residential and commercial projects across Canada.", images: [{ url: "/og-canada-v2.jpg", width: 1536, height: 1024, alt: "Tiling.ca tile installation and supply" }] },
  twitter: { card: "summary_large_image", images: ["/og-canada-v2.jpg"] },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get("x-tiling-locale") === "fr" ? "fr-CA" : "en-CA";
  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon-v7.ico" type="image/x-icon" sizes="16x16 32x32 48x48" />
        <link rel="icon" href="/favicon-v7-32.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon-v7.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-v7.png" sizes="180x180" />
      </head>
      <body>{children}</body>
    </html>
  );
}
