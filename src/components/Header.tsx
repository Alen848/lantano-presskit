"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { dictionaries, localePath, type Locale } from "@/content/i18n";
import { useLenis } from "./Providers";
import { Logo } from "./Logo";
import { IconClose, IconMenu, Sun } from "./icons";

export const SECTIONS = ["bio", "stages", "music", "live", "gallery", "rider", "booking"] as const;
type SectionId = (typeof SECTIONS)[number];

const navKey: Record<SectionId, keyof (typeof dictionaries)["es"]["nav"]> = {
  bio: "about",
  stages: "stages",
  music: "music",
  live: "live",
  gallery: "gallery",
  rider: "rider",
  booking: "booking",
};

export function Header({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].nav;
  const other: Locale = locale === "es" ? "en" : "es";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [open, setOpen] = useState(false);
  const lenisRef = useLenis();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(true);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Lock scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const lenis = lenisRef.current;
    const btn = menuBtn.current;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      if (restoreFocus.current) btn?.focus();
      restoreFocus.current = true;
    };
  }, [open, lenisRef]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-ink-900 px-5 py-3 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.skip}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled && !open ? "bg-sand-50/80 shadow-[0_1px_0_rgb(42_24_16/0.08)] backdrop-blur-xl backdrop-saturate-150" : ""
        }`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <a href="#top" className="relative z-10 block text-ink-900" aria-label="LANTANO — inicio">
            <Logo id="header" className="h-6 w-auto md:h-7" />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full bg-cream/60 p-1 shadow-[inset_0_0_0_1px_rgb(42_24_16/0.08)] backdrop-blur-md">
              {SECTIONS.filter((s) => s !== "booking").map((id) => (
                <li key={id} className="relative">
                  {active === id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-ink-900"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <a
                    href={`#${id}`}
                    aria-current={active === id ? "true" : undefined}
                    className={`relative block rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] transition-colors ${
                      active === id ? "text-cream" : "text-ink-700 hover:text-ink-900"
                    }`}
                  >
                    {t[navKey[id]]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <a
              href={localePath[other]}
              hrefLang={other}
              lang={other}
              className="grid h-10 min-w-10 place-items-center rounded-full px-3 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-ink-800 shadow-[inset_0_0_0_1.5px_rgb(42_24_16/0.18)] transition-colors hover:bg-ink-900 hover:text-cream"
              aria-label={t.switchTo}
            >
              {other}
            </a>
            <a href="#booking" className="btn btn-primary hidden !min-h-10 !px-5 sm:inline-flex">
              {t.booking}
            </a>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-cream lg:hidden"
            >
              <span className="sr-only">{open ? t.close : t.menu}</span>
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>

        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
          style={{ scaleX: progress, background: "var(--sunset-x)" }}
        />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.menu}
            className="grain fixed inset-0 z-40 flex flex-col overflow-y-auto pt-[var(--header-h)] lg:hidden"
            style={{ background: "var(--sunset)" }}
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Móvil" className="container-x flex flex-1 flex-col justify-center py-10">
              <ul className="space-y-1">
                {SECTIONS.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6 }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={() => {
                        restoreFocus.current = false;
                        setOpen(false);
                      }}
                      className="display flex items-baseline gap-4 py-1 text-[clamp(2.8rem,13vw,5rem)] text-ink-950 transition-colors hover:text-cream"
                    >
                      <span className="font-sans text-xs font-bold tracking-[0.2em]">0{i + 1}</span>
                      {t[navKey[id]]}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="container-x flex items-center gap-3 pb-10 text-ink-950">
              <Sun className="text-xl" />
              <span className="eyebrow">Tech House · Minimal Deep</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
