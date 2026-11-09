# Quote forms and pricing calculators — November 8, 2026

Inner-page quote forms now support optional service and timing selections and optional photo/plan attachments. Only name, email and city remain required. Existing city, service and material context is retained; visitors can change the selected service. Both English and French interfaces are supported.

Attachments use the existing Formspree endpoint with multipart submission. Supported formats are JPG, PNG, WebP, HEIC/HEIF and PDF. Client-side checks allow up to five files, 5 MiB each and 10 MiB total, with provider limits applying independently. Invalid selections show a localized error without clearing the project details. File names and contents are never sent as analytics event data. No new recipient, paid plan, storage service or account setting was introduced. The privacy copy describes the attachment processing.

Twelve installation/supply pricing guides now contain a quantity calculator in both languages. Visitors can sum up to ten rectangular surfaces or enter a total area, use feet or metres, adjust a cutting allowance from 0–30%, and optionally calculate full cartons from the product's stated coverage. The default 10% is explicitly adjustable rather than a product specification. Measurements and product suitability need verification before ordering.

The floor installation guide additionally offers three independently scoped budget examples using its existing published benchmarks. Labour-only and supplied-and-installed examples retain their separate source, region and exclusion notes. Budget arithmetic uses installed area; the purchasing allowance is not added to labour. The examples are not Tiling.ca prices or quotes. Other specialist guides do not turn whole-project ranges into unsupported per-area estimates.

A calculator result can populate an editable quote note while preserving city, service, material and language context. Only bounded numeric measurement parameters and recognized units are accepted. Canonical and language metadata stay query-free; no additional indexed routes were added.

## Verification

- TypeScript and production build passed.
- 95 rendered-route checks and 19 unit checks passed, including multipart payload preservation, attachment validation, metric conversion, carton rounding, invalid input handling and quote context.
- Browser checks covered desktop and 390/320-pixel layouts, French decimal commas, source-specific budget results, calculator-to-quote navigation, oversized-file feedback and a supported photo selection.
- No live enquiry or attachment was submitted to the production inbox during testing. Formspree attachment capability and submission storage were verified in the existing account; multipart transport was tested with a simulated provider response.
- English and French homepage main markup is unchanged. New form controls are explicitly enabled on inner pages only, and new styles are scoped to those controls and calculators.
- The 15,452-URL sitemap, active consolidation policy, production homepage design and unpublished homepage alternatives are retained.

Reference: [Formspree file-upload documentation](https://help.formspree.io/articles/building-your-form/file-uploads/).
