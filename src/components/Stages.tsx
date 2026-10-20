import type { Dictionary, Locale } from "@/content/i18n";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { IconArrow, IconArrowUpRight, Sun } from "./icons";

function UpcomingEvents({ t, locale }: { t: Dictionary["stages"]; locale: Locale }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = site.events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  if (!upcoming.length) {
    return (
      <Reveal className="grain relative overflow-hidden rounded-[2rem] p-8 text-ink-950 md:p-10" style={{ background: "var(--sunset)" }}>
        <Sun className="absolute -right-10 -top-10 text-[11rem] text-sun-200/60" />
        <p className="eyebrow relative mb-4 flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-ink-950" /> {t.upcomingTitle}
        </p>
        <h3 className="display relative text-[clamp(2.2rem,4vw,3.4rem)]">{t.emptyTitle}</h3>
        <p className="relative mt-4 max-w-md font-medium text-ink-900/85">{t.emptyBody}</p>
        <a href="#booking" className="btn btn-primary relative mt-7">
          {t.emptyCta} <IconArrow width={18} height={18} />
        </a>
      </Reveal>
    );
  }

  const fmt = new Intl.DateTimeFormat(locale === "es" ? "es-AR" : "en-US", { day: "2-digit", month: "short", timeZone: "UTC" });
  return (
    <Reveal className="rounded-[2rem] bg-cream p-6 shadow-[inset_0_0_0_1px_rgb(42_24_16/0.08)] md:p-8">
      <p className="eyebrow mb-5 text-tangerine-600">{t.upcomingTitle}</p>
      <ul className="divide-y divide-ink-900/10">
        {upcoming.map((e) => {
          const [day, month] = fmt.format(new Date(e.date)).replace(".", "").split(" ");
          return (
            <li key={e.date + e.venue} className="flex items-center gap-5 py-4">
              <time dateTime={e.date} className="w-14 text-center leading-none">
                <span className="display block text-4xl">{day}</span>
                <span className="eyebrow text-[0.65rem] text-ink-500">{month}</span>
              </time>
              <div className="flex-1">
                <p className="display text-2xl">{e.venue}</p>
                <p className="text-sm text-ink-500">{e.city}</p>
              </div>
              {e.url && (
                <a href={e.url} target="_blank" rel="noopener" className="btn btn-ghost !min-h-10 !px-4">
                  {t.tickets} <IconArrowUpRight width={16} height={16} />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}

export function Stages({ t, locale }: { t: Dictionary["stages"]; locale: Locale }) {
  return (
    <section id="stages" aria-labelledby="stages-title" className="relative bg-sand-100 py-24 md:py-36">
      <div className="container-x">
        <SectionHeading id="stages-title" index="02" eyebrow={t.eyebrow} title={t.title} />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4 text-ink-500">{t.venuesLabel}</p>
            <ol className="border-t border-ink-900/15">
              {site.venues.map((v, i) => (
                <li key={v} className="group relative overflow-hidden border-b border-ink-900/15">
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
                    style={{ background: "var(--sunset-x)" }}
                  />
                  <Reveal delay={i * 0.05} y={24} className="relative flex items-center gap-5 py-5 md:gap-8 md:py-6">
                    <span className="w-8 text-xs font-bold tabular-nums tracking-[0.2em] text-ink-500 transition-colors group-hover:text-ink-950">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="display flex-1 text-[clamp(2.4rem,6.5vw,5.2rem)] text-ink-900 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                      {v}
                    </span>
                    <Sun className="text-2xl text-tangerine-500 transition-all duration-500 group-hover:rotate-90 group-hover:text-ink-950" />
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-10 lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-4 text-ink-500">{t.citiesLabel}</p>
              <ul className="flex flex-wrap gap-2">
                {site.cities.map((c) => (
                  <li key={c} className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-bold text-cream">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <p className="eyebrow mb-4 text-ink-500">{t.sharedLabel}</p>
              <ul className="flex flex-wrap gap-2">
                {site.sharedBooth.map((a) => (
                  <li
                    key={a}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-ink-800 shadow-[inset_0_0_0_1.5px_rgb(42_24_16/0.22)]"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>

            <UpcomingEvents t={t} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
