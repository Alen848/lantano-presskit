import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { anton, manrope } from "@/app/fonts";
import { dictionaries, localePath, type Locale } from "@/content/i18n";
import { site } from "@/content/site";
import { Providers } from "./Providers";

export const viewport: Viewport = {
  themeColor: "#ffb547",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function buildMetadata(locale: Locale): Metadata {
  const t = dictionaries[locale].meta;
  return {
    metadataBase: new URL(site.url),
    title: t.title,
    description: t.description,
    applicationName: site.name,
    authors: [{ name: site.legalName }],
    keywords: ["LANTANO", "DJ", "Mar del Plata", "Tech House", "Minimal Deep", "presskit", "booking", "Argentina"],
    alternates: {
      canonical: localePath[locale],
      languages: { es: localePath.es, en: localePath.en, "x-default": localePath.es },
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "profile",
      siteName: `${site.name} — Presskit`,
      title: t.title,
      description: t.description,
      url: localePath[locale],
      locale: locale === "es" ? "es_AR" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_AR"],
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "LANTANO — DJ / Productor" }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: ["/og.jpg"] },
    robots: { index: true, follow: true },
    formatDetection: { email: false, telephone: false, address: false },
  };
}

function jsonLd(locale: Locale) {
  const t = dictionaries[locale].meta;
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: site.name,
    alternateName: site.legalName,
    url: new URL(localePath[locale], site.url).toString(),
    image: new URL("/og.jpg", site.url).toString(),
    description: t.description,
    genre: site.genres,
    foundingLocation: { "@type": "Place", name: `${site.city}, ${site.country}` },
    email: `mailto:${site.email}`,
    sameAs: Object.values(site.socials).filter(Boolean),
    member: { "@type": "Person", name: site.legalName, jobTitle: "DJ / Producer" },
  };
}

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} className={`${anton.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(locale)).replace(/</g, "\\u003c") }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
