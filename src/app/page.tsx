/**
 * Home — the single-scroll portfolio.
 * Every section is self-contained and reads its copy from
 * src/content/*.json. Reorder or remove sections here freely;
 * nothing below depends on its neighbors.
 */
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Packages from "@/components/Packages";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <>
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
