"use client";

/**
 * VideoFacade — poster-first stand-in for YouTube/Vimeo iframes.
 *
 * A raw embed ships ~1MB of third-party JS per video before anyone
 * presses play. This renders only a poster + play button; the real
 * iframe (with autoplay) mounts on click. Same single click for the
 * visitor — the page just stops paying for players nobody started.
 *
 * Posters: pass videoPoster in work.json, or leave it empty for
 * YouTube and the thumbnail is derived from the embed URL
 * (maxresdefault, falling back to hqdefault when YouTube has no
 * high-res frame). Vimeo without a poster gets the dark well +
 * play button — still intentional, never broken.
 */
import { useState } from "react";
import ReactDOM from "react-dom";

const YT_POSTER_HOST = "https://i.ytimg.com";

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/** Append autoplay to whatever embed URL was pasted, preserving params. */
function withAutoplay(url: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}autoplay=1`;
}

type VideoFacadeProps = {
  src: string; // YouTube/Vimeo EMBED url from work.json
  title: string; // client name, used for iframe title + aria label
  poster?: string;
};

export default function VideoFacade({ src, title, poster }: VideoFacadeProps) {
  const ytId = youtubeId(src);
  const [playing, setPlaying] = useState(false);
  /* Derived YouTube posters try the high-res frame first; YouTube
     serves a gray 120×90 stub when it doesn't exist, so onError
     drops to hqdefault (always present). */
  const [posterSrc, setPosterSrc] = useState(
    poster || (ytId ? `${YT_POSTER_HOST}/vi/${ytId}/maxresdefault.jpg` : "")
  );

  /* Warm the connections a facade will need, only on pages that
     actually have one (React dedupes repeat calls). */
  if (ytId) {
    ReactDOM.preconnect("https://www.youtube.com");
    ReactDOM.preconnect(YT_POSTER_HOST);
  } else {
    ReactDOM.preconnect("https://player.vimeo.com");
  }

  if (playing) {
    return (
      <iframe
        src={withAutoplay(src)}
        title={title}
        className="aspect-video w-full border border-line-soft bg-well"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={`Play video: ${title}`}
      data-cursor="play"
      onClick={() => setPlaying(true)}
      className="group/facade relative block aspect-video w-full overflow-hidden border border-line-soft bg-well text-left"
    >
      {posterSrc && (
        /* Plain <img>: remote thumbnail hosts stay out of next.config,
           and the aspect-video frame already reserves the space. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterSrc}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() =>
            ytId && posterSrc.includes("maxresdefault")
              ? setPosterSrc(`${YT_POSTER_HOST}/vi/${ytId}/hqdefault.jpg`)
              : setPosterSrc("")
          }
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/facade:scale-[1.03]"
        />
      )}

      {/* Legibility scrim under the play button */}
      <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

      {/* Play affordance */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal text-ink transition-transform duration-300 ease-out group-hover/facade:scale-110 md:h-16 md:w-16">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="ml-0.5 h-5 w-5"
          >
            <path d="M8 5.14v13.72L19 12 8 5.14z" />
          </svg>
        </span>
      </span>

      {/* Mono corner label — reads as a deck slate, not a widget */}
      <span className="type-label absolute bottom-4 left-4 text-bone/80">
        {"//"} Play
      </span>
    </button>
  );
}
