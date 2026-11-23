import { formValue } from './form-values.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../dist/server/index.js';
import fs from 'node:fs';
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},ctx={waitUntil(){},passThroughOnException(){}};
const contentDates=JSON.parse(fs.readFileSync(new URL('../app/content-dates.json',import.meta.url),'utf8'));
const productServices = [
 ['carpet-tile','carpet-tile-installation'],
 ['interlocking-floor-tile','interlocking-floor-tile-installation'],
 ['interlocking-pavers','interlocking-paver-installation'],
 ['vinyl-tile','vinyl-tile-installation'],
];
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
  const entity=all.filter(item=>item['@type']===(slug==='contact'?'ContactPage':'WebPage'));assert.equal(entity.length,1);assert.equal(entity[0].inLanguage,prefix?'fr-CA':'en-CA');assert.equal(entity[0].dateModified,contentDates.pages[slug]);assert.equal(entity[0].url,'https://tiling.ca'+path);
  assert.equal(all.filter(item=>item['@type']==='BreadcrumbList').length,1);
  const forms=[...body.matchAll(/<form[\s\S]*?<\/form>/g)];assert.equal(forms.length,1);const form=forms[0][0];
  assert.ok(form.includes('action="https://formspree.io/f/xdeownaz"'));assert.ok(form.includes('name="language" value="'+(prefix?'fr-CA':'en-CA')+'"'));
  const fields=[...form.matchAll(/<(?:input|textarea)[^>]*>/g)].map(m=>m[0]);
  assert.ok(fields.some(field=>field.includes('name="product_reference"')),path);
  assert.ok(form.includes(prefix ? "Marque, modèle ou code du produit" : "Brand, style or product code"),path);
  assert.deepEqual(fields.filter(s=>/\brequired(?:=|\s|>)/.test(s)).map(s=>s.match(/name="([^"]+)"/)[1]),['name','email','city']);
  assert.ok(form.includes('type="file"'));assert.ok(form.includes('name="timing"'));assert.equal(formValue(form,'service'),'');assert.ok(!form.match(/name="(?:budget|consent)"/));
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
  assert.match(body,/name="city"[^>]*value="Oshawa"/);assert.ok(formValue(body,'service'));assert.match(body,/name="material" value="[^"]+"/);
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
   const body=main(await html(prefix+'/'+slug+query));assert.match(body,/name="city"[^>]*value=""/);assert.equal(formValue(body,'service'),'');assert.equal(formValue(body,'material'),'');assert.doesNotMatch(body,/<input[^>]+name="material"|href="[^\"]*unknown/);
  }
  const supply=main(await html(prefix+'/'+slug+'?material=porcelain-tile'));assert.ok(formValue(supply,'service'));assert.ok(supply.includes(prefix?'quantité et besoins de livraison':'quantity and delivery needs'));
 }
});

test('every service provides tailored guidance and links only to an applicable pricing guide',async()=>{
 const services=JSON.parse(fs.readFileSync(new URL('../app/service-guides.json',import.meta.url),'utf8'));
 for(const prefix of ['','/fr'])for(const service of services){
  const body=decode(main(await html(prefix+'/request-a-quote?service='+service.slug)));
  assert.ok(body.includes(service.quoteChecklist[0][prefix?'fr':'en']),service.slug);
  const pricingLink = new RegExp('href="'+prefix+'/pricing/[^\"]+service='+service.slug);
  if (productServices.some(([,slug])=>slug===service.slug)) {
   assert.doesNotMatch(body,pricingLink);
   assert.ok(body.includes('href="'+prefix+'/services/'+service.slug+'?service='+service.slug+'"'));
  } else {
   assert.match(body,pricingLink);
  }
 }
});

test('new tile products and installation services can be quoted together or separately',async()=>{
 const services = JSON.parse(fs.readFileSync(new URL('../app/quote-services.json',import.meta.url),'utf8'));
 for (const [locale,prefix] of [['en',''],['fr','/fr']]) {
  const direct = decode(main(await html(prefix+'/request-a-quote')));
  const choices = direct.match(/<select[^>]*name="material"[^>]*>([\s\S]*?)<\/select>/)[1];
  const scopes = direct.match(/<select[^>]*name="project_scope"[^>]*>([\s\S]*?)<\/select>/)[1];
  const labels = locale === 'fr' ? ['Fourniture seulement','Pose seulement','Fourniture et pose'] : ['Supply only','Installation only','Supply and installation'];
  for (const label of labels) assert.ok(scopes.includes('>'+label+'</option>'),label);
  for (const [material,service] of productServices) {
   const name = services.find(item=>item.slug===service)[locale];
   const selected = main(await html(prefix+'/request-a-quote?material='+material+'&service='+service));
   assert.equal(formValue(selected,'service'),name);
   const product = formValue(selected,'material');
   assert.ok(product,material);
   assert.ok(choices.includes('>'+product+'</option>'),product);
   assert.ok(selected.includes('name="project_scope"'));
  }
 }
});

