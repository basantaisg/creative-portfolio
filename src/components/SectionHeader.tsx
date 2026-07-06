"use client";

/**
 * SectionHeader — the repeating editorial header for every section.
 * Mono kicker + index on the hairline, display title, dim note.
 */
import { Reveal } from "@/components/motion/Reveal";

type SectionHeaderProps = {
  index: string; // e.g. "01"
  kicker: string; // e.g. "Selected Work"
  title: string; // e.g. "Case studies."
  note?: string;
};

export default function SectionHeader({
  index,
  kicker,
  title,
  note,
}: SectionHeaderProps) {
  return (
    <Reveal className="mb-14 md:mb-20">
      <div className="flex items-baseline justify-between border-b border-line pb-4">
        <p className="type-label text-signal">
          {"//"} {kicker}
        </p>
        <p className="type-label text-dim">{index}</p>
      </div>
      <h2 className="type-display mt-8 text-[clamp(2.25rem,5.5vw,4.5rem)] text-bone">
        {title}
      </h2>
      {note && (
        <p className="mt-6 max-w-xl text-base leading-relaxed text-dim">
          {note}
        </p>
      )}
    </Reveal>
  );
}
