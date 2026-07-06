"use client";

/**
 * Packages — engagement models / pricing.
 * Content comes from content/packages.json. The card with
 * `featured: true` gets the signal treatment automatically.
 */
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import packages from "@/content/packages.json";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

type Pkg = (typeof packages.items)[number];

function PackageCard({ pkg, index }: { pkg: Pkg; index: number }) {
  /* Mouse-tracked 3D tilt — card angles toward the cursor, springs back on leave */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <Reveal delay={index * 0.1} className="h-full [perspective:1200px]">
      <motion.article
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative flex h-full flex-col p-6 md:p-8 ${
          pkg.featured ? "bg-panel" : "bg-ink"
        }`}
      >
        {/* Featured markers */}
        {pkg.featured && (
          <>
            <span className="absolute inset-x-0 top-0 h-1 bg-signal" />
            <span className="type-label absolute right-6 top-6 bg-signal px-2 py-1 text-ink">
              {pkg.badge}
            </span>
          </>
        )}

        <p className="type-label text-dim">{pkg.tag}</p>
        <h3 className="type-display mt-3 text-3xl text-bone">{pkg.name}</h3>

        <p className="mt-8">
          <span
            className={`type-display text-4xl md:text-5xl ${
              pkg.featured ? "text-signal" : "text-bone"
            }`}
          >
            {pkg.price}
          </span>
          <span className="type-label ml-2 text-dim">{pkg.period}</span>
        </p>

        <p className="mt-6 text-sm leading-relaxed text-dim">{pkg.summary}</p>

        <ul className="mt-8 flex flex-col gap-3 border-t border-line-soft pt-8">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-sm text-bone/90">
              <span className="type-label mt-0.5 text-signal">+</span>
              {feature}
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`type-label mt-10 block rounded-full px-6 py-4 text-center transition-colors duration-300 ${
            pkg.featured
              ? "bg-signal text-ink hover:bg-bone"
              : "border border-line text-bone hover:border-signal hover:text-signal"
          }`}
        >
          {pkg.cta} ↗
        </a>
      </motion.article>
    </Reveal>
  );
}

export default function Packages() {
  return (
    <section id="packages" className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-32">
        <SectionHeader
          index="03"
          kicker={packages.sectionKicker}
          title={packages.sectionTitle}
          note={packages.sectionNote}
        />

        <div className="grid grid-cols-1 gap-px border border-line bg-line lg:grid-cols-3">
          {packages.items.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="type-label mt-8 max-w-2xl leading-relaxed text-dim">
            {packages.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
