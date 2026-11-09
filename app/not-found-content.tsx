import { Logo } from "./logo";
import { business } from "./data";

export function NotFoundContent({ locale = "en" }: { locale?: "en" | "fr" }) {
  const fr = locale === "fr", prefix = fr ? "/fr" : "", home = prefix || "/";
  const links = [
    { path: "/services", title: fr ? "Choisir un service →" : "Find a service →", text: fr ? "Pose, réparation, entretien et fourniture de carreaux." : "Tile installation, repair, care and supply." },
    { path: "/locations", title: fr ? "Trouver votre ville →" : "Find your city →", text: fr ? "Recherchez votre ville ou votre communauté dans le répertoire." : "Search for your city or community in the service-area directory." },
    { path: "/contact", title: fr ? "Nous joindre →" : "Get in touch →", text: fr ? "Appelez, écrivez ou décrivez les travaux que vous envisagez." : "Call, email or tell us about the work you have in mind." },
  ];
  return <>
    <a className="skip-link" href="#main-content">{fr ? "Aller au contenu" : "Skip to content"}</a>
    <header className="recovery-header"><a className="brand" href={home} aria-label={fr ? "Tiling.ca — accueil" : "Tiling.ca home"}><Logo header/></a><nav aria-label={fr ? "Navigation principale" : "Main navigation"}><a href={home}>{fr ? "Accueil" : "Home"}</a><a href={prefix + "/contact"}>{fr ? "Nous joindre" : "Contact"}</a><a href={fr ? "/" : "/fr"} hrefLang={fr ? "en-CA" : "fr-CA"} lang={fr ? "en" : "fr"}>{fr ? "English" : "Français"}</a></nav></header>
    <main id="main-content" className="recovery-main"><p className="eyebrow">{fr ? "404 · Page introuvable" : "404 · Page not found"}</p><h1>{fr ? "Retrouvons le chemin de votre projet." : "Let’s get back to your tile project."}</h1><p>{fr ? "Le lien a peut-être changé ou l’adresse contient une erreur. Retrouvez un service, cherchez votre ville ou décrivez-nous votre projet." : "The link may have changed, or the address may contain a typo. Find a service, search for your city or tell us about your project."}</p><div className="recovery-actions"><a className="button button-primary" href={prefix + "/request-a-quote"}>{fr ? "Demander une soumission" : "Request a quote"}</a><a href={home}>{fr ? "Retour à l’accueil" : "Back to the homepage"}</a></div><div className="recovery-links">{links.map(item => <a key={item.path} href={prefix + item.path}><h2>{item.title}</h2><p>{item.text}</p></a>)}</div><div className="recovery-contact"><a href={`tel:${business.phoneHref}`}>{business.phone}</a><a href={`mailto:${business.email}`}>{business.email}</a></div></main>
  </>;
}
