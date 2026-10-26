"use client";

import { type AnchorHTMLAttributes, useState } from "react";
import { usePathname } from "next/navigation";
import { trackEnquiry } from "./enquiry-events";
import { business, materials, services } from "./data";

export function Link({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const pathname = usePathname();
  let destination = href;
  if (href === "/request-a-quote") {
    const parts = (pathname || "/").split("/");
    const query = new URLSearchParams();
    if (parts[1] === "areas" && parts[2]) query.set("area", parts[2]);
    if (parts[1] === "areas" && parts[3]) query.set("service", parts[3]);
    if (parts[1] === "services" && parts[2]) query.set("service", parts[2]);
    if (query.size) destination += `?${query}`;
  }
  return <a {...props} href={destination} onClick={(event) => {
    if (href.startsWith("tel:")) trackEnquiry("phone_click");
    props.onClick?.(event);
  }}>{children}</a>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const localService = /^\/areas\/[^/]+\/[^/]+\/?$/.test(pathname || "");
  return (
    <><a className="skip-link" href="#main-content">Skip to content</a><header className="site-header" onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
      <Link className="brand" href="/" aria-label="Tiling.ca home">
        <img className="brand-logo" src="/brand/tiling-herringbone-square-dot.png" alt="Tiling.ca" width="2170" height="573" />
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation"><Link href="/services">Tile services</Link><Link href="/materials">Tile supply</Link><Link href="/locations">Service areas</Link><Link href="/about">About</Link></nav>
      <div className="header-actions">
        <Link className="header-phone" href={`tel:${business.phoneHref}`}>{business.phone}</Link>
        <Link className="header-cta" href="/request-a-quote">Get a quote</Link>
      </div>
      <button className="menu-button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}><span /><span /><span /><b className="sr-only">Menu</b></button>
      <nav id="mobile-nav" className={`mobile-nav ${open ? "open" : ""}`} aria-label="Mobile navigation">
        <Link onClick={() => setOpen(false)} href="/services">Tile services</Link><Link onClick={() => setOpen(false)} href="/materials">Tile supply</Link><Link onClick={() => setOpen(false)} href="/locations">Service areas</Link><Link onClick={() => setOpen(false)} href="/about">About</Link><Link onClick={() => setOpen(false)} href="/how-it-works">Our process</Link><Link onClick={() => setOpen(false)} href="/request-a-quote">Get a quote</Link>
      </nav>
    </header>
    {pathname !== "/request-a-quote" && <nav className="mobile-enquiry-bar" aria-label="Quick contact"><Link href={`tel:${business.phoneHref}`}>CALL US</Link><Link href={localService ? "#local-quote" : "/request-a-quote"}>GET A QUOTE</Link></nav>}
    </>
  );
}

export function Footer() {
  return <footer className="footer"><div className="footer-main"><div><Link className="footer-brand" href="/" aria-label="Tiling.ca home"><img src="/brand/tiling-herringbone-square-dot.png" alt="Tiling.ca" width="2170" height="573" /></Link><p>Your tile contractor across Canada. We install, repair and supply tile for homes and businesses.</p><Link className="footer-phone" href={`tel:${business.phoneHref}`}>{business.phone}</Link><Link href={`mailto:${business.email}`}>{business.email}</Link><address>{business.address.street}<br/>{business.address.city}, {business.address.province} {business.address.postalCode}<br/>{business.address.country}</address></div><div><h2><Link href="/services">Services</Link></h2>{services.slice(0,5).map(s=><Link key={s.slug} href={`/services/${s.slug}`}>{s.name}</Link>)}</div><div><h2><Link href="/materials">Tile supply</Link></h2>{materials.map(m=><Link key={m.slug} href={`/materials/${m.slug}`}>{m.name}</Link>)}</div><div><h2>Company</h2><Link href="/about">About Tiling.ca</Link><Link href="/contact">Contact</Link><Link href="/how-it-works">Our process</Link><Link href="/editorial-standards">Editorial standards</Link><Link href="/locations">Service areas</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Website terms</Link></div><div><h2>Start your project</h2><p>Tell us what you are planning and receive a follow-up about scope, materials and availability.</p><Link className="footer-cta" href="/request-a-quote">Request a quote</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Tiling.ca</span><span>Tile installation · supply · Canada</span></div></footer>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const schema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:items.map((item,i)=>({"@type":"ListItem",position:i+1,name:item.label,item:item.href?new URL(item.href,business.domain).href:undefined}))};
  return <><nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item,i)=><span key={item.label}>{item.href?<Link href={item.href}>{item.label}</Link>:item.label}{i<items.length-1&&<b>/</b>}</span>)}</nav><StructuredData data={schema}/></>;
}

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const schema={"@context":"https://schema.org","@type":"FAQPage",mainEntity:items.map(item=>({"@type":"Question",name:item.q,acceptedAnswer:{"@type":"Answer",text:item.a}}))};
  return <><div className="faq-list">{items.map(item=><details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</div><StructuredData data={schema}/></>;
}

export function StructuredData({data}:{data:Record<string,unknown>}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/>;
}
