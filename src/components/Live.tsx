"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import media from "@/content/media.json";
import { dictionaries, type Locale } from "@/content/i18n";
import { LoopVideo, type VideoId } from "./LoopVideo";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { IconVolumeOff, IconVolumeOn } from "./icons";

const CLIPS = Object.keys(media.videos) as VideoId[];

function ClipCard({
  id,
  index,
  audible,
  onToggle,
  labels,
  locale,
}: {
  id: VideoId;
  locale: Locale;
  index: number;
  audible: boolean;
  onToggle: (id: VideoId | null) => void;
  labels: { mute: string; unmute: string };
}) {
  const video = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (audible) {
      v.muted = true;
      onToggle(null);
    } else {
      v.muted = false;
      v.play().catch(() => {});
      onToggle(id);
    }
  };

  // Silence a clip as soon as it scrolls out of view.
  const onVisibleChange = useCallback(
    (visible: boolean) => {
      if (!visible && video.current && !video.current.muted) {
        video.current.muted = true;
        onToggle(null);
      }
    },
    [onToggle],
  );

  // Keep the element's muted state in sync when another card takes the audio.
  useEffect(() => {
    if (!audible && video.current) video.current.muted = true;
  }, [audible]);

  return (
    <Reveal
      delay={index * 0.08}
      className={`relative w-[72vw] shrink-0 snap-center sm:w-[42vw] md:w-auto ${index % 2 ? "md:translate-y-12" : ""}`}
    >
      <figure className="group relative overflow-hidden rounded-[1.75rem] bg-ink-800">
        <LoopVideo ref={video} id={id} locale={locale} onVisibleChange={onVisibleChange} className="aspect-[9/16] w-full object-cover" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-cream">
          <span className="text-sm font-semibold leading-snug">{media.videos[id].alt[locale]}</span>
        </figcaption>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={audible}
          className={`absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full backdrop-blur-md transition-colors ${
            audible ? "bg-tangerine-500 text-ink-950" : "bg-ink-950/50 text-cream hover:bg-ink-950/75"
          }`}
        >
          <span className="sr-only">{audible ? labels.mute : labels.unmute}</span>
          {audible ? <IconVolumeOn /> : <IconVolumeOff />}
        </button>
        {audible && (
          <span aria-hidden className="absolute left-3 top-3 flex h-11 items-end gap-[3px] rounded-full bg-ink-950/50 px-3 pb-3.5 backdrop-blur-md">
            {[0, 1, 2, 3].map((b) => (
              <span key={b} className="eq-bar h-4 w-[3px] rounded-full bg-sun-300" style={{ animationDelay: `${b * 160}ms` }} />
            ))}
          </span>
        )}
      </figure>
    </Reveal>
  );
}

export function Live({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].live;
  const [audible, setAudible] = useState<VideoId | null>(null);
  const onToggle = useCallback((id: VideoId | null) => setAudible(id), []);

  return (
    <section
      id="live"
      aria-labelledby="live-title"
      className="grain relative overflow-hidden bg-ink-900 py-24 text-cream md:pb-44 md:pt-36"
    >
      <div
        aria-hidden
        className="absolute -right-48 -top-48 h-[44rem] w-[44rem] rounded-full opacity-50 blur-[140px]"
        style={{ background: "radial-gradient(circle, #ff6a2b, transparent 70%)" }}
      />
      <div className="container-x relative">
        <SectionHeading
          id="live-title"
          index="04"
          eyebrow={t.eyebrow}
          title={t.title}
          tone="dark"
          aside={<p className="max-w-xs text-cream/70">{t.body}</p>}
        />
      </div>

      <div className="no-scrollbar relative -mb-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 md:container-x md:grid md:snap-none md:grid-cols-4 md:gap-6 md:overflow-visible">
        {CLIPS.map((id, i) => (
          <ClipCard key={id} id={id} index={i} audible={audible === id} onToggle={onToggle} labels={t} locale={locale} />
        ))}
      </div>
    </section>
  );
}
