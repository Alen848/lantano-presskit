#!/usr/bin/env node
/**
 * LANTANO — media pipeline.
 *
 * Reads the original material in /media-src and writes web-ready assets:
 *   public/media/img/*      responsive AVIF + WebP (+ JPG for the press pack)
 *   public/media/video/*    H.264 MP4 loops + WebP posters (needs ffmpeg in PATH)
 *   public/brand/*          logo (vector + textured raster), grain texture
 *   src/app/**              icon.png, apple-icon.png
 *   public/og.jpg           Open Graph / social preview
 *   src/content/media.json  manifest consumed by <Picture> / <Clip>
 *   src/content/logo.json   vector path of the logotype
 *
 * Usage:  npm run media          (skips outputs that already exist)
 *         npm run media -- --force
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "media-src");
const PUB = path.join(ROOT, "public");
const OUT_IMG = path.join(PUB, "media/img");
const OUT_VID = path.join(PUB, "media/video");
const OUT_BRAND = path.join(PUB, "brand");
const FORCE = process.argv.includes("--force");

for (const d of [OUT_IMG, OUT_VID, OUT_BRAND, path.join(ROOT, "src/content")]) mkdirSync(d, { recursive: true });

const WIDTHS = [480, 800, 1200, 1800];

/** Photos. `cutout` = transparent PNG (trimmed, keeps alpha). */
const PHOTOS = [
  { id: "hero", file: "E5.png", cutout: true, alt: { es: "LANTANO de frente, brazos cruzados", en: "LANTANO facing the camera, arms crossed" } },
  { id: "seated", file: "E6.png", cutout: true, alt: { es: "LANTANO sentado con piluso negro y camisa blanca", en: "LANTANO seated, black bucket hat and white shirt" } },
  { id: "shades", file: "E3.png", cutout: true, alt: { es: "LANTANO con lentes oscuros mirando hacia abajo", en: "LANTANO in dark sunglasses looking down" } },
  { id: "booth", file: "B1.jpeg", alt: { es: "LANTANO mezclando en cabina con auriculares", en: "LANTANO mixing in the booth with headphones" } },
  { id: "hat-tip", file: "IMG_2567.JPG", alt: { es: "Retrato de LANTANO tocando el ala de su piluso", en: "Portrait of LANTANO touching the brim of his bucket hat" } },
  { id: "white-shirt", file: "IMG_2572.JPG", alt: { es: "LANTANO con camisa blanca y lentes metálicos", en: "LANTANO in a white shirt and metal-frame sunglasses" } },
  { id: "profile", file: "IMG_2569.JPG", alt: { es: "Perfil de LANTANO pensativo, camisa verde", en: "LANTANO in profile, thoughtful, green shirt" } },
  { id: "hat-portrait", file: "IMG_2573.JPG", alt: { es: "Retrato de LANTANO con piluso, luz lateral", en: "Portrait of LANTANO in a bucket hat, side light" } },
  { id: "side-shades", file: "IMG_2142.JPG", alt: { es: "LANTANO de perfil con lentes oscuros", en: "LANTANO in profile with dark sunglasses" } },
  { id: "jersey-back", file: "IMG_2574.JPG", alt: { es: "LANTANO de espaldas con camiseta 88", en: "LANTANO from behind in a number 88 jersey" } },
  { id: "close-shades", file: "IMG_2570.JPG", alt: { es: "Primer plano de LANTANO con lentes", en: "Close-up of LANTANO in sunglasses" } },
  { id: "jersey-profile", file: "IMG_2568.JPG", alt: { es: "LANTANO de perfil con camiseta 88", en: "LANTANO in profile wearing a number 88 jersey" } },
  { id: "hat-back", file: "IMG_2571.JPG", alt: { es: "LANTANO acomodándose el piluso", en: "LANTANO adjusting his bucket hat" } },
];

