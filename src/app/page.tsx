/**
 * Home — the single-scroll portfolio.
 * Every section is self-contained and reads its copy from
 * src/content/*.json. Reorder or remove sections here freely;
 * nothing below depends on its neighbors.
 */
import site from "@/content/site.json";
import servicesContent from "@/content/services.json";
import packagesContent from "@/content/packages.json";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Packages from "@/components/Packages";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

/* Structured data: one @graph tying together who this is (Person),
   what the site is (WebSite), and what's sold here (Service + offer
   catalog built from the real packages) — the shape search engines
   need to show rich results for "hire"-intent queries. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      jobTitle: site.role,
      email: `mailto:${site.email}`,
      url: site.url,
      knowsAbout: servicesContent.items.map((s) => s.title),
      sameAs: site.footer.socials
        .filter((s) => s.href.startsWith("http"))
        .map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: `${site.name} — ${site.role}`,
      url: site.url,
      publisher: { "@id": `${site.url}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "Service",
      "@id": `${site.url}/#service`,
      name: "Video editing & content strategy",
      serviceType: "Video editing, short-form content, ad creative, content strategy",
      provider: { "@id": `${site.url}/#person` },
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: packagesContent.sectionTitle,
        itemListElement: packagesContent.items.map((pkg) => ({
          "@type": "Offer",
          name: pkg.name,
          description: pkg.summary,
          priceCurrency: "USD",
        })),
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <Work />
        <Services />
        <Packages />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
