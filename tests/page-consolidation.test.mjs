import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../dist/server/index.js';
const publication=JSON.parse(await readFile(new URL('../app/local-service-publication.json',import.meta.url)));
const env={ASSETS:{fetch:async()=>new Response('',{status:404})}},ctx={waitUntil(){},passThroughOnException(){}};
const request=url=>worker.fetch(new Request(new URL(url,'https://tiling.ca'),{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,ctx);
const html=async path=>{const r=await request(path);assert.equal(r.status,200,path);return r.text();};
const pilot=Object.entries(publication.mergedServices);

test('all 166 retired URLs redirect once to matching language, city, service section and selected form',async()=>{
 let count=0;
 for(const prefix of ['', '/fr']) for(const [area,services] of pilot){
  const hub=await html(`${prefix}/areas/${area}`);
  for(const service of services){
   const old=`${prefix}/areas/${area}/${service}`;
   const r=await request(old+'?material=porcelain-tile&tag=one&tag=two');
   assert.equal(r.status,308,old);
   const target=new URL(r.headers.get('location'),'https://tiling.ca');
   assert.equal(target.pathname,`${prefix}/areas/${area}`);
   assert.equal(target.hash,`#service-${service}`);
   assert.equal(target.searchParams.get('service'),service);
   assert.deepEqual(target.searchParams.getAll('tag'),['one','two']);
   assert.equal(target.searchParams.get('material'),'porcelain-tile');
   assert.ok(hub.includes(`id="service-${service}"`),old);
   assert.ok(hub.includes(`${prefix}/request-a-quote?area=${area}&amp;service=${service}`),old);
   assert.ok(hub.includes(`${prefix}/services/${service}?area=${area}`),old);
   assert.ok(!hub.includes(`href="${old}"`),old);
   count++;
  }
  const service=services[0];
  const selected=await html(`${prefix}/areas/${area}?service=${service}`);
  const head=selected.split('</head>')[0];
  assert.ok(head.includes(`rel="canonical" href="https://tiling.ca${prefix}/areas/${area}"`));
  assert.ok(head.includes(`href="https://tiling.ca/areas/${area}"`));
  assert.ok(head.includes(`href="https://tiling.ca/fr/areas/${area}"`));
  assert.match(selected,/<input[^>]*name="service"[^>]*value="[^"]+"/);
  assert.match(selected,/<input[^>]*name="city"[^>]*value="[^"]+"/);
  assert.equal((selected.match(/<form /g)||[]).length,1);
  assert.doesNotMatch(selected, /class="location-service-card-photo"/);
 }
 assert.equal(count,166);
});

test('host normalization combines with consolidation and invalid URLs remain 404',async()=>{
 for(const prefix of ['', '/fr'])for(const origin of ['http://tiling.ca','https://www.tiling.ca','http://www.tiling.ca']){
  const r=await request(`${origin}${prefix}/areas/arran-elderslie/pool-spa-tiling?service=unknown&tag=one`);
  assert.equal(r.status,308);
  const target=new URL(r.headers.get('location'));
  assert.equal(target.origin,'https://tiling.ca');
  assert.equal(target.pathname,`${prefix}/areas/arran-elderslie`);
  assert.equal(target.hash,'#service-pool-spa-tiling');
  assert.equal(target.searchParams.get('service'),'pool-spa-tiling');
  assert.equal((await request(target)).status,200);
 }
 for(const path of ['/areas/arran-elderslie/unknown','/fr/areas/unknown/pool-spa-tiling','/areas/arran-elderslie/pool-spa-tiling/extra']) assert.equal((await request(path)).status,404,path);
 for(const prefix of ['', '/fr'])assert.doesNotMatch(await html(`${prefix}/areas/arran-elderslie?service=unknown`),/<input[^>]*name="service"/);
});

test('core intents and all pilot city/service pairs with reported search activity remain live in both languages',async()=>{
 const protectedPairs={
  kincardine:['tile-grout-stone-cleaning-sealing','tile-repair-regrouting','tile-stairs-steps'],
  'saugeen-shores':['tile-grout-stone-cleaning-sealing','tile-repair-regrouting','tile-stairs-steps'],
  'south-bruce-peninsula':['tile-removal-surface-preparation','pool-spa-tiling'],
  'northern-bruce-peninsula':['large-format-tile'],
  brockton:['tile-grout-stone-cleaning-sealing'],
  'south-bruce':['tile-removal-surface-preparation','tile-stairs-steps'],
  'huron-kinloss':['tile-grout-stone-cleaning-sealing']
 };
 for(const prefix of ['', '/fr'])for(const [area] of pilot)for(const service of ['bathroom-shower-tile','floor-tile-installation','kitchen-backsplash',...(protectedPairs[area]||[])]){
  const path=`${prefix}/areas/${area}/${service}`,page=await html(path);
  assert.ok(page.split('</head>')[0].includes(`rel="canonical" href="https://tiling.ca${path}"`));
  assert.match(page,/<form /);
 }
});

test('sitemap excludes merged URLs and preserves reciprocal language coverage without losing hubs or guides',async()=>{
 const xml=await html('/sitemap.xml');
 const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]),set=new Set(urls);
 assert.equal(urls.length,15452);assert.equal(set.size,urls.length);
 for(const url of urls.filter(u=>!new URL(u).pathname.startsWith('/fr'))){assert.ok(set.has('https://tiling.ca/fr'+url.slice('https://tiling.ca'.length)),url);}
 for(const prefix of ['', '/fr'])for(const [area,services] of pilot){
  assert.ok(set.has(`https://tiling.ca${prefix}/areas/${area}`));
  for(const service of services)assert.ok(!set.has(`https://tiling.ca${prefix}/areas/${area}/${service}`));
 }
 assert.equal(urls.filter(u=>/^\/(fr\/)?pricing\//.test(new URL(u).pathname)).length,30);
});

test('service and pricing backlinks reach the final local section with project context',async()=>{
 for(const prefix of ['', '/fr']){
  for(const path of ['/services/pool-spa-tiling?area=arran-elderslie','/pricing/pool-spa-tiling-cost?area=arran-elderslie&service=pool-spa-tiling']){
   const page=await html(prefix+path);
   assert.ok(page.includes(`href="${prefix}/areas/arran-elderslie#service-pool-spa-tiling"`),path);
   assert.ok(!page.includes(`href="${prefix}/areas/arran-elderslie/pool-spa-tiling"`),path);
  }
 }
});