/** Clips: [start, duration] in seconds. All SDR / bt709. */
const CLIPS = [
  { id: "day-session", file: "c3.mov", start: 4, dur: 12, poster: 2, alt: { es: "Set de día frente a una pared de piedra", en: "Daytime set in front of a stone wall" } },
  { id: "booth-red", file: "c4.mp4", start: 1, dur: 10, poster: 3, alt: { es: "LANTANO en cabina bajo luces rojas y azules", en: "LANTANO in the booth under red and blue lights" } },
  { id: "hands-up", file: "c1.mp4", start: 22, dur: 12, poster: 4, alt: { es: "LANTANO mezclando, primer plano de las manos", en: "LANTANO mixing, close-up on the decks" } },
  { id: "crowd", file: "c2.mp4", start: 0, dur: 10, poster: 6, alt: { es: "Público bailando frente a la cabina", en: "Crowd dancing in front of the booth" } },
];

const manifest = { images: {}, videos: {} };
const log = (...a) => console.log("•", ...a);

async function tinyBlur(input) {
  const buf = await sharp(input).resize(16).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function buildPhoto(p) {
  let pipeline = sharp(path.join(SRC, "fotos", p.file)).rotate();
  if (p.cutout) pipeline = pipeline.trim({ threshold: 1 });
  const base = await pipeline.toBuffer({ resolveWithObject: true });
  const { width, height } = base.info;
  const widths = WIDTHS.filter((w) => w < width).concat(width > WIDTHS.at(-1) ? [] : [width]);
  const finalWidths = [...new Set(widths.length ? widths : [width])].sort((a, b) => a - b);

  for (const w of finalWidths) {
    const avif = path.join(OUT_IMG, `${p.id}-${w}.avif`);
    const webp = path.join(OUT_IMG, `${p.id}-${w}.webp`);
    if (FORCE || !existsSync(avif))
      await sharp(base.data).resize(w).avif({ quality: p.cutout ? 60 : 55, effort: 6 }).toFile(avif);
    if (FORCE || !existsSync(webp))
      await sharp(base.data).resize(w).webp({ quality: p.cutout ? 82 : 78, alphaQuality: 90, effort: 6 }).toFile(webp);
  }
  // Press-pack JPG (opaque photos only, long edge 2400).
  if (!p.cutout) {
    const jpg = path.join(ROOT, "media-build/press", `LANTANO-${p.id}.jpg`);
    mkdirSync(path.dirname(jpg), { recursive: true });
    if (FORCE || !existsSync(jpg))
      await sharp(base.data).resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 88, mozjpeg: true }).toFile(jpg);
  }
  manifest.images[p.id] = {
    width,
    height,
    widths: finalWidths,
    alt: p.alt,
    cutout: !!p.cutout,
    blur: p.cutout ? null : await tinyBlur(base.data),
  };
  log("img", p.id, `${width}×${height}`, finalWidths.join(","));
}

function hasFfmpeg() {
  return spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
  if (r.status !== 0) throw new Error(`${cmd} failed:\n${r.stderr?.toString().slice(-2000)}`);
}

function probe(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file]);
  const [w, h] = r.stdout.toString().trim().split(",").map(Number);
  return { w, h };
}

