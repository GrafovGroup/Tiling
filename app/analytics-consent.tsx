"use client";

import { useEffect, useState } from "react";
import { validMeasurementId } from "./analytics-config";

type Consent = "accepted" | "declined" | null;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  tilingAnalytics?: (event: string, details: Record<string, unknown>) => void;
  [key: `ga-disable-${string}`]: boolean;
};
const storageKey = "tiling-analytics-choice-v1";

function enableAnalytics(measurementId: string) {
  if (!validMeasurementId(measurementId)) return;
  const target = window as unknown as AnalyticsWindow;
  target[`ga-disable-${measurementId}`] = false;
  if (target.tilingAnalytics) return;
  target.dataLayer ??= [];
  target.gtag ??= function () { target.dataLayer!.push(arguments); };
  const gtag = target.gtag;
  // Apply globally before consent/config processing as well as on this destination.
  // Only the explicit page_view below should count a visit.
  gtag("set", "send_page_view", false);
  gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  gtag("js", new Date());
  let referrer = "";
  try { if (document.referrer) referrer = new URL(document.referrer).origin; } catch { /* Omit invalid referrers. */ }
  const page = { page_location: "https://tiling.ca" + location.pathname, page_referrer: referrer, page_title: document.title };
  gtag("config", measurementId, { ...page, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_domain: "none", cookie_flags: "SameSite=Lax;Secure" });
  target.tilingAnalytics = (event, details) => gtag("event", event, { ...details, ...page, send_to: measurementId });
  target.tilingAnalytics("page_view", { language: document.documentElement.lang });
  if (!document.getElementById("tiling-google-tag")) {
    const script = document.createElement("script");
    script.id = "tiling-google-tag";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }
}

function disableAnalytics(measurementId: string) {
  const target = window as unknown as AnalyticsWindow;
  target[`ga-disable-${measurementId}`] = true;
  target.tilingAnalytics = undefined;
  target.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (/^_ga(?:_|$)/.test(name)) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
  }
}

export function AnalyticsConsent({ measurementId, locale }: { measurementId: string; locale: "en" | "fr" }) {
  const [consent, setConsent] = useState<Consent>(null);
  const fr = locale === "fr";
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "accepted" || stored === "declined") setConsent(stored);
      if (stored === "accepted") enableAnalytics(measurementId);
    } catch { /* Storage restrictions leave analytics off. */ }
  }, [measurementId]);
  function choose(value: Exclude<Consent, null>) {
    setConsent(value);
    try { localStorage.setItem(storageKey, value); } catch { /* The choice still applies to this page. */ }
    try { if (value === "accepted") enableAnalytics(measurementId); else disableAnalytics(measurementId); } catch { /* Quotes and navigation remain available. */ }
  }
  return <section className="analytics-choice" aria-label={fr ? "Préférences de mesure d’audience" : "Analytics preferences"}>
    <p>{fr ? "Mesure d’audience facultative" : "Optional website analytics"}</p>
    <p>{fr ? "Autorisez Google Analytics à mesurer les visites et les actions de contact. Les champs du formulaire ne sont pas transmis. Votre choix ne change pas l’envoi d’une soumission." : "Allow Google Analytics to measure visits and contact actions. Form fields are not shared. Your choice does not affect quote requests."} <a href={fr ? "/fr/privacy" : "/privacy"}>{fr ? "Confidentialité" : "Privacy details"}</a></p>
    <div><button type="button" aria-pressed={consent === "accepted"} onClick={() => choose("accepted")}>{fr ? "Autoriser" : "Allow analytics"}</button><button type="button" aria-pressed={consent === "declined"} onClick={() => choose("declined")}>{fr ? "Refuser" : "Decline analytics"}</button></div>
    <span role="status">{consent === "accepted" ? (fr ? "Mesure autorisée. Vous pouvez changer ce choix ici." : "Analytics allowed. You can change this choice here.") : consent === "declined" ? (fr ? "Mesure désactivée." : "Analytics disabled.") : (fr ? "Désactivée jusqu’à votre accord." : "Off until you choose to allow it.")}</span>
  </section>;
}
