"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { dictionaries, type Locale } from "@/content/i18n";
import { site } from "@/content/site";
import { CdjArt, MixerArt } from "./GearArt";
import { SectionHeading } from "./SectionHeading";
import { IconDownload } from "./icons";

const TABS = ["tech", "hospitality"] as const;
type Tab = (typeof TABS)[number];

export function Rider({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].rider;
  const press = dictionaries[locale].footer.press;
  const [tab, setTab] = useState<Tab>("tech");
  const refs = useRef<Record<Tab, HTMLButtonElement | null>>({ tech: null, hospitality: null });

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = TABS[(TABS.indexOf(tab) + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length];
    setTab(next);
    refs.current[next]?.focus();
  };

  return (
    <section id="rider" aria-labelledby="rider-title" className="relative bg-sand-100 py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="rider-title"
          index="06"
          eyebrow={t.eyebrow}
          title={t.title}
          aside={
            <a href={site.pressKit} download className="btn btn-ghost self-start md:self-auto">
              <IconDownload /> {press}
            </a>
          }
        />

        <div role="tablist" aria-label={t.title} className="mb-10 inline-flex rounded-full bg-cream p-1.5 shadow-[inset_0_0_0_1px_rgb(42_24_16/0.1)]" onKeyDown={onKey}>
          {TABS.map((k) => (
            <button
              key={k}
              ref={(el) => {
                refs.current[k] = el;
              }}
              role="tab"
              id={`tab-${k}`}
              aria-selected={tab === k}
              aria-controls={`panel-${k}`}
              tabIndex={tab === k ? 0 : -1}
              onClick={() => setTab(k)}
              className={`relative rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-[0.18em] transition-colors ${
                tab === k ? "text-cream" : "text-ink-700 hover:text-ink-900"
              }`}
            >
              {tab === k && (
                <motion.span layoutId="rider-tab" className="absolute inset-0 rounded-full bg-ink-900" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
              <span className="relative">{t.tabs[k]}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {tab === "tech" ? (
            <motion.div
              key="tech"
              role="tabpanel"
              id="panel-tech"
              aria-labelledby="tab-tech"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="grid gap-4 md:grid-cols-3"
            >
              {/* Booth layout: CDJ · Mixer · CDJ */}
              <div className="grain relative overflow-hidden rounded-[2rem] p-6 md:col-span-3 md:p-10" style={{ background: "linear-gradient(160deg,#ffe2a3,#ffb547 45%,#ff8a4c)" }}>
                <div className="relative flex items-end justify-center gap-2 sm:gap-4">
                  <CdjArt className="w-[30%] max-w-[13rem] drop-shadow-[0_24px_30px_rgb(90_30_5/0.35)]" />
                  <MixerArt className="w-[34%] max-w-[14.5rem] drop-shadow-[0_24px_30px_rgb(90_30_5/0.35)]" />
                  <CdjArt className="w-[30%] max-w-[13rem] drop-shadow-[0_24px_30px_rgb(90_30_5/0.35)]" />
                </div>
              </div>
              {site.rider.gear.map((g) => (
                <article key={g.id} className="flex items-center gap-5 rounded-[1.6rem] bg-cream p-6 shadow-[inset_0_0_0_1px_rgb(42_24_16/0.08)]">
                  <span className="display text-6xl text-tangerine-600">{g.qty}×</span>
                  <div>
                    <p className="eyebrow text-[0.65rem] text-ink-500">{t.gearNames[g.id]}</p>
                    <h3 className="display mt-1 text-2xl text-ink-900 md:text-3xl">{g.model}</h3>
                    <p className="text-sm font-semibold text-ink-500">{t.orBetter}</p>
                  </div>
                </article>
              ))}
              <article className="flex items-center rounded-[1.6rem] bg-ink-900 p-6 text-cream">
                <p className="display text-2xl leading-tight md:text-3xl">
                  2 × CDJ <span className="text-sun-400">+</span> 1 × DJM
                  <span className="mt-2 block font-sans text-sm font-semibold normal-case tracking-normal text-cream/60">Pioneer DJ · {t.orBetter}</span>
                </p>
              </article>
            </motion.div>
          ) : (
            <motion.div
              key="hospitality"
              role="tabpanel"
              id="panel-hospitality"
              aria-labelledby="tab-hospitality"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {t.hospitality.map((h, i) => (
                <article
                  key={h.title}
                  className={`rounded-[1.6rem] bg-cream p-7 shadow-[inset_0_0_0_1px_rgb(42_24_16/0.08)] ${i === 2 ? "lg:row-span-2" : ""}`}
                >
                  <p className="text-xs font-bold tabular-nums tracking-[0.2em] text-tangerine-600">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display mt-3 text-4xl text-ink-900">{h.title}</h3>
                  <ul className="mt-4 space-y-3 text-ink-700">
                    {h.body.map((line) => (
                      <li key={line} className="flex gap-3 leading-relaxed">
                        <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-tangerine-500" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
