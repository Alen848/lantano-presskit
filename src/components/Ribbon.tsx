import { Sun } from "./icons";

function Track({ items, className, duration, reverse }: { items: readonly string[]; className: string; duration: string; reverse?: boolean }) {
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-[0.6em] px-[0.6em]">
          <span>{it}</span>
          <Sun className="text-[0.55em] opacity-80" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="display flex w-max animate-marquee py-3 text-[clamp(1.4rem,3vw,2.4rem)] leading-none md:py-4"
        style={{ ["--marquee-duration" as string]: duration, animationDirection: reverse ? "reverse" : undefined }}
      >
        {row()}
        {row(true)}
      </div>
    </div>
  );
}

/** Two crossing marquee bands — the summer "festival wristband" motif. */
export function Ribbon({ items }: { items: readonly string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative z-10 -my-6 overflow-hidden py-10 md:-my-8 md:py-14" aria-label={items.join(", ")} role="marquee">
      <Track
        items={doubled}
        duration="55s"
        reverse
        className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[2.5deg] bg-sun-300 text-ink-900/70"
      />
      <Track
        items={doubled}
        duration="45s"
        className="relative -rotate-[2deg] bg-ink-900 text-cream shadow-[0_20px_40px_-20px_rgb(42_24_16/0.6)]"
      />
    </div>
  );
}
