import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../dist/server/index.js';
import fs from 'node:fs';
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},ctx={waitUntil(){},passThroughOnException(){}};
const cache=new Map();
async function html(path){if(cache.has(path))return cache.get(path);const response=await worker.fetch(new Request('https://tiling.ca'+path,{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,ctx);assert.equal(response.status,200,path);const body=await response.text();cache.set(path,body);return body;}
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'");
const main=s=>s.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
const schemas=s=>[...s.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map(m=>JSON.parse(m[1]));

test('contact and quote pages have one concise, localized enquiry form and accurate metadata',async()=>{
 const titles=new Set(),descriptions=new Set();
 for(const prefix of ['','/fr'])for(const slug of ['contact','request-a-quote']){
  const path=prefix+'/'+slug,page=await html(path),body=main(page),head=page.split('</head>')[0],all=schemas(page);
  assert.equal((body.match(/<h1[ >]/g)||[]).length,1,path);
  titles.add(head.match(/<title>(.*?)<\/title>/)[1]);descriptions.add(head.match(/<meta name="description" content="([^"]+)"/)[1]);
  assert.ok(head.includes('rel="canonical" href="https://tiling.ca'+path+'"'));
  for(const lang of ['','/fr'])assert.ok(head.includes('href="https://tiling.ca'+lang+'/'+slug+'"'));
  const entity=all.filter(item=>item['@type']===(slug==='contact'?'ContactPage':'WebPage'));assert.equal(entity.length,1);assert.equal(entity[0].inLanguage,prefix?'fr-CA':'en-CA');assert.equal(entity[0].dateModified,'2026-11-08');assert.equal(entity[0].url,'https://tiling.ca'+path);
  assert.equal(all.filter(item=>item['@type']==='BreadcrumbList').length,1);
  const forms=[...body.matchAll(/<form[\s\S]*?<\/form>/g)];assert.equal(forms.length,1);const form=forms[0][0];
  assert.ok(form.includes('action="https://formspree.io/f/xdeownaz"'));assert.ok(form.includes('name="language" value="'+(prefix?'fr-CA':'en-CA')+'"'));
  const fields=[...form.matchAll(/<(?:input|textarea)[^>]*>/g)].map(m=>m[0]);
  assert.deepEqual(fields.filter(s=>/\brequired(?:=|\s|>)/.test(s)).map(s=>s.match(/name="([^"]+)"/)[1]),['name','email','city']);
  assert.ok(!form.includes('type="file"'));assert.ok(!form.match(/name="(?:service|timing|budget|consent)"/));
  assert.ok(body.includes('href="tel:+18335738453"'));assert.ok(body.includes('href="mailto:info@tiling.ca"'));
  assert.ok(form.includes(prefix?'Les détails utiles pour votre projet':'Helpful details for your project'));
  assert.ok(form.includes(prefix?'avec le même nom et la même ville':'with the same name and city'));
  const faq=all.filter(item=>item['@type']==='FAQPage');assert.equal(faq.length,1);assert.equal(faq[0].mainEntity.length,3);
  for(const q of faq[0].mainEntity){assert.ok(decode(body).includes(q.name));assert.ok(decode(body).includes(q.acceptedAnswer.text));}
 }
 assert.equal(titles.size,4);assert.equal(descriptions.size,4);
});

test('validated project context survives contact/quote navigation and resource links',async()=>{
 for(const prefix of ['','/fr'])for(const slug of ['contact','request-a-quote']){
  const path=prefix+'/'+slug+'?area=oshawa&service=kitchen-backsplash&material=porcelain-tile',body=main(await html(path));
  assert.match(body,/name="city"[^>]*value="Oshawa"/);assert.match(body,/name="service" value="[^"]+"/);assert.match(body,/name="material" value="[^"]+"/);
  const other=slug==='contact'?'request-a-quote':'contact';assert.ok(decode(body).includes('href="'+prefix+'/'+other+'?area=oshawa&service=kitchen-backsplash&material=porcelain-tile"'));
  const links=new Set([...body.matchAll(/href="([^"]+)"/g)].map(m=>decode(m[1])));
  for(const href of links){
   if(!href.startsWith('/')&&!href.startsWith('#'))continue;
   const url=new URL(href,'https://tiling.ca'+path);if(prefix)assert.ok(url.pathname==='/fr'||url.pathname.startsWith('/fr/'));
   const target=await html(url.pathname+url.search);if(url.hash)assert.ok(target.includes('id="'+url.hash.slice(1)+'"'));
  }
  assert.ok([...links].some(s=>s.startsWith(prefix+'/pricing/')&&s.includes('service=kitchen-backsplash')));
 }
});

test('invalid and repeated query values cannot inject enquiry fields or navigation context',async()=>{
 for(const prefix of ['','/fr'])for(const slug of ['contact','request-a-quote']){
  for(const query of ['?area=unknown&service=unknown&material=unknown','?area=oshawa&area=toronto&service=kitchen-backsplash&service=commercial-tile&material=porcelain-tile&material=marble-tile']){
   const body=main(await html(prefix+'/'+slug+query));assert.match(body,/name="city"[^>]*value=""/);assert.doesNotMatch(body,/name="(?:service|material)"/);assert.doesNotMatch(body,/href="[^\"]*unknown/);
  }
  const supply=main(await html(prefix+'/'+slug+'?material=porcelain-tile'));assert.match(supply,/name="service" value="[^"]+"/);assert.ok(supply.includes(prefix?'quantité et besoins de livraison':'quantity and delivery needs'));
 }
});

test('every service provides tailored guidance and a relevant pricing link in both languages',async()=>{
 const services=JSON.parse(fs.readFileSync(new URL('../app/service-guides.json',import.meta.url),'utf8'));
 for(const prefix of ['','/fr'])for(const service of services){
  const body=decode(main(await html(prefix+'/request-a-quote?service='+service.slug)));
  assert.ok(body.includes(service.quoteChecklist[0][prefix?'fr':'en']),service.slug);
  assert.match(body,new RegExp('href="'+prefix+'/pricing/[^\"]+service='+service.slug));
 }
});

test('contact and quote sitemap dates match the bilingual update',async()=>{
 const xml=await html('/sitemap.xml');for(const prefix of ['','/fr'])for(const slug of ['contact','request-a-quote']){
  const entry=[...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(item=>item[1].includes('<loc>https://tiling.ca'+prefix+'/'+slug+'</loc>'))?.[1];assert.ok(entry?.includes('<lastmod>2026-11-08</lastmod>'));
 }
});
