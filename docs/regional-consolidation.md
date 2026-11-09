# Grey, Perth and Wellington consolidation

November 8, 2026. This release consolidates 440 English/French local-service URLs into 46 existing municipality hubs. The sitemap falls from 15,256 to 14,816 URLs. Across all reviewed batches, 802 of the original 15,618 URLs have been consolidated.

| Region | Municipalities | Retired URLs |
| --- | ---: | ---: |
| Grey | 9 | 184 |
| Perth | 6 | 110 |
| Wellington | 8 | 146 |
| Total | 23 | 440 |

[Exact redirect mapping](regional-consolidation-urls.csv).

## Preserved pages and behavior

Every municipality hub and its shower, floor-installation and backsplash pages remain available in both languages. Other retained local pages remain published too, including Wellington North tile supply and Guelph tile repair. The remaining review is complete; retained URLs are not queued for automatic retirement.

Retired URLs return one permanent 308 redirect to the matching language, municipality and named service section. Existing query parameters are preserved, and the original route selects the service in the destination quote form. Internal navigation, service/pricing backlinks and the sitemap point directly to surviving destinations.

Consolidated sections retain the service scope, exclusions, quote checklist, relevant full service and pricing guides, and a quote action with municipality and service selected. Housing, community and local planning context stays on each hub. Canonicals and reciprocal language alternates remain query-free.

The homepage, optional quote attachments, pricing calculators and core service/material/pricing pages retain their existing behavior. The earlier Bruce and Huron redirect mappings are unchanged.

## Validation and follow-up

All 97 rendered checks and 19 unit checks passed, including every active redirect and retained local intent in both languages. The full 14,816-URL audit found no failures or internal links to retired pages. English and French homepage main markup is byte-identical to the previous publication. Mobile quote selection was verified at 390 and 320 pixels. [Validation record](regional-consolidation-validation.json).

After recrawling, compare combined old/destination search coverage and confirmed enquiries. Publication and sitemap acceptance do not establish indexing or ranking gains. Retain permanent redirects for at least a year, preferably indefinitely. Restore a distinct service page, its internal links and sitemap entry together if new evidence supports it. Keep search-account exports, customer records and unpublished review evidence outside this public repository.

Reference: [Google guidance on URL changes and permanent redirects](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
