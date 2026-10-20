"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import media from "@/content/media.json";
import type { Locale } from "@/content/i18n";

export type VideoId = keyof typeof media.videos;

type Props = {
  id: VideoId;
  locale?: Locale;
  className?: string;
  /** Called when visibility changes — lets parents pause audio, etc. */
  onVisibleChange?: (visible: boolean) => void;
};

/**
 * Muted, looping, inline video that only downloads when it gets near the
 * viewport and pauses when it leaves (saves data + battery on mobile).
 */
export const LoopVideo = forwardRef<HTMLVideoElement | null, Props>(function LoopVideo(
  { id, locale = "es", className, onVisibleChange },
  forwarded,
) {
  const ref = useRef<HTMLVideoElement>(null);
  useImperativeHandle(forwarded, () => ref.current as HTMLVideoElement);
  const [load, setLoad] = useState(false);
  const visible = useRef(false);
  const meta = media.videos[id];

  // The <source> is injected lazily, so the element must be told to (re)load it.
  useEffect(() => {
    const el = ref.current;
    if (!load || !el) return;
    el.load();
    if (visible.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) el.play().catch(() => {});
  }, [load]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "400px 0px" });
    const vis = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        onVisibleChange?.(e.isIntersecting);
        if (e.isIntersecting && !reduce) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, [onVisibleChange]);

  return (
    <video
      ref={ref}
      className={className}
      width={meta.width}
      height={meta.height}
      poster={`/media/video/${id}.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={meta.alt[locale]}
      style={{ backgroundImage: `url(${meta.blur})`, backgroundSize: "cover" }}
    >
      {load && <source src={`/media/video/${id}.mp4`} type="video/mp4" />}
    </video>
  );
});
