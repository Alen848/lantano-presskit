import logo from "@/content/logo.json";

type Props = {
  /** Unique per instance — used for the SVG mask id. */
  id: string;
  className?: string;
  /** Apply the worn print texture of the original artwork. */
  textured?: boolean;
  title?: string;
};

/**
 * The LANTANO logotype as inline SVG. Inherits `color`, so it can be themed
 * with any text-* utility; the grain mask reproduces the original artwork.
 */
export function Logo({ id, className, textured = true, title = "LANTANO" }: Props) {
  const maskId = `lantano-grain-${id}`;
  return (
    <svg
      viewBox={`0 0 ${logo.width} ${logo.height}`}
      className={className}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{title}</title>
      {textured && (
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={logo.width} height={logo.height}>
            <image href="/brand/grain.webp" width={logo.width} height={logo.height} preserveAspectRatio="none" />
          </mask>
        </defs>
      )}
      <path d={logo.d} fill="currentColor" mask={textured ? `url(#${maskId})` : undefined} />
    </svg>
  );
}

export const logoAspect = logo.width / logo.height;
