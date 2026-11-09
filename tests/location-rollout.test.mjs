import { finalResponse, localHref } from './local-route-helpers.mjs';
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import worker from "../dist/server/index.js";

const housing = JSON.parse(readFileSync(new URL("../app/local-housing.json", import.meta.url)));
const services = ["bathroom-shower-tile","floor-tile-installation","kitchen-backsplash","large-format-tile","tile-repair-regrouting","commercial-tile","tile-supply-delivery","outdoor-balcony-tiling","fireplace-feature-wall-tiling","heated-tile-floors","pool-spa-tiling","tile-stairs-steps","tile-removal-surface-preparation","tile-grout-stone-cleaning-sealing","rooftop-terrace-pedestal-pavers"];
const env = {ASSETS:{fetch:async()=>new Response("Not found",{status:404})}};
async function html(path) {
  const response = await finalResponse(p => worker.fetch(new Request("https://tiling.ca"+p,{headers:{accept:"text/html","user-agent":"Googlebot"}}),env,{waitUntil(){},passThroughOnException(){}}),path);
  assert.equal(response.status,200,path);
  return response.text();
}
const section = page => page.match(/<section class="local-project-brief section-pad"[^>]*>[\s\S]*?<\/section>/)?.[0];
const primaryGuideSlugs = ["tile-installation-cost","shower-tiling-cost","backsplash-tiling-cost"];
const extraGuides = JSON.parse(readFileSync(new URL("../app/pricing-expansion.json", import.meta.url))).guides;
const guideSlugs = [...primaryGuideSlugs, ...extraGuides.map(guide=>guide.slug)];

test("all 482 city hubs publish distinct planning content and all service cost guides in both languages", async()=>{
  assert.equal(Object.keys(housing).length,482);
  for (const prefix of ["","/fr"]) {
    const briefs = new Set();
    for (const slug of Object.keys(housing)) {
      const path = prefix+"/areas/"+slug;
      const page = await html(path);
      assert.equal((page.match(/<h1[ >]/g)||[]).length,1,path);
      const brief = section(page);
      assert.ok(brief,path);
      assert.ok(!briefs.has(brief),"Duplicate local planning: "+path);
      briefs.add(brief);
      if (!["toronto","mississauga"].includes(slug)) {
        assert.match(brief,/98-10-0041-01/,path);
        assert.match(brief,/2021/,path);
        assert.match(brief,/geocode=A0005/,path);
      }
      for (const guide of guideSlugs) assert.ok(page.includes(prefix+"/pricing/"+guide+"?area="+slug),path+" guide "+guide);
      assert.ok(page.split("</head>")[0].includes('rel="canonical" href="https://tiling.ca'+path+'"'),path);
    }
  }
});

test("all fifteen local service families have planning and appropriately scoped pricing in both languages",async()=>{
  for (const prefix of ["","/fr"]) for (const city of ["vancouver","montreal","addington-highlands","iqaluit"]) for (const service of services) {
    const path = `${prefix}/areas/${city}/${service}`;
    const page = await html(path);
    assert.ok(section(page),path);
    assert.match(page,/pricing-links section-pad/,path);
    assert.equal((page.match(/<form /g)||[]).length,1,path);
    if (["bathroom-shower-tile","floor-tile-installation","kitchen-backsplash"].includes(service)) {
      const guide=primaryGuideSlugs[["floor-tile-installation","bathroom-shower-tile","kitchen-backsplash"].indexOf(service)];
      assert.ok(page.includes(`${prefix}/pricing/${guide}?area=${city}&amp;service=${service}`),path);
    }
    if (service==="pool-spa-tiling" || service==="rooftop-terrace-pedestal-pavers") {
      const guide = extraGuides.find(item=>item.service===service);
      assert.ok(guide,path);
      assert.ok(page.includes(`${prefix}/pricing/${guide.slug}?area=${city}&amp;service=${service}`),path);
    }
  }
});

test("municipality boundaries, combined counts and wider regional references remain explicit",async()=>{
  const city=section(await html("/areas/hamilton/commercial-tile"));
  const township=section(await html("/areas/hamilton-township"));
  assert.match(township,/Northumberland/);
  assert.match(township,/separate service area from the City of Hamilton/);
  assert.match(township,/geocode=A00053514019/);
  assert.doesNotMatch(city,/Hamilton Township/);
  const langley=section(await html("/areas/langley"));
  assert.match(langley,/59,520/);
  assert.match(langley,/Township of Langley combined/);
  assert.match(langley,/geocode=A00055915001/);
  assert.match(langley,/geocode=A00055915002/);
  const north=section(await html("/fr/areas/north-vancouver"));
  assert.match(north,/ville et le district de North Vancouver réunis/);
  for (const slug of ["north-york","fort-mcmurray","sydney"]) {
    assert.match(section(await html("/areas/"+slug)),/these are not .+-only figures/);
    assert.match(section(await html("/fr/areas/"+slug)),/il ne s’agit pas de chiffres propres/);
  }
});

test("suppressed housing counts remain unavailable rather than being presented as zero",async()=>{
  assert.equal(housing["cockburn-island"].counts.total,null);
  for (const prefix of ["","/fr"]) {
    const brief=section(await html(prefix+"/areas/cockburn-island"));
    assert.match(brief,prefix?/supprimées/:/suppressed/);
    assert.doesNotMatch(brief,/NaN|undefined|null|0 occupied|0 logements/);
    assert.match(brief,prefix?/transport et hébergement/:/transport and accommodation/);
  }
});

test("related price guides retain the original service only when valid for that guide",async()=>{
  for (const prefix of ["","/fr"]) {
    for (const service of ["heated-tile-floors","large-format-tile","commercial-tile","tile-repair-regrouting","tile-supply-delivery"]) {
      const page = await html(`${prefix}/pricing/tile-installation-cost?area=vancouver&service=${service}`);
      assert.ok(page.includes(`${prefix}/request-a-quote?service=${service}&amp;area=vancouver`));
      assert.ok(page.includes(localHref("vancouver",service,prefix)));
      assert.ok(page.split("</head>")[0].includes('rel="canonical" href="https://tiling.ca'+prefix+'/pricing/tile-installation-cost"'));
    }
    for (const service of ["no-such-service","pool-spa-tiling","%3Cscript%3E"]) {
      const page = await html(`${prefix}/pricing/tile-installation-cost?area=vancouver&service=${service}`);
      const links=[...page.matchAll(/href="([^"]*request-a-quote\?[^"]*)"/g)].map(m=>m[1]);
      assert.ok(links.length);
      assert.ok(links.every(link=>link.includes("service=floor-tile-installation")));
    }
  }
});

test("city enquiry buttons retain locality and corrected display names keep their established URLs",async()=>{
  const page=await html("/areas/edmonton");
  assert.ok((page.match(/href="\/request-a-quote\?area=edmonton"/g)||[]).length>=2);
  const mattice=await html("/areas/mattice-val-ca-ta");
  assert.match(mattice,/Mattice-Val Côté/);
  assert.doesNotMatch(mattice,/CÃ/);
  assert.match(mattice,/https:\/\/tiling.ca\/areas\/mattice-val-ca-ta/);
});
