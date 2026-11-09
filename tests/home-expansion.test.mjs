import { formValue } from './form-values.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../dist/server/index.js';
const ctx={waitUntil(){},passThroughOnException(){}};
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
async function html(path){const response=await worker.fetch(new Request('https://tiling.ca'+path,{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,ctx);assert.equal(response.status,200,path);return response.text();}
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'");
const main=s=>s.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
const schemas=s=>[...s.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].flatMap(m=>{const item=JSON.parse(m[1]);return item['@graph']||[item];});

test('both homepages connect all services, materials, pricing and local pages in the main content',async()=>{
 for(const prefix of ['','/fr']){
  const page=await html(prefix||'/'),body=main(page);
  assert.equal((body.match(/<h1[ >]/g)||[]).length,1);
  const serviceLinks=[...body.matchAll(/href="([^"?]*\/services\/[^"?]+)(?:\?[^\"]*)?"/g)].map(m=>m[1]);assert.equal(new Set(serviceLinks).size,15);
  const materialLinks=[...body.matchAll(/href="([^"?]*\/materials\/[^"?]+)(?:\?[^\"]*)?"/g)].map(m=>m[1]);assert.equal(new Set(materialLinks).size,5);
  for(const path of ['/services','/materials','/locations','/pricing'])assert.ok(body.includes('href="'+prefix+path+'"'),prefix+path);
  for(const path of ['/pricing/tile-installation-cost','/pricing/shower-tiling-cost','/pricing/backsplash-tiling-cost','/areas/toronto','/areas/montreal','/areas/vancouver','/locations/ontario'])assert.ok(body.includes('href="'+prefix+path+'"'),prefix+path);
  assert.equal((body.match(/<form /g)||[]).length,1);assert.ok(body.includes('action="https://formspree.io/f/xdeownaz"'));
  assert.ok(body.indexOf('class="home-start"')<body.indexOf('id="home-services"'));
  assert.match(body,/<details class="home-specialist-services"><summary>/);
 }
});

test('every crawlable homepage destination resolves and French destinations stay in French',async()=>{
 for(const prefix of ['','/fr']){
  const body=main(await html(prefix||'/'));
  const links=new Set([...body.matchAll(/href="(\/[^\"]*)"/g)].map(m=>decode(m[1]).split('#')[0]));
  for(const link of links){if(prefix)assert.ok(link==='/fr'||link.startsWith('/fr/'),link);await html(link);}
 }
});

test('homepage FAQs match visible answers and metadata identifies the bilingual homepages',async()=>{
 for(const prefix of ['','/fr']){
  const page=await html((prefix||'/')+'?q=Toronto'),body=decode(main(page)),all=schemas(page),faq=all.filter(s=>s['@type']==='FAQPage');
  assert.equal(faq.length,1);assert.equal(faq[0].mainEntity.length,6);
  for(const question of faq[0].mainEntity){assert.ok(body.includes(question.name));assert.ok(body.includes(question.acceptedAnswer.text));}
  assert.equal(all.filter(s=>s['@type']==='Organization').length,1);assert.equal(all.filter(s=>s['@type']==='WebSite').length,1);assert.equal(all.filter(s=>s['@type']==='WebPage').length,1);
  assert.ok(!all.some(s=>['Product','Offer','AggregateRating','Review'].includes(s['@type'])));
  assert.ok(page.includes('rel="canonical" href="https://tiling.ca'+prefix+'"'));
  assert.ok(page.includes('hrefLang="fr-CA"')||page.includes('hreflang="fr-CA"'));
  for(const field of ['og:title','twitter:title'])assert.ok(page.includes('="'+field+'"'));
  assert.ok(body.includes(prefix?'ni des tarifs ou soumissions de Tiling.ca':'not national averages or Tiling.ca rates or quotes'));
 }
 const xml=await html('/sitemap.xml');for(const prefix of ['','/fr'])assert.ok([...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(item=>item[1].includes('<loc>https://tiling.ca'+prefix+'</loc>'))?.[1].includes('<lastmod>2026-11-08</lastmod>'));
});

test('directory searches received from the homepage are localized, bounded and canonical',async()=>{
 for(const prefix of ['','/fr']){
  const page=await html(prefix+'/locations?q=Montr%C3%A9al');assert.ok(page.includes('value="Montréal"'));assert.ok(page.includes('href="'+prefix+'/areas/montreal"'));assert.ok(page.includes('rel="canonical" href="https://tiling.ca'+prefix+'/locations"'));
  const british=await html(prefix+'/locations?q=British%20Columbia');assert.ok(british.includes('href="'+prefix+'/areas/vancouver"'));
  const region=await html(prefix+'/locations?q=Port%20Perry');assert.ok(region.includes('href="'+prefix+'/areas/scugog"'));
  const repeated=await html(prefix+'/locations?q=Toronto&q=unknown');assert.ok(repeated.includes('value=""'));
  const tooLong=await html(prefix+'/locations?q='+'z'.repeat(120));assert.ok(tooLong.includes('value="'+'z'.repeat(100)+'"'));assert.ok(!tooLong.includes('value="'+'z'.repeat(120)+'"'));
 }
});

test('inspiration links carry the selected service and material into a usable quote',async()=>{
 for(const prefix of ['','/fr']){
  const body=main(await html(prefix||'/')),ideas=body.match(/class="project-grid">([\s\S]*?)<section class="home-process/)[1];
  assert.equal(new Set([...ideas.matchAll(/\/projects\/concept-[^" ]+\.jpg/g)].map(m=>m[0])).size,3);
  assert.equal((ideas.match(/<figcaption>/g)||[]).length,3);
  const links=[...ideas.matchAll(/href="([^\"]*\/request-a-quote\?[^\"]+)"/g)].map(m=>decode(m[1]));assert.equal(links.length,3);
  for(const link of links){const page=await html(link);assert.ok(formValue(page,'service'));assert.match(page,/name="material" value="[^\"]+"/);}
 }
});
