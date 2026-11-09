# Huron location consolidation

November 8, 2026. This release merges 196 English/French local-service URLs into 18 existing municipality hubs. The sitemap falls from 15,452 to 15,256 URLs. Together with the first batch, 362 of the original 15,618 URLs have been consolidated.

The nine municipalities are Ashfield-Colborne-Wawanosh, Bluewater, Central Huron, Goderich, Howick, Huron East, Morris-Turnberry, North Huron and South Huron. [Exact redirect mapping](huron-consolidation-urls.csv).

## Visitor and search behavior

- Every municipality hub remains available in both languages. Showers, floor installation and backsplashes retain separate local pages everywhere, along with the other retained local services in the publication policy.
- Retired URLs return one permanent 308 redirect to the matching municipality, language and named service section. Existing query parameters survive and the original service is selected in the destination quote form.
- Hub sections preserve service scope, exclusions, quote checklists, links to the full service and pricing guides, and a quote link with municipality and service selected. Local housing, community and regional content remains on the hub.
- Internal links and the sitemap use the surviving URLs. Canonicals and reciprocal language alternates remain query-free.
- The homepage, contact options, attachment-enabled forms and pricing calculators retain their existing behavior. Grey, Perth and Wellington consolidation remains inactive.

## Validation and monitoring

The rendered route checks cover every active retired URL in both languages, all retained core services, selected-service handling, canonical and language links, sitemap counts, and the boundaries of this regional rollout. All 96 rendered checks and 19 unit checks passed. The full 15,256-URL audit found no failures or internal links to retired routes. English and French homepage main markup is byte-identical to the previous publication. [Validation record](huron-consolidation-validation.json).

Review crawl/indexing reports and combined old/destination search coverage after recrawling; this release does not establish a ranking improvement. Keep redirects for at least one year, preferably indefinitely. If a distinct service/location page becomes useful, restore its publication policy entry, internal links and sitemap presence together. Keep account analytics, enquiry records and unpublished candidate decisions outside this public repository.

Reference: [Google guidance on URL changes and permanent redirects](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
