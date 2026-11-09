import test from 'node:test';
import assert from 'node:assert/strict';
import { trackEnquiry } from '../app/enquiry-events.ts';

test('measurement is safe on the server', () => {
  assert.doesNotThrow(() => trackEnquiry('generate_lead'));
});
test('measurement includes language and service without query strings or personal form data', () => {
  globalThis.window = { location: { pathname: '/fr/areas/montreal/kitchen-backsplash', search: '?email=private@example.com', hash: '#private' } };
  try {
    trackEnquiry('phone_click');
    assert.deepEqual(window.dataLayer, [{ event:'phone_click', page_path:'/fr/areas/montreal/kitchen-backsplash', language:'fr-CA', service:'kitchen-backsplash' }]);
  } finally { delete globalThis.window; }
});
test('a broken measurement destination cannot interrupt quote success', () => {
  globalThis.window = { location: { pathname:'/request-a-quote' }, dataLayer: { push(){throw new Error('Destination failed');} } };
  try { assert.doesNotThrow(() => trackEnquiry('generate_lead')); }
  finally { delete globalThis.window; }
});

test('configured analytics receives only event context, and destination errors remain non-blocking', () => {
  const calls=[];
  globalThis.window={location:{pathname:'/fr/request-a-quote',search:'?email=private@example.com',hash:'#private'},tilingAnalytics:(...args)=>calls.push(args)};
  try {
    trackEnquiry('generate_lead','Kitchen Backsplash');
    assert.deepEqual(calls,[['generate_lead',{page_path:'/fr/request-a-quote',language:'fr-CA',service:'Kitchen Backsplash'}]]);
    window.tilingAnalytics=()=>{throw new Error('Analytics blocked');};
    assert.doesNotThrow(()=>trackEnquiry('generate_lead'));
    assert.doesNotMatch(JSON.stringify(window.dataLayer),/private@example|#private/);
  } finally {delete globalThis.window;}
});
