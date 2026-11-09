import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const policy = JSON.parse(readFileSync(new URL('../app/local-service-publication.json', import.meta.url)));
export const isMerged = (area, service) => policy.mergedServices[area]?.includes(service) || false;
export const localHref = (area, service, prefix = '') => `${prefix}/areas/${area}${isMerged(area, service) ? '#service-' : '/'}${service}`;
export function canonicalPath(path) {
  const url = new URL(path, 'https://tiling.ca');
  const match = url.pathname.match(/^(\/fr)?\/areas\/([^/]+)\/([^/]+)$/);
  return match && isMerged(match[2], match[3]) ? `${match[1] || ''}/areas/${match[2]}` : url.pathname;
}

// Content assertions follow only reviewed local-service redirects. Unexpected
// redirects still fail the caller's status check; this never masks 404s/chains.
export async function finalResponse(request, path) {
  const url = new URL(path, 'https://tiling.ca');
  const canonical = canonicalPath(path);
  let response = await request(path);
  if (canonical !== url.pathname) {
    const service = url.pathname.split('/').at(-1);
    assert.equal(response.status, 308, path);
    const target = new URL(response.headers.get('location'), url);
    assert.equal(target.pathname, canonical, path);
    assert.equal(target.hash, `#service-${service}`, path);
    assert.equal(target.searchParams.get('service'), service, path);
    for (const key of new Set(url.searchParams.keys())) if (key !== 'service') {
      assert.deepEqual(target.searchParams.getAll(key), url.searchParams.getAll(key), path);
    }
    response = await request(target.pathname + target.search);
    assert.equal(response.status, 200, `Single-hop destination for ${path}`);
  }
  return response;
}
