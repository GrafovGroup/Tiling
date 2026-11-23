"use client";

import { createContext, useContext, type ReactNode } from "react";

const QuoteNavigation = createContext("/request-a-quote");

export function QuoteNavigationProvider({ href, children }: { href: string; children: ReactNode }) {
  return <QuoteNavigation.Provider value={href}>{children}</QuoteNavigation.Provider>;
}

export function useNavigationQuoteHref() {
  return useContext(QuoteNavigation);
}
