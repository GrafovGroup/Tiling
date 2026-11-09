"use client";

import { useEffect } from "react";
import { trackEnquiry } from "./enquiry-events";

/** One listener also covers server-rendered contact, footer and recovery links. */
export function EnquiryLinks() {
  useEffect(() => {
    function record(event: MouseEvent) {
      try {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackEnquiry("phone_click");
      else if (href.startsWith("mailto:")) trackEnquiry("email_click");
      else {
        const target = new URL(anchor.href);
        if (target.origin === location.origin && (/^\/(?:fr\/)?request-a-quote\/?$/.test(target.pathname) || (target.pathname === location.pathname && /^#(?:local-quote|home-quote|project-enquiry|project-enquiry-form|service-quote|commercial-quote|material-quote)$/.test(target.hash)))) trackEnquiry("quote_click");
      }
      } catch {
        // A measurement failure must never interfere with navigation.
      }
    }
    document.addEventListener("click", record, true);
    return () => document.removeEventListener("click", record, true);
  }, []);
  return null;
}
