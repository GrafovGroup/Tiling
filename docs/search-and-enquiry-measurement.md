# Search and enquiry measurement — November 8, 2026

## Implemented

- Permanent 308 redirects consolidate public www/HTTPS aliases and the four historical route pairs in English and French. Paths and query values survive; combined host/route changes use one application hop. The hosting edge may still upgrade HTTP before the application runs; verify the live response separately.
- Shorter bilingual local titles and descriptions preserve full municipality names, self-canonicals, social metadata and language alternates. No local URLs were removed or merged without search evidence.
- A shared contact listener covers phone, email and quote actions, including French footer/contact links and both 404 pages, once per click. Form starts count field focus; only confirmed provider success counts generate_lead. Failures retain typed details and offer phone/email alternatives.
- Events: phone_click, email_click, quote_click, quote_start, generate_lead, quote_error. Custom event context contains page path, language and service, never typed form values or URL query strings. Phone/email clicks are intent, not completed calls or leads.
- GA4 integration uses the production GA4_MEASUREMENT_ID setting; without a valid ID it stays off. An incoming request header cannot override this setting. Once configured, Google’s tag loads only after the visitor explicitly allows analytics; visitors can decline or withdraw without affecting quotes. Advertising consent stays denied. Choices appear below the footer in both languages and do not cover enquiry controls.
- IndexNow submission now supports the 15,618-URL sitemap in batches of at most 10,000, with per-batch receipts and no automatic retry after a failure.

## GA4 property created

Created November 8, 2026 in the existing Grafov Group account (213675022): property Tiling.ca (563208066), web stream Tiling.ca website (16300192496), https://tiling.ca, measurement ID G-83XS8KT8EM. Reporting time zone: Canada/Toronto. Currency: CAD. Industry: Home & Garden. Business size: 1–10 employees, confirmed by the owner. Objectives: generate leads and understand web traffic.

Enhanced Measurement was disabled with the owner’s explicit approval, so automatic form/search/outbound events do not bypass the site’s limited event payload. GA4_MEASUREMENT_ID is configured through Sites runtime settings (revision 1). Only visitor-approved analytics loads the Google tag. Advertising consent remains denied; Google Signals and advertising personalization are disabled by the tag configuration. Page URLs omit query strings/fragments and referrers are reduced to their origin.

generate_lead is configured as a key event, counted once per event with no assigned monetary value. Phone/email clicks are not marked as completed leads. Verify collection in Realtime/DebugView separately from code-level tests, and compare actual accepted submissions with Formspree/inbox records. A synthetic journey must not send a real customer enquiry.

## Search Console baseline verified November 8, 2026

Authenticated Search Console for the tiling.ca domain shows 83 clicks, 12.4K impressions, 0.7% CTR and average position 36.6 with the three-month selector active (chart September 3–November 6). The page indexing report, last updated October 22, shows 2,635 indexed and 6,440 not indexed. Exclusions: discovered/currently not indexed 6,110; alternate with canonical 292; duplicate without canonical 22; crawled/currently not indexed 13; redirect 2; noindex 1.

The noindex example is the historical /request-a-match URL (last crawled September 5). Its replacement now returns a 308 to the current, indexable quote page; Google validation was started November 8. The current sitemap was resubmitted successfully; Google's table still shows its previous 15,586 discovered URLs while reprocessing is pending. IndexNow received all 15,618 current URLs in two HTTP 200 batches.

Realtime confirmed page_view, quote_start and quote_click arriving from consented site navigation. No real enquiry was submitted. Compare future accepted submissions with inbox/Formspree records. Current Bing reports and actual enquiry outcomes are still needed. Sitemap receipt does not prove indexing, and these observations do not establish that the latest edits caused the earlier search performance. Do not remove or consolidate location pages solely because they share planning guidance.

Live www and legacy URLs return 308 with query values preserved. The hosting edge still upgrades HTTP to HTTPS with 302 before application code; the available Sites controls do not expose that redirect status.

### Historical baseline (not a current report)

Verified authenticated access to the tiling.ca domain property in Google Search Console and https://tiling.ca/ in Bing Webmaster Tools on October 11, 2026. Baseline: Google 1.76K impressions, 0 clicks, average position 40.7 in selected three months; indexing report last updated October 3 shows 89 indexed and 178 not indexed. Bing selected July 11–October 10 shows 2 impressions and 0 clicks. Both retained the old 264-URL sitemap. The signed-in Google Analytics account search has no Tiling.ca property. Submit https://tiling.ca/sitemap.xml, inspect representative home/service/city/local-service URLs, and review indexing exclusions and actual query impressions. Record baseline sessions, organic clicks, form starts, successful enquiries and conversion rate before assessing improvements.

robots.txt currently allows all user agents, including OAI-SearchBot. This does not prove search inclusion or that every hosting-security rule permits crawler IPs. Compare live crawler responses and provider diagnostics before concluding any indexing issue is fixed.


## Evidence required for trust and local proof

Obtain actual service priorities, approved original project photos and scope/outcome details before publishing cases. Team identities, reviews, credentials and warranty terms need owner verification. Inspiration remains labelled; no new portfolio, review, rating, office or warranty claim was invented.

## Publication checks

Run the rendered-route tests, the full metadata uniqueness/canonical audit, and intercepted EN/FR form success/rejection/network-failure journeys. Browser analytics checks use a synthetic ID with Google's external script blocked by the local preview's Content Security Policy; they verify consent controls and persistence. Unit tests verify custom-event payloads. Neither proves arrival in an actual property. No live customer enquiry is generated by these checks.

After deployment run scripts/submit-indexnow.mjs with a receipt path. HTTP 200 means received; 202 means key validation pending. Preserve partial receipts and inspect failures before retrying.
