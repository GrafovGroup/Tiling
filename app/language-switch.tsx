"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
export function LanguageSwitch() {
  const pathname = usePathname() || "/";
  const french = pathname === "/fr" || pathname.startsWith("/fr/");
  const destination = french ? pathname.replace(/^\/fr/, "") || "/" : `/fr${pathname === "/" ? "" : pathname}`;
  const [suffix, setSuffix] = useState("");
  useEffect(() => { setSuffix(window.location.search + window.location.hash); }, [pathname]);
  return <a className="language-switch" href={destination + suffix} hrefLang={french ? "en-CA" : "fr-CA"} lang={french ? "en" : "fr"} aria-label={french ? "View this page in English" : "Voir cette page en français"}>{french ? "EN" : "FR"}</a>;
}
