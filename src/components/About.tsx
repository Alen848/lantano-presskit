import type { Dictionary, Locale } from "@/content/i18n";
import { CountUp } from "./CountUp";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function About({ t, locale }: { t: Dictionary["about"]; locale: Locale }) {
  return (
    <section id="bio" aria-labelledby="bio-title" className="relative overflow-hidden pb-24 pt-28 md:pb-36 md:pt-40">
      <div className="container-x">
        <SectionHeading id="bio-title" index="01" eyebrow={t.eyebrow} title={t.title} />

        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Portrait on a sun disc */}
          <Reveal className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative aspect-[4/5]">
              <div
                aria-hidden
                className="absolute inset-x-[6%] bottom-0 top-[14%] rounded-[45%_45%_2.5rem_2.5rem] shadow-[0_40px_80px_-30px_rgb(232_84_26/0.55)]"
                style={{ background: "linear-gradient(170deg, #ffd27a 0%, #ff9a4c 55%, #ff6a2b 100%)" }}
              />
              <div aria-hidden className="absolute left-[8%] top-[6%] h-24 w-24 animate-spin-slow rounded-full border-[1.5px] border-dashed border-tangerine-600/50" />
              <Picture
                id="seated"
                locale={locale}
                sizes="(min-width: 1024px) 36vw, 90vw"
                className="absolute inset-0 flex items-end justify-center [clip-path:inset(-20%_6%_0_6%_round_0_0_2.5rem_2.5rem)]"
                imgClassName="h-full w-auto object-contain object-bottom drop-shadow-[0_24px_30px_rgb(90_30_5/0.35)]"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-7 lg:pl-8 lg:pt-6">
            <Reveal>
              <p className="display text-[clamp(2rem,4.2vw,3.6rem)] text-ink-900">
                <span className="text-sunset">{t.lead}</span>
              </p>
            </Reveal>
            <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-ink-700 md:text-lg">
              {t.body.map((p, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
              {t.stats.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={0.08 * i}
                  className="flex flex-col rounded-[1.6rem] bg-cream p-4 shadow-[inset_0_0_0_1px_rgb(42_24_16/0.08)] sm:p-6"
                >
                  <dt className="order-2 mt-2 text-[0.7rem] font-bold uppercase leading-snug tracking-[0.14em] text-ink-500 sm:text-xs">
                    {s.label}
                  </dt>
                  <dd className="display text-[clamp(2.6rem,6vw,4.5rem)] text-tangerine-600">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
