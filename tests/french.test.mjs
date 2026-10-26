import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import worker from '../dist/server/index.js';
const ctx={waitUntil(){},passThroughOnException(){}};
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
const request=(path)=>worker.fetch(new Request('https://tiling.ca'+path,{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,ctx);
async function html(path){const r=await request(path);assert.equal(r.status,200,path);return r.text();}
const services=['bathroom-shower-tile','floor-tile-installation','kitchen-backsplash','large-format-tile','tile-repair-regrouting','commercial-tile','tile-supply-delivery','outdoor-balcony-tiling','fireplace-feature-wall-tiling','heated-tile-floors','pool-spa-tiling','tile-stairs-steps','tile-removal-surface-preparation','tile-grout-stone-cleaning-sealing','rooftop-terrace-pedestal-pavers'];
test('French route families render localized content and reciprocal language metadata',async()=>{
 for(const path of ['','/services','/materials','/locations','/locations/ontario','/locations/ontario/haliburton','/about','/contact','/how-it-works','/request-a-quote','/privacy','/terms','/editorial-standards','/areas/montreal','/areas/dysart-et-al/kitchen-backsplash']){
 const fr=await html('/fr'+path);const en=await html(path||'/');
 assert.match(fr,/<html lang="fr-CA"/);assert.match(en,/<html lang="en-CA"/);
 assert.ok(fr.includes(`href="https://tiling.ca/fr${path}"`),path);
 assert.ok(fr.includes('hrefLang="en-CA"')||fr.includes('hreflang="en-CA"'));
 assert.ok(en.includes(`href="https://tiling.ca/fr${path}"`));
 assert.match(fr,/Aller au contenu/);assert.doesNotMatch(fr,/>Request a quote<|>Tile services<|>Your service:/);
 }
});
test('all fifteen French services and five materials have content and quote forms',async()=>{
 for(const service of services){const s=await html('/fr/services/'+service);assert.match(s,/Questions fréquentes/);assert.match(s,/name="language" value="fr-CA"/);assert.match(s,/action="https:\/\/formspree.io\/f\/xdeownaz"/);assert.match(s,/Demander une soumission/);}
 for(const material of ['marble-tile','porcelain-tile','ceramic-tile','natural-stone-tile','granite-tile']){const s=await html('/fr/materials/'+material);assert.match(s,/Points à vérifier/);assert.match(s,/name="language" value="fr-CA"/);}
});
test('French quote context validates area and service inputs',async()=>{
 const good=await html('/fr/request-a-quote?area=montreal&service=kitchen-backsplash');assert.match(good,/name="city"[^>]*value="Montréal"/);assert.match(good,/name="service" value="Dosseret de cuisine"/);assert.match(good,/>Courriel</);assert.match(good,/href="\/fr\/privacy"/);
 const bad=await html('/fr/request-a-quote?area=unknown&service=unknown');assert.doesNotMatch(bad,/name="service"/);assert.match(bad,/name="city"[^>]*value=""/);
});
test('French unknown routes return 404 and historical URLs redirect',async()=>{
 for(const path of ['/fr/unknown','/fr/services/unknown','/fr/materials/unknown','/fr/areas/unknown','/fr/areas/toronto/unknown','/fr/locations/ontario/unknown'])assert.equal((await request(path)).status,404,path);
 for(const [old,next] of [['areas','locations'],['request-a-match','request-a-quote'],['for-contractors','about'],['contractor-review-process','how-it-works']]){const r=await request('/fr/'+old);assert.equal(r.status,308);assert.equal(r.headers.get('location'),'/fr/'+next);}
});
test('sitemap has a one-to-one French counterpart for every English URL',async()=>{
 const xml=await html('/sitemap.xml');const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);const set=new Set(urls);assert.equal(set.size,urls.length);
 const en=urls.filter(u=>!u.startsWith('https://tiling.ca/fr'));assert.equal(urls.length,en.length*2);for(const u of en)assert.ok(set.has('https://tiling.ca/fr'+u.slice('https://tiling.ca'.length)),u);
 assert.match(xml,/hreflang="fr-CA"/);
});
test('all French local areas and their service links are available',async()=>{
 const xml=await html('/sitemap.xml');const urls=[...xml.matchAll(/<loc>https:\/\/tiling.ca(\/fr\/areas\/[^/<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,482);
 for(const path of urls){const page=await html(path);for(const service of services)assert.ok(page.includes(`${path}/${service}`),path+'/'+service);assert.match(page,/<html lang="fr-CA"/);}
 for(const area of ['montreal','quebec-city','vancouver','toronto','dysart-et-al','iqaluit'])for(const service of services){const page=await html('/fr/areas/'+area+'/'+service);assert.match(page,/id="local-quote"/);assert.match(page,/name="language" value="fr-CA"/);}
});

test('callback field stays optional in both languages and retains quote delivery',async()=>{
 for(const prefix of ['', '/fr']){
 const page=await html(prefix+'/request-a-quote');
 const phone=page.match(/<input[^>]*name="phone"[^>]*>/)?.[0];
 assert.ok(phone);
 assert.match(phone,/type="tel"/);
 assert.match(phone,/autoComplete="tel"/i);
 assert.doesNotMatch(phone,/required/);
 assert.match(page,/action="https:\/\/formspree.io\/f\/xdeownaz"/);
 assert.match(page,prefix?/Téléphone pour un rappel/:/Callback number/);
 }
});
