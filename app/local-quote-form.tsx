import { enquiryContext, type EnquiryQuery } from "./enquiry-data";
import { frenchMaterials, frenchServices } from "./fr/content";
import { planningContext } from "./planning-calculations";
import { QuoteForm } from "./quote-form";

export function LocalQuoteForm({ city, serviceSlug, query, locale = "en" }: {
  city: string;
  serviceSlug?: string;
  query: EnquiryQuery;
  locale?: "en" | "fr";
}) {
  const { service, material } = enquiryContext({ ...query, service: serviceSlug ?? query.service });
  const serviceName = locale === "fr" ? frenchServices.find(item => item.slug === service?.slug)?.name : service?.name;
  const materialName = locale === "fr" ? frenchMaterials.find(item => item.slug === material?.slug)?.name : material?.name;
  return <QuoteForm projectOptions locale={locale} defaultCity={city} serviceName={serviceName}
    materialName={materialName} initialDetails={planningContext(query, locale)?.summary}/>;
}
