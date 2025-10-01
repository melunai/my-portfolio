export default function BackgroundDecor() {
  // Маска-затухание: центр ярче, края плавно в прозрачность
//   const mask =
//     "radial-gradient(1120px 640px at 50% 25%, black 40%, transparent 100%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* <div
        className="absolute inset-0 opacity-70 dark:opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(rgba(244, 114, 182, 0.35) 1px, transparent 1px),
            radial-gradient(rgba(244, 114, 182, 0.15) 1px, transparent 1px)
          `,
          backgroundPosition: "0 0, 8px 8px", // смещение второй сетки
          backgroundSize: "32px 32px, 32px 32px",
          // плавное исчезновение сетки к краям
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <div
        className="absolute inset-0 opacity-70 mt-[2400px] dark:opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(rgba(244, 114, 182, 0.35) 1px, transparent 1px),
            radial-gradient(rgba(244, 114, 182, 0.15) 1px, transparent 1px)
          `,
          backgroundPosition: "0 0, 8px 8px", // смещение второй сетки
          backgroundSize: "32px 32px, 32px 32px",
          // плавное исчезновение сетки к краям
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      /> */}

      {/*<svg
        className="absolute inset-0 h-full w-full text-rose-300/60 dark:text-rose-200/30"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        <defs>
          <pattern
            id="grid-lg"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(0,0)"
          >
            <path
              d="M 0 0 L 0 48 M 0 0 L 48 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeDasharray="6 8"
              opacity="0.45"
            />
          </pattern>

          <pattern
            id="diag"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(0,0)"
          >
            <path
              d="M -72 72 L 72 -72"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeDasharray="5 10"
              opacity="0.25"
            />
          </pattern>

          <linearGradient id="sheen" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(244,114,182,0.25)" />
            <stop offset="100%" stopColor="rgba(244,114,182,0)" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#diag)" />
        <rect width="100%" height="100%" fill="url(#grid-lg)" />
        <rect width="100%" height="40%" y="0" fill="url(#sheen)" />
      </svg>*/}

      {/* ===== 3) Мягкие розовые ауры + искорки (сверху для «роскоши») ===== */}
      {/* <div className="absolute -top-28 -left-24 h-[42rem] w-[42rem] rounded-full bg-gradient-to-tr from-rose-300/30 via-pink-300/35 to-fuchsia-300/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-fuchsia-300/30 via-rose-300/30 to-pink-300/30 blur-3xl" /> */}

      <div className="absolute right-10 top-28 opacity-60 animate-[sparkle_2.4s_ease-in-out_infinite]">
        💖
      </div>
      <div className="absolute left-8 bottom-16 opacity-50 animate-[sparkle_2.4s_ease-in-out_infinite] [animation-delay:800ms]">
        ✨
      </div>
    </div>
  );
}
