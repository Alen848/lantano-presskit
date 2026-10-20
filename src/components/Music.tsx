"use client";

import { useEffect, useRef, useState } from "react";
import { dictionaries, type Locale } from "@/content/i18n";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { IconArrowUpRight, IconPlay, IconSoundcloud } from "./icons";

const widget = (url: string) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff6a2b&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;

/**
 * SoundCloud is loaded behind a facade: the third-party iframe (≈1 MB of JS + cookies)
 * only loads when the section approaches the viewport or the visitor asks for it.
 */
export function Music({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].music;
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setActive(true), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const profileUrl = `https://api.soundcloud.com/users/${site.soundcloud.userId}`;

  return (
    <section id="music" aria-labelledby="music-title" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="absolute -left-40 top-20 h-[38rem] w-[38rem] rounded-full bg-sun-300/35 blur-[120px]" />
      <div className="container-x relative">
        <SectionHeading
          id="music-title"
          index="03"
          eyebrow={t.eyebrow}
          title={t.title}
          aside={
            <a href={site.socials.soundcloud} target="_blank" rel="noopener" className="btn btn-ghost self-start md:self-auto">
              <IconSoundcloud /> {t.open}
            </a>
          }
        />

        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="text-lg leading-relaxed text-ink-700">{t.body}</p>

            <a
              href={site.soundcloud.featured.url}
              target="_blank"
              rel="noopener"
              className="group mt-8 flex items-center gap-5 rounded-[1.6rem] bg-ink-900 p-4 pr-6 text-cream transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
            >
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl" style={{ background: "var(--sunset)" }}>
                <IconPlay className="text-ink-950 transition-transform duration-500 group-hover:scale-110" width={24} height={24} />
              </span>
              <span className="flex-1">
                <span className="eyebrow block text-[0.65rem] text-sun-300">{t.featured}</span>
                <span className="display block text-3xl">{site.soundcloud.featured.title}</span>
              </span>
              <IconArrowUpRight className="opacity-60 transition-opacity group-hover:opacity-100" />
            </a>

            {/* Equaliser decoration */}
            <div aria-hidden className="mt-10 flex h-20 items-end gap-1.5">
              {Array.from({ length: 28 }, (_, i) => (
                <span
                  key={i}
                  className="eq-bar w-full rounded-full"
                  style={{
                    background: "var(--sunset)",
                    animationDelay: `${(i * 137) % 900}ms`,
                    height: `${30 + ((i * 53) % 70)}%`,
                  }}
                />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-8">
            <div
              ref={box}
              className="relative overflow-hidden rounded-[2rem] bg-cream p-2 shadow-[0_30px_80px_-40px_rgb(120_45_10/0.45),inset_0_0_0_1px_rgb(42_24_16/0.08)]"
            >
              {active ? (
                <iframe
                  title="LANTANO en SoundCloud"
                  src={widget(profileUrl)}
                  className="block h-[330px] w-full rounded-[1.6rem]"
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                />
              ) : (
                <div className="grid h-[330px] place-items-center rounded-[1.6rem] bg-sand-100 text-center">
                  <div>
                    <button type="button" onClick={() => setActive(true)} className="btn btn-sun">
                      <IconSoundcloud /> {t.loadPlayer}
                    </button>
                    <p className="mt-3 text-xs text-ink-500">{t.consent}</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
