export default function PinkRibbons() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden z-10"
    >
      {/* верхний ореол — сплошной, во всю ширину */}
      <div
        className="absolute inset-x-0 -top-8 h-36"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,.42) 0%, rgba(244,114,182,.28) 35%, transparent 70%)",
          mixBlendMode: "soft-light",
          filter: "blur(1px)",
        }}
      />

      {/* левая лента */}
      <div
        className="absolute top-0 left-0 h-full w-[120px] md:w-[160px]"
        style={{
          opacity: 0.5,
          background:
            "linear-gradient(180deg, rgba(244,114,182,0.18) 0%, rgba(236,72,153,0.25) 50%, rgba(219,39,119,0.12) 100%)",
          maskImage:
            "linear-gradient(90deg, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, black 0%, black 70%, transparent 100%)",
          animation: "ribbonDrift 22s cubic-bezier(.36,0,.64,1) infinite",
          animationDirection: "alternate",
          willChange: "transform",
        }}
      />

      {/* правая лента */}
      <div
        className="absolute top-0 right-0 h-full w-[120px] md:w-[160px]"
        style={{
          opacity: 0.5,
          background:
            "linear-gradient(180deg, rgba(236,72,153,0.16) 0%, rgba(244,114,182,0.28) 50%, rgba(236,72,153,0.16) 100%)",
          maskImage:
            "linear-gradient(-90deg, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(-90deg, black 0%, black 70%, transparent 100%)",
          animation: "ribbonDriftR 26s cubic-bezier(.36,0,.64,1) infinite",
          animationDirection: "alternate",
          willChange: "transform",
        }}
      />

      {/* бегущий блик — полотно шире и без «недоезда» */}
      <div
        className="absolute inset-y-0 left-0 w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 25%, rgba(255,255,255,.35) 50%, transparent 75%)",
          backgroundSize: "200% 100%",         // ⬅️ шире в 2 раза
          backgroundRepeat: "no-repeat",
          mixBlendMode: "soft-light",
          opacity: 0.14,
          animation: "sheenPos 18s linear infinite",
          animationDirection: "alternate",
          willChange: "background-position",
        }}
      />

      <style>{`
        @keyframes ribbonDrift {
          from { transform: translateY(0) translateX(0) skewY(2deg); }
          to   { transform: translateY(12px) translateX(6px) skewY(3deg); }
        }
        @keyframes ribbonDriftR {
          from { transform: translateY(0) translateX(0) skewY(-2deg); }
          to   { transform: translateY(12px) translateX(-6px) skewY(-3deg); }
        }
        /* вместо translateX — двигаем фон, который шире контейнера */
        @keyframes sheenPos {
          from { background-position: 0% 0%; }
          to   { background-position: 100% 0%; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
