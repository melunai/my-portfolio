import { useEffect, useState } from "react";

type Bubble = {
  id: number;
  size: number;     // px
  left: number;     // %
  duration: number; // s
  delay: number;    // s
};

export default function FloatingBubbles({ live = false }: { live?: boolean }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const count = live ? 26 : 14;
  const speedMul = live ? 0.7 : 1;
  const sizeMul = live ? 1.2 : 1;

  useEffect(() => {
    const list: Bubble[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: (12 + Math.random() * 36) * sizeMul,
      left: Math.random() * 100,
      duration: (8 + Math.random() * 12) * speedMul,
      delay: Math.random() * 10,
    }));
    setBubbles(list);
  }, [count, live, sizeMul, speedMul]);

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full backdrop-blur-sm"
          style={{
            background: "var(--bubble)",
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: `-${b.size}px`,
            animation: `bubbleUp ${b.duration}s linear infinite`,
            animationDelay: `${b.delay}s`,
            boxShadow: live ? "0 8px 22px -10px var(--glow)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
