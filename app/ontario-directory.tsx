"use client";
import { useState } from "react";
import { municipalities, ontarioRegions } from "./ontario-data";
import { services } from "./data";
import { Link } from "./components";
const normalize=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
export function OntarioDirectory({regionSlug}:{regionSlug?:string}) {
  const [query,setQuery]=useState("");
  const [service,setService]=useState("");
  const needle=normalize(query);
  const local=municipalities.filter(item=>!regionSlug || item.regionSlug===regionSlug);
  const results=local.flatMap(item=>{
    const places=[{name:item.name,id:""},...item.communities];
    return places.filter(place=>needle ? normalize(`${place.name} ${item.name} ${item.region}`).includes(needle) : !place.id)
      .map(place=>({key:`${item.slug}:${place.id}`,name:place.name,municipality:item.name,region:item.region,regionSlug:item.regionSlug,
        href:`/areas/${item.slug}${service?`/${service}`:""}${place.id?`#community-${place.id}`:""}`}));
  }).sort((a,b)=>{
    const exactA=normalize(a.name)===needle, exactB=normalize(b.name)===needle;
    return Number(exactB)-Number(exactA) || a.name.localeCompare(b.name) || a.municipality.localeCompare(b.municipality);
  });
  const visible=needle?results.slice(0,60):regionSlug?results:[];
  return <>
    <div className="ontario-search">
      <label>Town, village or community<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Try Elora, Port Perry or Geraldton" autoComplete="off" /></label>
      <label>Service<select value={service} onChange={event=>setService(event.target.value)}><option value="">All tile services</option>{services.map(item=><option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
    </div>
    <p className="coverage-count" role="status">{needle?`${results.length} matching ${results.length===1?"location":"locations"}${results.length>60?" · Showing the first 60. Refine your search for more specific results.":""}`:regionSlug?`${local.length} municipalities · Search also finds their named communities.`:"Search by the name you use locally, or browse a region below."}</p>
    {visible.length>0 && <div className="ontario-results">{visible.map(item=><Link key={item.key} href={item.href}><h3>{item.name}</h3><p>{item.name===item.municipality?item.region:`${item.municipality} · ${item.region}`}</p><span>{service?services.find(s=>s.slug===service)?.name:"VIEW TILE SERVICES"} →</span></Link>)}</div>}
    {needle&&!results.length&&<p className="coverage-empty">No exact entry yet. Browse the region covering your address or <Link href="/request-a-quote">send us your town and project</Link>. Named communities are examples within our wider municipal coverage.</p>}
    {!regionSlug && <><h2 className="region-directory-title">Browse Ontario by region.</h2><div className="ontario-regions">{ontarioRegions.map(region=><Link key={region.slug} href={`/locations/ontario/${region.slug}`}><h3>{region.name}</h3><p>{region.municipalities.length} {region.municipalities.length===1?"municipality":"municipalities"}</p><span>EXPLORE AREA →</span></Link>)}</div></>}
  </>;
}
