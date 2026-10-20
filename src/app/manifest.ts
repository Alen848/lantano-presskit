import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LANTANO — Presskit",
    short_name: "LANTANO",
    description: "DJ / Productor · Tech House · Minimal Deep · Mar del Plata",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8ef",
    theme_color: "#ffb547",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
