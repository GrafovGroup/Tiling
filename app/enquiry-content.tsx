import { business } from "./data";
import { frenchMaterials, frenchServices } from "./fr/content";
import { FAQ, Link, StructuredData } from "./components";
import { QuoteForm } from "./quote-form";
import { guidesForService, type Locale } from "./pricing-data";
import { enquiryContext, enquiryFaq, enquiryGuidance, enquiryMeta, enquiryReviewed, type EnquiryPage, type EnquiryQuery } from "./enquiry-data";

export function EnquiryContent({ page, locale = "en", query = {} }: { page: EnquiryPage; locale?: Locale; query?: EnquiryQuery }) {
  const fr = locale === "fr", prefix = fr ? "/fr" : "", contact = page === "contact";
  const { area, material, service, suffix } = enquiryContext(query);
  const serviceName = fr ? frenchServices.find(item => item.slug === service?.slug)?.name : service?.name;
  const materialName = fr ? frenchMaterials.find(item => item.slug === material?.slug)?.name : material?.name;
  const guide = service ? guidesForService(service.slug)[0] : undefined;
  const meta = enquiryMeta[page][locale];
  const resources = [
    { href: service ? `/services/${service.slug}${suffix}` : "/services", label: serviceName || (fr ? "Comparer les services" : "Compare services") },
    ...(material ? [{ href: `/materials/${material.slug}${suffix}`, label: materialName! }] : []),
    { href: guide ? `/pricing/${guide.slug}${suffix}` : "/pricing", label: fr ? "Consulter les repères de prix" : "Explore pricing guides" },
    { href: area ? `/areas/${area.slug}` : "/locations", label: area ? (fr ? `Votre projet à ${area.name}` : `Planning in ${area.name}`) : (fr ? "Trouver votre région" : "Find your local page") },
  ];
  return <div className={`enquiry-content ${contact ? "enquiry-contact" : "enquiry-quote"}`}>
    <section className="enquiry-intro">
      <p className="eyebrow">{contact ? (fr ? "Joindre Tiling.ca" : "Contact Tiling.ca") : (fr ? "Votre projet commence ici" : "Let’s get started")}</p>
      <h1>{contact ? (fr ? "Parlez directement à votre entrepreneur en carrelage." : "Talk directly to your tile contractor.") : (fr ? "Demandez une soumission gratuite." : "Request a free quote.")}</h1>
      <p>{contact ? (fr ? "Une question, une réparation ou un nouveau projet? Appelez, écrivez ou décrivez les travaux ci-dessous. Nous examinons les demandes de pose, de réparation et de fourniture au Canada." : "A question, a repair or a new project? Call, email or describe the work below. We review installation, repair and supply enquiries across Canada.") : (fr ? "Indiquez où se trouve votre projet et ce que vous souhaitez réaliser. Nous vous répondrons pour préciser les travaux, les matériaux et les disponibilités." : "Tell us where your project is and what you have in mind. We’ll follow up to discuss scope, materials and availability.")}</p>
      {!contact && <p className="enquiry-direct">{fr ? "Vous préférez nous joindre directement?" : "Prefer to get in touch directly?"} <Link href={`tel:${business.phoneHref}`}>{business.phone}</Link><span aria-hidden="true"> · </span><a href={`mailto:${business.email}`}>{business.email}</a></p>}
    </section>
    {contact && <nav className="enquiry-channels" aria-label={fr ? "Façons de nous joindre" : "Ways to get in touch"}>
      <Link href={`tel:${business.phoneHref}`}><span>{fr ? "Appelez-nous" : "Give us a call"}</span><strong>{business.phone}</strong><p>{fr ? "Discutez de votre ville, des travaux et de vos questions." : "Discuss your city, the work and your questions."}</p></Link>
      <a href={`mailto:${business.email}`}><span>{fr ? "Écrivez-nous" : "Send an email"}</span><strong>{business.email}</strong><p>{fr ? "Partagez les détails, les photos ou les plans du projet." : "Share project details, photos or plans."}</p></a>
      <a href="#project-enquiry-form"><span>{fr ? "Commencez en ligne" : "Start online"}</span><strong>{fr ? "Décrivez votre projet →" : "Tell us about your project →"}</strong><p>{fr ? "Un formulaire court, même si vos choix restent à préciser." : "A short form, even if you’re still working out the details."}</p></a>
    </nav>}
    <section className="enquiry-layout" aria-label={fr ? "Votre demande de projet" : "Your project enquiry"}>
      <div className="enquiry-form-panel" id="project-enquiry-form" tabIndex={-1}>
        {contact && <h2>{fr ? "Les premiers détails de votre projet." : "Start with your project details."}</h2>}
        <QuoteForm locale={locale} defaultCity={area?.name} serviceName={serviceName} materialName={materialName} guidance={enquiryGuidance(locale, service?.slug)}/>
      </div>
      <aside className="enquiry-aside">
        <div><p className="section-kicker">{fr ? "Après votre demande" : "After your enquiry"}</p><h2>{fr ? "La suite, en trois étapes." : "What happens next."}</h2>
          <ol className="enquiry-steps">
            <li><h3>{fr ? "Examen de votre demande" : "Review your request"}</h3><p>{fr ? "Nous examinons la ville et les détails que vous avez transmis." : "We review your city and the details you’ve shared."}</p></li>
            <li><h3>{fr ? "Précision des travaux" : "Clarify the work"}</h3><p>{fr ? "Nous discutons des matériaux, des dimensions, de l’accès et des renseignements manquants." : "We discuss materials, dimensions, access and any missing information."}</p></li>
            <li><h3>{fr ? "Confirmation des prochaines étapes" : "Confirm the next steps"}</h3><p>{fr ? "Nous confirmons les disponibilités et ce qu’il faut pour préparer la soumission, y compris une évaluation au besoin." : "We confirm availability and what’s needed to prepare the quote, including an assessment when necessary."}</p></li>
          </ol><a href={`${prefix}/how-it-works`}>{fr ? "Notre démarche complète →" : "See the full project process →"}</a>
        </div>
        <div className="enquiry-resources"><h2>{fr ? "Pour préparer la discussion." : "Plan the conversation."}</h2><ul>{resources.map(item => <li key={item.href}><a href={prefix + item.href}>{item.label} →</a></li>)}</ul><p>{fr ? "Les guides présentent des repères de l’industrie. Le prix et les dates sont confirmés pour votre projet." : "Guides provide industry benchmarks. Price and dates are confirmed for your project."}</p></div>
      </aside>
    </section>
    <section className="enquiry-faq"><p className="section-kicker">{fr ? "Avant de nous écrire" : "Before you get in touch"}</p><h2>{fr ? "Quelques questions courantes." : "A few common questions."}</h2><FAQ items={enquiryFaq(page, locale)}/><p className="enquiry-other-page"><a href={`${prefix}/${contact ? "request-a-quote" : "contact"}${suffix}`}>{contact ? (fr ? "Ouvrir la page de soumission →" : "Open the dedicated quote page →") : (fr ? "Voir les façons de nous joindre →" : "View all contact options →")}</a></p></section>
    <StructuredData data={{ "@context": "https://schema.org", "@type": contact ? "ContactPage" : "WebPage", "@id": `${business.domain}${prefix}/${page}#webpage`, url: `${business.domain}${prefix}/${page}`, name: meta.title, description: meta.description, inLanguage: fr ? "fr-CA" : "en-CA", dateModified: enquiryReviewed, about: { "@id": `${business.domain}/#organization` } }}/>
  </div>;
}
