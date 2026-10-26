# Tiling.ca — Canada-wide tile contractor

Tiling.ca provides tile installation, repairs and material supply directly to residential and commercial customers across Canada. The owner requested this positioning on October 11, 2026. Customer-facing content must not describe a referral, matching or independent-contractor network.

## Run and verify

Use Node.js 22.13+ and install the locked dependencies. The existing scripts support development and production builds. After building, run `node --test tests/rendered-html.test.mjs` to check rendered routes, quote configuration, metadata and sitemap coverage.

## Site structure

- National homepage, twelve service pages and five material pages
- Canada-wide coverage page covering all provinces and territories
- Existing 30 Ontario city guides and 210 city/service combinations retained at their original URLs
- About, process, contact, editorial standards, privacy and website terms
- Legacy contractor-review URL permanently redirects to the installation process
- Canonicals, structured data, sitemap and search-engine verification retained

## Quote intake

The working quote form posts to the existing Formspree endpoint `https://formspree.io/f/xdeownaz`. Its endpoint, field names, required fields, error handling and success state are unchanged by the positioning update. Contact details remain `info@tiling.ca` and `(833) 573-TILE (8453)`.

## Images

The October 11 update changes text only; no image binaries, sources or placements were added or moved. The three existing homepage gallery images are presented as tile inspiration, with descriptive alt text and no completed-project claims. Their existing `concept-*` filenames record provenance internally. Other-site image inventories were not audited in this copy update; do not claim portfolio-wide image verification.

Historical design documents under `docs/designs` describe a superseded referral model and must not override the current owner-approved positioning.

## National coverage and service imagery — October 11 update

- 114 city hubs across all 10 provinces and 3 territories, with 798 city/service routes.
- Every city lists neighbourhoods and surrounding communities; linked nearby hubs preserve useful navigation.
- The location directory searches city names, provinces, neighbourhoods and surrounding communities, including accent-insensitive queries.
- Existing Ontario URLs are preserved. Province fields now drive national titles, descriptions, structured data and local guidance labels.
- All twelve homepage service cards have unique photographs. Primary service pages and directory cards retain separate image placements. City cards and local service pages reuse corresponding service imagery under the user-approved location-page exception.
- 13 new image assets were created with built-in image generation, inspected and exported for the site. Prompt records are in `docs/generated-image-prompts.json`; the social card prompt is in the asset register.
- `docs/asset-usage-register.json` records all 31 active photographic/social-image placements. The audit is limited to accessible local project assets; remote portfolio inventories remain unverified.
- `docs/coverage-sources.json` records geographic sources. City pages are service areas, not claims of offices or completed projects.
- The quote endpoint, phone number and delivery behavior are unchanged.

The full production build and rendered-route tests are the publication checks. The October 25 maintenance update supplies Cloudflare runtime declarations and fixes the optional image-binding guard; TypeScript validation now passes.


## Ontario municipal and community coverage — October 12, 2026

- Official Ontario May 26, 2026 roster: all 414 lower-/single-tier municipalities mapped once; 30 upper-tier bodies are represented through geographic browsing rather than duplicate municipality pages.
- 49 Ontario region directories; 368 new municipality pages added to existing Canadian coverage. All twelve services have canonical local pages for each municipality.
- 639 distinct sourced community names (646 parent/community entries due to cross-boundary places) appear as visible service-specific sections and direct links on municipal pages. These are a verified selection, not every Ontario hamlet or an exhaustive Northern/unorganized-area gazetteer.
- Community search retains parent municipality and region to distinguish names such as Durham and Hamilton. Shared-border communities require exact address confirmation.
- Each local service page includes the simplified quote form with municipality and service context. The existing Formspree endpoint is unchanged. No test enquiry sent to the live inbox.
- Geographic sources and boundary cautions: `docs/ontario-source-data/`. Rebuild registry with `python3 scripts/build-ontario-coverage.py`. Coverage counts: `docs/ontario-coverage-audit.json`.
- Municipality names are official source data. Project planning guidance is conditional scoping advice, not evidence of local completed jobs, branches, staffing or universal building conditions.
- Sitemap and internal links expose municipalities, regional directories and services. Publishing does not establish Google indexing, rankings or local search demand; Search Console access is needed to measure those results.
- No photography added or changed in this expansion.


