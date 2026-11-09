import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../dist/server/index.js';
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},ctx={waitUntil(){},passThroughOnException(){}};
const cache=new Map();
async function html(path){if(cache.has(path))return cache.get(path);const response=await worker.fetch(new Request('https://tiling.ca'+path,{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,ctx);assert.equal(response.status,200,path);const body=await response.text();cache.set(path,body);return body;}
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'");
const main=s=>s.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
const schemas=s=>[...s.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map(m=>JSON.parse(m[1]));

test('About and process pages have distinct bilingual metadata and accurate page entities',async()=>{
 const titles=new Set(),descriptions=new Set();
 for(const prefix of ['','/fr'])for(const slug of ['about','how-it-works']){
  const path=prefix+'/'+slug,page=await html(path),head=page.split('</head>')[0],all=schemas(page);
  assert.equal((main(page).match(/<h1[ >]/g)||[]).length,1,path);
  const title=head.match(/<title>(.*?)<\/title>/)[1],description=head.match(/<meta name="description" content="([^"]+)"/)[1];titles.add(title);descriptions.add(description);
  assert.ok(head.includes('rel="canonical" href="https://tiling.ca'+path+'"'));
  for(const lang of ['','/fr'])assert.ok(head.includes('href="https://tiling.ca'+lang+'/'+slug+'"'));
  for(const property of ['og:title','twitter:title'])assert.equal(head.match(new RegExp('<meta (?:property|name)="'+property+'" content="([^\"]+)"'))?.[1],title.replace(/ \| Tiling\.ca$/,''));
  const entity=all.filter(item=>item['@type']===(slug==='about'?'AboutPage':'WebPage'));assert.equal(entity.length,1,path);assert.equal(entity[0].url,'https://tiling.ca'+path);assert.equal(entity[0].inLanguage,prefix?'fr-CA':'en-CA');assert.equal(entity[0].dateModified,'2026-11-08');
  assert.equal(all.filter(item=>item['@type']==='BreadcrumbList').length,1,path);
  assert.ok(!all.some(item=>['Person','Review','AggregateRating','Product','Offer','HowTo'].includes(item['@type'])));
 }
 assert.equal(titles.size,4);assert.equal(descriptions.size,4);
});

test('all company-page resource and navigation links resolve in the selected language',async()=>{
 for(const prefix of ['','/fr'])for(const slug of ['about','how-it-works']){
  const path=prefix+'/'+slug,page=await html(path),body=main(page),links=new Set([...body.matchAll(/href="([^\"]+)"/g)].map(m=>decode(m[1])));
  for(const href of links){
   if(!href.startsWith('/')&&!href.startsWith('#'))continue;
   const url=new URL(href,'https://tiling.ca'+path);
   if(prefix)assert.ok(url.pathname==='/fr'||url.pathname.startsWith('/fr/'),href);
   const target=await html(url.pathname+url.search);if(url.hash)assert.ok(target.includes('id="'+url.hash.slice(1)+'"'),href);
  }
  for(const hub of ['services','materials','pricing','locations'])assert.ok(body.includes('href="'+prefix+'/'+hub+'"'));
  for(const service of ['floor-tile-installation','bathroom-shower-tile','tile-repair-regrouting','tile-supply-delivery','commercial-tile'])assert.ok(body.includes('href="'+prefix+'/services/'+service+'"'));
 }
});

test('each trust page has one usable enquiry form and FAQ answers matching its schema',async()=>{
 for(const prefix of ['','/fr'])for(const slug of ['about','how-it-works']){
  const page=await html(prefix+'/'+slug),body=main(page),forms=[...body.matchAll(/<form[\s\S]*?<\/form>/g)];assert.equal(forms.length,1);
  const form=forms[0][0];assert.ok(form.includes('action="https://formspree.io/f/xdeownaz"'));assert.ok(form.includes('method="POST"'));assert.ok(form.includes('name="language" value="'+(prefix?'fr-CA':'en-CA')+'"'));
  for(const field of ['name','email','city'])assert.match(form.match(new RegExp('<input[^>]*name="'+field+'"[^>]*>'))?.[0]||'',/\brequired(?:=|\s|>)/);
  const phone=form.match(/<input[^>]*name="phone"[^>]*>/)[0];assert.ok(!phone.includes('required'));assert.ok(!form.includes('type="file"'));
  assert.ok(body.includes('href="#project-enquiry"'));assert.ok(body.includes('id="project-enquiry"'));
  const faq=schemas(page).filter(item=>item['@type']==='FAQPage');assert.equal(faq.length,1);assert.equal(faq[0].mainEntity.length,slug==='about'?4:5);
  for(const question of faq[0].mainEntity){assert.ok(decode(body).includes(question.name));assert.ok(decode(body).includes(question.acceptedAnswer.text));}
 }
});

test('process stages, written scope and readiness are available in both languages',async()=>{
 for(const prefix of ['','/fr']){
  const body=main(await html(prefix+'/how-it-works'));
  for(const id of ['project-stages','enquiry','assessment','written-scope','delivery-work','handover','quote-scope','site-readiness','project-types'])assert.ok(body.includes('id="'+id+'"'));
  assert.equal((body.match(/class="company-stage-detail"/g)||[]).length,5);
  const scope=body.match(/class="company-scope-grid">([\s\S]*?)<\/div>/)[1];assert.equal((scope.match(/<article>/g)||[]).length,6);
  assert.ok(body.includes(prefix?'modifications':'changes'));assert.ok(body.includes(prefix?'cure':'curing'));assert.ok(body.includes(prefix?'fourniture seule':'supply only'));
  assert.ok(body.includes(prefix?'ne constitue pas une réservation':'is not a booking'));
 }
});

test('company sitemap dates reflect the published bilingual content update',async()=>{
 const xml=await html('/sitemap.xml');
 for(const prefix of ['','/fr'])for(const slug of ['about','how-it-works']){
  const entry=[...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(item=>item[1].includes('<loc>https://tiling.ca'+prefix+'/'+slug+'</loc>'))?.[1];assert.ok(entry);assert.ok(entry.includes('<lastmod>2026-11-08</lastmod>'));
 }
});