async function buildClip(c) {
  const input = path.join(SRC, "clips", c.file);
  const out = path.join(OUT_VID, `${c.id}.mp4`);
  const posterJpg = path.join(ROOT, "media-build", `${c.id}-poster.jpg`);
  const poster = path.join(OUT_VID, `${c.id}.webp`);
  const { w } = probe(input);
  const targetW = Math.min(720, w - (w % 2));
  const fadeOut = Math.max(0, c.dur - 0.6);
  if (FORCE || !existsSync(out)) {
    run("ffmpeg", [
      "-y", "-ss", String(c.start), "-t", String(c.dur), "-i", input,
      "-vf", `scale=${targetW}:-2:flags=lanczos,fps=30,format=yuv420p`,
      "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "24",
      "-maxrate", "2500k", "-bufsize", "5000k",
      "-af", `afade=t=in:d=0.4,afade=t=out:st=${fadeOut}:d=0.6`,
      "-c:a", "aac", "-b:a", "128k", "-ac", "2",
      "-movflags", "+faststart", out,
    ]);
  }
  if (FORCE || !existsSync(poster)) {
    mkdirSync(path.dirname(posterJpg), { recursive: true });
    run("ffmpeg", ["-y", "-ss", String(c.start + c.poster), "-i", input, "-frames:v", "1", "-vf", `scale=${targetW}:-2`, "-q:v", "2", posterJpg]);
    await sharp(posterJpg).webp({ quality: 72 }).toFile(poster);
  }
  const meta = await sharp(poster).metadata();
  manifest.videos[c.id] = {
    width: meta.width,
    height: meta.height,
    alt: c.alt,
    blur: await tinyBlur(poster),
  };
  log("video", c.id, `${meta.width}×${meta.height}`);
}

/* ---------------------------------- brand ---------------------------------- */

const PALETTE = {
  ink: "#2A1810",
  cream: "#FFF6EA",
  tangerine: "#FF6A2B",
  sun: "#FFB547",
  coral: "#FF4F5E",
};

function readLogo() {
  const svg = readFileSync(path.join(SRC, "brand/lantano-vector.svg"), "utf8");
  const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const [, d] = svg.match(/ d="([^"]+)"/);
  return { width: Number(w), height: Number(h), d };
}

async function buildBrand() {
  const logo = readLogo();
  writeFileSync(path.join(ROOT, "src/content/logo.json"), JSON.stringify(logo));

  // Grain texture used as an SVG luminance mask (white = solid, dark = worn).
  const grainWebp = path.join(OUT_BRAND, "grain.webp");
  await sharp(path.join(SRC, "brand/grain.png")).webp({ quality: 80 }).toFile(grainWebp);
  const grainPng = await sharp(path.join(SRC, "brand/grain.png")).png({ compressionLevel: 9 }).toBuffer();
  const grainUri = `data:image/png;base64,${grainPng.toString("base64")}`;

  const textured = (fill) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${logo.width} ${logo.height}" width="${logo.width}" height="${logo.height}">
  <defs><mask id="g" maskUnits="userSpaceOnUse" x="0" y="0" width="${logo.width}" height="${logo.height}">
    <image width="${logo.width}" height="${logo.height}" href="${grainUri}" xlink:href="${grainUri}"/>
  </mask></defs>
  <path d="${logo.d}" fill="${fill}" mask="url(#g)"/>
</svg>`;

  // Standalone vector logos (solid) for press use.
  for (const [name, fill] of [["ink", PALETTE.ink], ["cream", PALETTE.cream], ["tangerine", PALETTE.tangerine]]) {
    writeFileSync(path.join(OUT_BRAND, `lantano-${name}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logo.width} ${logo.height}"><path fill="${fill}" d="${logo.d}"/></svg>`);
    const tex = textured(fill);
    writeFileSync(path.join(ROOT, "media-build", `lantano-textured-${name}.svg`), tex);
    await sharp(Buffer.from(tex), { density: 300 }).resize(2400).png().toFile(path.join(ROOT, "media-build/press", `LANTANO-logo-${name}.png`));
  }

  // Icon: L on a sunset tile.
  const iconSvg = (size) => {
    // The "L" occupies x∈[2,138] of the logotype; clip to it and center it on the tile.
    const scale = (size * 0.6) / logo.height;
    const gx = size / 2 - 70 * scale;
    const gy = (size - logo.height * scale) / 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PALETTE.sun}"/><stop offset=".55" stop-color="${PALETTE.tangerine}"/><stop offset="1" stop-color="${PALETTE.coral}"/></linearGradient>
    <clipPath id="c"><rect x="0" y="0" width="${gx + 140 * scale}" height="${size}"/></clipPath>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#s)"/>
  <g clip-path="url(#c)"><path d="${logo.d}" fill="${PALETTE.cream}" transform="translate(${gx} ${gy}) scale(${scale})"/></g>