## Commercial application examples

Six application sections on `/services/commercial-tile`: restaurants/cafés, hotels, retail, washrooms, offices and food-service kitchens. Three distinct homepage examples link to the appropriate sections. Nine new generated photographs use separate assets for every placement; no completed-job/client claim is made. Prompts and source paths are in `docs/commercial-image-prompts.json`; active placement register updated to 40. Local commercial pages link to the national application examples without repeating images. Direct commercial quote form retains the existing endpoint.


## Maintenance and GitHub — October 25, 2026

The source uses npm with `package-lock.json` for reproducible installs (replacing the previous Bun lockfile). Node.js 22.13+ is required.

```sh
npm ci
npm run typecheck
npm run test:forms
npm test
npm run dev
```

GitHub Actions runs those validation steps on pushes and pull requests. GitHub is a source backup and collaboration repository; a push does not automatically deploy to Sites. Production remains on the existing OpenAI Sites project and custom domain. Never commit environment files, credentials, customer enquiries or local runtime databases.

Quote submissions retain the same endpoint and field names, with a 20-second confirmation timeout, no automatic retries, a duplicate-submit guard, and explicit provider-success validation. Email delivery was confirmed by the owner during this review. Synthetic form tests do not send real emails.

See `docs/audit-2026-10-25.md` for validation and remaining gaps.


## French implementation and mobile header — October 25, 2026

French routes live under `/fr` with the same stable path segments as English. `app/fr/content.ts` contains Canadian French service/material copy. `app/fr/[[...path]]/page.tsx` resolves the supported route families, including every existing local service area and service combination. French pages use adapted French copy and layouts rather than a word-for-word mirror of every English section.

Both languages have reciprocal hreflang metadata, canonical URLs, sitemap entries and an equivalent-page language switcher that retains query/hash context. The Worker sets the HTML document language from the URL. French quote forms retain the production Formspree endpoint and field names, adding `language=fr-CA`; all UI states are localized.

The mobile/tablet header uses one grid through 1100px: logo, language control and menu on the first row; centered click-to-call phone number on a dedicated row of at least 44px. This removes the previous 30px-row/44px-link mismatch.

Validation: build and TypeScript pass; 38 tests cover existing English functionality, 482 French area hubs, all 15 French services, all five materials, representative local service combinations, form context, redirects, missing routes and sitemap parity. Browser viewport resizing is unavailable; real-phone visual confirmation remains a follow-up.

## Enquiry improvements — October 25, 2026
- Optional callback number on all English and French quote forms; no additional required fields.
- Confirmation provides a clearly labelled email link for project photos/plans. This is an email attachment workflow, not an in-form upload.
- Project prompts ask for work type, approximate dimensions and timing.
- Optional labels flow naturally on narrow screens; form inputs use 16px text.
- Enquiry hooks include language and route-derived service context, exclude query/hash/form data, and cannot interrupt successful submissions if a measurement destination fails.
- Analytics destination and Search Console access are still outstanding. No analytics account or measurement ID is present in the project.
- Real project photographs, approved reviews and a reliable response-time promise still require owner input.

## Herringbone favicon — October 25, 2026
Selected option 1: green/orange herringbone emblem on an opaque ivory field, with padding to preserve contrast on light, dark and coloured browser themes. Versioned v8 files replace the old T icon in the shared English/French layout: 16/32/48px ICO, 16/32px PNG, 180px Apple touch icon and 192/512px manifest icons. Default favicon.ico and apple-touch-icon.png fallbacks are also updated. Browser cache refresh timing may vary.
Artwork isolated with the built-in image tool from the approved five-option board; brief: preserve option 1 geometry, no text, forest green/orange, opaque ivory canvas, generous padding. PNG/ICO exports are resized from that master.
