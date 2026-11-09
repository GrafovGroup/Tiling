import { formValue } from './form-values.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../dist/server/index.js';
const publication=JSON.parse(await readFile(new URL('../app/local-service-publication.json',import.meta.url)));
const serviceNames=JSON.parse(await readFile(new URL('../app/quote-services.json',import.meta.url)));
const env={ASSETS:{fetch:async()=>new Response('',{status:404})}},ctx={waitUntil(){},passThroughOnException(){}};
const request=url=>worker.fetch(new Request(new URL(url,'https://tiling.ca'),{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,ctx);
const html=async path=>{const r=await request(path);assert.equal(r.status,200,path);return r.text();};
const consolidated=Object.entries(publication.mergedServices);

test('all 802 retired URLs redirect once to matching language, city, service section and selected form',async()=>{
 let count=0;
 for(const prefix of ['', '/fr']) for(const [area,services] of consolidated){
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
   const destination=await html(target.pathname+target.search);
   const expectedService=serviceNames.find(item=>item.slug===service)[prefix ? 'fr' : 'en'];
   assert.equal(formValue(destination,'service'),expectedService,old);
   count++;
  }
  const service=services[0];
  const selected=await html(`${prefix}/areas/${area}?service=${service}`);
  const head=selected.split('</head>')[0];
  assert.ok(head.includes(`rel="canonical" href="https://tiling.ca${prefix}/areas/${area}"`));
  assert.ok(head.includes(`href="https://tiling.ca/areas/${area}"`));
  assert.ok(head.includes(`href="https://tiling.ca/fr/areas/${area}"`));
  assert.ok(formValue(selected,'service'));
  assert.match(selected,/<input[^>]*name="city"[^>]*value="[^"]+"/);
  assert.equal((selected.match(/<form /g)||[]).length,1);
  assert.doesNotMatch(selected, /class="location-service-card-photo"/);
 }
 assert.equal(count,802);
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

test('core intents and retained local service pages remain live in both languages',async()=>{
 const protectedPairs={
  kincardine:['tile-grout-stone-cleaning-sealing','tile-repair-regrouting','tile-stairs-steps'],
  'saugeen-shores':['tile-grout-stone-cleaning-sealing','tile-repair-regrouting','tile-stairs-steps'],
  'south-bruce-peninsula':['tile-removal-surface-preparation','pool-spa-tiling'],
  'northern-bruce-peninsula':['large-format-tile'],
  brockton:['tile-grout-stone-cleaning-sealing'],
  'south-bruce':['tile-removal-surface-preparation','tile-stairs-steps'],
  'huron-kinloss':['tile-grout-stone-cleaning-sealing'],
  bluewater:['rooftop-terrace-pedestal-pavers'],
  'central-huron':['pool-spa-tiling'],
  goderich:['tile-removal-surface-preparation'],
  'huron-east':['tile-grout-stone-cleaning-sealing','tile-removal-surface-preparation'],
  'north-huron':['large-format-tile','tile-repair-regrouting'],
  'south-huron':['tile-grout-stone-cleaning-sealing','tile-stairs-steps','tile-supply-delivery'],

  "centre-wellington":["heated-tile-floors", "large-format-tile", "tile-supply-delivery"],
  "chatsworth":["tile-grout-stone-cleaning-sealing"],
  "erin":["pool-spa-tiling", "tile-grout-stone-cleaning-sealing", "tile-removal-surface-preparation", "tile-repair-regrouting"],
  "georgian-bluffs":["tile-grout-stone-cleaning-sealing"],
  "grey-highlands":["large-format-tile", "tile-grout-stone-cleaning-sealing", "tile-stairs-steps"],
  "guelph":["fireplace-feature-wall-tiling", "heated-tile-floors", "outdoor-balcony-tiling", "tile-grout-stone-cleaning-sealing", "tile-removal-surface-preparation", "tile-repair-regrouting", "tile-supply-delivery"],
  "guelph-eramosa":["large-format-tile"],
  "hanover":["commercial-tile", "pool-spa-tiling", "rooftop-terrace-pedestal-pavers", "tile-grout-stone-cleaning-sealing"],
  "mapleton":["rooftop-terrace-pedestal-pavers", "tile-stairs-steps"],
  "meaford":["commercial-tile", "pool-spa-tiling", "tile-grout-stone-cleaning-sealing"],
  "minto":["tile-stairs-steps"],
  "north-perth":["outdoor-balcony-tiling", "rooftop-terrace-pedestal-pavers", "tile-grout-stone-cleaning-sealing", "tile-repair-regrouting", "tile-supply-delivery"],
  "owen-sound":["tile-grout-stone-cleaning-sealing"],
  "perth-east":["rooftop-terrace-pedestal-pavers", "tile-grout-stone-cleaning-sealing", "tile-removal-surface-preparation", "tile-repair-regrouting", "tile-stairs-steps"],
  "perth-south":["rooftop-terrace-pedestal-pavers", "tile-grout-stone-cleaning-sealing", "tile-repair-regrouting"],
  "puslinch":["pool-spa-tiling", "rooftop-terrace-pedestal-pavers", "tile-repair-regrouting"],
  "southgate":["tile-grout-stone-cleaning-sealing"],
  "st-marys":["tile-stairs-steps"],
  "stratford":["tile-grout-stone-cleaning-sealing"],
  "the-blue-mountains":["tile-repair-regrouting"],
  "wellington-north":["fireplace-feature-wall-tiling", "tile-supply-delivery"],
  "west-grey":["tile-stairs-steps"],
  "west-perth":["pool-spa-tiling", "tile-grout-stone-cleaning-sealing"]
 };
 for(const prefix of ['', '/fr'])for(const [area] of consolidated)for(const service of ['bathroom-shower-tile','floor-tile-installation','kitchen-backsplash',...(protectedPairs[area]||[])]){
  const path=`${prefix}/areas/${area}/${service}`,page=await html(path);
  assert.ok(page.split('</head>')[0].includes(`rel="canonical" href="https://tiling.ca${path}"`));
  assert.match(page,/<form /);
 }
});

test('sitemap excludes merged URLs and preserves reciprocal language coverage without losing hubs or guides',async()=>{
 const xml=await html('/sitemap.xml');
 const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]),set=new Set(urls);
 assert.equal(urls.length,14816);assert.equal(set.size,urls.length);
 for(const url of urls.filter(u=>!new URL(u).pathname.startsWith('/fr'))){assert.ok(set.has('https://tiling.ca/fr'+url.slice('https://tiling.ca'.length)),url);}
 for(const prefix of ['', '/fr'])for(const [area,services] of consolidated){
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

test('Huron rollout retains its exact 196-URL scope',async()=>{
 const expected={'ashfield-colborne-wawanosh':12,bluewater:11,'central-huron':11,goderich:11,howick:12,'huron-east':10,'morris-turnberry':12,'north-huron':10,'south-huron':9};
 let count=0;
 for(const [area,number] of Object.entries(expected)){
  assert.equal(publication.mergedServices[area].length,number,area);
  count+=number*2;
 }
 assert.equal(count,196);
 for(const prefix of ['', '/fr']){
  for(const path of ['/services/pool-spa-tiling?area=goderich','/pricing/pool-spa-tiling-cost?area=goderich&service=pool-spa-tiling']){
   const page=await html(prefix+path);
   assert.ok(page.includes(`href="${prefix}/areas/goderich#service-pool-spa-tiling"`));
   assert.ok(!page.includes(`href="${prefix}/areas/goderich/pool-spa-tiling"`));
  }
 }
});

test('remaining regional rollout retires 440 URLs and preserves the Wellington North supply exception',async()=>{
 const regions={
  Grey:{urls:184,areas:['chatsworth','georgian-bluffs','grey-highlands','hanover','meaford','owen-sound','southgate','the-blue-mountains','west-grey']},
  Perth:{urls:110,areas:['north-perth','perth-east','perth-south','st-marys','stratford','west-perth']},
  Wellington:{urls:146,areas:['centre-wellington','erin','guelph','guelph-eramosa','mapleton','minto','puslinch','wellington-north']}
 };
 for(const {urls,areas} of Object.values(regions)){
  assert.equal(areas.reduce((sum,area)=>sum+publication.mergedServices[area].length*2,0),urls);
 }
 assert.equal(Object.keys(publication.mergedServices).length,40);
 for(const area of ['toronto','mississauga','king'])assert.equal(publication.mergedServices[area],undefined);
 for(const prefix of ['', '/fr']){
  const retained=`${prefix}/areas/wellington-north/tile-supply-delivery`;
  assert.equal((await request(retained)).status,200);
  for(const path of ['/services/tile-supply-delivery?area=wellington-north','/pricing/tile-supply-delivery-cost?area=wellington-north&service=tile-supply-delivery']){
   assert.ok((await html(prefix+path)).includes(`href="${retained}"`));
  }
  for(const area of ['owen-sound','stratford','guelph']){
   for(const path of [`/services/pool-spa-tiling?area=${area}`,`/pricing/pool-spa-tiling-cost?area=${area}&service=pool-spa-tiling`]){
    const page=await html(prefix+path);
    assert.ok(page.includes(`href="${prefix}/areas/${area}#service-pool-spa-tiling"`));
    assert.ok(!page.includes(`href="${prefix}/areas/${area}/pool-spa-tiling"`));
   }
  }
 }
});