</svg>`;
  };
  await sharp(Buffer.from(iconSvg(512))).png().toFile(path.join(ROOT, "src/app/icon.png"));
  await sharp(Buffer.from(iconSvg(180))).png().toFile(path.join(ROOT, "src/app/apple-icon.png"));
  await sharp(Buffer.from(iconSvg(192))).png().toFile(path.join(PUB, "icon-192.png"));
  await sharp(Buffer.from(iconSvg(512))).png().toFile(path.join(PUB, "icon-512.png"));
  log("brand", "logo + icons");

  // Open Graph image 1200×630.
  const W = 1200, H = 630;
  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="sun" cx="0.72" cy="0.95" r="0.75"><stop offset="0" stop-color="${PALETTE.sun}"/><stop offset=".45" stop-color="${PALETTE.tangerine}"/><stop offset="1" stop-color="#E8433F"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#sun)"/>
  <circle cx="${W * 0.79}" cy="${H * 0.62}" r="210" fill="${PALETTE.sun}" opacity=".55"/>
</svg>`;
  const person = await sharp(path.join(SRC, "fotos/E5.png")).trim({ threshold: 1 }).resize({ height: 600 }).toBuffer();
  const personMeta = await sharp(person).metadata();
  const logoW = 680;
  const logoPng = await sharp(Buffer.from(textured(PALETTE.cream)), { density: 200 }).resize(logoW).png().toBuffer();
  const logoH = Math.round((logo.height / logo.width) * logoW);
  const tagline = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <style>.t{font-family:Helvetica,Arial,sans-serif;font-weight:700;letter-spacing:6px;fill:${PALETTE.ink}}</style>
  <text class="t" x="64" y="${100 + logoH + 62}" font-size="26">DJ · PRODUCTOR</text>
  <text class="t" x="64" y="${100 + logoH + 102}" font-size="26">TECH HOUSE · MINIMAL DEEP</text>
  <text class="t" x="64" y="${100 + logoH + 146}" font-size="20" opacity=".7">MAR DEL PLATA · ARGENTINA</text>
</svg>`;
  await sharp(Buffer.from(bg))
    .composite([
      { input: person, left: Math.round(W * 0.79 - personMeta.width / 2), top: H - personMeta.height },
      { input: logoPng, left: 56, top: 100 },
      { input: Buffer.from(tagline), left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(PUB, "og.jpg"));
  log("brand", "og.jpg");
}

/* ---------------------------------- run ---------------------------------- */

mkdirSync(path.join(ROOT, "media-build/press"), { recursive: true });
await buildBrand();
for (const p of PHOTOS) await buildPhoto(p);
if (hasFfmpeg()) {
  for (const c of CLIPS) await buildClip(c);
} else {
  console.warn("! ffmpeg not found — skipping video transcode (existing manifest entries kept)");
  const prev = path.join(ROOT, "src/content/media.json");
  if (existsSync(prev)) manifest.videos = JSON.parse(readFileSync(prev, "utf8")).videos;
}
writeFileSync(path.join(ROOT, "src/content/media.json"), JSON.stringify(manifest, null, 2));

// Press pack zip (photos + logos).
const zip = path.join(PUB, "press/LANTANO-presskit.zip");
mkdirSync(path.dirname(zip), { recursive: true });
if (FORCE || !existsSync(zip)) {
  rmSync(zip, { force: true });
  const r = spawnSync("zip", ["-qr9", zip, "."], { cwd: path.join(ROOT, "media-build/press") });
  if (r.status === 0) log("press", "LANTANO-presskit.zip");
  else console.warn("! zip not available — press pack skipped");
}
console.log("✓ media ready");
