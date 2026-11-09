import { finalResponse, isMerged, localHref } from './local-route-helpers.mjs';
import { formValue } from './form-values.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from '../dist/server/index.js';
const guides=JSON.parse(readFileSync(new URL('../app/service-guides.json',import.meta.url),'utf8'));
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
async function html(path){const r=await finalResponse(p=>worker.fetch(new Request('https://tiling.ca'+p,{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,{waitUntil(){},passThroughOnException(){}}),path);assert.equal(r.status,200,path);return r.text();}
function schemas(page){return [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{const json=JSON.parse(m[1]);return json['@graph']||[json]});}
const decode=text=>text.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');

test('all service pages publish distinct bilingual metadata and one correctly connected Service entity',async()=>{
 assert.equal(guides.length,15);assert.equal(new Set(guides.map(g=>g.slug)).size,15);
 for(const prefix of ['','/fr']){
  const titles=new Set(),descriptions=new Set();
  for(const guide of guides){
   const path=prefix+'/services/'+guide.slug,page=await html(path),head=page.split('</head>')[0];
   const title=head.match(/<title>(.*?)<\/title>/)?.[1],description=head.match(/<meta name="description" content="([^"]+)"/)?.[1];
   assert.ok(title&&description,path);titles.add(title);descriptions.add(description);
   assert.equal((page.match(/<h1[ >]/g)||[]).length,1,path);
   assert.ok(head.includes('rel="canonical" href="https://tiling.ca'+path+'"'),path);
   for(const alternate of ['','/fr'])assert.ok(head.includes('href="https://tiling.ca'+alternate+'/services/'+guide.slug+'"'),path);
   const json=schemas(page),services=json.filter(item=>item['@type']==='Service');
   assert.equal(services.length,1,path);assert.equal(services[0].provider['@id'],'https://tiling.ca/#organization');
   assert.equal(services[0].url,'https://tiling.ca'+path);
   assert.equal(json.filter(item=>item['@type']==='WebPage').length,1,path);
   assert.equal(json.find(item=>item['@type']==='WebPage').mainEntity['@id'],services[0]['@id']);
   assert.doesNotMatch(page,/"@type":"(?:Offer|AggregateOffer|AggregateRating)"/);
  }
  assert.equal(titles.size,15);assert.equal(descriptions.size,15);
 }
});

test('service enquiry buttons, inline forms and pricing guides retain the selected service in both languages',async()=>{
 for(const prefix of ['','/fr'])for(const guide of guides){
  const path=prefix+'/services/'+guide.slug,page=await html(path);
  assert.equal((page.match(/<form[ >]/g)||[]).length,1,path);
  const form=page.match(/<form[\s\S]*?<\/form>/)?.[0];
  assert.ok(form.includes('action="https://formspree.io/f/xdeownaz"'),path);
  assert.ok(formValue(form,'service'));
  assert.ok(form.includes('name="language" value="'+(prefix?'fr-CA':'en-CA')+'"'));
  assert.ok(page.match(/<section class="inner-hero service-hero">[\s\S]*?<\/section>/)?.[0].includes(`href="${prefix}/request-a-quote?service=${guide.slug}"`),path);
  const priceLinks=[...page.matchAll(/class="pricing-card" href="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(priceLinks.length,1,path);assert.ok(priceLinks[0].endsWith('?service='+guide.slug));
  const pricePage=await html(decode(priceLinks[0]));
  assert.ok(pricePage.includes(`${prefix}/request-a-quote?service=${guide.slug}`));
  const quotePage=await html(`${prefix}/request-a-quote?service=${guide.slug}`);
  assert.ok(formValue(quotePage,'service'));
 }
});

test('expanded service FAQs match visible questions and jump links reach existing sections',async()=>{
 for(const prefix of ['','/fr'])for(const guide of guides){
  const path=prefix+'/services/'+guide.slug,page=await html(path);
  const faq=schemas(page).filter(item=>item['@type']==='FAQPage');assert.equal(faq.length,1,path);
  const questions=faq[0].mainEntity;assert.ok(questions.length>=5,path);assert.equal(new Set(questions.map(q=>q.name)).size,questions.length,path);
  for(const question of questions){assert.ok(decode(page).includes(question.name),question.name);assert.ok(question.acceptedAnswer.text.length>50);}
  const nav=page.match(/<nav class="guide-jump-links service-jump-links"[\s\S]*?<\/nav>/)?.[0];assert.ok(nav,path);
  for(const match of nav.matchAll(/href="#([^"]+)"/g))assert.ok(page.includes('id="'+match[1]+'"'),path+' #'+match[1]);
  if(guide.slug==='commercial-tile')for(const anchor of ['restaurant','hotel','retail','washroom','office','kitchen','commercial-quote'])assert.ok(page.includes('id="'+anchor+'"'));
 }
});

test('related service and material links resolve in the same language without linking back to the current service',async()=>{
 const checked=new Set();
 for(const prefix of ['','/fr'])for(const guide of guides){
  const path=prefix+'/services/'+guide.slug,page=await html(path);
  const section=page.match(/<section class="service-resources section-pad"[\s\S]*?<\/section>/)?.[0];assert.ok(section,path);
  const links=[...section.matchAll(/href="([^"]+)"/g)].map(m=>decode(m[1]));
  const serviceLinks=links.filter(link=>link.startsWith(prefix+'/services/'));assert.equal(serviceLinks.length,3,path);assert.equal(new Set(serviceLinks).size,3,path);assert.ok(!serviceLinks.includes(path),path);
  for(const link of links){assert.ok(link.startsWith(prefix+'/services/')||link.startsWith(prefix+'/materials/'),link);if(!checked.has(link)){await html(link);checked.add(link);}}
 }
});

test('local service pages link to the deeper national service guide while keeping local quote context',async()=>{
 for(const prefix of ['','/fr'])for(const guide of guides){
  const page=await html(`${prefix}/areas/toronto/${guide.slug}`);
  assert.ok(page.includes(`href="${prefix}/services/${guide.slug}?area=toronto${isMerged("toronto",guide.slug)?"":"#service-options"}"`));
  assert.equal((page.match(/id="local-quote"/g)||[]).length,1);
  assert.match(page,/name="city"[^>]*value="Toronto"/);
  assert.ok(page.includes(`?area=toronto&amp;service=${guide.slug}`));
 }
});


test('city context survives the detailed service guide while canonicals stay clean and unknown areas are ignored',async()=>{
 for(const prefix of ['','/fr'])for(const guide of guides){
  const path=prefix+'/services/'+guide.slug,page=await html(path+'?area=toronto');
  assert.ok(page.includes(`href="${localHref("toronto",guide.slug,prefix)}"`));
  assert.ok(page.includes(`href="${prefix}/request-a-quote?service=${guide.slug}&amp;area=toronto"`));
  assert.match(page,/name="city"[^>]*value="Toronto"/);
  assert.ok(page.includes(`rel="canonical" href="https://tiling.ca${path}"`));
  const invalid=await html(path+'?area=unknown-city');
  assert.doesNotMatch(invalid,/name="city"[^>]*value="unknown-city"/);
  assert.ok(!invalid.includes('class="service-context"'));
 }
});
