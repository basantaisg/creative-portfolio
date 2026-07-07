"use client";

/**
 * Services — the end-to-end pipeline, rendered as numbered ledger rows.
 * Content comes from content/services.json.
 */
import services from "@/content/services.json";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

export default function Services() {
  return (
    <section id="services" className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-32">
        <SectionHeader
          index="02"
          kicker={services.sectionKicker}
          title={services.sectionTitle}
          note={services.sectionNote}
        />

        <div className="border-t border-line">
          {services.items.map((service, i) => (
            <Reveal key={service.index} delay={i * 0.05}>
              <div className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-line py-8 transition-colors duration-300 hover:bg-panel md:grid-cols-[6rem_1fr_1.1fr] md:gap-8 md:px-4">
                {/* Index */}
                <span className="type-label inline-block text-signal transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,77,0,0.8)]">
                  {service.index}
                </span>

                {/* Title */}
                <h3 className="type-display text-3xl text-bone transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="col-span-2 mt-3 text-sm leading-relaxed text-dim md:col-span-1 md:mt-0">
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
