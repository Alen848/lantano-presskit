"use client";

import { useId } from "react";

/** Flat, top-down illustrations of the rider gear, drawn in the site palette. */

export function CdjArt({ className }: { className?: string }) {
  const uid = useId();
  const jog = `cdj-jog-${uid}`;
  const screen = `cdj-screen-${uid}`;
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden>
      <defs>
        <radialGradient id={jog} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#5a3b2b" />
          <stop offset="1" stopColor="#1d100a" />
        </radialGradient>
        <linearGradient id={screen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="1" stopColor="#ff6a2b" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="188" height="248" rx="18" fill="#2a1810" />
      <rect x="6" y="6" width="188" height="248" rx="18" fill="none" stroke="#fff6ea" strokeOpacity=".08" strokeWidth="2" />
      {/* screen */}
      <rect x="40" y="20" width="120" height="58" rx="6" fill={`url(#${screen})`} />
      <path d="M48 58 l8-10 6 6 8-16 7 22 6-8 8 12 6-18 7 14 6-6 8 10 8-12 8 8 6-4" fill="none" stroke="#2a1810" strokeWidth="2" strokeLinejoin="round" opacity=".7" />
      {/* side buttons */}
      {[24, 38, 52, 66].map((y) => (
        <rect key={y} x="16" y={y} width="16" height="8" rx="2" fill="#5a3b2b" />
      ))}
      {[24, 38, 52, 66].map((y) => (
        <rect key={`r${y}`} x="168" y={y} width="16" height="8" rx="2" fill="#5a3b2b" />
      ))}
      {/* jog wheel */}
      <circle cx="100" cy="152" r="58" fill={`url(#${jog})`} />
      <circle cx="100" cy="152" r="58" fill="none" stroke="#ff8a4c" strokeOpacity=".55" strokeWidth="2" strokeDasharray="2 5" />
      <circle cx="100" cy="152" r="22" fill="#1d100a" stroke="#ff6a2b" strokeWidth="3" />
      <circle cx="100" cy="152" r="7" fill="#ffb547" />
      {/* play / cue */}
      <circle cx="30" cy="226" r="11" fill="#ffb547" />
      <path d="M27 221 l8 5 -8 5z" fill="#2a1810" />
      <circle cx="30" cy="198" r="11" fill="none" stroke="#ff6a2b" strokeWidth="3" />
      {/* pitch fader */}
      <rect x="174" y="118" width="6" height="110" rx="3" fill="#1d100a" />
      <rect x="168" y="160" width="18" height="12" rx="3" fill="#fff6ea" />
    </svg>
  );
}

export function MixerArt({ className }: { className?: string }) {
  const channels = [0, 1, 2, 3];
  const xfade = `mixer-x-${useId()}`;
  return (
    <svg viewBox="0 0 220 260" className={className} aria-hidden>
      <rect x="6" y="6" width="208" height="248" rx="18" fill="#2a1810" />
      <rect x="6" y="6" width="208" height="248" rx="18" fill="none" stroke="#fff6ea" strokeOpacity=".08" strokeWidth="2" />
      {channels.map((c) => {
        const x = 49 + c * 38;
        return (
          <g key={c}>
            {[30, 56, 82, 108].map((y, k) => (
              <g key={y}>
                <circle cx={x} cy={y} r="9" fill="#3d2518" stroke={k === 0 ? "#ffb547" : "#5a3b2b"} strokeWidth="2" />
                <line x1={x} y1={y} x2={x + (k % 2 ? 5 : -4)} y2={y - 6} stroke="#fff6ea" strokeWidth="2" strokeLinecap="round" />
              </g>
            ))}
            {/* VU */}
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <rect key={s} x={x + 13} y={44 + s * 10} width="4" height="6" rx="1" fill={s < 2 ? "#ff4f5e" : s < 4 ? "#ffb547" : "#ff8a4c"} opacity={s >= 2 - (c % 2) ? 1 : 0.25} />
            ))}
            {/* fader */}
            <rect x={x - 2} y="138" width="4" height="70" rx="2" fill="#1d100a" />
            <rect x={x - 9} y={150 + ((c * 17) % 40)} width="18" height="12" rx="3" fill="#fff6ea" />
          </g>
        );
      })}
      {/* crossfader */}
      <rect x="60" y="230" width="100" height="5" rx="2.5" fill="#1d100a" />
      <rect x="102" y="224" width="16" height="17" rx="3" fill={`url(#${xfade})`} />
      <defs>
        <linearGradient id={xfade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb547" />
          <stop offset="1" stopColor="#ff6a2b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
