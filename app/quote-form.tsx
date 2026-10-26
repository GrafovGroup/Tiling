"use client";

import { useRef, useState, type FormEvent } from "react";
import { trackEnquiry } from "./enquiry-events";
import { business } from "./data";
import { submitQuoteRequest } from "./submit-quote";

export function QuoteForm({ compact = false, defaultCity = "", serviceName = "" }: { compact?: boolean; defaultCity?: string; serviceName?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "succeeded" | "failed">("idle");
  const [error, setError] = useState("");
  const started = useRef(false);
  const inFlight = useRef(false);

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    form.set("_subject", `Tile project quote${serviceName ? ` — ${serviceName}` : ""} — ${form.get("city")}`);
    form.set("source_page", window.location.href);
    setStatus("submitting");
    setError("");

    try {
      await submitQuoteRequest(business.formspreeEndpoint, form);
      formElement.reset();
      setStatus("succeeded");
      trackEnquiry("generate_lead", serviceName);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "The request could not be submitted.");
      setStatus("failed");
      trackEnquiry("quote_error", serviceName);
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "succeeded") return <div className="form-success" role="status" aria-live="polite">
    <b>Thank you. Your request has been received.</b>
    <p>We will review the project details and follow up using the contact information you provided.</p>
    <button type="button" onClick={() => { started.current = false; setStatus("idle"); }}>SEND ANOTHER REQUEST</button>
  </div>;

  return <form className={`quote-form ${compact ? "quote-form-compact" : ""}`} action={business.formspreeEndpoint} method="POST" aria-busy={status === "submitting"} onSubmit={submitQuote} onFocus={() => {
    if (!started.current) { started.current = true; trackEnquiry("quote_start", serviceName); }
  }}>
    <label className="quote-honeypot" aria-hidden="true">Leave this field empty<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label>
    <input type="hidden" name="_subject" value="New Tiling.ca quote request" />
    {serviceName && <input type="hidden" name="service" value={serviceName} />}
    {serviceName && <p className="full quote-service-context">Your service: <strong>{serviceName}</strong></p>}
    <label>Name<input name="name" autoComplete="name" maxLength={100} required /></label>
    <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    <label className="full">City<input name="city" defaultValue={defaultCity} maxLength={120} autoComplete="address-level2" placeholder="Where is your project?" required /></label>
    <label className="full">Project note <span className="optional-label">Optional</span><textarea name="details" maxLength={5000} rows={3} placeholder="For example: a bathroom floor in Toronto." /></label>
    {status === "failed" && <p className="form-error" role="alert">{error} You can also email <a href={`mailto:${business.email}`}>{business.email}</a>.</p>}
    <button className="button button-primary" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending…" : "Request a quote"}</button>
    <small className="full">We’ll use your details to reply about your project. <a href="/privacy">Privacy policy</a></small>
  </form>;
}
