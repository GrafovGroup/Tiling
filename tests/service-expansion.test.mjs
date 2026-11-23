import { finalResponse, isMerged, localHref } from './local-route-helpers.mjs';
import { formValue } from './form-values.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from '../dist/server/index.js';
const guides=JSON.parse(readFileSync(new URL('../app/service-guides.json',import.meta.url),'utf8'));
const newServices = new Set(["carpet-tile-installation", "interlocking-floor-tile-installation", "interlocking-paver-installation", "vinyl-tile-installation"]);
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
async function html(path){const r=await finalResponse(p=>worker.fetch(new Request('https://tiling.ca'+p,{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,{waitUntil(){},passThroughOnException(){}}),path);assert.equal(r.status,200,path);return r.text();}
function schemas(page){return [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{const json=JSON.parse(m[1]);return json['@graph']||[json]});}
const decode=text=>text.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');

test('all service pages publish distinct bilingual metadata and one correctly connected Service entity',async()=>{
 assert.equal(guides.length,19);assert.equal(new Set(guides.map(g=>g.slug)).size,guides.length);
 for (const slug of newServices) assert.ok(guides.some(guide => guide.slug === slug));
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
  assert.equal(titles.size,guides.length);assert.equal(descriptions.size,guides.length);
 }
});

test('floor choices keep the selected product, installation and city together in each language', async () => {
 const selections = [
  ['ceramic-tile','floor-tile-installation'], ['porcelain-tile','floor-tile-installation'], ['natural-stone-tile','floor-tile-installation'],
  ['carpet-tile','carpet-tile-installation'], ['interlocking-floor-tile','interlocking-floor-tile-installation'], ['vinyl-tile','vinyl-tile-installation'],
 ];
 for (const prefix of ['', '/fr']) {
  const path = prefix + '/services/floor-tile-installation';
  const page = await html(path + '?area=toronto&material=granite-tile');
  const choices = page.match(/<section[^>]*aria-labelledby="floor-materials"[\s\S]*?<\/section>/)?.[0];
  assert.ok(choices);
  assert.ok(page.indexOf(choices) < page.indexOf('class="service-detail section-pad"'));
  assert.ok(page.includes(prefix ? 'Prix de pose de la céramique, de la porcelaine et de la pierre' : 'Ceramic, porcelain and stone installation costs'));
  const links = [...choices.matchAll(/href="([^"]+)"/g)].map(match => new URL(decode(match[1]), 'https://tiling.ca'));
  for (const [material, service] of selections) {
   const product = links.find(link => link.pathname === prefix + '/materials/' + material);
   assert.ok(product, material);
   assert.equal(product.searchParams.get('service'), service);
   assert.equal(product.searchParams.get('area'), 'toronto');
   const productPage = await html(product.pathname + product.search);
   assert.equal(formValue(productPage,'city'), 'Toronto');
   if (service === 'floor-tile-installation') continue;
   const installation = links.find(link => link.pathname === prefix + '/services/' + service);
   assert.ok(installation, service);
   assert.equal(installation.searchParams.get('material'), material);
   assert.equal(installation.searchParams.get('area'), 'toronto');
   const servicePage = await html(installation.pathname + installation.search);
   for (const field of ['city','material','service']) {
    assert.ok(formValue(productPage,field), field);
    assert.equal(formValue(productPage,field), formValue(servicePage,field), field);
   }
  }
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
  if (newServices.has(guide.slug)) {
   assert.equal(priceLinks.length,0,path);
   assert.ok(!page.includes('href="#service-pricing"'),path);
  } else {
   assert.equal(priceLinks.length,1,path);assert.ok(priceLinks[0].endsWith('?service='+guide.slug));
   const pricePage=await html(decode(priceLinks[0]));
   assert.ok(pricePage.includes(`${prefix}/request-a-quote?service=${guide.slug}`));
  }
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
  if (newServices.has(guide.slug)) {
   const hub=await html(prefix+'/areas/toronto');
   assert.ok(hub.includes(`href="${prefix}/services/${guide.slug}?area=toronto"`));
   const legacyCityPath = `${prefix}/areas/toronto/${guide.slug}`;
   const response = await worker.fetch(new Request('https://tiling.ca'+legacyCityPath+'?material='+guide.materials[0]), env, {waitUntil(){},passThroughOnException(){}});
   assert.equal(response.status,308,legacyCityPath);
   const destination = new URL(response.headers.get('location'), 'https://tiling.ca');
   assert.equal(destination.pathname,`${prefix}/services/${guide.slug}`);
   assert.equal(destination.searchParams.get('area'),'toronto');
   assert.equal(destination.searchParams.get('material'),guide.materials[0]);
   continue;
  }
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
  const areaLink = newServices.has(guide.slug) ? prefix+'/areas/toronto' : localHref("toronto",guide.slug,prefix);
  assert.ok(page.includes(`href="${areaLink}"`));
  assert.ok(page.includes(`href="${prefix}/request-a-quote?service=${guide.slug}&amp;area=toronto"`));
  assert.match(page,/name="city"[^>]*value="Toronto"/);
  assert.ok(page.includes(`rel="canonical" href="https://tiling.ca${path}"`));
  const invalid=await html(path+'?area=unknown-city');
  assert.doesNotMatch(invalid,/name="city"[^>]*value="unknown-city"/);
  assert.ok(!invalid.includes('class="service-context"'));
 }
});
