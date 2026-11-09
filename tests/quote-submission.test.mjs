import test from 'node:test';
import assert from 'node:assert/strict';
import { submitQuoteRequest } from '../app/submit-quote.ts';
const form = new FormData();
form.set('name', 'Synthetic test');
test('accepts only confirmed provider success and preserves form payload', async () => {
  await submitQuoteRequest('https://example.invalid', form, async (url, init) => {
    assert.equal(init.body, form); assert.equal(init.method, 'POST');
    return Response.json({ ok: true });
  });
});
test('surfaces provider validation and quota failures', async () => {
  for (const status of [400, 422, 429, 500]) {
    await assert.rejects(submitQuoteRequest('https://example.invalid', form, async () => Response.json({ errors: [{ message: 'Unable to accept request' }] }, { status })), /Unable to accept request/);
  }
});
test('does not claim success for HTML or unconfirmed JSON', async () => {
  for (const response of [new Response('<html>Unavailable</html>'), Response.json({ ok: false }), Response.json({})]) {
    await assert.rejects(submitQuoteRequest('https://example.invalid', form, async () => response), /could not confirm/);
  }
});
test('network failures keep errors actionable without retrying', async () => {
  let calls = 0;
  await assert.rejects(submitQuoteRequest('https://example.invalid', form, async () => { calls++; throw new Error('Network unavailable'); }), /check your connection, or call or email/);
  assert.equal(calls, 1);
});
test('timeout releases pending request without an automatic duplicate', async () => {
  await assert.rejects(submitQuoteRequest('https://example.invalid', form, async (_, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('Aborted')))), 5), /may have arrived/);
});
test('multipart submission keeps multiple optional files and project selections intact', async () => {
 const payload=new FormData();payload.set('service','Floor Tile Installation');payload.set('timing','Within 1–3 months');
 payload.append('attachment',new File(['synthetic photo'], 'test.jpg', {type:'image/jpeg'}));
 payload.append('attachment',new File(['synthetic plan'], 'test.pdf', {type:'application/pdf'}));
 await submitQuoteRequest('https://example.invalid',payload,async (_,init)=>{
  assert.equal(init.body.get('service'),'Floor Tile Installation');assert.equal(init.body.getAll('attachment').length,2);
  assert.equal(init.body.getAll('attachment')[1].name,'test.pdf');assert.equal(init.headers['Content-Type'],undefined);
  return Response.json({ok:true});
 });
});
