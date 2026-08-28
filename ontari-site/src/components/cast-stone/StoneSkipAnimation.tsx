"use client";

import { useEffect, useRef } from "react";

type StoneSkipAnimationProps = {
  skips: number;
  playToken: number;
  onComplete?: () => void;
  className?: string;
};

type Ripple = {
  x: number;
  y: number;
  startedAt: number;
  maxRadius: number;
};

export function StoneSkipAnimation({
  skips,
  playToken,
  onComplete,
  className = "",
}: StoneSkipAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || playToken === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const waterY = height * 0.62;
    const startX = width * 0.08;
    const startY = waterY - height * 0.1;

    const n = Math.max(1, Math.min(75, skips));

    const distanceRatio = 0.88;
    const heightRatio = 0.82;
    const usableWidth = width * 0.82;
    const d0 = (usableWidth * (1 - distanceRatio)) / (1 - Math.pow(distanceRatio, n));
    const h0 = height * 0.16;

    const skipDurations: number[] = [];
    const skipDistances: number[] = [];
    const skipHeights: number[] = [];
    for (let i = 0; i < n; i++) {
      skipDistances.push(d0 * Math.pow(distanceRatio, i));
      skipHeights.push(h0 * Math.pow(heightRatio, i));
      skipDurations.push(Math.max(40, 320 * Math.pow(0.9, i)));
    }

    const ripples: Ripple[] = [];
    let startTime: number | null = null;
    let finished = false;

    function drawRipple(ripple: Ripple, now: number) {
      const age = now - ripple.startedAt;
      const life = 700;
      if (age > life || !ctx) return;
      const t = age / life;
      const radius = ripple.maxRadius * t;
      const opacity = (1 - t) * 0.5;
      ctx.beginPath();
      ctx.ellipse(ripple.x, ripple.y, radius, radius * 0.28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(28, 47, 69, ${opacity})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    function drawStone(x: number, y: number, angle: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 3.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#1c2f45";
      ctx.fill();
      ctx.strokeStyle = "rgba(242,236,220,0.6)";
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    }

    function frame(now: number) {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      let t = elapsed;
      let segmentIndex = 0;
      let segStartX = startX;
      for (let i = 0; i < n; i++) {
        if (t <= skipDurations[i] || i === n - 1) {
          segmentIndex = i;
          break;
        }
        t -= skipDurations[i];
        segStartX += skipDistances[i];
      }

      const duration = skipDurations[segmentIndex];
      const progress = Math.min(1, t / duration);
      const dist = skipDistances[segmentIndex];
      const arcHeight = skipHeights[segmentIndex];

      const x = segStartX + dist * progress;
      const arc = Math.sin(Math.PI * progress);
      const y = waterY - arc * arcHeight;
      const startingDrop = segmentIndex === 0 ? (1 - Math.min(1, elapsed / 120)) * -20 : 0;

      if (progress < 0.04) {
        const alreadySpawned = ripples.some(
          (r) => Math.abs(r.x - segStartX) < 2 && now - r.startedAt < 50
        );
        if (!alreadySpawned) {
          ripples.push({
            x: segStartX,
            y: waterY,
            startedAt: now,
            maxRadius: 14 + arcHeight * 0.4,
          });
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].startedAt > 700) ripples.splice(i, 1);
        else drawRipple(ripples[i], now);
      }

      const isLastSegment = segmentIndex === n - 1;
      const sinking = isLastSegment && progress >= 0.92;

      if (!sinking) {
        const angle = Math.cos(Math.PI * progress) * 0.5;
        drawStone(x, y + startingDrop, angle);
      } else {
        const sinkProgress = (progress - 0.92) / 0.08;
        ctx.beginPath();
        ctx.ellipse(x, waterY, 10 + sinkProgress * 20, (10 + sinkProgress * 20) * 0.28, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(28, 47, 69, ${0.5 * (1 - sinkProgress)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      const totalDuration = skipDurations.reduce((a, b) => a + b, 0);
      if (elapsed >= totalDuration + 200) {
        finished = true;
      }

      if (!finished) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
        onComplete?.();
      }
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playToken]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
