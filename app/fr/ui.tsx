"use client";
import { Logo } from "../logo";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { business } from "../data";
import { LanguageSwitch } from "../language-switch";
import { trackEnquiry } from "../enquiry-events";
export function FrenchHeader(){
 const [open,setOpen]=useState(false);const pathname=usePathname()||"/fr";
 const parts=pathname.slice(3).split('/');const q=new URLSearchParams();if(parts[1]==='areas'&&parts[2])q.set('area',parts[2]);if(parts[1]==='areas'&&parts[3])q.set('service',parts[3]);if(parts[1]==='services'&&parts[2])q.set('service',parts[2]);
 const quote='/fr/request-a-quote'+(q.size?'?'+q:'');
 const links=[['/fr/services','Services'],['/fr/materials','Matériaux'],['/fr/locations','Régions desservies'],['/fr/about','À propos']];
 return <><a className="skip-link" href="#main-content">Aller au contenu</a><header className="site-header french-header" onKeyDown={e=>{if(e.key==='Escape')setOpen(false)}}>
 <a className="brand" href="/fr" aria-label="Tiling.ca — accueil"><Logo header/></a>
 <nav className="desktop-nav" aria-label="Navigation principale">{links.map(([href,label])=><a key={href} href={href}>{label}</a>)}</nav>
 <div className="header-actions"><LanguageSwitch/><a className="header-phone" href={`tel:${business.phoneHref}`} onClick={()=>trackEnquiry('phone_click')}>{business.phone}</a><a className="header-cta" href={quote}>Soumission</a></div>
 <button className="menu-button" aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(!open)}><span/><span/><span/><b className="sr-only">Menu</b></button>
 <nav id="mobile-nav" className={`mobile-nav ${open?'open':''}`} aria-label="Navigation mobile">{[...links,['/fr/how-it-works','Notre démarche'],[quote,'Demander une soumission']].map(([href,label])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}</nav></header>
 {pathname!='/fr/request-a-quote'&&<nav className="mobile-enquiry-bar" aria-label="Contact rapide"><a href={`tel:${business.phoneHref}`} onClick={()=>trackEnquiry('phone_click')}>APPELER</a><a href={/^\/fr\/areas\/[^/]+\/[^/]+\/?$/.test(pathname)?'#local-quote':quote}>SOUMISSION</a></nav>}</>;
}
export function FrenchDirectory({items}:{items:{slug:string;name:string;province:string;communities:string[]}[]}){
 const [query,setQuery]=useState('');const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr-CA');
 const found=items.filter(a=>normalize([a.name,a.province,...a.communities].join(' ')).includes(normalize(query.trim())));
 return <><label htmlFor="fr-city-search">Rechercher une ville ou une communauté</label><br/><input className="fr-location-search" id="fr-city-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ville, province ou communauté"/><p role="status">{found.length} {found.length===1?'région trouvée':'régions trouvées'}</p><div className="fr-grid">{found.map(a=><a className="fr-card" href={`/fr/areas/${a.slug}`} key={a.slug}><span>{a.province}</span><h3>{a.name}</h3><p>{a.communities.slice(0,4).join(' · ')}</p><span>Voir les services locaux →</span></a>)}</div>{!found.length&&<p>Vous ne trouvez pas votre localité? <a href="/fr/request-a-quote">Indiquez votre adresse dans une demande de soumission.</a></p>}</>;
}
