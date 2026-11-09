# GitHub production snapshot

This repository includes published **Sites version 64**, source commit `0a94d870c07aad1584cea236b6e303e9ece9c8aa`, and the separate [unpublished homepage concepts](docs/designs/homepage-alternatives-2026-11-08/README.md).

- Inner-page quote forms now offer optional service/timing selections and photo/plan attachments. Twelve bilingual pricing guides include quantity calculators, and the floor guide includes source-specific budget calculations. The current homepage remains unchanged. [Implementation and validation](docs/quote-and-calculator-update.md).
- The first consolidation pilot reduces the sitemap from 15,618 to 15,452 URLs. All reported pilot city/service search activity is protected in both languages. [Decision and monitoring plan](docs/page-consolidation.md) · [Complete URL inventory](docs/page-consolidation-inventory.csv) · [Validation](docs/page-consolidation-validation.json).
- Prior content, pricing, accessibility, image optimization, redirect, 404 and enquiry improvements are retained.
- GA4 `G-83XS8KT8EM` remains a Sites runtime setting, with explicit visitor consent, Enhanced Measurement off and confirmed submissions tracked as `generate_lead`. No environment files or credentials are stored in this repository.
- GitHub Actions validates code; it does not deploy the site. The homepage alternatives remain documentation only. [Source manifest](docs/github-sync-2026-11-08-consolidation.json).

A [rollout checklist for further consolidation](docs/page-consolidation-next-batch.md) is available. It is planning documentation only; further redirects require the pilot checkpoint and a fresh evidence review. Detailed account observations and candidate URL decisions are kept in private working files.

Later updates supersede historical notes below.

---

# Current consolidation update

The first reviewed location-page consolidation merges 166 URLs into their existing city hubs, preserves all reported pilot search activity in both languages, and reduces the sitemap to 15,452 URLs. New city/service combinations require explicit publication review. See the [decision and monitoring plan](docs/page-consolidation.md) and [complete keep/merge inventory](docs/page-consolidation-inventory.csv). The three alternative homepage designs remain unpublished.

---

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


## Pricing guides and location quality — November 8, 2026

- `/pricing` now groups 15 service guides, including the original floor, shower and backsplash guides. French equivalents use the same stable path segments under `/fr`.
- `app/pricing-data.ts` records published third-party ranges, source URLs, regions, scope and the actual review date. These are industry planning examples, not Tiling.ca rates, quotes or a measured national average. Labour-only figures remain separate from material-and-installation packages; unspecified inclusions and taxes must be confirmed.
- Update the source observations and review date together. Do not roll the date forward without rechecking the linked sources. No `Offer` or product-price schema is emitted for these editorial comparisons.
- `app/local-project-brief.tsx` adds distinct, bilingual planning scenarios for Toronto and Mississauga, plus service-specific notes for floors, showers and backsplashes. They are conditional planning guidance, not completed-project claims.
- Relevant local and national service pages link to the guides. City context is validated and retained when a customer moves from a local page to a guide and then requests a quote.
- Service-page geographic link walls now use 13 province/territory directory links. Community names and anchors remain, with a concise enquiry link instead of repeating all 15 services for every community. City hubs retain all service links; all existing routes, canonicals, hreflang pairs and sitemap entries remain available.
- There is no bulk removal, redirect, canonical consolidation or `noindex` change without Search Console evidence. Analytics access, verified customer work and approved first-party price data remain outstanding.
- New rendered-route tests cover bilingual guide metadata, source disclosures, valid quote context, unknown routes, sitemap entries and location navigation. Form delivery remains unchanged; no synthetic enquiry is sent to the live inbox.


## Nationwide local planning rollout — November 8, 2026

All 482 location hubs and all 15 city/service route families now render local planning content in English and French. The original Toronto and Mississauga briefs remain; other locations use `city-project-planning.tsx` with local community/access context and the municipality-specific housing record in `local-housing.json`. The housing evidence is a dated 2021 snapshot, not a claim about current building condition or local prices. Practical preparation questions are selected for the main published dwelling categories. Commercial, pool, exterior and rooftop pages do not infer property suitability from residential census counts.

The source is Statistics Canada table 98-10-0041-01, downloaded November 8, 2026. `scripts/import-local-housing.py` reproduces the checked-in subset from the official English ZIP; `docs/local-housing-audit.json` records the checksum, matching rules and reviewed exceptions. Exact names are matched within the province; ambiguous municipality names have explicit mappings. Langley and North Vancouver combine their two municipalities, while the wider Toronto / Wood Buffalo / Cape Breton references are labelled for North York / Fort McMurray / Sydney. Suppressed Cockburn Island counts remain unavailable. Displayed counts are rounded and use 2021 boundaries, including where later boundary changes occurred. They do not distinguish rental from condominium tenure. No geographic facts are fetched at runtime.

Each hub features the three original guides and exposes the twelve additional service guides as crawlable links in an expandable list. Every national and city/service page links its own guide. Legacy comparison-guide URLs remain valid and retain their scope notes. Guide links preserve validated city and service context through to the quote form. Canonicals stay query-free. All existing paths remain, including the historical Mattice-Val Côté URL whose display-name encoding was corrected. No company branches, completed projects, local rates or permit rules were invented.

Validation: `tests/location-rollout.test.mjs` checks every hub in both languages, all service families across representative cities, geographic exceptions, suppression, guide scope, and validated quote context. Existing route, metadata and form suites remain in place.


## Remaining service pricing guides — November 8, 2026

