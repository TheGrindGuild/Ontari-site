"use client";

import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { siteConfig } from "@/config/site";
import { StoneSkipAnimation } from "./StoneSkipAnimation";
import { useBurnTokens } from "./useBurnTokens";

function resultLabel(skips: number): string {
  if (skips >= 75) return "The lake itself did this.";
  if (skips >= 66) return "Nearly impossible.";
  if (skips >= 51) return "Local legend status.";
  if (skips >= 31) return "The lake is impressed.";
  if (skips >= 16) return "Good form.";
  if (skips >= 6) return "A respectable throw.";
  return "Barely a plunk.";
}

export function CastStoneSection() {
  const { connected } = useWallet();
  const { burn, status, error, signature, reset } = useBurnTokens();

  const [skips, setSkips] = useState<number | null>(null);
  const [playToken, setPlayToken] = useState(0);
  const [burnAmount, setBurnAmount] = useState("");
  const [animating, setAnimating] = useState(false);

  const rollSkips = useCallback(() => {
    // Cosmetic-only randomness — nothing of value depends on this outcome,
    // so Math.random is perfectly fine here (no fairness/audit requirement).
    return Math.floor(Math.random() * 75) + 1;
  }, []);

  const cast = useCallback(() => {
    setAnimating(true);
    setSkips(rollSkips());
    setPlayToken((t) => t + 1);
  }, [rollSkips]);

  async function handleBurnAndCast() {
    const amount = parseFloat(burnAmount);
    const sig = await burn(amount);
    if (sig) {
      cast();
    }
  }

  return (
    <section className="relative overflow-hidden bg-[var(--color-lake-deep)] px-6 py-32 text-[var(--color-ivory)] sm:py-44">
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
        <span className="eyebrow text-xs text-[var(--color-ivory)]/60 sm:text-sm">
          A Ritual Of Our Own
        </span>
        <h2 className="font-display text-4xl sm:text-6xl">Cast a Stone</h2>
        <p className="max-w-xl font-display text-lg italic text-[var(--color-ivory)]/75 sm:text-xl">
          Every cast is a number the lake chooses. Free, or burned for good measure — the
          lake doesn&rsquo;t care which.
        </p>

        {/* Video + animation stage */}
        <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-[var(--color-ivory)]/15">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/lake-waves.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {skips !== null && (
            <StoneSkipAnimation
              skips={skips}
              playToken={playToken}
              onComplete={() => setAnimating(false)}
              className="z-10"
            />
          )}

          {skips !== null && !animating && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-[var(--color-lake-deep)]/40 backdrop-blur-[1px]">
              <p className="font-display text-6xl font-medium sm:text-7xl">{skips}</p>
              <p className="eyebrow text-xs text-[var(--color-ivory)]/80 sm:text-sm">
                skip{skips === 1 ? "" : "s"} &mdash; {resultLabel(skips)}
              </p>
            </div>
          )}
        </div>

        {/* Free cast */}
        <button
          type="button"
          onClick={cast}
          disabled={animating}
          className="eyebrow inline-flex items-center justify-center bg-[var(--color-ivory)] px-8 py-4 text-xs text-[var(--color-lake-deep)] transition-colors hover:bg-[var(--color-ivory-dim)] disabled:opacity-40 sm:text-sm"
        >
          {animating ? "The stone is in the air..." : "Cast a Free Stone"}
        </button>

        {/* Burn cast */}
        <div className="mt-6 flex w-full max-w-md flex-col items-center gap-4 border-t border-[var(--color-ivory)]/15 pt-8">
          <p className="eyebrow text-xs text-[var(--color-ivory)]/50">
            Or burn {siteConfig.tickerSymbol} for the same odds, permanently
          </p>

          <WalletMultiButton />

          {connected && (
            <div className="flex w-full flex-col items-center gap-3">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                placeholder={`Amount of ${siteConfig.tickerSymbol} to burn`}
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                className="w-full rounded-sm border border-[var(--color-ivory)]/25 bg-transparent px-4 py-3 text-center text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-ivory)]/40 focus:border-[var(--color-ivory)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleBurnAndCast}
                disabled={
                  animating || status === "building" || status === "awaiting-signature" || status === "confirming"
                }
                className="eyebrow inline-flex w-full items-center justify-center border border-[var(--color-ivory)]/50 px-8 py-4 text-xs text-[var(--color-ivory)] transition-colors hover:border-[var(--color-ivory)] hover:bg-[var(--color-ivory)]/10 disabled:opacity-40 sm:text-sm"
              >
                {status === "awaiting-signature" && "Confirm in wallet..."}
                {status === "confirming" && "Burning..."}
                {(status === "idle" || status === "success" || status === "error" || status === "building") &&
                  "Burn & Cast"}
              </button>

              {status === "error" && error && (
                <p className="text-xs text-[var(--color-red)]/90">{error}</p>
              )}
              {status === "success" && (
                <div className="flex flex-col items-center gap-1">
                  {signature && (
                    <a href={`https://solscan.io/tx/${signature}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-ivory)]/70 underline underline-offset-2">
                      View burn on Solscan
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs text-[var(--color-ivory)]/50 underline underline-offset-2"
                  >
                    Burn again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="max-w-md text-xs leading-relaxed text-[var(--color-ivory)]/40">
          Cast a Stone is cosmetic. The outcome carries no prize, no yield, and no bearing on
          {" "}{siteConfig.tickerSymbol}&rsquo;s value — it&rsquo;s a number the lake gives you, nothing more.
          Burned tokens are permanently destroyed using Solana&rsquo;s token burn instruction,
          reducing {siteConfig.tickerSymbol}&rsquo;s total supply. This cannot be reversed by
          anyone, including the ONTARI.IO team.
        </p>
      </div>
    </section>
  );
}
