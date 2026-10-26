"use client";

import { useRef, useState, type FormEvent } from "react";
import { trackEnquiry } from "./enquiry-events";
import { business } from "./data";
import { submitQuoteRequest } from "./submit-quote";

export function QuoteForm({ compact = false, defaultCity = "", serviceName = "", locale = "en" }: { compact?: boolean; defaultCity?: string; serviceName?: string; locale?: "en" | "fr" }) {
  const fr = locale === "fr";
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
    form.set("_subject", `${fr ? "Demande de soumission" : "Tile project quote"}${serviceName ? ` — ${serviceName}` : ""} — ${form.get("city")}`);
    form.set("source_page", window.location.href);
    form.set("language", fr ? "fr-CA" : "en-CA");
    setStatus("submitting");
    setError("");

    try {
      await submitQuoteRequest(business.formspreeEndpoint, form);
      formElement.reset();
      setStatus("succeeded");
      trackEnquiry("generate_lead", serviceName);
    } catch (submissionError) {
      setError(fr ? (submissionError instanceof Error && submissionError.message.includes("may have arrived") ? "La confirmation prend trop de temps. Votre demande a peut-être été reçue; contactez-nous avant de la soumettre à nouveau." : "Nous ne pouvons pas confirmer la réception de votre demande. Vérifiez votre connexion et les renseignements saisis, puis réessayez ou contactez-nous.") : submissionError instanceof Error ? submissionError.message : "The request could not be submitted.");
      setStatus("failed");
      trackEnquiry("quote_error", serviceName);
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "succeeded") return <div className="form-success" role="status" aria-live="polite">
    <b>{fr ? "Merci. Nous avons reçu votre demande." : "Thank you. Your request has been received."}</b>
    <p>{fr ? "Nous examinerons les détails du projet et vous répondrons aux coordonnées fournies." : "We will review the project details and follow up using the contact information you provided."}</p>
    <p>{fr ? "Vous avez des photos ou des plans? Envoyez-les par courriel en indiquant le même nom et la même ville que dans votre demande." : "Have photos or plans? Email them using the same name and city as your quote request."}</p>
    <p><a href={`mailto:${business.email}?subject=${encodeURIComponent(fr ? "Photos de mon projet de carrelage" : "Photos for my tile project")}`}>{fr ? "Envoyer des photos par courriel" : "Email project photos"}</a></p>
    <button type="button" onClick={() => { started.current = false; setStatus("idle"); }}>{fr ? "ENVOYER UNE AUTRE DEMANDE" : "SEND ANOTHER REQUEST"}</button>
  </div>;

  return <form className={`quote-form ${compact ? "quote-form-compact" : ""}`} action={business.formspreeEndpoint} method="POST" aria-busy={status === "submitting"} onSubmit={submitQuote} onFocus={() => {
    if (!started.current) { started.current = true; trackEnquiry("quote_start", serviceName); }
  }}>
    <label className="quote-honeypot" aria-hidden="true">{fr ? "Laissez ce champ vide" : "Leave this field empty"}<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label>
    <input type="hidden" name="language" value={fr ? "fr-CA" : "en-CA"}/><input type="hidden" name="_subject" value={fr ? "Nouvelle demande de soumission Tiling.ca" : "New Tiling.ca quote request"} />
    {serviceName && <input type="hidden" name="service" value={serviceName} />}
    {serviceName && <p className="full quote-service-context">{fr ? "Votre service : " : "Your service: "}<strong>{serviceName}</strong></p>}
    <label>{fr ? "Nom" : "Name"}<input name="name" autoComplete="name" maxLength={100} required /></label>
    <label>{fr ? "Courriel" : "Email"}<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    <label className="full">{fr ? "Téléphone pour un rappel " : "Callback number "}<span className="optional-label">{fr ? "Facultatif" : "Optional"}</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} /></label>
    <label className="full">{fr ? "Ville" : "City"}<input name="city" defaultValue={defaultCity} maxLength={120} autoComplete="address-level2" placeholder={fr ? "Où se trouve votre projet?" : "Where is your project?"} required /></label>
    <label className="full">{fr ? "Description du projet " : "Project note "}<span className="optional-label">{fr ? "Facultatif" : "Optional"}</span><textarea name="details" maxLength={5000} rows={3} placeholder={fr ? "Type de travaux, dimensions approximatives et échéancier souhaité." : "Type of work, approximate dimensions and preferred timing."} /></label>
    {status === "failed" && <p className="form-error" role="alert">{error} {fr ? "Vous pouvez aussi écrire à " : "You can also email "}<a href={`mailto:${business.email}`}>{business.email}</a>.</p>}
    <button className="button button-primary" type="submit" disabled={status === "submitting"}>{status === "submitting" ? (fr ? "Envoi en cours…" : "Sending…") : (fr ? "Demander une soumission" : "Request a quote")}</button>
    <small className="full">{fr ? "Nous utiliserons vos renseignements pour répondre à votre demande. " : "We’ll use your details to reply about your project. "}<a href={fr ? "/fr/privacy" : "/privacy"}>{fr ? "Confidentialité" : "Privacy policy"}</a></small>
  </form>;
}
