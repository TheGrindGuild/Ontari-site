"use client";

import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — fail silently, address is still selectable text.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="eyebrow shrink-0 rounded-sm border border-[var(--color-ink)]/25 px-4 py-2 text-xs text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-ivory)]"
      aria-live="polite"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
