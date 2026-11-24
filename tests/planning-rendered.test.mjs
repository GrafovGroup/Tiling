import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../dist/server/index.js';
import { formValue } from './form-values.mjs';
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},ctx={waitUntil(){},passThroughOnException(){}};
async function html(path){const response=await worker.fetch(new Request('https://tiling.ca'+path,{headers:{accept:'text/html','user-agent':'Googlebot'}}),env,ctx);assert.equal(response.status,200,path);return response.text();}
test('inner forms accept optional project details and files without adding required fields; home stays unchanged',async()=>{
 for(const prefix of ['', '/fr']) {
  const quote=await html(prefix+'/request-a-quote?service=floor-tile-installation&area=toronto');
  const form=quote.match(/<form[\s\S]*?<\/form>/)[0];
  assert.equal(formValue(form,'service'),prefix?'Pose de carrelage au sol':'Floor Tile Installation');
  assert.match(form,/enctype="multipart\/form-data"/i);assert.ok(form.includes('name="attachment"'));assert.ok(form.includes(' multiple=""'));
  const required=[...form.matchAll(/<(?:input|select|textarea)[^>]*\brequired(?:=""|)[^>]*>/g)].map(m=>m[0].match(/name="([^"]+)"/)[1]);assert.deepEqual(required,['name','email','city']);
  const home=await html(prefix||'/');const main=home.match(/<main[\s\S]*?<\/main>/)[0];assert.doesNotMatch(main,/name="(?:attachment|service|timing)"|id="project-calculator"/);
 }
});
test('calculators appear on installation and supply guides in both languages without extra indexed pages',async()=>{
 for(const prefix of ['', '/fr']) {
  for(const slug of ['tile-installation-cost','shower-tiling-cost','backsplash-tiling-cost']) {
   const page=await html(prefix+'/pricing/'+slug);assert.match(page,/id="project-calculator"/);assert.match(page,/href="#project-calculator"/);assert.match(page,/<noscript>/);
   assert.ok(page.includes(prefix?'Marge pour les coupes':'Cutting allowance'));
   if(slug==='tile-installation-cost')for(const range of ['$13–$34','$8–$27','$8–$15']){if(!prefix)assert.ok(page.includes(range));}
  }
 }
 const xml=await html('/sitemap.xml');assert.doesNotMatch(xml,/<loc>[^<]*(?:calculator|calc_area|calc_waste|calc_unit)/);
});
test('planning measurements reach the quote note with city/service context and clean canonical metadata',async()=>{
 for(const prefix of ['', '/fr']) {
  const page=await html(prefix+'/request-a-quote?service=floor-tile-installation&area=toronto&calc_area=200&calc_waste=10&calc_unit=ft');
  const note=page.match(/<textarea[^>]*name="details"[^>]*>([\s\S]*?)<\/textarea>/)?.[1];assert.ok(note.includes('200'));assert.ok(note.includes('220'));
  assert.equal(formValue(page,'city'),'Toronto');assert.ok(formValue(page,'service'));
  assert.ok(page.split('</head>')[0].includes('rel="canonical" href="https://tiling.ca'+prefix+'/request-a-quote"'));
  const bad=await html(prefix+'/request-a-quote?calc_area=%3Cscript%3E&calc_waste=10&calc_unit=ft');assert.match(bad,/<textarea[^>]*name="details"[^>]*><\/textarea>/);
 }
});
test('compact service labels cover the published service guides in each language',()=>{
 const options=JSON.parse(fs.readFileSync(new URL('../app/quote-services.json',import.meta.url)));
 const guides=JSON.parse(fs.readFileSync(new URL('../app/service-guides.json',import.meta.url)));
 assert.deepEqual(options.map(x=>x.slug).sort(),guides.map(x=>x.slug).sort());
 assert.equal(new Set(options.map(x=>x.slug)).size,options.length);
 for(const option of options)assert.ok(option.en&&option.fr);
});


test('carton details reach bilingual enquiry notes and survive links without changing their canonical', async () => {
 for (const prefix of ['', '/fr']) {
  const query = new URLSearchParams({service:'tile-supply-delivery',material:'porcelain-tile',area:'toronto',calc_area:'120',calc_unit:'ft',calc_waste:'10',calc_box_coverage:'20'});
  const quote = await html(prefix+'/request-a-quote?'+query);
  const contactHref = quote.match(/href="([^"]*\/contact\?[^"]*calc_box_coverage[^"]*)"/)?.[1].replaceAll('&amp;','&');
  assert.ok(contactHref);
  for (const [path,page] of [['/request-a-quote',quote],['/contact',await html(contactHref)]]) {
   const note=page.match(/<textarea[^>]*name="details"[^>]*>([\s\S]*?)<\/textarea>/)?.[1];
   assert.ok(note.includes(prefix ? '20 pi² par boîte, prévoir 7 boîtes entières' : '20 sq. ft. per box, allow for 7 full boxes'));
   assert.equal(formValue(page,'city'),'Toronto');
   assert.ok(formValue(page,'material'));
   assert.ok(page.split('</head>')[0].includes('rel="canonical" href="https://tiling.ca'+prefix+path+'"'));
  }
 }
});
