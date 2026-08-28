"use client";

import { useEffect, useRef, useState } from "react";

export function MemeMorph() {
  const ref = useRef<HTMLDivElement>(null);
  const [morphed, setMorphed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setMorphed(true), 400);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
      <div
        className="font-display text-[13vw] leading-none tracking-tight sm:text-[7rem] md:text-[8.5rem]"
        aria-label={morphed ? "ONTARI.IO" : "ONTARI'IO"}
      >
        <span>ONTARI</span>
        <span className="relative inline-block w-[0.28em] align-baseline">
          <span
            className={`absolute inset-0 flex items-start justify-center transition-all duration-700 ease-out ${
              morphed ? "-translate-y-2 rotate-45 opacity-0" : "translate-y-0 rotate-0 opacity-100"
            }`}
            aria-hidden="true"
          >
            &rsquo;
          </span>
          <span
            className={`absolute inset-0 flex items-end justify-center pb-[0.06em] text-[var(--color-red)] transition-all duration-700 ease-out ${
              morphed ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            aria-hidden="true"
          >
            .
          </span>
        </span>
        <span>IO</span>
      </div>
      <p className="eyebrow text-xs text-current opacity-60 sm:text-sm">
        the apostrophe becomes the internet
      </p>
    </div>
  );
}
