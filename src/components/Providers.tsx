"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";

const LenisContext = createContext<RefObject<Lenis | null>>({ current: null });
/** Ref to the active Lenis instance (null when smooth scrolling is disabled). */
export const useLenis = () => useContext(LenisContext);

/** Smooth scrolling (disabled for reduced motion) + in-page anchor handling. */
export function Providers({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const instance = new Lenis({ duration: 1.15, smoothWheel: true, anchors: false, autoRaf: true });
    lenisRef.current = instance;
    return () => {
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href")!;
      const target = hash === "#top" ? document.body : document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      const lenis = lenisRef.current;
      const offset = hash === "#top" ? 0 : -parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || "0");
      if (lenis) {
        lenis.start(); // a just-closed overlay may have stopped it
        lenis.scrollTo(target, { offset, duration: 1.4, force: true });
      } else {
        // Let a closing overlay release `overflow: hidden` first.
        setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 60);
      }
      history.replaceState(null, "", hash === "#top" ? location.pathname : hash);
      // Move focus for keyboard / screen-reader users without a second jump.
      if (hash !== "#top") {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.9 }}>
        {children}
      </MotionConfig>
    </LenisContext.Provider>
  );
}
