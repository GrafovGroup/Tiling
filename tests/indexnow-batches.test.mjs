import test from 'node:test';
import assert from 'node:assert/strict';
import { sitemapBatches, submitBatches } from '../scripts/indexnow-batches.mjs';

test('a 15,618-page sitemap submits every canonical URL once within the per-request limit', async () => {
  const urls = Array.from({ length: 15618 }, (_, i) => `https://tiling.ca/areas/test-${i}`);
  const batches = sitemapBatches(urls.map(u => `<loc>${u}</loc>`).join('') + `<loc>${urls[0]}</loc>`, 'tiling.ca');
  assert.deepEqual(batches.map(b => b.length), [10000, 5618]);
  const sent = [];
  const results = await submitBatches({ endpoint: 'https://example.invalid', host: 'tiling.ca', key: 'test-key' }, batches, async (_, init) => {
    sent.push(...JSON.parse(init.body).urlList);
    return new Response('', { status: sent.length === 10000 ? 200 : 202 });
  });
  assert.deepEqual(sent, urls);
  assert.ok(results.every(r => r.accepted));
});

test('noncanonical or empty lists are rejected before any submission', () => {
  for (const value of ['', '<loc>https://other.example/</loc>', '<loc>http://tiling.ca/</loc>', '<loc>https://tiling.ca/?email=private</loc>', '<loc>https://tiling.ca/#quote</loc>', '<loc>not-a-url</loc>']) assert.throws(() => sitemapBatches(value, 'tiling.ca'));
});

test('failed batches stop without retrying accepted URLs and retain a receipt', async () => {
  let calls = 0;
  const results = await submitBatches({ endpoint: 'https://example.invalid', host: 'tiling.ca' }, [['https://tiling.ca/a'], ['https://tiling.ca/b'], ['https://tiling.ca/c']], async () => {
    calls++;
    return new Response('', { status: calls === 1 ? 200 : 429 });
  });
  assert.equal(calls, 2);
  assert.deepEqual(results.map(r => r.accepted), [true, false]);
  assert.equal(results[1].status, 429);
});
