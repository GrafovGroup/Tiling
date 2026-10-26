// Measurement hooks only. An analytics destination still needs to be connected.
// Never include form fields, full URLs, query strings, or fragment identifiers.
export function trackEnquiry(event: "phone_click" | "quote_start" | "generate_lead" | "quote_error", service = "") {
  if (typeof window === "undefined") return;
  try {
    const target = window as Window & { dataLayer?: Record<string, unknown>[] };
    const pathname = window.location.pathname;
    const parts = pathname.split("/").filter(Boolean);
    const language = parts[0] === "fr" ? "fr-CA" : "en-CA";
    if (parts[0] === "fr") parts.shift();
    const serviceSlug = parts[0] === "services" ? parts[1] : parts[0] === "areas" ? parts[2] : "";
    target.dataLayer ??= [];
    target.dataLayer.push({ event, page_path: pathname, language, service: service || serviceSlug || "" });
  } catch {
    // Measurement failures must never block a call or turn a successful quote into an error.
  }
}
