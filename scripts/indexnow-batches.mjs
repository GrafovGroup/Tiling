/** IndexNow limits each request to 10,000 URLs, not the whole site. */
export function sitemapBatches(xml, host, limit = 10000) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 10000) throw new Error('Invalid batch size');
  const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&')))];
  if (!urls.length || urls.some(value => {
    try { const url = new URL(value); return url.origin !== `https://${host}` || !!url.search || !!url.hash; }
    catch { return true; }
  })) throw new Error('Invalid canonical sitemap URL list');
  const batches = [];
  for (let offset = 0; offset < urls.length; offset += limit) batches.push(urls.slice(offset, offset + limit));
  return batches;
}

export async function submitBatches(config, batches, fetcher = fetch) {
  const receipts = [];
  for (const [index, urlList] of batches.entries()) {
    let receipt;
    try {
      const response = await fetcher(config.endpoint, {
        method: 'POST', headers: { 'content-type': 'application/json' }, signal: AbortSignal.timeout(45000),
        body: JSON.stringify({ host: config.host, key: config.key, keyLocation: config.keyLocation, urlList }),
      });
      receipt = { batch: index + 1, urlCount: urlList.length, status: response.status, response: await response.text(), accepted: [200, 202].includes(response.status) };
    } catch (error) {
      receipt = { batch: index + 1, urlCount: urlList.length, status: null, response: error instanceof Error ? error.message : 'Network failure', accepted: false };
    }
    receipts.push(receipt);
    if (!receipt.accepted) break; // Preserve the receipt; do not repeat already accepted batches.
  }
  return receipts;
}
