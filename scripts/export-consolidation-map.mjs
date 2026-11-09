import { readFile } from 'node:fs/promises';

// Reproduce every redirect from the published policy without exporting private
// search reports or enquiry records. Redirect URLs are not sitemap entries.
const policy = JSON.parse(await readFile(new URL('../app/local-service-publication.json', import.meta.url)));
process.stdout.write('url,destination\n');
for (const [area, services] of Object.entries(policy.mergedServices)) {
  for (const service of services) for (const prefix of ['', '/fr']) {
    const hub = `https://tiling.ca${prefix}/areas/${area}`;
    process.stdout.write(`${hub}/${service},${hub}?service=${service}#service-${service}\n`);
  }
}
