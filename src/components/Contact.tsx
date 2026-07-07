"use client";

/**
 * Contact — frictionless, zero-backend contact form.
 *
 * Submitting builds a pre-filled mailto: link and opens the visitor's
 * email client — no server, no API keys, nothing to break. If you later
 * wire up Formspree/Resend/etc., replace the handleSubmit body only;
 * the markup and styling stay untouched.
 */
import { useState } from "react";
import type { FormEvent } from "react";
import site from "@/content/site.json";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

/* Shared brutalist input style: underline only, signal focus */
const fieldClass =
  "w-full border-b border-line bg-transparent py-4 text-base text-bone placeholder:text-dim/60 outline-none transition-colors focus:border-signal";

export default function Contact() {
  const { contact } = site;
  /* After submit we keep the composed message around so visitors whose
     machines have no mail client configured can still copy it out —
     the mailto: jump silently does nothing for them otherwise. */
  const [sent, setSent] = useState<{ subject: string; body: string } | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "");
    const business = String(data.get("business") || "");
    const budget = String(data.get("budget") || "");
    const message = String(data.get("message") || "");

    const subject = `Project inquiry: ${name}${business ? ` (${business})` : ""}`;
    const body = [
      `Name: ${name}`,
      `Business: ${business}`,
      `Budget: ${budget}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent({ subject, body });
  }

  async function handleCopy() {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(
        `To: ${site.email}\nSubject: ${sent.subject}\n\n${sent.body}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* Clipboard blocked — the email address is printed right there */
    }
  }

  return (
    <section id="contact" className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-32">
        <SectionHeader
          index="04"
          kicker="Contact"
          title="Open a line."
          note={contact.subline}
        />

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left — the pitch */}
          <Reveal>
            <h3 className="type-display text-[clamp(2.5rem,5.5vw,4.25rem)]">
              {contact.headline.map((line, i) => (
                <span
                  key={line}
                  className={`block ${
                    i === contact.headline.length - 1
                      ? "type-serif text-signal"
                      : "text-bone"
                  }`}
                >
                  {line}
                </span>
              ))}
            </h3>

            {/* Direct lines — reach out without the form.
                Rows come from content/site.json → contact.channels */}
            <div className="mt-12 border-t border-line">
              {contact.channels.map((channel, i) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    channel.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex items-center justify-between gap-4 border-b border-line py-5 transition-colors duration-300 hover:bg-panel md:px-3"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="type-label text-signal">
                      0{i + 1}
                    </span>
                    <div>
                      <p
                        className={`type-display text-lg md:text-xl ${
                          channel.primary ? "text-signal" : "text-bone"
                        }`}
                      >
                        {channel.label}
                      </p>
                      <p className="type-label mt-1 text-dim">{channel.note}</p>
                    </div>
                  </div>
                  <span className="text-dim transition-all duration-300 group-hover:translate-x-1 group-hover:text-signal">
                    ↗
                  </span>
                </a>
              ))}

              <p className="mt-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-signal animate-signal" />
                <span className="type-label text-dim">{site.availability}</span>
              </p>
            </div>
          </Reveal>

          {/* Right — the form */}
          <Reveal delay={0.15}>
            {sent ? (
              <div className="flex h-full min-h-72 flex-col items-start justify-center border border-line p-10">
                <p className="type-display text-3xl text-signal">
                  Message armed.
                </p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-dim">
                  Your email client should have opened with everything
                  pre-filled — hit send and I&apos;ll reply within 24 hours.
                  Nothing opened? Copy your message below and send it to{" "}
                  <span className="text-bone">{site.email}</span>.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="type-label rounded-full bg-signal px-6 py-3 text-ink transition-colors duration-300 hover:bg-bone"
                  >
                    {copied ? "Copied ✓" : "Copy message"}
                  </button>
                  <a
                    href={`mailto:${site.email}`}
                    className="type-label rounded-full border border-line px-6 py-3 text-bone transition-colors duration-300 hover:border-signal hover:text-signal"
                  >
                    Open email app ↗
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label className="type-label text-dim" htmlFor="name">
                  01 / Your name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="Full name"
                  className={fieldClass}
                />

                <label className="type-label mt-8 text-dim" htmlFor="business">
                  02 / Business
                </label>
                <input
                  id="business"
                  name="business"
                  placeholder="Company / project"
                  className={fieldClass}
                />

                <label className="type-label mt-8 text-dim" htmlFor="budget">
                  03 / Monthly budget
                </label>
                {/* appearance-none strips the native arrow, so we draw our
                    own chevron — without it this doesn't read as a dropdown */}
                <div className="relative">
                  <select
                    id="budget"
                    name="budget"
                    className={`${fieldClass} appearance-none pr-8 [&>option]:bg-ink`}
                    defaultValue={contact.budgetOptions[0]}
                  >
                    {contact.budgetOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="type-label pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-signal"
                  >
                    ▾
                  </span>
                </div>

                <label className="type-label mt-8 text-dim" htmlFor="message">
                  04 / The mission
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="What do you sell, and where does it need to go?"
                  className={`${fieldClass} resize-none`}
                />

                <button
                  type="submit"
                  className="type-label mt-10 w-full rounded-full bg-signal px-8 py-5 text-ink transition-colors duration-300 hover:bg-bone"
                >
                  Send it ↗
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
