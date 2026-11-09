"use client";
import { useState } from "react";
import type { Locale } from "./pricing-data";

type Place = { slug: string; name: string; province: string; search: string; communities: string[] };
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function HomeLocations({ items, featured, locale }: { items: Place[]; featured: string[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const fr = locale === "fr", prefix = fr ? "/fr" : "", needle = normalize(query.trim());
  const rank = (item: Place) => normalize(item.name) === needle ? 0 : item.communities.some(name => normalize(name) === needle) ? 1 : normalize(item.name).startsWith(needle) ? 2 : normalize(item.name).includes(needle) ? 3 : 4;
  const matches = needle ? items.filter(item => normalize(item.search).includes(needle)).sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, fr ? "fr-CA" : "en-CA")) : featured.map(slug => items.find(item => item.slug === slug)!).filter(Boolean);
  const shown = matches.slice(0, 6);
  const directoryHref = prefix + "/locations" + (query.trim() ? "?q=" + encodeURIComponent(query.trim()) : "");
  return <div className="home-location-finder">
    <div className="home-location-input"><label htmlFor="home-city-search">{fr ? "Ville, province ou communauté" : "City, province or community"}</label><input id="home-city-search" type="search" maxLength={100} autoComplete="off" value={query} onChange={event => setQuery(event.target.value)} placeholder={fr ? "Ex. Montréal, Ontario ou Halifax" : "Try Toronto, Alberta or Halifax"} aria-describedby="home-city-results"/>{query && <button type="button" onClick={() => setQuery("")}>{fr ? "Effacer la recherche" : "Clear search"}</button>}</div>
    <p id="home-city-results" className="home-city-status" role="status" aria-live="polite">{needle ? (fr ? `${matches.length} résultat${matches.length === 1 ? "" : "s"}. ${shown.length} affiché${shown.length === 1 ? "" : "s"} ci-dessous.` : `${matches.length} matching ${matches.length === 1 ? "location" : "locations"}. Showing ${shown.length} below.`) : (fr ? "Quelques villes pour commencer. Recherchez votre localité ou consultez le répertoire complet." : "A few cities to start with. Search for your community or browse the full directory.")}</p>
    <div className="home-city-links">{shown.map(item => <a key={item.slug} href={`${prefix}/areas/${item.slug}`}><span>{item.province}</span><strong>{item.name}</strong><b>{fr ? "Services locaux →" : "Local services →"}</b></a>)}</div>
    {!shown.length && <p className="home-no-location">{fr ? "Aucun résultat. Essayez une ville voisine ou " : "No matches. Try a nearby city or "}<a href={`${prefix}/request-a-quote`}>{fr ? "indiquez le lieu de votre projet" : "send us your project location"}</a>.</p>}
    <a className="text-link" href={directoryHref}>{needle ? (fr ? "Voir tous les résultats dans le répertoire →" : "View all results in the directory →") : (fr ? "Parcourir toutes les régions desservies →" : "Browse all service areas →")}</a>
  </div>;
}
