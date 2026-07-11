"use client";

/**
 * Work — the spec / concept video portfolio grid.
 *
 * All content comes from content/work.json. To publish a video, set
 * `videoUrl` on an item:
 *   - YouTube/Vimeo:  paste the EMBED url (youtube.com/embed/<id>)
 *   - Self-hosted:    paste a direct .mp4/.webm url (poster optional)
 *
 * Only items with a videoUrl render — no empty "footage slot" frames
 * dressed up as finished work. With zero published videos the entire
 * section (and its nav link, see Nav.tsx) stays hidden; drop a URL
 * into work.json and the card, section, and nav link all come back.
 */
import work from "@/content/work.json";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

type WorkItem = (typeof work.items)[number];

/* ------------------------------------------------------------------ */
/*  Video slot — placeholder / embed / file, decided by videoUrl       */
/* ------------------------------------------------------------------ */
function VideoSlot({ item }: { item: WorkItem }) {
  const isEmbed = /youtube\.com|youtu\.be|vimeo\.com/.test(item.videoUrl);

  if (item.videoUrl && isEmbed) {
    return (
      <iframe
        src={item.videoUrl}
        title={item.client}
        className="aspect-video w-full border border-line-soft bg-well"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      src={item.videoUrl}
      poster={item.videoPoster || undefined}
      controls
      playsInline
      className="aspect-video w-full border border-line-soft bg-well object-cover"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Work card                                                          */
/*  `size: "large"` items span the full row and lay out video-beside-  */
/*  text on desktop; `"small"` items stack in half-width columns —     */
/*  the scale shift is what keeps the grid editorial, not templated.   */
/*  Metrics render only when they hold real, defensible numbers —      */
/*  "TBD" values stay hidden. Spec pieces ship with no metrics at all. */
/* ------------------------------------------------------------------ */
type Metric = { value: string; label: string };

function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  const isLarge = item.size === "large";
  const metrics = (item.metrics as Metric[]).filter((m) => m.value !== "TBD");

  const meta = (
    <>
      {/* Client + objective + year */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="type-display text-2xl text-bone md:text-3xl">
          {item.client}
        </h3>
        <span className="type-label flex items-center gap-2 text-dim">
          <span className="h-1 w-1 rounded-full bg-signal" />
          {item.objective}
          <span className="text-dim/50">/ {item.year}</span>
        </span>
      </div>

      <p className="text-sm leading-relaxed text-dim">{item.description}</p>

      {/* Deliverables + metrics on the baseline */}
      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line-soft pt-4">
        <p className="type-label text-dim">{item.deliverables.join(" · ")}</p>
        {metrics.length > 0 && (
          <div className="flex gap-8">
            {metrics.map((m) => (
              <div key={m.label} className="text-right">
                <p className="type-display text-xl text-bone">{m.value}</p>
                <p className="type-label mt-1 text-dim">{m.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (isLarge) {
    return (
      <Reveal className="h-full md:col-span-2">
        <article className="group grid h-full gap-6 bg-ink p-6 transition-colors duration-500 hover:bg-panel md:grid-cols-[3fr_2fr] md:gap-10 md:p-8">
          <VideoSlot item={item} />
          <div className="flex flex-col gap-6">{meta}</div>
        </article>
      </Reveal>
    );
  }

  return (
    <Reveal delay={(index % 2) * 0.1} className="h-full">
      <article className="group flex h-full flex-col gap-6 bg-ink p-6 transition-colors duration-500 hover:bg-panel md:p-8">
        <VideoSlot item={item} />
        {meta}
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
/* Shared by Nav/Hero to decide whether "#work" is a real destination */
export const publishedWork = work.items.filter((item) => item.videoUrl);

export default function Work() {
  /* Nothing published yet → no section. An empty grid of placeholder
     frames reads as a bluff; absence reads as honesty. */
  if (publishedWork.length === 0) return null;

  return (
    <section id="work" className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-32">
        <SectionHeader
          index="01"
          kicker={work.sectionKicker}
          title={work.sectionTitle}
          note={work.sectionNote}
        />

        {/* Hairline grid: 1px gaps expose the line color underneath */}
        <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
          {publishedWork.map((item, i) => (
            <WorkCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
