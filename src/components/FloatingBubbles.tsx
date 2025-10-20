import { useEffect, useMemo, useState } from "react";

type Bubble = {
  id: number;
  size: number;     // px
  left: number;     // %
  duration: number; // s
  delay: number;    // s
};

export default function FloatingBubbles({ live = false }: { live?: boolean }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [burstAt, setBurstAt] = useState<{ x: number; y: number; id: number } | null>(null);

  const count = live ? 26 : 14;
  const speedMul = live ? 0.7 : 1; // меньше = быстрее анимация
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, live]);

  const containerStyle = useMemo(
    () => ({ pointerEvents: "auto" as const }),
    []
  );

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width;
        const my = (e.clientY - r.top) / r.height;
        (e.currentTarget as HTMLDivElement).style.setProperty("--mx", mx.toFixed(2));
        (e.currentTarget as HTMLDivElement).style.setProperty("--my", my.toFixed(2));
      }}
      onClick={(e) => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setBurstAt({ x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() });
        setTimeout(() => setBurstAt(null), 900);
      }}
      style={containerStyle}
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
            transform: `translate(calc((var(--mx,0.5) - 0.5) * 12px), calc((var(--my,0.5) - 0.5) * 8px))`,
            animationDelay: `${b.delay}s`,
            boxShadow: live ? "0 8px 22px -10px var(--glow)" : undefined,
          }}
        />
      ))}

      {burstAt && (
        <div
          key={burstAt.id}
          className="absolute pointer-events-none"
          style={{ left: burstAt.x, top: burstAt.y }}
        >
          {Array.from({ length: live ? 22 : 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full will-change-transform"
              style={{
                width: 6,
                height: 6,
                background: "var(--confetti2)",
                transform: "translate(-50%, -50%)",
                animation: "bubbleBurst 0.9s ease-out forwards",
                animationDelay: `${i * 0.02}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
