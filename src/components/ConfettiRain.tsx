import { useEffect, useState } from "react";

type Piece = {
  id: number;
  x: number;        // стартовое X в vw
  size: number;     // px
  rotate: number;   // стартовый поворот
  hue: number;      // оттенок (вокруг розового)
  duration: number; // сек
  delay: number;    // сек
  side: "left" | "right"; // с какого бока падает
};

/**
 * Лёгкий конфетти-дождик по бокам.
 * Без библиотек, с бережной производительностью и рандомизацией.
 */
export default function ConfettiRain({ density = 24 }: { density?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const make = (i: number): Piece => {
      const fromLeft = Math.random() > 0.5;
      return {
        id: i,
        side: fromLeft ? "left" : "right",
        x: fromLeft ? Math.random() * 12 : 88 + Math.random() * 12, // 0-12vw или 88-100vw
        size: 6 + Math.random() * 10,
        rotate: Math.random() * 360,
        hue: 320 + Math.random() * 30, // розовый диапазон (320-350)
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 8,
      };
    };
    setPieces(Array.from({ length: density }).map((_, i) => make(i)));
  }, [density]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute will-change-transform"
          style={{
            left: `${p.x}vw`,
            top: `-5vh`,
            width: p.size,
            height: p.size * 2,
            borderRadius: 4,
            transform: `rotate(${p.rotate}deg)`,
            background: `linear-gradient(180deg, hsl(${p.hue} 80% 72%) 0%, hsl(${
              p.hue - 10
            } 85% 58%) 100%)`,
            boxShadow: `0 4px 12px -4px hsl(${p.hue} 70% 60% / .45)`,
            animation: `${
              p.side === "left" ? "confettiFallL" : "confettiFallR"
            } ${p.duration}s linear ${p.delay}s infinite`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}
