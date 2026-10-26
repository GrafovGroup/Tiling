# Search and enquiry follow-up — October 11, 2026

## Implemented

- Initial-head metadata for browser and crawler user agents through supported framework configuration.
- Contextual quote links and validated city/service prefill.
- Earlier local enquiry form, expandable planning guidance, mobile contact actions.
- In-memory dataLayer events only: phone_click, quote_start, generate_lead (successful Formspree response only), quote_error. Payload contains event, page_path (no query string), and selected service only. No name, email, project note or typed city enters event payloads. No analytics script, cookies or external measurement requests have been added.

## Account connection required

Obtain the existing GA4 measurement ID or Tag Manager container and access. Connect the events above, mark generate_lead as a key event, then verify in the provider's debug view. Treat phone_click as call intent, not a completed call or lead. Exclude internal testing.

Verified authenticated access to the tiling.ca domain property in Google Search Console and https://tiling.ca/ in Bing Webmaster Tools on October 11, 2026. Baseline: Google 1.76K impressions, 0 clicks, average position 40.7 in selected three months; indexing report last updated October 3 shows 89 indexed and 178 not indexed. Bing selected July 11–October 10 shows 2 impressions and 0 clicks. Both retained the old 264-URL sitemap. The signed-in Google Analytics account search has no Tiling.ca property. Submit https://tiling.ca/sitemap.xml, inspect representative home/service/city/local-service URLs, and review indexing exclusions and actual query impressions. Record baseline sessions, organic clicks, form starts, successful enquiries and conversion rate before assessing improvements.

robots.txt currently allows all user agents, including OAI-SearchBot. This does not prove search inclusion or that every hosting-security rule permits crawler IPs. Compare live crawler responses and provider diagnostics before concluding any indexing issue is fixed.

## Evidence needed from business owner

Prioritize cities based on actual jobs and business capacity. For each real case study: city, project type, scope, materials, preparation, challenges, outcome, and approved photos. Obtain permission to publish customer names/reviews. Confirm team details, insurance, warranty terms and any response-time commitment before adding claims. Existing inspiration photos must not be described as completed Tiling.ca projects without evidence.

Do not expand duplicate city/service combinations merely to increase page count. Improve useful local guidance and connect real projects to relevant service/city pages. Preserve current URLs while evaluating indexing and demand data.

## IndexNow

The public root ownership file and docs/indexnow-config.json configure IndexNow. After publishing content changes, run scripts/submit-indexnow.mjs with an optional receipt output path. It verifies the live ownership file and submits canonical sitemap URLs (maximum 10,000). HTTP 200 means received, not indexed; HTTP 202 means ownership validation pending. This is a manual post-deploy step, not an automatic background job.

## Form check

One labelled test TILING-QA-20261011-FINAL was accepted through the published form. The connected Gmail search returned no match; inbox delivery is not independently confirmed.
