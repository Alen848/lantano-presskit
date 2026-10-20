import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconInstagram = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" {...stroke} />
    <circle cx="12" cy="12" r="4.2" {...stroke} />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
  </svg>
);

export const IconSoundcloud = (p: P) => (
  <svg {...base} {...p}>
    <path
      fill="currentColor"
      d="M10.5 7.2c.3-.1.6-.2 1-.2 2.6 0 4.8 1.9 5.2 4.4.4-.1.8-.2 1.2-.2 2.2 0 4.1 1.8 4.1 4s-1.8 4-4.1 4h-7.4a.6.6 0 0 1-.6-.6V7.8c0-.3.2-.5.6-.6ZM8.4 9c.3 0 .5.2.5.5v8.9a.5.5 0 0 1-1 0V9.5c0-.3.2-.5.5-.5Zm-2.3 1.6c.3 0 .5.2.5.5v7.3a.5.5 0 0 1-1 0v-7.3c0-.3.2-.5.5-.5Zm-2.3 1.9c.3 0 .5.2.5.5v5.4a.5.5 0 0 1-1 0V13c0-.3.2-.5.5-.5Zm-2.3 1.3c.3 0 .5.2.5.5v3.6a.5.5 0 0 1-1 0v-3.6c0-.3.2-.5.5-.5Z"
    />
  </svg>
);

export const IconMail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" {...stroke} />
    <path d="m4 7 8 6 8-6" {...stroke} />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" {...stroke} />
  </svg>
);

export const IconArrowUpRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" {...stroke} />
  </svg>
);

export const IconArrowDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" {...stroke} />
  </svg>
);

export const IconPlay = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M8 5.6v12.8c0 .8.9 1.3 1.6.8l10-6.4a1 1 0 0 0 0-1.6l-10-6.4c-.7-.5-1.6 0-1.6.8Z" />
  </svg>
);

export const IconVolumeOn = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" {...stroke} />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" {...stroke} />
  </svg>
);

export const IconVolumeOff = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" {...stroke} />
    <path d="m16 10 4 4m0-4-4 4" {...stroke} />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base} {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2.5" {...stroke} />
    <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" {...stroke} />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" {...stroke} />
  </svg>
);

export const IconDownload = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" {...stroke} />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" {...stroke} />
  </svg>
);

export const IconChevron = (p: P & { dir?: "left" | "right" }) => {
  const { dir = "right", ...rest } = p;
  return (
    <svg {...base} {...rest}>
      <path d={dir === "right" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} {...stroke} />
    </svg>
  );
};

export const IconMenu = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 8h16M4 16h10" {...stroke} />
  </svg>
);

/** Eight-ray sun used as a separator glyph throughout the site. */
export const Sun = (p: P) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...p}>
    <circle cx="12" cy="12" r="4.4" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M4.8 19.2l2.1-2.1M17.1 6.9l2.1-2.1" />
    </g>
  </svg>
);