test('contact and quote sitemap dates match the bilingual update',async()=>{
 const xml=await html('/sitemap.xml');for(const prefix of ['','/fr'])for(const slug of ['contact','request-a-quote']){
  const entry=[...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(item=>item[1].includes('<loc>https://tiling.ca'+prefix+'/'+slug+'</loc>'))?.[1];assert.ok(entry?.includes('<lastmod>'+contentDates.pages[slug]+'</lastmod>'));
 }
});

test('desktop, mobile menu, mobile bar and footer share validated project context in both languages', async () => {
 const cases = [
  ['/services/carpet-tile-installation?service=vinyl-tile-installation&material=carpet-tile&area=toronto', {area:'toronto',service:'carpet-tile-installation',material:'carpet-tile'}],
  ['/materials/carpet-tile?area=toronto&service=carpet-tile-installation&material=vinyl-tile', {area:'toronto',service:'carpet-tile-installation',material:'carpet-tile'}],
  ['/pricing/tile-installation-cost?service=carpet-tile-installation&area=oshawa&material=porcelain-tile', {area:'oshawa',service:'floor-tile-installation',material:'porcelain-tile'}],
  ['/pricing/tile-installation-cost?service=commercial-tile', {service:'commercial-tile'}],
  ['/contact?area=oshawa&service=carpet-tile-installation&material=carpet-tile&calc_area=240&calc_waste=10&calc_unit=m&tracking=omit', {area:'oshawa',service:'carpet-tile-installation',material:'carpet-tile',calc_area:'240',calc_waste:'10',calc_unit:'m'}],
  ['/services/carpet-tile-installation?area=toronto&area=oshawa&material=nope&calc_waste=10&calc_area=12&calc_area=23&calc_unit=ft', {service:'carpet-tile-installation'}],
  ['/materials/vinyl-tile?service=foo&service=kitchen-backsplash&area=missing', {service:'tile-supply-delivery',material:'vinyl-tile'}],
  ['/areas/toronto?area=oshawa&service=carpet-tile-installation&material=carpet-tile', {area:'toronto', service:'carpet-tile-installation',material:'carpet-tile'}],
  ['/request-a-quote?material=carpet-tile&calc_waste=7&calc_area=270&calc_unit=ft', {service:'tile-supply-delivery',material:'carpet-tile',calc_area:'270',calc_waste:'7',calc_unit:'ft'}],
 ];
 for (const prefix of ['', '/fr']) for (const [path,expected] of cases) {
  const page = await html(prefix+path);
  const links = [
   page.match(/<a class="header-cta" href="([^"]+)"/)?.[1],
   page.match(/<a class="footer-cta" href="([^"]+)"/)?.[1],
   page.match(/<nav id="mobile-nav"[^>]*>[\s\S]*?href="([^"]*\/request-a-quote[^"]*)"/)?.[1],
  ];
  if (!path.startsWith('/request-a-quote')) links.push(page.match(/<nav class="mobile-enquiry-bar"[^>]*>[\s\S]*?href="([^"]*\/request-a-quote[^"]*)"/)?.[1]);
  for (const href of links) {
   assert.ok(href,path);
   const url = new URL(decode(href),'https://tiling.ca');
   assert.equal(url.pathname,prefix+'/request-a-quote',path);
   assert.deepEqual(Object.fromEntries(url.searchParams),expected,path);
  }
  assert.ok(page.includes('rel="canonical" href="https://tiling.ca'+prefix+path.split('?')[0]+'"'),path);
 }
});

test('the local mobile quote anchor keeps route identity, product and measurements in its form', async () => {
 for(const prefix of ['','/fr']){
  const path = prefix+'/areas/toronto/kitchen-backsplash?area=oshawa&service=vinyl-tile-installation&material=ceramic-tile&calc_area=80&calc_waste=10&calc_unit=ft';
  const page = await html(path);
  assert.match(page, /<nav class="mobile-enquiry-bar"[^>]*>[\s\S]*?href="#local-quote"/);
  const form = page.split('id="local-quote"')[1]?.match(/<form[\s\S]*?<\/form>/)?.[0];
  assert.ok(form,path);
  assert.equal(formValue(form,'city'),'Toronto');
  assert.equal(formValue(form,'service'),prefix?'Dosseret de cuisine':'Kitchen Backsplash');
  assert.equal(formValue(form,'material'),prefix?'Carreaux de céramique':'Ceramic Tile');
  assert.match(form, /80 (?:pi²|sq\. ft\.)/);
  assert.match(form, /88 (?:pi²|sq\. ft\.)/);
 }
});

test('React navigation transports the verified quote destination through hydration', async () => {
 for (const prefix of ['', '/fr']) {
  const path = prefix+'/services/carpet-tile-installation.rsc?area=toronto&material=carpet-tile';
  const response = await worker.fetch(new Request('https://tiling.ca'+path, {
   headers:{'x-tiling-quote-href':'https://outside.example/invalid'},
  }), env, ctx);
  assert.equal(response.status,200,path);
  assert.match(response.headers.get('content-type'),/^text\/x-component/);
  const payload = await response.text();
  assert.ok(payload.includes('"href":"'+prefix+'/request-a-quote?area=toronto&service=carpet-tile-installation&material=carpet-tile","children":'),path);
  assert.ok(!payload.includes('outside.example'),path);
 }
});
