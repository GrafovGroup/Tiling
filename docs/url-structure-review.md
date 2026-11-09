# URL structure and regional-directory consolidation

Reviewed November 8, 2026, following the nationwide service-page consolidation.

## Published structure

The sitemap contains **4,138 canonical English/French URLs**, reduced from 4,152. All 482 location areas remain available in both languages. The 2,994 retained local-service pages remain published. Both homepage main-content hashes remain unchanged.

Seven single-municipality regional directories now redirect permanently to their existing municipality hubs in the same language. The hubs already contain every named community, local planning guidance, service links, pricing guides and quote access; no unique project evidence was removed.

| Retired region path under `/locations/ontario/` | Destination under `/areas/` |
| --- | --- |
| chatham-kent | chatham-kent |
| haldimand | haldimand-county |
| hamilton | hamilton |
| kawartha-lakes | kawartha-lakes |
| norfolk | norfolk-county |
| prince-edward | prince-edward-county |
| toronto | toronto |

The same mapping applies under `/fr`. Ottawa and all regions covering multiple municipalities remain published. The explicit policy in `app/region-publication.json` prevents new region records from automatically retiring URLs. Search-account records and enquiry data are not part of the source repository.

## URL rules

- Canonical production origin: `https://tiling.ca`; lowercase registered content paths, no trailing slash except `/`.
- English content uses `/services/`, `/materials/`, `/pricing/`, `/areas/` and `/locations/`. French equivalents keep the existing `/fr` prefix. Established descriptive slugs are preserved.
- Recognized uppercase, repeated-slash, trailing-slash and percent-encoded unreserved-character aliases return one **308** to their final destination, combined with HTTP/www, historical-route and consolidation redirects.
- Reserved encodings, unknown services/locations, extra segments, assets and API paths are not silently reinterpreted as content aliases. Unknown content retains a genuine 404. The retired quote API remains 410.
- Repeated query values, marketing parameters and project context survive redirects. A retired local-service route selects its original service. Query variants use the clean page's canonical and language URLs.
- Region cards, breadcrumbs, structured data and sitemaps link directly to surviving URLs. A municipality no longer links to its own retired region alias as a parent.
- React navigation responses with `text/x-component` content type receive `X-Robots-Tag: noindex`; HTML stays indexable and navigation payloads remain usable.
- Native Sites hosting remains reachable with custom-domain canonical metadata. Robots.txt allows crawling of redirects and canonical signals.

## Verification

- TypeScript check and production build passed.
- 104 rendered regression tests and 19 form/planning/notification tests passed, including all 11,466 existing local-service redirects and the 14 new region redirects.
- Full crawl: 4,138 successful canonical pages, 4,138 unique titles, 4,138 unique descriptions, reciprocal language URLs and 23,170 unique internal path/anchor destinations; no failures or orphan pages.
- English homepage main-content SHA-256: `e16e3bbea671c57ebc8ef30c6f8fb27b34416241e454771b70055b1e1955dc22`.
- French homepage main-content SHA-256: `5808d2fe8c6721a9399b3d79efef111b95024cf5d9e299d30c8350c4c76c43d3`.
- Browser checks confirmed direct region-card navigation and a French retired-region redirect preserving city, service, repeated query values and the photo-attachment control. No additional enquiry was submitted.

The structured crawl report is in `docs/url-structure-validation.json`. These checks validate technical behavior, not future ranking outcomes. Further reductions should follow recrawling and combined old/new URL performance review. Keep the permanent redirects for at least a year, preferably indefinitely. Do not remove distinct municipalities, translations or useful service intent to meet a page-count target.

References: [Google URL structure guidance](https://developers.google.com/search/docs/crawling-indexing/url-structure), [Google canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
