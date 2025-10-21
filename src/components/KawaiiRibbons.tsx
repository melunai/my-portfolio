export default function KawaiiRibbons({
  glow = true,
}: { glow?: boolean; density?: number }) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        {/* Блик по ленте (мягкий переход акцентных цветов) */}
        <linearGradient id="rib-sheen" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--ribbon-sheen-start)" />
          <stop offset="50%" stopColor="var(--ribbon-sheen-end)" />
          <stop offset="100%" stopColor="var(--ribbon-sheen-start)" />
        </linearGradient>

        {/* Градиент для затухания концов (прозрачные края) */}
        <linearGradient id="rib-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--ribbon-fade)" stopOpacity="0" />
          <stop offset="10%" stopColor="var(--ribbon-fade)" stopOpacity=".75" />
          <stop offset="90%" stopColor="var(--ribbon-fade)" stopOpacity=".75" />
          <stop offset="100%" stopColor="var(--ribbon-fade)" stopOpacity="0" />
        </linearGradient>

        {/* Мягкое свечение вокруг ленты */}
        <filter id="rib-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="1.2"
            floodColor="var(--ribbon-sheen-start)"
            floodOpacity="0.85"
          />
        </filter>

        <style>{`
          @keyframes ribBreath {
            0%,100% { transform: translateY(0) }
            50%     { transform: translateY(-.35px) }
          }
          @keyframes ribDash {
            0%   { stroke-dashoffset: 0 }
            100% { stroke-dashoffset: -120 }
          }
        `}</style>
      </defs>

      {/* Лента: слева-сверху → вправо-вниз (чуть выходит за экран) */}
      <g filter={glow ? "url(#rib-glow)" : undefined}>
        {/* Подложка-«дыхание» (очень деликатная) */}
        <path
          d="M -8 12 C 22 2, 36 6, 50 14
             S 78 30, 108 42"
          fill="none"
          stroke="var(--ribbon-accent)"
          strokeOpacity="var(--ribbon-accent-o)"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ animation: "ribBreath 5s ease-in-out infinite" }}
        />
        {/* Бегущий штриховой блик, тонкий и длинный */}
        <path
          d="M -8 12 C 22 2, 36 6, 50 14
             S 78 30, 108 42"
          fill="none"
          stroke="url(#rib-sheen)"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeDasharray="14 28"
          style={{ animation: "ribDash 12s linear infinite" }}
          opacity=".7"
        />
        {/* Основной контур с затухающими краями */}
        <path
          d="M -8 12 C 22 2, 36 6, 50 14
             S 78 30, 108 42"
          fill="none"
          stroke="url(#rib-fade)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </g>

      {/* Лента: справа-сверху → влево-вниз (зеркальная, тоже уходит за экран) */}
      <g filter={glow ? "url(#rib-glow)" : undefined}>
        <path
          d="M 108 10 C 78 18, 64 26, 50 36
             S 24 58, -8 88"
          fill="none"
          stroke="var(--ribbon-accent)"
          strokeOpacity="var(--ribbon-accent-o)"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ animation: "ribBreath 5.4s ease-in-out .3s infinite" }}
        />
        <path
          d="M 108 10 C 78 18, 64 26, 50 36
             S 24 58, -8 88"
          fill="none"
          stroke="url(#rib-sheen)"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeDasharray="14 28"
          style={{ animation: "ribDash 12s linear reverse infinite" }}
          opacity=".7"
        />
        <path
          d="M 108 10 C 78 18, 64 26, 50 36
             S 24 58, -8 88"
          fill="none"
          stroke="url(#rib-fade)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
