import type { Dictionary } from "@/content/i18n";
import { site } from "@/content/site";
import { Logo } from "./Logo";
import { IconArrowUpRight, IconDownload, IconInstagram, IconMail, IconSoundcloud, Sun } from "./icons";

export function Footer({ t }: { t: Dictionary["footer"] }) {
  const year = new Date().getFullYear();
  const links = [
    { href: site.socials.instagram, label: "Instagram", icon: IconInstagram, external: true },
    { href: site.socials.soundcloud, label: "SoundCloud", icon: IconSoundcloud, external: true },
    { href: `mailto:${site.email}`, label: "Email", icon: IconMail, external: false },
  ].filter((l) => l.href);
  return (
    <footer className="grain relative overflow-hidden bg-ink-900 text-cream">
      {/* Giant scrolling logotype */}
      <div aria-hidden className="overflow-hidden border-b border-cream/10 py-10 md:py-14">
        <div className="flex w-max animate-marquee items-center gap-[4vw]" style={{ ["--marquee-duration" as string]: "38s" }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-[4vw]">
              <Logo id={`footer-${i}`} className="h-[clamp(5rem,14vw,12rem)] w-auto text-[#ff8a4c]" />
              <Sun className="text-[clamp(2rem,5vw,4rem)] text-sun-400" />
            </div>
          ))}
        </div>
      </div>

      <div className="container-x grid gap-10 py-12 md:grid-cols-3 md:items-center">
        <ul className="flex gap-3">
          {links.map(({ href, label, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener" } : {})}
                className="grid h-12 w-12 place-items-center rounded-full bg-cream/5 text-sun-300 shadow-[inset_0_0_0_1px_rgb(255_246_234/0.12)] transition-colors hover:bg-tangerine-500 hover:text-ink-950"
                aria-label={label}
              >
                <Icon />
              </a>
            </li>
          ))}
        </ul>

        <a href={site.pressKit} download className="link-sweep inline-flex items-center gap-2 justify-self-start text-sm font-bold uppercase tracking-[0.16em] text-cream/80 md:justify-self-center">
          <IconDownload width={18} height={18} /> {t.press}
        </a>

        <a href="#top" className="link-sweep inline-flex items-center gap-2 justify-self-start text-sm font-bold uppercase tracking-[0.16em] text-cream/80 md:justify-self-end">
          {t.backTop} <IconArrowUpRight width={18} height={18} className="-rotate-45" />
        </a>
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-cream/10 py-6 text-xs text-cream/50 sm:flex-row sm:justify-between">
        <p>
          © {year} {site.name} — {site.legalName}. {t.rights}
        </p>
        <p>
          {site.city}, {site.country}
        </p>
      </div>
    </footer>
  );
}
