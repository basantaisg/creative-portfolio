"use client";

/**
 * SectionHeader — the repeating editorial header for every section.
 * Mono kicker + index on the hairline, display title, dim note.
 *
 * Arrival choreography (all viewport-triggered, once):
 *   1. the hairline draws itself left → right
 *   2. kicker + index fade in on top of it
 *   3. the title rises out of a mask
 *   4. the note fades up last
 * One consistent entrance for every section = the premium signature.
 */
import { motion } from "framer-motion";
import { EASE, LineDraw, MaskReveal, Reveal } from "@/components/motion/Reveal";

type SectionHeaderProps = {
  index: string; // e.g. "01"
  kicker: string; // e.g. "Selected Work"
  title: string; // e.g. "Case studies."
  note?: string;
};

const fadeIn = (delay: number) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.7, ease: EASE, delay },
});

export default function SectionHeader({
  index,
  kicker,
  title,
  note,
}: SectionHeaderProps) {
  return (
    <div className="mb-10 md:mb-20">
      <div className="flex items-baseline justify-between pb-4">
        <motion.p className="type-label text-signal" {...fadeIn(0.25)}>
          {"//"} {kicker}
        </motion.p>
        <motion.p className="type-label text-dim" {...fadeIn(0.35)}>
          {index}
        </motion.p>
      </div>
      <LineDraw />
      <h2 className="type-display mt-8 text-[clamp(2.25rem,5.5vw,4.5rem)] text-bone">
        <MaskReveal inView delay={0.15}>
          {title}
        </MaskReveal>
      </h2>
      {note && (
        <Reveal delay={0.3}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-dim">
            {note}
          </p>
        </Reveal>
      )}
    </div>
  );
}
