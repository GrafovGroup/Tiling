import { Link } from "./components";
import { services } from "./data";
import { getOntarioMunicipality } from "./ontario-data";
export function CommunityCoverage({areaSlug,serviceSlug}:{areaSlug:string;serviceSlug?:string}){
 const municipality=getOntarioMunicipality(areaSlug);
 if(!municipality || !municipality.communities.length)return null;
 const service=services.find(item=>item.slug===serviceSlug);
 return <section className="community-coverage section-pad"><div className="section-heading"><div><p className="section-kicker">{municipality.name} · Local communities</p><h2>{service?`${service.name} in your community.`:"Choose your community and service."}</h2></div><p>These local place names help identify projects across the {municipality.name} area. Some settlements span municipal boundaries; we confirm the full address, access and travel requirements before scheduling.</p></div>
 {municipality.planningNote&&<p className="community-planning">{municipality.planningNote}</p>}
 <div className="community-grid">{municipality.communities.map(community=><article id={`community-${community.id}`} key={community.id}><h3>{service?`${service.name} in ${community.name}`:community.name}</h3><p>{municipality.name} · {municipality.region}, Ontario</p>{service?<><Link href="#local-quote">REQUEST YOUR {community.name.toUpperCase()} QUOTE →</Link></>:<ul>{services.map(item=><li key={item.slug}><Link href={`/areas/${areaSlug}/${item.slug}#community-${community.id}`}>{item.name} in {community.name} →</Link></li>)}</ul>}</article>)}</div>
 <p className="community-source">Community information: {municipality.sourceUrls.map((url,index)=><span key={url}>{index>0?" · ":""}<a href={url} target="_blank" rel="noopener noreferrer">{municipality.name}{municipality.sourceUrls.length>1?` · source ${index+1}`:""}</a></span>)}</p>
 </section>;
}
