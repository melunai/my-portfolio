import { useEffect, useState } from "react";

type Bubble = {
  id: number;
  size: number;     // размер px
  left: number;     // позиция слева %
  duration: number; // длительность анимации
  delay: number;    // задержка старта
};

export default function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const list: Bubble[] = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      size: 12 + Math.random() * 36,
      left: Math.random() * 100,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
    }));
    setBubbles(list);
  }, []);

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full bg-rose-200/40 dark:bg-rose-400/20 backdrop-blur-sm"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: `-${b.size}px`,
            animation: `bubbleUp ${b.duration}s linear infinite`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
