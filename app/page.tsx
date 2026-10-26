import { CommercialShowcase } from "./commercial-examples";
import { business, materials, services } from "./data";
import { FAQ, Footer, Header, Link, StructuredData } from "./components";
import { QuoteForm } from "./quote-form";

const homeFaq = [
  { q: "Does Tiling.ca provide tile installation?", a: "Yes. We install tile for homes and businesses across Canada, from surface preparation and waterproofing to tile setting, grouting and finishing." },
  { q: "Can Tiling.ca supply the tile too?", a: "Yes. We can review tile supply on its own or coordinate materials with installation. Product availability, quantities, trim, delivery and installation are identified in the quote." },
  { q: "What areas do you serve?", a: "We serve residential and commercial customers across Canada. Tell us your city and project details so we can confirm site access, scheduling and any travel requirements." },
  { q: "Who performs the installation?", a: "We do. Tiling.ca is your tile contractor, handling the project from the initial assessment through installation and the final walkthrough. You work directly with us." },
];

const tileIdeas = [
  {
    image: "/projects/concept-toronto-condo-bathroom.jpg",
    alt: "Bathroom with large-format porcelain shower tile",
    location: "Bathrooms",
    service: "Bathroom & Shower Tile",
    title: "Large-format porcelain shower",
    summary: "Create a calm bathroom with generous porcelain surfaces, a recessed niche and carefully finished edges.",
  },
  {
    image: "/projects/concept-newmarket-kitchen-backsplash.jpg",
    alt: "Kitchen with a sage green ceramic tile backsplash",
    location: "Kitchens",
    service: "Kitchen Backsplash",
    title: "Handcrafted-look ceramic backsplash",
    summary: "Bring colour and texture to your kitchen with a ceramic backsplash planned around cabinetry, outlets and countertops.",
  },
  {
    image: "/projects/concept-aurora-entry-floor.jpg",
    alt: "Entry floor with charcoal stone-look porcelain tile",
    location: "Entryways",
    service: "Floor Tile Installation",
    title: "Stone-look porcelain entry floor",
    summary: "Give a busy entrance a durable stone-look surface with balanced joints and clean transitions to adjoining rooms.",
  },
];

export default function Home() {
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${business.domain}/#organization`, name: business.name, url: business.domain, logo: `${business.domain}/brand/tiling-herringbone-square-dot.png`, email: business.email, telephone: business.phoneHref, description: "Tile contractor providing installation, repair and material supply across Canada.", areaServed: { "@type": "Country", name: "Canada" }, contactPoint: { "@type": "ContactPoint", contactType: "sales", email: business.email, telephone: business.phoneHref, areaServed: "CA" } },
    { "@type": "WebSite", "@id": `${business.domain}/#website`, name: business.name, url: business.domain, inLanguage: "en-CA", publisher: { "@id": `${business.domain}/#organization` } },
  ] };

  return <><link rel="preload" as="image" href="/heroes/commercial-atrium.webp" fetchPriority="high"/><Header/><main id="main-content">
    <section className="hero"><div className="hero-photo" aria-hidden="true"/><div className="hero-scrim" aria-hidden="true"/><div className="hero-content"><p className="eyebrow">Tile installation & supply · Canada</p><h1>Your tile contractor. Across Canada.</h1><p className="hero-copy">We install, repair and supply tile for homes and businesses across Canada. From bathrooms and backsplashes to commercial floors, we take care of your project from preparation to the final finish.</p><div className="hero-actions"><Link className="button button-primary" href="/request-a-quote">Request a free quote</Link><Link className="button button-ghost" href={`tel:${business.phoneHref}`}>Call {business.phone}</Link></div><div className="hero-proof" aria-label="Service commitments"><span>Residential & commercial</span><span>Installation & supply</span><span>Clear written scope</span></div></div></section>



    <section className="intro section-pad"><div className="section-heading"><div><p className="section-kicker">Complete tile services</p><h2>One place for materials, preparation and installation.</h2></div><p>From a backsplash or shower repair to a full commercial floor, we handle the details that affect durability: substrate, waterproofing, layout, tile selection, transitions and schedule.</p></div><div className="home-service-grid">{services.map(service=><article className="home-service-card" key={service.slug}><Link href={`/services/${service.slug}`}><img src={service.homeImage} alt={service.homeImageAlt} width="1536" height="1024" loading="lazy"/><div><h3>{service.name}</h3><p>{service.short}</p><span>EXPLORE SERVICE →</span></div></Link></article>)}</div><Link className="text-link" href="/services">View all tile services →</Link></section>

    <section className="project-showcase section-pad" aria-labelledby="recent-projects-heading"><div className="section-heading"><div><p className="section-kicker">Tile ideas for your space</p><h2 id="recent-projects-heading">Find a finish that fits your space.</h2></div><div className="project-intro"><p>Explore porcelain showers, textured backsplashes and durable entry floors. We help you choose the right tile and bring the details together.</p></div></div><div className="project-grid">{tileIdeas.map((project)=><article className="project-card" key={project.image}><figure><img src={project.image} alt={project.alt} width="1600" height="1067" loading="lazy"/></figure><div className="project-card-copy"><p className="project-meta"><span>{project.location}</span><span>{project.service}</span></p><h3>{project.title}</h3><p>{project.summary}</p><Link href="/request-a-quote">Plan your tile project →</Link></div></article>)}</div></section>

    <CommercialShowcase/>
    <section className="feature-image-section"><div className="feature-image" role="img" aria-label="Detailed tile installation surface"/><div className="feature-copy"><p className="section-kicker">One team, start to finish</p><h2>Fewer gaps between selection and installation.</h2><p>We assess the space, source suitable tile and carry out the installation. You work with Tiling.ca for the quote, schedule and finished result, with clear next steps before work begins.</p><ul><li>Room, substrate and moisture conditions</li><li>Tile, trim and setting-material requirements</li><li>Layout, transitions and finishing details</li><li>Delivery, installation and project timing</li></ul><p className="compact-page-links"><Link href="/how-it-works">OUR INSTALLATION PROCESS →</Link><Link href="/locations">FIND YOUR SERVICE AREA →</Link></p></div></section>





    <section className="materials-section section-pad"><div className="section-heading"><div><p className="section-kicker">Tile supply</p><h2>Choose the surface for the room—not just the sample board.</h2></div><p>We review intended use, finish, format, maintenance, quantities and installation requirements before an order is finalized.</p></div><div className="material-grid">{materials.map((material,i)=><Link key={material.slug} href={`/materials/${material.slug}`}><span>{String(i+1).padStart(2,"0")} · {material.category}</span><h3>{material.name}</h3><p>{material.short}</p><b>Explore material →</b></Link>)}</div></section>

    <section className="quote-section"><div className="quote-copy"><p className="section-kicker">Request a quote</p><h2>Tell us what you are planning.</h2><p>Share a few details. We’ll follow up to discuss your project and the next steps.</p><div className="contact-strip"><a href={`tel:${business.phoneHref}`}>{business.phone}</a><a href={`mailto:${business.email}`}>{business.email}</a></div></div><QuoteForm compact/></section>

    <section className="faq-section section-pad"><div><p className="section-kicker">Before you begin</p><h2>Clear answers about how we work.</h2><p>From your first question to the final walkthrough, you deal directly with Tiling.ca for tile installation, repairs and supply.</p></div><FAQ items={homeFaq}/></section>
  </main><Footer/><StructuredData data={schema}/></>;
}
