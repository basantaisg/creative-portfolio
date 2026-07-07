/**
 * Home — the single-scroll portfolio.
 * Every section is self-contained and reads its copy from
 * src/content/*.json. Reorder or remove sections here freely;
 * nothing below depends on its neighbors.
 */
import site from "@/content/site.json";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Packages from "@/components/Packages";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

/* Structured data so search engines understand who this site belongs to */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: site.footer.socials
    .filter((s) => s.href.startsWith("http"))
    .map((s) => s.href),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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
