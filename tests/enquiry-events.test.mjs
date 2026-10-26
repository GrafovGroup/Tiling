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
