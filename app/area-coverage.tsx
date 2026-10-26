import { Link } from "./components";
import { areas, getArea, getRelatedAreas } from "./data";

export function AreaCoverage({ areaSlug, serviceSlug }: { areaSlug: string; serviceSlug?: string }) {
  const area = getArea(areaSlug);
  if (!area) return null;
  const nearby = [...new Set([...area.surroundingAreas, ...getRelatedAreas(area.slug).map(item => item.name)])];
  return <section className="coverage-summary section-pad">
    <p className="section-kicker">{area.name} and surrounding areas</p>
    <h2>Find your neighbourhood or nearby town.</h2>
    <p>We serve {area.name} and nearby communities. Confirm your property location with us so we can plan access, travel and scheduling.</p>
    {area.neighbourhoods.length > 0 && <div className="coverage-group"><h3>In {area.name}</h3><div className="coverage-tags">{area.neighbourhoods.map(name => <span key={name}>{name}</span>)}</div></div>}
    <div className="coverage-group"><h3>Nearby service areas</h3><div className="coverage-tags">{nearby.map(name => {
      const destination = areas.find(item => item.name === name && item.slug !== area.slug && item.province === area.province);
      return destination ? <Link key={name} href={`/areas/${destination.slug}${serviceSlug ? `/${serviceSlug}` : ""}`}>{name} →</Link> : <span key={name}>{name}</span>;
    })}</div></div>
    <Link className="text-link" href="/locations">ALL SERVICE AREAS →</Link>
  </section>;
}