- Twelve new bilingual guides complete coverage of all 15 services: large-format tile, heated floors, commercial work, removal/preparation, repair/regrouting, cleaning/sealing, supply/delivery, stairs, outdoor/balconies, fireplaces/feature walls, pools/spas and rooftop pedestal pavers.
- `app/pricing-expansion.json` contains reviewed bilingual copy and source records; `docs/pricing-source-audit.json` records the exact source pricing and scope checks. The pricing hub groups all 15 guides into four categories. Each article links three relevant related guides.
- Third-party benchmarks distinguish installed work, labour, materials and shipping. Small-job minimums and unknown inclusions are visible. Heating-only examples are separate from heating-and-tile packages. Stair examples use different units and are not combined into a market range. Rooftop examples cover components only; a complete installed rooftop price is not established. Pool coverage is explicitly limited to one Quebec contractor’s unspecified-size example, not a verified spa range.
- All 482 city hubs and all service families inherit the guide links in English and French. Valid city/service context continues to the quote form; canonical URLs remain query-free. Sources and Article citations are visible, with no Offer schema or invented local rates.
- `tests/pricing-expansion.test.mjs` verifies complete service coverage, all added bilingual routes, source disclosures, index/sitemap discovery, direct service links and quote context. The location suite checks all city hubs. Form submission behavior is unchanged.


## Service-page content expansion — November 8, 2026

All 15 national service pages now share `app/service-content.tsx` in English and French, with original service-specific copy in `app/service-guides.json`. The pages add three project options, three planning stages, a concrete quote checklist, scope boundaries and three additional FAQs, retaining existing service FAQs. Each page links its own pricing guide, three related services and relevant material pages. Province navigation remains compact; French service pages lead to the existing searchable directory.

`docs/service-content-audit.json` records competitor observations and technical cross-checks. The improvements use clearer choices, scope and preparation; competitor credentials, project claims, guarantees and extra services are not adopted. Service imagery remains illustrative. No search ranking improvement is guaranteed.

The shared template supplies unique metadata, connected WebPage/Service entities, visible FAQ content and matching FAQ schema. Service-specific quote links and the inline form keep the requested service selected. Commercial application anchors and its existing enquiry anchor are preserved. Local service pages retain their city content and link to the expanded national guide; existing route, canonical, language and pricing behavior stays intact.

`tests/service-expansion.test.mjs` checks all 30 service routes, metadata and schema, selected-service enquiry context, FAQ visibility, navigation anchors and valid internal resource links. It also checks the local-to-national guide links. No real enquiry is submitted during validation.


## Material-selection guides — November 8, 2026

All five material pages and the comparison hub now share bilingual layouts in `app/material-content.tsx`, with original selection, application, care, ordering and FAQ copy in `app/material-guides.json`. Marble and granite are explicitly part of natural stone, while porcelain is part of the ceramic family. The broader stone guide focuses on limestone, travertine and slate. Manufacturer and trade references support material guidance; competitor observations are retained in `docs/material-content-audit.json` without attributing ranking causes or adopting unverified offerings.

Material pages link relevant services and cost guides. Pricing references remain scoped industry benchmarks, not prices for a selected stone or tile product. A validated material selection is carried through the primary material/service/pricing/quote paths along with service and city context. `QuoteForm` adds an optional visible material label and hidden material field to the existing submission; no endpoint, delivery, retry or success behavior changes. Unknown and repeated query values are ignored.

Guides have unique metadata, current sitemap dates, Article schema and four visible FAQs with matching schema. They are editorial material guides, not an inventory catalogue: no Product, Offer, stock or SKU claims are added. Existing CSS surface illustrations remain labelled as illustrations.

`tests/material-expansion.test.mjs` verifies all ten guide routes, bilingual comparison hubs, source/FAQ markup, internal links, quote context, validation and sitemap dates. Browser QA covers desktop/mobile layouts and a locally intercepted form submission; no real enquiry is sent.


### Homepage planning update — November 8, 2026

The English and French homepages share `home-content.tsx` and the bilingual copy in `home-data.ts`. Four early planning routes lead to services, materials, pricing and locations. Six service cards lead the page; nine additional service cards remain in an accessible native disclosure. The homepage also includes scoped third-party pricing examples, all five material guides, a city/community finder, labelled inspiration with contextual service/material/pricing/quote links, a three-step process, one enquiry form and matching visible/schema FAQs.

`home-locations.tsx` searches existing areas without inventing offices or service availability. Exact city matches are prioritized, accents are normalized, and the full location directories preserve a bounded `q` parameter while retaining canonical URLs. Existing form submission behavior and recipient endpoint are unchanged. `tests/home-expansion.test.mjs` checks destination resolution, bilingual navigation, metadata, FAQ parity, search handoff and quote context. Competitor observations and claim boundaries are recorded in `docs/home-content-audit.json`.


### About and process update — November 8, 2026

`company-content.tsx` and `company-data.ts` provide the English and French About and How It Works pages. About explains the direct working relationship, material decisions, responsibilities and coverage. The process uses five shared stages with written-scope and readiness checklists, service-specific paths, change and handover questions, contextual guide links and one existing quote form per page. No unverified company biography, credentials, reviews or warranty promise is added.

The original hero assets, contact details and Formspree delivery remain in use. Page-specific metadata, AboutPage/WebPage entities, breadcrumbs, matching FAQ schema and sitemap dates are updated. `tests/company-expansion.test.mjs` checks all resource destinations and section anchors, locale parity, metadata, forms, scope and stage availability. Source observations and claim boundaries are recorded in `docs/company-content-audit.json`.
