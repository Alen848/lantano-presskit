import type { ReactNode } from "react";
import { RevealWords } from "./Reveal";
import { Sun } from "./icons";

type Props = {
  index: string;
  eyebrow: string;
  title: string;
  tone?: "light" | "dark";
  aside?: ReactNode;
  id?: string;
};

export function SectionHeading({ index, eyebrow, title, tone = "light", aside, id }: Props) {
  const dark = tone === "dark";
  return (
    <header className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p className={`eyebrow mb-4 flex items-center gap-3 ${dark ? "text-sun-300" : "text-tangerine-600"}`}>
          <span className="tabular-nums">{index}</span>
          <Sun className="text-[0.9rem]" />
          <span>{eyebrow}</span>
        </p>
        <h2 id={id} className={`display text-[clamp(3.2rem,10vw,8.5rem)] ${dark ? "text-cream" : "text-ink-900"}`}>
          <RevealWords text={title} />
        </h2>
      </div>
      {aside}
    </header>
  );
}
