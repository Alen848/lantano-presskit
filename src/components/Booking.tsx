"use client";

import { useState, type FormEvent } from "react";
import { dictionaries, type Locale } from "@/content/i18n";
import { site } from "@/content/site";
import { Picture } from "./Picture";
import { Reveal, RevealWords } from "./Reveal";
import { IconArrow, IconArrowUpRight, IconCheck, IconCopy, IconDownload, IconInstagram, IconSoundcloud, Sun } from "./icons";

export function Booking({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].booking;
  const f = t.form;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const lines = [
      `${f.name}: ${get("name")}`,
      `${f.email}: ${get("email")}`,
      `${f.date}: ${get("date") || "—"}`,
      `${f.city}: ${get("city") || "—"}`,
      `${f.type}: ${get("type") || "—"}`,
      "",
      get("message"),
    ];
    const href = `mailto:${site.email}?subject=${encodeURIComponent(f.subject(get("name"), get("date")))}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = href;
  };

  return (
    <section
      id="booking"
      aria-labelledby="booking-title"
      className="grain relative overflow-hidden pb-0 pt-24 text-ink-950 md:pt-36"
      style={{ background: "linear-gradient(180deg, #ffd27a 0%, #ffb547 30%, #ff7a35 75%, #ff5d4a 100%)" }}
    >
      <Sun aria-hidden className="pointer-events-none absolute -right-24 -top-24 text-[26rem] text-sun-200/50 motion-safe:animate-spin-slow" />

      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span>07</span> <Sun className="text-[0.9rem]" /> <span>{t.eyebrow}</span>
          </p>
          <h2 id="booking-title" className="display text-[clamp(3.2rem,9vw,7.5rem)]">
            <RevealWords text={t.title} />
          </h2>
          <Reveal>
            <p className="mt-6 max-w-md text-lg font-medium text-ink-900/85">{t.body}</p>

            <div className="mt-10">
              <a
                href={`mailto:${site.email}`}
                className="link-sweep display break-all text-[clamp(1.6rem,4.2vw,3.2rem)] leading-tight"
              >
                {site.email}
              </a>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={copy} className="btn btn-primary" aria-live="polite">
                  {copied ? <IconCheck /> : <IconCopy />} {copied ? t.copied : t.copy}
                </button>
                {site.socials.instagram && (
                  <a href={site.socials.instagram} target="_blank" rel="noopener" className="btn btn-ghost !px-4" aria-label="Instagram">
                    <IconInstagram />
                  </a>
                )}
                <a href={site.socials.soundcloud} target="_blank" rel="noopener" className="btn btn-ghost !px-4" aria-label="SoundCloud">
                  <IconSoundcloud />
                </a>
              </div>
            </div>
          </Reveal>

          <Picture
            id="shades"
            locale={locale}
            sizes="(min-width: 1024px) 28vw, 70vw"
            className="pointer-events-none mt-12 block w-[62%] max-w-[18rem] lg:mt-14"
            imgClassName="h-auto w-full drop-shadow-[0_30px_30px_rgb(120_30_5/0.35)]"
          />
        </div>

        <Reveal delay={0.1} className="self-start lg:col-span-6 lg:mb-24">
          <form
            onSubmit={submit}
            className="rounded-[2rem] bg-cream/95 p-6 shadow-[0_40px_80px_-30px_rgb(120_30_5/0.6)] backdrop-blur md:p-9"
          >
            <h3 className="display text-4xl text-ink-900">{f.title}</h3>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-700">{f.name}</span>
                <input name="name" required autoComplete="organization" className="field" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-700">{f.email}</span>
                <input name="email" type="email" required autoComplete="email" className="field" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-700">{f.date}</span>
                <input name="date" type="date" className="field" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-700">{f.city}</span>
                <input name="city" autoComplete="address-level2" className="field" />
              </label>
              <fieldset className="sm:col-span-2">
                <legend className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-700">{f.type}</legend>
                <div className="flex flex-wrap gap-2">
                  {f.types.map((type, i) => (
                    <label key={type} className="cursor-pointer">
                      <input type="radio" name="type" value={type} defaultChecked={i === 0} className="peer sr-only" />
                      <span className="block rounded-full px-4 py-2 text-sm font-semibold text-ink-700 shadow-[inset_0_0_0_1.5px_rgb(42_24_16/0.18)] transition-colors peer-checked:bg-ink-900 peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-tangerine-600">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-700">{f.message}</span>
                <textarea name="message" rows={4} placeholder={f.messagePh} className="field resize-y" />
              </label>
            </div>
            <button type="submit" className="btn btn-sun mt-6 w-full sm:w-auto">
              {f.submit} <IconArrow width={18} height={18} />
            </button>
            <p className="mt-3 text-xs text-ink-500">{f.note}</p>
          </form>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <a
              href={site.pressKit}
              download
              className="group flex items-center justify-between gap-4 rounded-[1.6rem] bg-ink-900 p-6 text-cream transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
            >
              <span>
                <span className="eyebrow block text-[0.65rem] text-sun-300">ZIP · {t.pressKind}</span>
                <span className="display mt-1 block text-2xl">{t.pressLabel}</span>
              </span>
              <IconDownload className="shrink-0 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#rider"
              className="group flex items-center justify-between gap-4 rounded-[1.6rem] bg-cream/90 p-6 text-ink-900 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
            >
              <span>
                <span className="eyebrow block text-[0.65rem] text-tangerine-600">{t.riderKind}</span>
                <span className="display mt-1 block text-2xl">{t.riderLabel}</span>
              </span>
              <IconArrowUpRight className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
