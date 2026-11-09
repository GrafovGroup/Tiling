import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker from '../dist/server/index.js';
const {mergedRegions}=JSON.parse(readFileSync(new URL('../app/region-publication.json',import.meta.url)));
const municipalities=JSON.parse(readFileSync(new URL('../app/ontario-coverage.json',import.meta.url)));
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},ctx={waitUntil(){},passThroughOnException(){}};
const request=(url,headers={})=>worker.fetch(new Request(new URL(url,'https://tiling.ca'),{headers:{accept:'text/html',...headers}}),env,ctx);
const query='?area=toronto&service=commercial-tile&material=porcelain-tile&tag=one&tag=two&utm_source=url-check';

test('reviewed one-municipality regions redirect once to matching language hubs without losing project context',async()=>{
 const xml=await (await request('/sitemap.xml')).text();assert.equal(Object.keys(mergedRegions).length,7);
 for(const [region,area] of Object.entries(mergedRegions)){
  assert.deepEqual(municipalities.filter(m=>m.regionSlug===region).map(m=>m.slug),[area]);
  for(const prefix of ['','/fr']){
   const old=`${prefix}/locations/ontario/${region}`,target=`${prefix}/areas/${area}`;
   assert.ok(!xml.includes(`https://tiling.ca${old}</loc>`));assert.ok(xml.includes(`https://tiling.ca${target}</loc>`));
   const response=await request(old+query);assert.equal(response.status,308);assert.equal(response.headers.get('location'),target+query);
   const html=await (await request(target+query)).text();assert.ok(html.includes(`rel="canonical" href="https://tiling.ca${target}"`));
   for(const c of municipalities.find(m=>m.slug===area).communities)assert.ok(html.includes(`id="community-${c.id}"`),`${target} ${c.id}`);
   assert.ok(html.includes('id="local-quote"'));assert.ok(html.includes('name="attachment"'));assert.ok(html.includes('/pricing/'));
   const variant=`http://www.tiling.ca${old.toUpperCase().replaceAll('/','//')}/`+query;
   const alias=await request(variant);assert.equal(alias.status,308);assert.equal(alias.headers.get('location'),'https://tiling.ca'+target+query);
  }
 }
 for(const prefix of ['','/fr']){
  const html=await (await request(prefix+'/locations/ontario')).text();
  for(const [region,area] of Object.entries(mergedRegions)){
   assert.ok(html.includes(`href="${prefix}/areas/${area}"`));assert.ok(!html.includes(`href="${prefix}/locations/ontario/${region}"`));
  }
  assert.equal((await request(prefix+'/locations/ontario/ottawa')).status,200);
 }
});

test('host, slash, case, unreserved encoding and retired-route aliases resolve in one permanent hop',async()=>{
 const cases=[['//ABOUT//','/about'],['/%61bout/','/about'],['/FR//ABOUT/','/fr/about'],['/areas/Toronto/','/areas/toronto'],['/FR//AREAS/%74ORONTO//','/fr/areas/toronto'],['/SERVICES/COMMERCIAL-TILE/','/services/commercial-tile'],['/MATERIALS/PORCELAIN-TILE/','/materials/porcelain-tile'],['/PRICING/TILE-INSTALLATION-COST/','/pricing/tile-installation-cost'],['/FR//REQUEST-A-MATCH/','/fr/request-a-quote'],['/LOCATIONS/ONTARIO/YORK/','/locations/ontario/york']];
 for(const origin of ['https://tiling.ca','http://www.tiling.ca'])for(const [input,target] of cases){
  const response=await request(origin+input+query);assert.equal(response.status,308,origin+input);
  const destination=new URL(response.headers.get('location'),origin+input);assert.equal(destination.href,'https://tiling.ca'+target+query);
  const final=await request(destination);assert.equal(final.status,200);assert.equal(final.headers.get('location'),null);
 }
 const retired=await request('http://www.tiling.ca/FR//AREAS/%74ORONTO/COMMERCIAL-TILE/?service=unknown&tag=one&tag=two');
 assert.equal(retired.status,308);assert.equal(retired.headers.get('location'),'https://tiling.ca/fr/areas/toronto?service=commercial-tile&tag=one&tag=two#service-commercial-tile');
 const encodedQuery=await request('/ABOUT/?q=Toronto%20condo&tag=A%2FB&tag=C%2BD');assert.equal(encodedQuery.headers.get('location'),'/about?q=Toronto%20condo&tag=A%2FB&tag=C%2BD');
});

test('reserved encodings, unknown routes and assets are not treated as public page aliases',async()=>{
 for(const path of ['/ABOUT%2F','/areas%2ftoronto','/areas%5ctoronto','/areas/toronto/extra-service','/LOCATIONS/ONTARIO/TORONTO/EXTRA','/UNKNOWN-PAGE','/FR/UNKNOWN-PAGE','/services/__proto__','/index.html','/MEDIA/IMAGE.WEBP']){
  const response=await request(path);assert.equal(response.status,404,path);assert.equal(response.headers.get('location'),null,path);
 }
 assert.equal((await request('/api/quotes')).status,410);
});

test('React navigation payloads are noindex without blocking HTML or breaking the payload',async()=>{
 for(const path of ['/areas/toronto','/fr/about','/request-a-quote']){
  const response=await request(path+'.rsc');assert.equal(response.status,200,path);assert.match(response.headers.get('content-type'),/^text\/x-component/i);assert.equal(response.headers.get('x-robots-tag'),'noindex');assert.ok((await response.text()).length>100);
  const html=await request(path);assert.equal(html.status,200);assert.match(html.headers.get('content-type'),/^text\/html/i);assert.equal(html.headers.get('x-robots-tag'),null);assert.doesNotMatch((await html.text()).split('</head>')[0],/name="robots" content="[^"]*noindex/);
 }
});
