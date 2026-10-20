"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { dictionaries, type Locale } from "@/content/i18n";
import { site } from "@/content/site";
import { Logo } from "./Logo";
import { Picture } from "./Picture";
import { LoopVideo } from "./LoopVideo";
import { IconArrowDown, IconPlay, Sun } from "./icons";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].hero;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sunY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const logoY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const personY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      aria-label="LANTANO"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fff4e4 0%, #ffe6c4 38%, #ffcf98 72%, #ffb77a 100%)" }}
    >
      {/* Sun */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 top-0 -z-10" style={{ y: sunY }}>
        <motion.div
          className="absolute left-1/2 top-[52%] aspect-square w-[min(118vw,78svh)] -translate-x-1/2 -translate-y-1/2 rounded-full md:top-[50%] md:w-[min(64vw,84svh)]"
          style={{
            background: "radial-gradient(circle at 50% 35%, #ffd98a 0%, #ffb547 30%, #ff7a35 62%, #ff5552 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, #000 0 56%, transparent 56% 59%, #000 59% 67%, transparent 67% 71%, #000 71% 78%, transparent 78% 83%, #000 83% 88%, transparent 88% 94%, #000 94%)",
            maskImage:
              "linear-gradient(180deg, #000 0 56%, transparent 56% 59%, #000 59% 67%, transparent 67% 71%, #000 71% 78%, transparent 78% 83%, #000 83% 88%, transparent 88% 94%, #000 94%)",
          }}
          initial={{ opacity: 0, y: "18%", scale: 0.92 }}
          animate={{ opacity: 1, y: "0%", scale: 1 }}
          transition={{ duration: 1.8, ease }}
        />
        {/* Soft glow around the sun */}
        <div className="absolute left-1/2 top-1/2 h-[80svh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun-300/40 blur-[120px]" />
      </motion.div>

      {/* Logotype — sits behind the artist so the head overlaps only the T */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+5svh)] z-0 flex justify-center px-[var(--gutter)] md:top-[calc(var(--header-h)+3svh)]"
        style={{ y: logoY, scale: logoScale, opacity: fade }}
      >
        <motion.h1
          className="w-full max-w-[min(100%,118svh)] text-ink-900"
          initial={{ clipPath: "inset(100% 0 0 0)", y: 40 }}
          animate={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
          transition={{ duration: 1.4, delay: 0.35, ease }}
        >
          <Logo id="hero" className="block h-auto w-full" title="LANTANO — DJ / Productor" />
        </motion.h1>
      </motion.div>

      {/* Artist */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center"
        style={{ y: personY }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.6, ease }}
      >
        <Picture
          id="hero"
          locale={locale}
          priority
          placeholder={false}
          sizes="(min-width: 768px) 42vh, 70vw"
          className="block"
          imgClassName="h-[min(72svh,135vw)] w-auto max-w-none select-none drop-shadow-[0_30px_40px_rgb(120_45_10/0.28)] md:h-[76svh]"
        />
      </motion.div>

      {/* Bottom bar */}
      <motion.div className="relative z-20 mt-auto" style={{ opacity: fade }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1, ease }}>
        <div className="bg-gradient-to-t from-[#ffb070] from-35% via-[#ffbd85]/80 to-transparent pb-6 pt-28 md:bg-none md:pb-10 md:pt-0">
          <div className="container-x grid items-end gap-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="text-ink-950 max-md:text-center">
              <p className="eyebrow mb-2 flex items-center gap-2 max-md:justify-center">
                <Sun className="text-tangerine-600" /> {t.role}
              </p>
              <p className="display text-[clamp(1.6rem,3.2vw,2.6rem)] leading-none">{site.genres.join(" · ")}</p>
              <p className="mt-2 text-sm font-semibold text-ink-800">{t.based}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <a href="#music" className="btn btn-ghost !bg-cream/85">
                <IconPlay width={16} height={16} /> {t.listen}
              </a>
              <a href="#booking" className="btn btn-primary">
                {t.book}
              </a>
            </div>

            <a
              href="#bio"
              className="eyebrow hidden items-center justify-self-end gap-3 text-ink-900 md:flex"
              aria-label={t.scroll}
            >
              {t.scroll}
              <span className="grid h-11 w-11 place-items-center rounded-full shadow-[inset_0_0_0_1.5px_rgb(42_24_16/0.6)]">
                <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
                  <IconArrowDown width={18} height={18} />
                </motion.span>
              </span>
            </a>
          </div>
        </div>
      </motion.div>
      </motion.div>

      {/* Floating live card (large screens) */}
      <motion.div
        className="absolute right-[var(--gutter)] top-[58%] z-20 hidden w-[clamp(9rem,11vw,12rem)] -translate-y-1/2 xl:block"
        style={{ opacity: fade }}
      >
      <motion.figure
        initial={{ opacity: 0, rotate: 0, y: 40 }}
        animate={{ opacity: 1, rotate: 4, y: 0 }}
        transition={{ duration: 1.2, delay: 1.4, ease }}
      >
        <div className="overflow-hidden rounded-[1.4rem] bg-ink-900 p-1.5 shadow-[0_30px_60px_-20px_rgb(120_45_10/0.55)]">
          <LoopVideo id="day-session" locale={locale} className="aspect-[9/16] w-full rounded-[1.05rem] object-cover" />
        </div>
        <figcaption className="eyebrow mt-3 flex items-center gap-2 text-[0.65rem] text-ink-900">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-coral-500" /> Live · {t.liveTag}
        </figcaption>
      </motion.figure>
      </motion.div>
    </section>
  );
}
