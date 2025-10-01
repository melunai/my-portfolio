export default function KawaiiFrame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-[12px] md:inset-[20px] mt-16"
    >
      {/* светящийся контур */}
      <div
        className="absolute inset-0 rounded-[28px] md:rounded-[36px]"
        style={{
          boxShadow:
            "0 0 0 2px rgba(244,114,182,0.35), 0 15px 50px -20px rgba(244,114,182,0.45)",
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
        }}
      />

      {/* угловые «наклейки» */}
      <div className="absolute -top-3 -left-1 text-2xl md:text-3xl animate-kawaiiSticker">💖</div>
      <div className="absolute -top-3 -right-1 text-2xl md:text-3xl animate-kawaiiSticker [animation-delay:.25s]">✨</div>
      <div className="absolute -bottom-3 -left-1 text-2xl md:text-3xl animate-kawaiiSticker [animation-delay:.5s]">🌸</div>
      <div className="absolute -bottom-3 -right-1 text-2xl md:text-3xl animate-kawaiiSticker [animation-delay:.75s]">🫶</div>
    </div>
  );
}
