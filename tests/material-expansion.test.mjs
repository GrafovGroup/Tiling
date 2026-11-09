import { formValue } from './form-values.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from '../dist/server/index.js';
const guides=JSON.parse(readFileSync(new URL('../app/material-guides.json',import.meta.url),'utf8'));
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
async function html(path){const response=await worker.fetch(new Request('https://tiling.ca'+path,{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,{waitUntil(){},passThroughOnException(){}});assert.equal(response.status,200,path);return response.text();}
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'");
const links=page=>[...page.matchAll(/href="([^"]+)"/g)].map(m=>decode(m[1]));
const jsonld=page=>[...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
const field=formValue;
function section(page,name){const result=page.match(new RegExp('<section class="'+name+' section-pad"[\\s\\S]*?<\\/section>'))?.[0];assert.ok(result,name);return result;}

test('all five material guides have distinct bilingual metadata, accessible sections and editorial schema',async()=>{
 assert.equal(guides.length,5);
 for(const prefix of ['','/fr']){
  const titles=new Set(),descriptions=new Set();
  for(const guide of guides){
   const path=prefix+'/materials/'+guide.slug,page=await html(path+'?area=toronto'),head=page.split('</head>')[0];
   assert.equal((page.match(/<h1[ >]/g)||[]).length,1,path);
   titles.add(head.match(/<title>(.*?)<\/title>/)[1]);descriptions.add(head.match(/<meta name="description" content="([^"]+)"/)[1]);
   assert.ok(head.includes(`rel="canonical" href="https://tiling.ca${path}"`));
   for(const alternate of ['','/fr'])assert.ok(head.includes(`href="https://tiling.ca${alternate}/materials/${guide.slug}"`));
   const article=jsonld(page).filter(item=>item['@type']==='Article');assert.equal(article.length,1,path);assert.equal(article[0].url,'https://tiling.ca'+path);assert.equal(article[0].dateModified,'2026-11-08');
   assert.doesNotMatch(page,/"@type":"(?:Product|Offer|AggregateOffer|AggregateRating)"/);
   for(const anchor of ['material-selection','material-applications','material-care','material-pricing','material-quote','material-faq']){assert.ok(page.includes('id="'+anchor+'"'));assert.ok(page.includes('href="#'+anchor+'"'));}
   for(const source of guide.references){assert.ok(source.url.startsWith('https://'));assert.ok(decode(page).includes(source.url));assert.ok(article[0].citation.includes(source.url));}
  }
  assert.equal(titles.size,5);assert.equal(descriptions.size,5);
 }
});

test('material FAQs are visible and exactly match the structured answers in each language',async()=>{
 for(const prefix of ['','/fr'])for(const guide of guides){
  const page=await html(prefix+'/materials/'+guide.slug),faqs=jsonld(page).filter(item=>item['@type']==='FAQPage');assert.equal(faqs.length,1);assert.equal(faqs[0].mainEntity.length,4);
  const visible=decode(page);for(const q of faqs[0].mainEntity){assert.ok(visible.includes(q.name));assert.ok(visible.includes(q.acceptedAnswer.text));}
  const form=page.match(/<form[\s\S]*?<\/form>/)[0];assert.equal((page.match(/<form[ >]/g)||[]).length,1);assert.ok(field(form,'material'));assert.ok(field(form,'service'));assert.ok(form.includes('action="https://formspree.io/f/xdeownaz"'));
 }
});

test('material service and pricing links resolve and preserve the chosen material and city',async()=>{
 for(const prefix of ['','/fr'])for(const guide of guides){
  const page=await html(`${prefix}/materials/${guide.slug}?area=toronto`);
  for(const href of links(section(page,'material-related'))){
   const url=new URL(href,'https://tiling.ca');assert.ok(url.pathname.startsWith(prefix+'/services/'));assert.equal(url.searchParams.get('material'),guide.slug);assert.equal(url.searchParams.get('area'),'toronto');
   const destination=await html(href);assert.ok(field(destination,'material'));assert.equal(field(destination,'city'),'Toronto');
  }
  const pricing=section(page,'material-pricing');assert.match(pricing,prefix?/ne constituent ni un tarif/:/do not establish a price for this specific material/);
  for(const href of links(pricing)){
   const url=new URL(href,'https://tiling.ca');assert.ok(url.pathname.startsWith(prefix+'/pricing/'));assert.equal(url.searchParams.get('material'),guide.slug);assert.equal(url.searchParams.get('area'),'toronto');
   const destination=await html(href);assert.ok(destination.includes('material-price-context'));
   const quote=links(destination).find(link=>link.startsWith(prefix+'/request-a-quote?'));assert.ok(quote);const quoteURL=new URL(quote,'https://tiling.ca');assert.equal(quoteURL.searchParams.get('material'),guide.slug);assert.equal(quoteURL.searchParams.get('area'),'toronto');
   const form=await html(quote);assert.ok(field(form,'material'));assert.equal(field(form,'city'),'Toronto');
  }
 }
});

test('service to material to quote keeps the original project service while material comparisons change the selection',async()=>{
 for(const prefix of ['','/fr']){
  const service=await html(prefix+'/services/bathroom-shower-tile?area=toronto');
  const href=links(service).find(link=>link.startsWith(prefix+'/materials/marble-tile?'));assert.ok(href);
  const url=new URL(href,'https://tiling.ca');assert.equal(url.searchParams.get('service'),'bathroom-shower-tile');assert.equal(url.searchParams.get('area'),'toronto');
  const material=await html(href);assert.equal(field(material,'service'),field(service,'service'));assert.equal(field(material,'city'),'Toronto');
  const quote=links(material).find(link=>link.startsWith(prefix+'/request-a-quote?')&&link.includes('service=bathroom-shower-tile'));assert.ok(quote);
  const request=await html(quote);assert.equal(field(request,'service'),field(service,'service'));assert.equal(field(request,'material'),field(material,'material'));assert.equal(field(request,'city'),'Toronto');
  const comparisons=links(section(material,'material-comparisons')).filter(link=>new URL(link,'https://tiling.ca').pathname!==prefix+'/materials');
  assert.equal(comparisons.length,2);
  for(const link of comparisons){const other=await html(link);assert.notEqual(field(other,'material'),field(material,'material'));assert.equal(field(other,'service'),field(material,'service'));assert.equal(field(other,'city'),'Toronto');}
 }
});

test('unknown material and repeated query values do not become quote fields or editorial price context',async()=>{
 for(const prefix of ['','/fr']){
  for(const suffix of ['?material=unknown-material','?material=marble-tile&material=granite-tile']){
   const page=await html(prefix+'/request-a-quote'+suffix);assert.equal(field(page,'material'),'');
  }
  const invalid=await html(prefix+'/materials/marble-tile?service=unknown-service&area=unknown-city');assert.equal(field(invalid,'city'),'');assert.ok(field(invalid,'service'));assert.notEqual(field(invalid,'service'),'unknown-service');
  const service=await html(prefix+'/services/floor-tile-installation?material=unknown-material');assert.equal(field(service,'material'),'');
  const price=await html(prefix+'/pricing/tile-installation-cost?material=unknown-material');assert.ok(!price.includes('material-price-context'));
 }
});

test('material comparison hubs and sitemap expose all guides with current bilingual dates',async()=>{
 const sitemap=await html('/sitemap.xml');
 for(const prefix of ['','/fr']){
  const page=await html(prefix+'/materials');assert.equal((page.match(/<h1[ >]/g)||[]).length,1);assert.match(page,/<caption>/);assert.match(page,/scope="col"/);assert.match(page,/scope="row"/);
  assert.ok(page.includes(prefix?"la famille des céramiques":"the ceramic family"));assert.ok(page.includes(prefix?"pierres naturelles":"natural stones"));
  for(const guide of guides){const path=prefix+'/materials/'+guide.slug;assert.ok(page.includes('href="'+path+'"'));const entry=sitemap.match(new RegExp('<url>\\s*<loc>https://tiling.ca'+path+'<\\/loc>[\\s\\S]*?<\\/url>'))?.[0];assert.ok(entry,path);assert.ok(entry.includes('<lastmod>2026-11-08</lastmod>'));}
 }
});
