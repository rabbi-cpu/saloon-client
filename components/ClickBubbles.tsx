"use client";

import React, { useEffect, useState } from "react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  offsetX: number;
  color: string;
}

const BUBBLE_COLORS = [
  "bg-rose-400/80 shadow-[0_0_12px_rgba(251,113,133,0.9)]",
  "bg-pink-400/80 shadow-[0_0_12px_rgba(244,114,182,0.9)]",
  "bg-amber-300/80 shadow-[0_0_12px_rgba(252,211,77,0.85)]",
  "bg-rose-500/80 shadow-[0_0_14px_rgba(244,63,94,0.9)]",
];

export default function ClickBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    function handleGlobalClick(e: MouseEvent) {
      const now = Date.now();
      const batch: Bubble[] = Array.from({ length: 6 }).map((_, idx) => ({
        id: now + idx + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.floor(Math.random() * 8) + 6, // 6px - 14px
        offsetX: (Math.random() - 0.5) * 90,
        color: BUBBLE_COLORS[idx % BUBBLE_COLORS.length],
      }));

      setBubbles((prev) => [...prev.slice(-30), ...batch]);

      setTimeout(() => {
        setBubbles((prev) =>
          prev.filter((b) => !batch.some((item) => item.id === b.id))
        );
      }, 950);
    }

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-9999 overflow-hidden"
    >
      {bubbles.map((b) => (
        <span
          key={b.id}
          style={
            {
              left: `${b.x}px`,
              top: `${b.y}px`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              "--tx": `${b.offsetX}px`,
            } as React.CSSProperties
          }
          className={`animate-salon-bubble absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${b.color}`}
        />
      ))}
    </div>
  );
}