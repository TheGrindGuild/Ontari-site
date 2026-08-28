type ContourLinesProps = {
  variant?: "dark" | "light";
  className?: string;
};

/**
 * A stylized, abstract shoreline — evoking historic bathymetric survey charts
 * rather than a literal, accurate map of Lake Ontario.
 */
export function ContourLines({ variant = "dark", className = "" }: ContourLinesProps) {
  const stroke = variant === "dark" ? "var(--color-line-on-dark)" : "var(--color-line-on-light)";

  const shorePath =
    "M -80 220 C 40 160, 90 260, 180 210 C 260 170, 300 240, 400 200 C 480 165, 540 230, 640 195 " +
    "C 720 165, 760 220, 860 190 C 940 165, 980 210, 1080 185 L 1080 460 L -80 460 Z";

  return (
    <svg
      className={className}
      viewBox="0 0 1000 400"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {[0, 22, 44, 68, 94].map((offset, i) => (
        <path
          key={offset}
          d={shorePath}
          transform={`translate(0 ${-offset})`}
          stroke={stroke}
          strokeWidth={i === 0 ? 1.4 : 1}
          fill="none"
        />
      ))}
    </svg>
  );
}
