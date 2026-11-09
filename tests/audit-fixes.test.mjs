import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import worker from '../dist/server/index.js';
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},ctx={waitUntil(){},passThroughOnException(){}};
async function render(path){const response=await worker.fetch(new Request('https://tiling.ca'+path,{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,ctx);return {status:response.status,body:await response.text(),location:response.headers.get('location')};}

test('unknown routes retain 404 status and offer localized recovery links and quote access',async()=>{
 for(const prefix of ['','/fr'])for(const route of ['/audit-unknown','/services/unknown','/materials/unknown','/areas/unknown','/areas/toronto/unknown','/locations/ontario/unknown']){
  const {status,body}=await render(prefix+route);assert.equal(status,404,prefix+route);assert.equal((body.match(/<h1[ >]/g)||[]).length,1);assert.match(body,/name="robots" content="[^"]*noindex/);
  assert.ok(body.includes(prefix?'Retrouvons le chemin de votre projet.':'Let’s get back to your tile project.'));assert.ok(body.includes('lang="'+(prefix?'fr-CA':'en-CA')+'"'));
  assert.ok(body.includes(prefix?'Page introuvable':'Page not found'));
  for(const path of ['/services','/locations','/contact','/request-a-quote']){assert.ok(body.includes('href="'+prefix+path+'"'));assert.equal((await render(prefix+path)).status,200);}
  assert.ok(body.includes('href="tel:+18335738453"'));assert.ok(body.includes('href="mailto:info@tiling.ca"'));assert.ok(!body.includes('/request-a-quote?area=unknown'));
 }
});

test('every previously affected page renders without any of the 26 broken source URLs',async()=>{
 const audit=JSON.parse(fs.readFileSync(new URL('../docs/reference-link-repairs.json',import.meta.url),'utf8'));assert.equal(audit.replacements.length,26);
 for(const replacement of audit.replacements)assert.equal(replacement.httpVerification.getStatus,200,replacement.replacementUrl);
 for(const url of audit.affectedPages){let result=await render(new URL(url).pathname);if(result.status===308){const target=new URL(result.location,url);assert.equal(target.origin,'https://tiling.ca');result=await render(target.pathname+target.search);}const {status,body}=result;assert.equal(status,200,url);const decoded=body.replaceAll('&amp;','&');for(const item of audit.replacements)assert.ok(!decoded.includes('href="'+item.oldUrl+'"'),url+' -> '+item.oldUrl);}
});

test('replacement references retain their meaning and correct unsupported locality attribution',async()=>{
 const coverage=JSON.parse(fs.readFileSync(new URL('../app/ontario-coverage.json',import.meta.url),'utf8'));
 const highlands=coverage.find(x=>x.slug==='highlands-east');assert.ok(!highlands.communities.some(x=>x.id==='irondale'));assert.equal(highlands.communities.length,4);
 const westLincoln=coverage.find(x=>x.slug==='west-lincoln');assert.equal(new Set(westLincoln.sourceUrls).size,westLincoln.sourceUrls.length);assert.ok(westLincoln.sourceUrls.some(x=>x.endsWith('2022-niagara-official-plan.pdf#page=338')));
 const fortErie=coverage.find(x=>x.slug==='fort-erie');assert.ok(fortErie.sourceUrls.includes('https://www.forterie.ca/build-and-invest/planning-and-development/official-plan/'));
 const {body}=await render('/areas/halton-hills');assert.ok(body.includes('Statistics Canada: Halton Hills place names'));
});

test('optimized homepage assets keep readable branding and provide small image choices',async()=>{
 for(const path of ['/','/fr']){
  const {body}=await render(path);assert.ok(body.includes('type="image/avif"'));assert.ok(body.includes('href="/heroes/commercial-atrium-optimized.avif"'));assert.ok(body.includes('fetchPriority="high"'));
  assert.ok(body.includes('/brand/tiling-herringbone-display.webp'));assert.ok(body.includes('-480.webp 480w, '));assert.ok(body.includes('-960.webp 960w'));
 }
 for(const [asset,max] of [['brand/tiling-herringbone-display.webp',40000],['heroes/commercial-atrium-optimized.avif',50000],['heroes/commercial-atrium-optimized.webp',75000]])assert.ok(fs.statSync(new URL('../public/'+asset,import.meta.url)).size<max,asset+' asset budget');
 const manifest=JSON.parse(fs.readFileSync(new URL('../docs/mobile-asset-optimization.json',import.meta.url),'utf8'));for(const asset of manifest.assets)assert.ok(fs.existsSync(new URL('../public/'+asset.dest,import.meta.url)));
});
