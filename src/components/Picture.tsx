import media from "@/content/media.json";
import type { Locale } from "@/content/i18n";

export type ImageId = keyof typeof media.images;

type Props = {
  id: ImageId;
  /** `sizes` attribute — describe the rendered width so the browser picks the right file. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  alt?: string;
  locale?: Locale;
  priority?: boolean;
  /** Show the blurred placeholder behind the image while it loads. */
  placeholder?: boolean;
};

export function imageMeta(id: ImageId) {
  return media.images[id];
}

export function srcSet(id: ImageId, ext: "avif" | "webp") {
  return media.images[id].widths.map((w) => `/media/img/${id}-${w}.${ext} ${w}w`).join(", ");
}

export function largestSrc(id: ImageId, ext: "avif" | "webp" = "webp") {
  const m = media.images[id];
  return `/media/img/${id}-${m.widths.at(-1)}.${ext}`;
}

export function altText(id: ImageId, locale: Locale = "es") {
  return media.images[id].alt[locale];
}

/** Responsive <picture> fed by the build-time manifest (AVIF → WebP). */
export function Picture({ id, sizes, className, imgClassName, alt, locale = "es", priority, placeholder = true }: Props) {
  const m = media.images[id];
  const mid = m.widths[Math.min(1, m.widths.length - 1)];
  return (
    <picture
      className={className}
      style={
        placeholder && m.blur
          ? { backgroundImage: `url(${m.blur})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      <source type="image/avif" srcSet={srcSet(id, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(id, "webp")} sizes={sizes} />
      {/* Plain <img>: images are pre-optimised at build time for the static export. */}
      <img
        src={`/media/img/${id}-${mid}.webp`}
        width={m.width}
        height={m.height}
        alt={alt ?? m.alt[locale]}
        className={imgClassName}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        draggable={false}
      />
    </picture>
  );
}
