# Nationwide location-page consolidation

Reviewed November 8, 2026, following the owner's instruction to merge overlapping local-service pages throughout the site while keeping both homepages unchanged.

The review covers all 482 location areas in all 10 provinces and 3 territories. This release consolidates another 10,664 English/French URLs into their existing location pages. The sitemap decreases from 14,816 to 4,152 URLs. Across all releases, 11,466 of the original 15,618 URLs now permanently redirect.

All 964 bilingual location hubs remain available. There are 2,994 retained local-service URLs, plus 194 other canonical pages. Consolidation now applies to 481 location areas; all 15 service pairs in Repentigny remain published following review. No municipality is awaiting this rollout.

## Publication decisions

Shared service copy is consolidated where the municipality hub and national service guide can cover the same useful information. Previously retained floor, shower and backsplash pages were included in this review. Reviewed exceptions remain at their existing URLs in both languages. Distinct Toronto and Mississauga planning content is preserved. Search-account exports, report metrics and customer records remain outside the public source repository.

The exact active map is `mergedServices` in [the publication policy](../app/local-service-publication.json). Generate a complete, query-free source inventory with:

```sh
node scripts/export-consolidation-map.mjs
```

The CSV writes to standard output and includes the permanent destination's selected service and section anchor. Historical Bruce, Huron, Grey, Perth and Wellington mappings remain active.

## Visitor and search behavior

- Each retired URL returns one permanent 308 redirect to the same-language location hub and its matching service section. Query parameters survive; the route's original service wins over conflicting query input.
- Each consolidated section includes service scope, exclusions, a quote checklist, a national service guide, a pricing guide and a quote action with city and service selected.
- Existing municipality, housing and community content stays on its own location page. The service menu links to the retained local guide or the corresponding section.
- Sitemaps and internal navigation link directly to surviving pages. Canonicals and language alternates remain query-free. Unknown locations, services and extra path segments continue to return real 404 responses.
- The English and French homepage markup, quote submission endpoint, attachments, pricing calculators and analytics configuration are preserved.

## Verification and follow-up

Release checks cover every active redirect, all surviving sitemap URLs, retained page metadata, internal links, bilingual quote context and homepage equivalence. Results are recorded in [the validation record](nationwide-consolidation-validation.json).

After recrawling, compare old and destination URLs together and review service-query coverage and confirmed enquiries. Missing report rows are not proof of zero demand. This rollout does not establish a ranking improvement, and sitemap acceptance does not establish indexing. Retain permanent redirects for at least a year, preferably indefinitely. Restore a distinct local page, its links and sitemap entry together when new evidence supports it.

Reference: [Google guidance on URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
