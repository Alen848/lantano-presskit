import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { anton, manrope } from "./fonts";
import { dictionaries } from "@/content/i18n";
import { Logo } from "@/components/Logo";

const t = dictionaries.es.notFound;

export const metadata: Metadata = { title: `404 — ${t.title} · LANTANO` };

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${anton.variable} ${manrope.variable}`}>
      <body>
        <main
          className="grain relative grid min-h-[100svh] place-items-center overflow-hidden px-6 text-center text-ink-950"
          style={{ background: "var(--sunset)" }}
        >
          <div className="relative">
            <Logo id="404" className="mx-auto h-auto w-[min(80vw,36rem)] text-ink-900" />
            <p className="display mt-8 text-[clamp(5rem,20vw,12rem)] leading-none text-cream">404</p>
            <h1 className="display mt-2 text-3xl">{t.title}</h1>
            <p className="mt-3 font-medium text-ink-900/80">{t.body}</p>
            <Link href="/" className="btn btn-primary mt-8">
              {t.cta}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
