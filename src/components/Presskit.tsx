import { dictionaries, type Locale } from "@/content/i18n";
import { About } from "./About";
import { Booking } from "./Booking";
import { Footer } from "./Footer";
import { Gallery } from "./Gallery";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Live } from "./Live";
import { Music } from "./Music";
import { Ribbon } from "./Ribbon";
import { Rider } from "./Rider";
import { Stages } from "./Stages";

export function Presskit({ locale }: { locale: Locale }) {
  const t = dictionaries[locale];
  return (
    <>
      <Header locale={locale} />
      <main id="main">
        <Hero locale={locale} />
        <Ribbon items={t.ribbon} />
        <About t={t.about} locale={locale} />
        <Stages t={t.stages} locale={locale} />
        <Music locale={locale} />
        <Live locale={locale} />
        <Gallery locale={locale} />
        <Rider locale={locale} />
        <Booking locale={locale} />
      </main>
      <Footer t={t.footer} />
    </>
  );
}
