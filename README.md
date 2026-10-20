# LANTANO — Presskit

Sitio oficial / presskit de **LANTANO** (Andrés Lantaño), DJ y productor de Mar del Plata.
Next.js 16 · React 19 · Tailwind CSS 4 · Motion · Lenis. Exportación 100 % estática.

## Comandos

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # genera el sitio estático en /out
npm start          # sirve /out localmente para probar el build
npm run media      # regenera imágenes, videos, logos, íconos y OG (requiere ffmpeg)
npm run lint && npm run typecheck
```

## Publicar

`npm run build` genera la carpeta `out/` con HTML, CSS, JS y medios. Se puede subir tal cual a
Vercel, Netlify, Cloudflare Pages, GitHub Pages o cualquier hosting estático.

Antes de publicar, definí la URL final (se usa en el sitemap, las URLs canónicas y las vistas previas en redes):

```bash
NEXT_PUBLIC_SITE_URL=https://tudominio.com npm run build
```

## Editar contenido

| Qué | Dónde |
| --- | --- |
| Email, redes, SoundCloud, clubes, ciudades, artistas, rider técnico, **próximas fechas** | `src/content/site.ts` |
| Textos en español e inglés (bio, títulos, rider de hospitalidad, formulario) | `src/content/i18n.ts` |
| Fotos y clips usados, recortes de video, textos alternativos | `scripts/build-media.mjs` |

**Fechas:** agregá eventos a `events` en `site.ts` (`{ date: "2027-01-15", venue: "Janos Beach", city: "Mar del Plata" }`).
Las fechas pasadas se ocultan solas en cada build; si no hay ninguna, se muestra el bloque "Temporada de verano abierta".

**Instagram:** el usuario del kit original (`_andrew.ar`) ya no existe. Pegá la URL del perfil actual en
`socials.instagram`; mientras esté vacío, los íconos de Instagram no se muestran.

## Medios

- `media-src/` contiene los originales (fotos, logo, PDF). Los clips originales (~570 MB) están en
  `media-src/clips/` y no se versionan.
- `npm run media` genera:
  - fotos en AVIF + WebP en varios tamaños (`public/media/img`)
  - clips H.264 de 10–12 s con póster (`public/media/video`, ~11 MB en total)
  - logo vectorial (`public/brand/*.svg`) + textura original (`grain.webp`)
  - íconos de la app, imagen para redes `public/og.jpg`
  - pack de prensa `public/press/LANTANO-presskit.zip` (fotos HD + logos PNG)

## Marca

- El logotipo está reconstruido en vector a partir del PNG original, sobre la tipografía **Anton**
  (condensada al 87 %), con la textura original aplicada como máscara. Se adapta a cualquier color.
- Paleta de verano: arena / crema de base, acentos sol → mandarina → coral, y cacao oscuro para el texto.
  Tokens en `src/app/globals.css` (`@theme`).
