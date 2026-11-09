import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
const env = { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const request = url => worker.fetch(new Request(url, { headers: { accept: 'text/html' } }), env, ctx);

test('host and historical redirects are permanent, preserve query values and combine into one hop', async () => {
  const aliases = [['areas','locations'],['request-a-match','request-a-quote'],['for-contractors','about'],['contractor-review-process','how-it-works']];
  const query = '?area=oshawa&service=kitchen-backsplash&material=porcelain-tile&tag=one&tag=two';
  for (const origin of ['http://www.tiling.ca','https://www.tiling.ca','http://tiling.ca','https://tiling.ca']) for (const prefix of ['', '/fr']) for (const [oldPath, newPath] of aliases) {
    const input = `${origin}${prefix}/${oldPath}${query}`;
    const response = await request(input);
    assert.equal(response.status, 308, input);
    const destination = new URL(response.headers.get('location'), input);
    assert.equal(destination.href, `https://tiling.ca${prefix}/${newPath}${query}`);
    assert.equal((await request(destination)).status, 200);
  }
  for (const path of ['/services/kitchen-backsplash','/fr/request-a-quote','/areas/oshawa/kitchen-backsplash']) {
    const response = await request('https://www.tiling.ca'+path+query);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), 'https://tiling.ca'+path+query);
  }
});

test('canonical and native hosting pages remain reachable, and unknown paths keep a real 404', async () => {
  for (const origin of ['https://tiling.ca','https://tiling-canada.dimagrafov.chatgpt.site']) {
    assert.equal((await request(origin+'/request-a-quote')).status, 200);
    assert.equal((await request(origin+'/fr/request-a-quote')).status, 200);
    assert.equal((await request(origin+'/no-such-project')).status, 404);
  }
});

test('analytics is off without valid server configuration and cannot be enabled by an incoming header', async () => {
  const url='https://tiling.ca/request-a-quote';
  const spoofed=new Request(url,{headers:{'x-tiling-ga4':'G-TEST000001'}});
  assert.doesNotMatch(await (await worker.fetch(spoofed,env,ctx)).text(),/class="analytics-choice"/);
  for(const id of ['', 'not-an-id', 'G-test<script>']) {
    assert.doesNotMatch(await (await worker.fetch(new Request(url),{...env,GA4_MEASUREMENT_ID:id},ctx)).text(),/class="analytics-choice"/);
  }
  for(const prefix of ['', '/fr']) {
    const html=await (await worker.fetch(new Request('https://tiling.ca'+prefix+'/request-a-quote'),{...env,GA4_MEASUREMENT_ID:'G-TEST000001'},ctx)).text();
    assert.match(html,/class="analytics-choice"/);
    assert.ok(html.includes(prefix?'Désactivée jusqu’à votre accord.':'Off until you choose to allow it.'));
    assert.doesNotMatch(html,/<script[^>]*src="https:\/\/www.googletagmanager.com/);
  }
});
