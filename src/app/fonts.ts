import localFont from "next/font/local";

/** Anton — the typeface the LANTANO logotype is built on. */
export const anton = localFont({
  src: "../fonts/Anton.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-anton",
  preload: true,
});

export const manrope = localFont({
  src: "../fonts/Manrope-Variable.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-manrope",
  preload: true,
});
