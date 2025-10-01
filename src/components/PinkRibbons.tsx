export default function PinkRibbons() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden mt-14 z-1"
    >
      {/* Левая лента */}
      <div
        className="absolute top-0 left-0 h-full w-[120px] md:w-[160px] opacity-50"
        style={{
          background:
            "linear-gradient(180deg, rgba(244,114,182,0.20) 0%, rgba(236,72,153,0.25) 50%, rgba(219,39,119,0.15) 100%)",
          maskImage:
            "linear-gradient(90deg, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, black 0%, black 70%, transparent 100%)",
          animation: "ribbonDrift 16s ease-in-out infinite",
        }}
      />

      {/* Правая лента */}
      <div
        className="absolute top-0 right-0 h-full w-[120px] md:w-[160px] opacity-50"
        style={{
          background:
            "linear-gradient(180deg, rgba(236,72,153,0.18) 0%, rgba(244,114,182,0.3) 50%, rgba(236,72,153,0.18) 100%)",
          maskImage:
            "linear-gradient(-90deg, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(-90deg, black 0%, black 70%, transparent 100%)",
          animation: "ribbonDriftReverse 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}
