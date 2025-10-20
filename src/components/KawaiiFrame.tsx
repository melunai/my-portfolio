import KawaiiRibbons from "./KawaiiRibbons";

/**
 * Светящаяся рамка + ленты (Ribbons). Эмодзи и угловые бантики убраны.
 */
export default function KawaiiFrame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-[12px] md:inset-[20px] mt-16"
    >
      {/* мягкая светящаяся рамка */}
      <div
        className="absolute inset-0 rounded-[28px] md:rounded-[36px]"
        style={{
          boxShadow: `0 0 0 2px var(--glow), 0 15px 50px -20px var(--glow)`,
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
        }}
      />

      {/* кавайные ленты по диагоналям */}
      <KawaiiRibbons density={6} glow />
    </div>
  );
}
