"use client";
import { useState } from "react";
import { areas, featuredAreas } from "./data";
import { Link } from "./components";
const provinceId=(name:string)=>name.toLowerCase().replace(/[^a-z]+/g,"-");
const normalize=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
export function LocationDirectory(){
 const [query,setQuery]=useState("");const needle=normalize(query.trim());
 const matches=(needle?areas:featuredAreas).filter(area=>normalize([area.name,area.province,area.region,...area.surroundingAreas,...area.neighbourhoods].join(" ")).includes(needle));
 const provinces=[...new Set(matches.map(area=>area.province))].sort();
 return <><div className="coverage-search"><label htmlFor="city-search">Find your city or surrounding community</label><input id="city-search" type="search" placeholder="City, province or nearby community" value={query} onChange={e=>setQuery(e.target.value)}/><p className="coverage-count" role="status">{matches.length} {matches.length===1?"location":"locations"} covering local neighbourhoods and surrounding communities</p></div><nav className="province-links" aria-label="Provinces and territories">{provinces.map(province=><a key={province} href={`#${provinceId(province)}`}>{province}</a>)}</nav><div className="location-groups">{provinces.map(province=>{const cities=matches.filter(area=>area.province===province);if(!cities.length)return null;return <section className="location-group" id={provinceId(province)} key={province}><div className="location-group-heading"><h2>{province}</h2><span>{cities.length} locations</span></div><div className="area-grid">{cities.map(area=><Link key={area.slug} href={`/areas/${area.slug}`}><span>{area.region}</span><p>Tile installation &amp; supply</p><h3>{area.name}</h3><b>{area.lead}</b><em>VIEW LOCAL SERVICES →</em></Link>)}</div></section>})}</div>{!matches.length&&<p>No matching location. <Link href="/request-a-quote">Send us your location</Link> to discuss service, travel and scheduling for your property.</p>}</>;
}
