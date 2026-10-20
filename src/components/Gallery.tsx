"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { dictionaries, type Locale } from "@/content/i18n";
import { site } from "@/content/site";
import { Picture, altText, largestSrc, type ImageId } from "./Picture";
import { useLenis } from "./Providers";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { IconChevron, IconClose, IconDownload } from "./icons";

/** Order + layout: `tall` tiles span two rows in the bento grid. */
const PHOTOS: { id: ImageId; tall?: boolean }[] = [
  { id: "booth", tall: true },
  { id: "hat-tip" },
  { id: "white-shirt" },
  { id: "profile" },
  { id: "hat-portrait", tall: true },
  { id: "side-shades" },
  { id: "jersey-back" },
  { id: "close-shades" },
  { id: "jersey-profile" },
  { id: "hat-back" },
];

function Lightbox({ index, onClose, onStep, locale }: { index: number; onClose: () => void; onStep: (d: number) => void; locale: Locale }) {
  const t = dictionaries[locale].gallery;
  const photo = PHOTOS[index];
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const [dir, setDir] = useState(0);

  useEffect(() => {
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) {
        setDir(d);
        onStep(d);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  const step = (d: number) => {
    setDir(d);
    onStep(d);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={altText(photo.id, locale)}
      className="fixed inset-0 z-[60] flex flex-col bg-ink-950/95 text-cream backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
        <p className="eyebrow tabular-nums text-cream/70" aria-live="polite">
          {t.counter(index + 1, PHOTOS.length)}
        </p>
        <button ref={closeBtn} type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-cream/10 hover:bg-cream/20">
          <span className="sr-only">{t.close}</span>
          <IconClose />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-24">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.img
            key={photo.id}
            src={largestSrc(photo.id)}
            alt={altText(photo.id, locale)}
            className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 80 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -80 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            draggable={false}
          />
        </AnimatePresence>
        <button
          type="button"
          onClick={() => step(-1)}
          className="absolute left-4 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-cream/10 hover:bg-cream/20 md:grid"
        >
          <span className="sr-only">{t.prev}</span>
          <IconChevron dir="left" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="absolute right-4 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-cream/10 hover:bg-cream/20 md:grid"
        >
          <span className="sr-only">{t.next}</span>
          <IconChevron dir="right" />
        </button>
      </div>
    </motion.div>
  );
}

export function Gallery({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].gallery;
  const [open, setOpen] = useState<number | null>(null);
  const lenisRef = useLenis();
  const opener = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const stepBy = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + PHOTOS.length) % PHOTOS.length)), []);

  useEffect(() => {
    if (open === null) return;
    const lenis = lenisRef.current;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      opener.current?.focus();
    };
  }, [open === null, lenisRef]); // eslint-disable-line react-hooks/exhaustive-deps -- only on open/close, not on every step

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="gallery-title"
          index="05"
          eyebrow={t.eyebrow}
          title={t.title}
          aside={
            <div className="max-w-xs space-y-4">
              <p className="text-ink-700">{t.body}</p>
              <a href={site.pressKit} download className="btn btn-sun">
                <IconDownload /> {t.download}
              </a>
            </div>
          }
        />

        <ul className="grid grid-flow-dense auto-rows-[44vw] grid-cols-2 gap-3 sm:auto-rows-[30vw] sm:grid-cols-3 md:gap-4 lg:auto-rows-[19vw] lg:grid-cols-4 2xl:auto-rows-[17rem]">
          {PHOTOS.map((p, i) => (
            <li key={p.id} className={p.tall ? "row-span-2" : ""}>
              <Reveal delay={(i % 4) * 0.06} y={30} className="h-full">
                <button
                  type="button"
                  onClick={(e) => {
                    opener.current = e.currentTarget;
                    setOpen(i);
                  }}
                  className="group relative block h-full w-full overflow-hidden rounded-[1.4rem] bg-sand-200"
                >
                  <span className="sr-only">
                    {t.open}: {altText(p.id, locale)}
                  </span>
                  <Picture
                    id={p.id}
                    locale={locale}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "var(--sunset)" }}
                  />
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open !== null && <Lightbox index={open} onClose={close} onStep={stepBy} locale={locale} />}
      </AnimatePresence>
    </section>
  );
}
