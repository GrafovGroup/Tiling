# Location-page consolidation — first batch

Reviewed November 8, 2026. Baseline: published version 62, source commit `35ebba574a0822df1b82eafc683c56b275e45f1b`.

## Decision

Reduce the automatic location/service matrix in stages. This batch merges **166 English/French URLs (83 service/location pairs)** into **16 existing location hubs**, leaving **15,452 sitemap URLs** instead of 15,618. Every service remains available to explore. The eight locations are Arran-Elderslie, Brockton, Huron-Kinloss, Kincardine, Northern Bruce Peninsula, Saugeen Shores, South Bruce and South Bruce Peninsula.

The complete [URL inventory](page-consolidation-inventory.csv) distinguishes `keep`, `merge-pilot` and `retain-pending-review`. A retained page awaiting review is not a finding that it has no value. The inventory's replacement URLs are clean internal-link destinations; incoming retired URLs also preserve their query parameters and set the original service for the hub's quote form.

## Evidence and limits

- Authenticated Search Console was reviewed with the 16-month selector. Available data covered September 3–November 6, 2026; the site does not have 16 months of history.
- The global page export reaches the 1,000-row display limit. Absence from that export was **not** treated as zero activity.
- A focused page-regex filter covered all eight pilot locations across www/non-www and English/French. The complete displayed table had 19 rows, with 1 click and 43 impressions. Filtered Search Console reports can still omit data; this is reported activity, not a complete record of every visit.
- All 17 city/service pairs appearing in that regional report remain published in **both** languages, even when only one language appeared. All three core services—showers, floor installation and backsplashes—also remain published in every pilot location.
- Search Console's external links report showed 0 links. This does not prove that no backlinks exist.
- GA4 was installed on the review date, so there is no reliable historical conversion baseline. Missing conversion history was not used to identify underperformers.
- The merged pages use shared service guidance and location context already represented on their own city hub. No unique project case studies, reviews or verified project evidence were removed.
- Raw performance exports stay outside the published source repository. No customer enquiry records were used or published.

## Behavior

- Retired URLs return a single permanent **308** redirect to the corresponding language/city hub and named service section. Host normalization is combined into the same redirect.
- Repeated query parameters survive. The original route's service takes precedence over a conflicting `service` query parameter. Unknown cities/services and extra path segments remain 404s.
- Each merged service has an indexable section containing its scope, exclusions, expandable quote checklist, full service guide, relevant pricing guide and a quote link with city/service preselected.
- Existing local housing, community and regional context stays on the hub. The hub form preserves valid selected-service context; canonical and reciprocal language URLs remain query-free.
- Service cards on pilot hubs become a compact menu without 15 tile photographs. Other hubs and the production homepage retain their current presentation.
- Sitemap, service links, nearby-area links, pricing backlinks and the Ontario service filter point directly to surviving pages/sections. Redirecting URLs are excluded from the sitemap.
- `app/local-service-publication.json` freezes the existing area/service footprint and records reviewed merges. Adding a new city or service to content data does **not** automatically publish its full matrix. Explicit reviewed additions go in `additionalApprovedPages` as `area/service` strings. Both languages move together.

## Further batches and monitoring

Do not apply a numerical deletion quota. Protect pages with relevant queries, clicks, backlinks, enquiries, distinctive project evidence or a strong unmet local intent. For remaining pages, obtain scoped performance exports below reporting limits and review actual coverage and content before deciding.

After publication and recrawling, compare the combined old/new URL groups, not just retired-URL traffic. Track search clicks, impressions, query coverage and confirmed enquiries; use similar unchanged locations as a comparison and account for seasonality. The pilot had almost no observed search traffic, so absence of a measurable decline alone cannot prove a ranking benefit. Extend only when the consolidated hubs are being crawled/indexed correctly and useful service-query coverage is preserved.

Keep redirects for at least one year, preferably indefinitely. Restore individual pairs if relevant intent is lost or new evidence warrants a distinct page; restore their links and sitemap entries together. Do not use blanket `noindex`, robots blocking or unrelated homepage redirects to hide the matrix.

References: [Google URL migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [Google guidance on doorway pages](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse).

## Inventory reason codes

- `core-or-hub`: distinct core page, service/material/pricing guide, directory or location hub.
- `reported-search-activity`: retain both languages of a pilot city/service pair with reported activity.
- `core-installation-intent`: retain showers, floors and backsplashes during this pilot.
- `pilot-shared-guidance`: merge shared guidance into the same-language hub; no activity reported in the scoped regional review.
- `review-incomplete`: retain until demand, link, enquiry and content review is complete.
