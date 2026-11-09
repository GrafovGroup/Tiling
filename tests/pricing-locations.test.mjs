import test from "node:test";
import assert from "node:assert/strict";
import worker from "../dist/server/index.js";

const guides = ["tile-installation-cost", "shower-tiling-cost", "backsplash-tiling-cost"];
const env = {ASSETS:{fetch:async()=>new Response("Not found",{status:404})}};
async function request(path) {return worker.fetch(new Request("https://tiling.ca"+path,{headers:{accept:"text/html","user-agent":"Googlebot"}}),env,{waitUntil(){},passThroughOnException(){}});}
async function html(path) {const response=await request(path); assert.equal(response.status,200,path);return response.text();}
test("pricing guides render one heading, complete source scope and reciprocal metadata in both languages",async()=>{
  for(const prefix of ["","/fr"])for(const slug of guides){
    const path=prefix+"/pricing/"+slug, page=await html(path);
    const head=page.split("</head>")[0];
    assert.equal((page.match(/<h1[ >]/g)||[]).length,1,path);
    assert.ok(head.includes('rel="canonical" href="https://tiling.ca'+path+'"'),path);
    assert.ok(head.includes('href="https://tiling.ca/fr/pricing/'+slug+'"'),path);
    assert.ok(head.includes('href="https://tiling.ca/pricing/'+slug+'"'),path);
    assert.match(page,/2026-11-08/);
    assert.match(page,/"@type":"Article"/);
    assert.doesNotMatch(page,/"@type":"(?:Offer|AggregateOffer)"/);
    assert.match(page,/<caption>/);
    assert.match(page,/scope="col"/);
    assert.match(page,/target="_blank" rel="noopener noreferrer"/);
    assert.match(page,prefix?/ne constituent pas une soumission de Tiling.ca/:/not Tiling.ca quotations/);
    assert.match(page,/id="sources"/);
    assert.match(page,/id="quote-checklist"/);
  }
});
test("pricing CTA retains validated city and service context without accepting arbitrary quote context",async()=>{
  for(const prefix of ["","/fr"]){
    const page=await html(prefix+"/pricing/shower-tiling-cost?area=toronto");
    assert.ok(page.includes(prefix+"/request-a-quote?service=bathroom-shower-tile&amp;area=toronto"));
    const bad=await html(prefix+"/pricing/shower-tiling-cost?area=%3Cscript%3Ebad-city%3C%2Fscript%3E");
    const quoteLinks=[...bad.matchAll(/href="([^"]*request-a-quote[^"]*)"/g)].map(m=>m[1]);
    assert.ok(quoteLinks.length);
    assert.ok(quoteLinks.every(link=>!link.includes("bad-city")&&!link.includes("area=")));
    assert.ok(bad.includes(prefix+"/request-a-quote?service=bathroom-shower-tile"));
  }
});
test("pricing hub and sitemap expose three guides in both languages",async()=>{
  const sitemap=await html("/sitemap.xml");
  for(const prefix of ["","/fr"]){
    const page=await html(prefix+"/pricing");
    assert.equal((page.match(/<h1[ >]/g)||[]).length,1);
    for(const slug of guides){
      assert.ok(page.includes(prefix+"/pricing/"+slug));
      assert.ok(sitemap.includes("https://tiling.ca"+prefix+"/pricing/"+slug+"</loc>"));
    }
  }
});
test("unknown pricing routes remain not found",async()=>{
  for(const path of ["/pricing/no-such-guide","/fr/pricing/no-such-guide","/fr/pricing/tile-installation-cost/extra"])assert.equal((await request(path)).status,404,path);
});
test("Toronto and Mississauga have distinct planning content, localized pricing links and live quote context",async()=>{
  for(const prefix of ["","/fr"]){
    const toronto=await html(prefix+"/areas/toronto");
    const mississauga=await html(prefix+"/areas/mississauga");
    assert.match(toronto,/local-project-brief/);
    assert.match(mississauga,/local-project-brief/);
    assert.match(toronto,prefix?/Commerce occupé/:/An occupied retail space/);
    assert.match(mississauga,prefix?/Cuisine reliée à l’entrée/:/A kitchen connected to the entry/);
    assert.ok(toronto.includes(prefix+"/pricing/tile-installation-cost?area=toronto"));
    const local=await html(prefix+"/areas/mississauga/kitchen-backsplash");
    assert.ok(local.includes(prefix+"/pricing/backsplash-tiling-cost?area=mississauga"));
    assert.equal((local.match(/<form /g)||[]).length,1);
    assert.match(local,/name="city"[^>]*value="Mississauga"/);
    assert.match(local,/Port Credit/);
    assert.match(toronto,/id="community-scarborough"/);
  }
});
test("service pages replace the national city-link wall with province navigation",async()=>{
  const page=await html("/services/bathroom-shower-tile");
  const section=page.match(/<section class="service-area-links section-pad">[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  assert.equal((section.match(/<a /g)||[]).length,14);
  assert.ok(section.includes('href="/locations#ontario"'));
  assert.doesNotMatch(section,/href="\/areas\//);
});
test("community lists keep anchors without repeating fifteen service links per community",async()=>{
  for(const prefix of ["","/fr"]){
    const page=await html(prefix+"/areas/toronto");
    assert.match(page,/id="community-scarborough"/);
    assert.doesNotMatch(page,/href="\/(?:fr\/)?areas\/toronto\/[^"]+#community-scarborough"/);
    assert.ok(page.includes(prefix+"/areas/toronto/bathroom-shower-tile"));
  }
});
