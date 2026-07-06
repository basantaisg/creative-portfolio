"use client";

/**
 * Work — the case-study / video portfolio grid.
 *
 * All content comes from content/work.json. To publish a video, set
 * `videoUrl` on an item:
 *   - YouTube/Vimeo:  paste the EMBED url (youtube.com/embed/<id>)
 *   - Self-hosted:    paste a direct .mp4/.webm url (poster optional)
 * Leave it "" and the slot renders a quiet placeholder frame.
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

  if (item.videoUrl) {
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

  /* Quiet placeholder frame — just a play ring and a whisper of a label */
  return (
    <div className="relative aspect-video w-full overflow-hidden border border-line-soft bg-well">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:scale-110 group-hover:border-signal">
          <span className="ml-0.5 text-[10px] text-dim transition-colors duration-500 group-hover:text-signal">
            ▶
          </span>
        </div>
      </div>
      <p className="type-label absolute bottom-3 left-3 text-dim/50">
        Footage slot
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Case-study card                                                    */
/* ------------------------------------------------------------------ */
function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  return (
    <Reveal delay={(index % 2) * 0.1} className="h-full">
      <article className="group flex h-full flex-col gap-6 bg-ink p-6 transition-colors duration-500 hover:bg-panel md:p-8">
        <VideoSlot item={item} />

        {/* Client + objective */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="type-display text-2xl text-bone md:text-3xl">
            {item.client}
          </h3>
          <span className="type-label flex items-center gap-2 text-dim">
            <span className="h-1 w-1 rounded-full bg-signal" />
            {item.objective}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-dim">{item.description}</p>

        {/* Deliverables + metrics on the baseline */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line-soft pt-4">
          <p className="type-label text-dim">
            {item.deliverables.join(" · ")}
          </p>
          <div className="flex gap-8">
            {item.metrics.map((m) => (
              <div key={m.label} className="text-right">
                <p className="type-display text-xl text-bone">{m.value}</p>
                <p className="type-label mt-1 text-dim">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function Work() {
  return (
    <section id="work" className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <SectionHeader
          index="01"
          kicker={work.sectionKicker}
          title={work.sectionTitle}
          note={work.sectionNote}
        />

        {/* Hairline grid: 1px gaps expose the line color underneath */}
        <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
          {work.items.map((item, i) => (
            <WorkCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
