import { finalResponse, isMerged, localHref } from './local-route-helpers.mjs';
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import worker from "../dist/server/index.js";

const expansion = JSON.parse(readFileSync(new URL("../app/pricing-expansion.json", import.meta.url)));
const primary = [
  {slug:"tile-installation-cost",service:"floor-tile-installation"},
  {slug:"shower-tiling-cost",service:"bathroom-shower-tile"},
  {slug:"backsplash-tiling-cost",service:"kitchen-backsplash"},
];
const guides = [...primary,...expansion.guides];
const env={ASSETS:{fetch:async()=>new Response("Not found",{status:404})}};
async function html(path){
  const response=await finalResponse(p=>worker.fetch(new Request("https://tiling.ca"+p,{headers:{accept:"text/html","user-agent":"Googlebot"}}),env,{waitUntil(){},passThroughOnException(){}}),path);
  assert.equal(response.status,200,path);
  return response.text();
}
function cards(page){return [...page.matchAll(/<a[^>]+class="pricing-card"[^>]+href="([^"]+)"/g)].map(match=>match[1]);}

test("twelve new guides complete one-to-one coverage of all fifteen services",()=>{
  assert.equal(expansion.guides.length,12);
  assert.equal(new Set(guides.map(guide=>guide.slug)).size,15);
  assert.equal(new Set(guides.map(guide=>guide.service)).size,15);
  const serviceSource=readFileSync(new URL("../app/data.ts",import.meta.url),"utf8").split("export const services: Service[] = [")[1].split("export function getArea")[0];
  const services=[...serviceSource.matchAll(/"?slug"?:\s*"([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(guides.map(guide=>guide.service).sort(),services.sort());
});

test("every added guide renders sourced, bilingual content with canonical and reciprocal metadata",async()=>{
  for(const prefix of ["","/fr"])for(const guide of expansion.guides){
    const locale=prefix?"fr":"en",path=prefix+"/pricing/"+guide.slug;
    const page=await html(path),head=page.split("</head>")[0];
    assert.equal((page.match(/<h1[ >]/g)||[]).length,1,path);
    assert.ok(head.includes('rel="canonical" href="https://tiling.ca'+path+'"'),path);
    for(const languagePrefix of ["","/fr"])assert.ok(head.includes('href="https://tiling.ca'+languagePrefix+'/pricing/'+guide.slug+'"'),path);
    assert.match(page,/"@type":"Article"/);
    assert.doesNotMatch(page,/"@type":"(?:Offer|AggregateOffer)"/);
    assert.match(page,/<caption>/);
    assert.match(page,/scope="col"/);
    assert.match(page,/id="sources"/);
    assert.match(page,/id="quote-checklist"/);
    assert.match(page,prefix?/ne constituent pas une soumission de Tiling.ca/:/not Tiling.ca quotations/);
    for(const benchmark of guide.benchmarks){
      const source=expansion.sources[benchmark.source];
      assert.ok(source,`${guide.slug}: ${benchmark.source}`);
      assert.ok(source.url.startsWith("https://"));
      assert.ok(page.includes(source.url.replaceAll("&","&amp;")),source.url);
      assert.ok(benchmark.scope[locale]&&benchmark.includes[locale]&&benchmark.range[locale]);
    }
    assert.ok(guide.factors.length>=3 && guide.checklist.length>=4 && guide.faq.length>=2);
  }
});

test("pricing catalog and sitemap expose all fifteen guides in both languages",async()=>{
  const sitemap=await html("/sitemap.xml");
  for(const prefix of ["","/fr"]){
    const page=await html(prefix+"/pricing");
    assert.equal(cards(page).length,15);
    for(const guide of guides){
      assert.ok(cards(page).includes(prefix+"/pricing/"+guide.slug));
      assert.ok(sitemap.includes("https://tiling.ca"+prefix+"/pricing/"+guide.slug+"</loc>"));
    }
    for(const id of ["interior-installation","repair-preparation","specialty-surfaces","tile-supply"])assert.ok(page.includes('id="'+id+'"'));
  }
});

test("national and city service pages link their own guide and preserve the selected scope",async()=>{
  for(const prefix of ["","/fr"])for(const guide of guides){
    for(const base of ["/services","/areas/vancouver","/areas/addington-highlands"]){
      const path=prefix+base+"/"+guide.service;
      const page=await html(path),links=cards(page);
      const area=base.startsWith("/areas/")?base.split("/")[2]:undefined;
      const query=area?`area=${area}&amp;service=${guide.service}`:`service=${guide.service}`;
      if(area && isMerged(area,guide.service)) {
        const section=page.split(`id="service-${guide.service}"`)[1]?.split("</article>")[0];
        assert.ok(section?.includes(`href="${prefix}/pricing/${guide.slug}?${query}"`),path);
      } else {
        assert.equal(links.length,1,path);
        assert.equal(links[0],`${prefix}/pricing/${guide.slug}?${query}`,path);
      }
    }
    const guidePage=await html(`${prefix}/pricing/${guide.slug}?area=vancouver&service=${guide.service}`);
    assert.ok(guidePage.includes(`${prefix}/request-a-quote?service=${guide.service}&amp;area=vancouver`));
    assert.ok(guidePage.includes(localHref("vancouver",guide.service,prefix)));
  }
});

test("city hubs keep three featured cards while exposing all other service guides as crawlable links",async()=>{
  for(const prefix of ["","/fr"]){
    const page=await html(prefix+"/areas/toronto");
    assert.equal(cards(page).length,3);
    const more=page.match(/<details class="pricing-more-guides">[\s\S]*?<\/details>/)?.[0];
    assert.ok(more);
    for(const guide of expansion.guides)assert.ok(more.includes(`${prefix}/pricing/${guide.slug}?area=toronto`));
  }
});
