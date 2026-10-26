# Current priorities

- Complete English/French parity for the existing site, including forms, navigation, service/location content and metadata. Current pages are English-only.
- Connect owner-approved enquiry analytics and review Search Console performance. Existing dataLayer events have no analytics destination.
- Measure mobile Core Web Vitals with field data; no performance score is claimed by the October 25 audit.

---

# Archived referral-model backlog (superseded)

The items below are historical only and must not guide implementation for the current direct-provider business.

# TODOS

## Product

### Add a protected homeowner request-status page

**What:** Let a homeowner securely view request status, supply missing information, correct details, cancel, withdraw sharing consent, and see whether contact information was shared.

**Why:** Reduces “did you receive my request?” anxiety and operator email work after the concierge matching workflow is validated.

**Pros:** Clear self-service status and fewer manual updates.

**Cons:** Adds authentication-link security, privacy states, token recovery, and more lifecycle UI.

**Context:** Explicitly deferred during the 2026-08-25 selective CEO review. Release one must still support correction, cancellation, consent withdrawal, and sharing-history requests through reply links or operator assistance. Start from the stable CRM request ID, existing state machine, and signed-link patterns after the Ontario pilot proves the workflow.

**Effort:** M
**Priority:** P3
**Depends on:** Validated CRM lifecycle, homeowner identity-confirmation policy, and five-request Ontario pilot

### Explain why a contractor matched

**What:** Show the homeowner a short factual explanation of the geographic, category, material, size, and availability criteria that qualified an introduced contractor.

**Why:** Makes tile-specific matching more transparent than a generic contractor directory.

**Pros:** Stronger trust and clearer differentiation.

**Cons:** Requires carefully reviewed language and must never imply ranking, guarantee, or unverified quality.

**Context:** Explicitly deferred during the 2026-08-25 selective CEO review. Release one records the operator’s internal selection reason but does not render a homeowner-facing rationale. Generate future explanations only from reviewed contractor and coverage facts.

**Effort:** S
**Priority:** P3
**Depends on:** Validated matching criteria, reviewed contractor data, and approved public trust wording

## Operations

### Add an internal demand-versus-coverage dashboard

**What:** Visualize homeowner demand, reviewed contractor supply, supported categories, failed-match reasons, and publication readiness by city and FSA.

**Why:** Helps choose the next contractor-recruiting market from real demand and coverage gaps instead of keyword volume alone.

**Pros:** Faster expansion decisions and visible supply bottlenecks.

**Cons:** Premature before the pilot establishes reliable fields, reports, and decision cadence.

**Context:** Explicitly deferred during the 2026-08-25 selective CEO review. Release one uses views and reports in the selected CRM. Revisit after Ontario activity proves which metrics operators actually use.

**Effort:** M
**Priority:** P3
**Depends on:** Selected CRM, stable event model, and sufficient Ontario request volume

## Completed
