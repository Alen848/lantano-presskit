import type { MetadataRoute } from "next";
import { localePath } from "@/content/i18n";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { es: new URL(localePath.es, site.url).href, en: new URL(localePath.en, site.url).href };
  return (["es", "en"] as const).map((l) => ({
    url: languages[l],
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: l === "es" ? 1 : 0.9,
    alternates: { languages },
  }));
}
