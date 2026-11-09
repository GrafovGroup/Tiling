"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { trackEnquiry } from "./enquiry-events";
import { business } from "./data";
import { submitQuoteRequest } from "./submit-quote";
import quoteServices from "./quote-services.json";
import { attachmentError, ATTACHMENT_ACCEPT } from "./quote-attachments";

export function QuoteForm({ compact = false, defaultCity = "", serviceName = "", materialName = "", locale = "en", guidance, projectOptions = false, initialDetails = "" }: { compact?: boolean; defaultCity?: string; serviceName?: string; materialName?: string; locale?: "en" | "fr"; projectOptions?: boolean; initialDetails?: string; guidance?: { hints: string[]; placeholder: string } }) {
  const fr = locale === "fr";
  const [status, setStatus] = useState<"idle" | "submitting" | "succeeded" | "failed">("idle");
  const [error, setError] = useState("");
  const started = useRef(false);
  const inFlight = useRef(false);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const focusNameOnReset = useRef(false);
  const helpId = useId();
  const attachmentHelpId = useId();
  const [selectedService, setSelectedService] = useState(serviceName);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [sentFiles, setSentFiles] = useState(0);
  const attachmentInput = useRef<HTMLInputElement>(null);
  const effectiveService = projectOptions ? selectedService : serviceName;
  useEffect(() => { setSelectedService(serviceName); }, [serviceName]);
  const activeGuidance = guidance && projectOptions && selectedService !== serviceName ? {
    hints: fr ? ["La pièce ou la surface et les travaux souhaités.", "Les dimensions approximatives, en pieds ou en mètres.", "Le revêtement actuel et les travaux de préparation."] : ["The room or surface and the work you need.", "Approximate dimensions, in feet or metres.", "The existing finish and any preparation needed."],
    placeholder: fr ? "Pièce, travaux souhaités et dimensions approximatives." : "Room, work needed and approximate dimensions.",
  } : guidance;

  useEffect(() => {
    if (status === "succeeded") successHeading.current?.focus();
    if (status === "failed") errorMessage.current?.focus();
    if (status === "idle" && focusNameOnReset.current) {
      focusNameOnReset.current = false;
      nameInput.current?.focus();
    }
  }, [status]);

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const attached = projectOptions ? Array.from(attachmentInput.current?.files || []) : [];
    const invalidFiles = attachmentError(attached, locale);
    if (invalidFiles) { setFileError(invalidFiles); attachmentInput.current?.focus(); return; }
    inFlight.current = true;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (projectOptions && !attached.length) form.delete("attachment");
    form.set("_subject", `${fr ? "Demande de soumission" : "Tile project quote"}${effectiveService ? ` — ${effectiveService}` : ""} — ${form.get("city")}`);
    form.set("source_page", window.location.href);
    form.set("language", fr ? "fr-CA" : "en-CA");
    setStatus("submitting");
    setError("");

    try {
      await submitQuoteRequest(business.formspreeEndpoint, form, fetch, attached.length ? 30000 : 20000);
      formElement.reset();
      setSentFiles(attached.length); setFiles([]); setFileError(""); setSelectedService(serviceName);
      setStatus("succeeded");
      trackEnquiry("generate_lead", effectiveService);
    } catch (submissionError) {
      setError(fr ? (submissionError instanceof Error && submissionError.message.includes("may have arrived") ? "La confirmation prend trop de temps. Votre demande a peut-être été reçue; contactez-nous avant de la soumettre à nouveau." : "Nous ne pouvons pas confirmer la réception de votre demande. Vérifiez votre connexion et les renseignements saisis, puis réessayez ou contactez-nous.") : submissionError instanceof Error ? submissionError.message : "The request could not be submitted.");
      setStatus("failed");
      trackEnquiry("quote_error", effectiveService);
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "succeeded") return <div className="form-success" role="status" aria-live="polite">
    <h2 className="form-status-title" ref={successHeading} tabIndex={-1}>{fr ? "Merci. Nous avons reçu votre demande." : "Thank you. Your request has been received."}</h2>
    <p>{fr ? "Nous examinerons les détails du projet et vous répondrons aux coordonnées fournies." : "We will review the project details and follow up using the contact information you provided."}</p>
    {projectOptions && sentFiles > 0 && <p>{fr ? `${sentFiles} fichier(s) joint(s) à votre demande.` : `${sentFiles} file(s) were attached to your request.`}</p>}
    <p>{fr ? "Vous avez des photos ou des plans? Envoyez-les par courriel en indiquant le même nom et la même ville que dans votre demande." : "Have photos or plans? Email them using the same name and city as your quote request."}</p>
    <p><a href={`mailto:${business.email}?subject=${encodeURIComponent(fr ? "Photos de mon projet de carrelage" : "Photos for my tile project")}`}>{fr ? "Envoyer des photos par courriel" : "Email project photos"}</a></p>
    <button type="button" onClick={() => { started.current = false; focusNameOnReset.current = true; setStatus("idle"); }}>{fr ? "ENVOYER UNE AUTRE DEMANDE" : "SEND ANOTHER REQUEST"}</button>
  </div>;

  return <form className={`quote-form ${compact ? "quote-form-compact" : ""}`} action={business.formspreeEndpoint} method="POST" encType={projectOptions ? "multipart/form-data" : undefined} aria-busy={status === "submitting"} onSubmit={submitQuote} onFocus={(event) => {
    if (!started.current && event.target.matches('input:not([type="hidden"]):not([name="_gotcha"]), textarea, select')) { started.current = true; trackEnquiry("quote_start", effectiveService); }
  }}>
    <label className="quote-honeypot" aria-hidden="true">{fr ? "Laissez ce champ vide" : "Leave this field empty"}<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label>
    <input type="hidden" name="language" value={fr ? "fr-CA" : "en-CA"}/><input type="hidden" name="_subject" value={fr ? "Nouvelle demande de soumission Tiling.ca" : "New Tiling.ca quote request"} />
    {guidance && <p className="full quote-required-note">{fr ? "Seuls le nom, le courriel et la ville sont obligatoires. Les autres renseignements sont facultatifs." : "Only your name, email and city are required. Everything else is optional."}</p>}
    {!projectOptions && serviceName && <input type="hidden" name="service" value={serviceName} />}
    {materialName && <><input type="hidden" name="material" value={materialName}/><p className="full quote-material-context">{fr ? "Votre matériau : " : "Your material: "}<strong>{materialName}</strong></p></>}
    {!projectOptions && serviceName && <p className="full quote-service-context">{fr ? "Votre service : " : "Your service: "}<strong>{serviceName}</strong></p>}
    <label>{fr ? "Nom" : "Name"}<input ref={nameInput} name="name" autoComplete="name" maxLength={100} required /></label>
    <label>{fr ? "Courriel" : "Email"}<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    <label className="full">{fr ? "Téléphone pour un rappel " : "Callback number "}<span className="optional-label">{fr ? "Facultatif" : "Optional"}</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} /></label>
    <label className="full">{fr ? "Ville" : "City"}<input name="city" defaultValue={defaultCity} maxLength={120} autoComplete="address-level2" placeholder={fr ? "Où se trouve votre projet?" : "Where is your project?"} required /></label>
    {projectOptions && <>
      <label className="full quote-project-option">{fr ? "Type de travaux" : "Service needed"}<span className="optional-label">{fr ? "Facultatif" : "Optional"}</span>
        <select name="service" value={selectedService} onChange={event => setSelectedService(event.target.value)}>
          <option value="">{fr ? "À préciser / plusieurs services" : "Not sure / several services"}</option>
          {quoteServices.map(service => <option key={service.slug} value={service[locale]}>{service[locale]}</option>)}
        </select>
      </label>
      <label className="full quote-project-option">{fr ? "Période souhaitée" : "Preferred timing"}<span className="optional-label">{fr ? "Facultatif" : "Optional"}</span>
        <select name="timing" defaultValue=""><option value="">{fr ? "À préciser" : "Not sure yet"}</option>
          {(fr ? ["Dès que possible", "Dans 1 à 3 mois", "Dans 3 à 6 mois", "Plus tard / planification"] : ["As soon as available", "Within 1–3 months", "Within 3–6 months", "Later / planning ahead"]).map(value => <option key={value}>{value}</option>)}
        </select>
        <span className="quote-field-note">{fr ? "Les disponibilités seront confirmées après l’examen du projet." : "Availability will be confirmed after reviewing your project."}</span>
      </label>
    </>}
    <label className="full">{fr ? "Description du projet " : "Project note "}<span className="optional-label">{fr ? "Facultatif" : "Optional"}</span><textarea name="details" defaultValue={initialDetails || undefined} maxLength={5000} rows={3} aria-describedby={guidance ? helpId : undefined} placeholder={activeGuidance?.placeholder || (fr ? "Type de travaux, dimensions approximatives et échéancier souhaité." : "Type of work, approximate dimensions and preferred timing.")} /></label>
    {projectOptions && <div className="full quote-attachments">
      <label>{fr ? "Photos ou plans" : "Photos or plans"}<span className="optional-label">{fr ? "Facultatif" : "Optional"}</span>
        <input ref={attachmentInput} type="file" disabled={status === "submitting"} name="attachment" accept={ATTACHMENT_ACCEPT} multiple aria-describedby={attachmentHelpId} aria-invalid={fileError ? true : undefined} onChange={event => { const chosen = Array.from(event.target.files || []); setFiles(chosen); setFileError(attachmentError(chosen, locale)); }} />
      </label>
      <p id={attachmentHelpId} className="quote-field-note">{fr ? "Jusqu’à 5 fichiers JPG, PNG, WebP, HEIC ou PDF. 5 Mo par fichier, 10 Mo au total. Ils seront envoyés avec votre demande; évitez les documents personnels sans rapport avec les travaux." : "Up to 5 JPG, PNG, WebP, HEIC or PDF files. 5 MB each, 10 MB total. They’ll be sent with your request; leave out unrelated personal documents."}</p>
      {files.length > 0 && <><ul>{files.map((file, index) => <li key={index}>{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</li>)}</ul><button type="button" className="quote-clear-files" disabled={status === "submitting"} onClick={() => { if (attachmentInput.current) attachmentInput.current.value = ""; setFiles([]); setFileError(""); }}>{fr ? "Retirer les fichiers" : "Remove files"}</button></>}
      {fileError && <p className="form-error" role="alert">{fileError}</p>}
    </div>}
    {guidance && <div className="full quote-guidance"><p id={helpId}>{fr ? "Indiquez ce que vous savez; les estimations suffisent pour commencer." : "Share what you know; estimates are fine to start."}</p><details><summary>{fr ? "Les détails utiles pour votre projet" : "Helpful details for your project"}</summary><ul>{activeGuidance!.hints.map(hint => <li key={hint}>{hint}</li>)}</ul></details><p>{fr ? "Des photos ou des plans? " : "Have photos or plans? "}<a href={`mailto:${business.email}?subject=${encodeURIComponent(fr ? "Photos de mon projet de carrelage" : "Photos for my tile project")}`}>{fr ? "Envoyez-les par courriel" : "Email them to us"}</a>{fr ? " avec le même nom et la même ville." : " with the same name and city."}</p></div>}
    {status === "failed" && <p className="form-error" role="alert" ref={errorMessage} tabIndex={-1}>{error} {fr ? "Appelez le " : "Call "}<a href={`tel:${business.phoneHref}`}>{business.phone}</a>{fr ? " ou écrivez à " : " or email "}<a href={`mailto:${business.email}`}>{business.email}</a>.</p>}
    <button className="button button-primary" type="submit" disabled={status === "submitting"}>{status === "submitting" ? (fr ? "Envoi en cours…" : "Sending…") : (fr ? "Demander une soumission" : "Request a quote")}</button>
    <small className="full">{fr ? "Nous utiliserons vos renseignements pour répondre à votre demande. " : "We’ll use your details to reply about your project. "}<a href={fr ? "/fr/privacy" : "/privacy"}>{fr ? "Confidentialité" : "Privacy policy"}</a></small>
  </form>;
}
