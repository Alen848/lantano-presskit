/**
 * Single source of truth for everything factual on the presskit.
 * Edit this file to update links, venues, dates or the rider.
 */

export const site = {
  name: "LANTANO",
  legalName: "Andrés Lantaño",
  /** Public URL of the deployed site (used for canonical links, sitemap and OG tags). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lantano.dj",
  email: "andreslantanok@gmail.com",
  city: "Mar del Plata",
  country: "Argentina",
  genres: ["Tech House", "Minimal Deep"],
  socials: {
    /**
     * The handle in the original press kit (instagram.com/_andrew.ar) no longer exists.
     * Paste the current profile URL here; while empty, every Instagram link is hidden.
     */
    instagram: "" as string,
    soundcloud: "https://soundcloud.com/andy-lanta-o" as string,
  },
  soundcloud: {
    /** SoundCloud user id — the widget shows every public track of the profile. */
    userId: "203744065",
    featured: { title: "BALLARE", url: "https://soundcloud.com/andy-lanta-o/249ab0a0-db9b-4c5d-bfab-6855689cc692" },
  },
  pressKit: "/press/LANTANO-presskit.zip",

  cities: ["Mar del Plata", "Tandil", "Tres Arroyos"],
  venues: ["La Carpa", "Janos Beach", "Stadium", "Roomie", "Only Club"],
  sharedBooth: [
    "George Privatti",
    "Miguel Bastida",
    "Fran DC",
    "Gustavo Mota",
    "Victoria Whynot",
    "DUODISCO",
    "Rafa Calello",
  ],

  /**
   * Upcoming dates. Leave empty to show the "booking open" state.
   * Example: { date: "2027-01-15", venue: "Janos Beach", city: "Mar del Plata" }
   */
  events: [] as { date: string; venue: string; city: string; url?: string }[],

  rider: {
    gear: [
      { id: "cdj", qty: 2, model: "Pioneer CDJ-2000" },
      { id: "mixer", qty: 1, model: "Pioneer DJM-900" },
    ],
  },
} as const;

export type Site = typeof site;
