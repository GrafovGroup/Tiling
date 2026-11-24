"use client";

import type { AnchorHTMLAttributes } from "react";
import { useNavigationQuoteHref } from "./quote-navigation-context";

export function QuoteButton({ children, className, href, onClick }: Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href" | "onClick">) {
  const quoteHref = useNavigationQuoteHref();
  return <a className={className} href={href ?? quoteHref} data-quote-inlay="" onClick={onClick}>
    <span className="quote-button-inlay" aria-hidden="true"/>
    <span className="quote-button-label">{children}</span>
    <span className="quote-button-arrow" aria-hidden="true">→</span>
  </a>;
}
