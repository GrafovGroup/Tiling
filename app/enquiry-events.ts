// Measurement hooks only. No analytics provider or external request is enabled here.
export function trackEnquiry(event: "phone_click" | "quote_start" | "generate_lead" | "quote_error", service = "") {
  if (typeof window === "undefined") return;
  const target = window as Window & { dataLayer?: Record<string, unknown>[] };
  target.dataLayer ??= [];
  target.dataLayer.push({ event, page_path: window.location.pathname, service });
}
