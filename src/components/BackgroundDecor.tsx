import ShaderBg from "./ShaderBg";
import { useLiveMode } from "./LiveMode";

export default function BackgroundDecor() {
  const { live } = useLiveMode ? useLiveMode() : ({ live: false } as any);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {/* Живой шейдер: больше видимости и сверху над базовым градиентом контейнера */}
      {live && (
        <div className="absolute inset-0 opacity-100">
          <ShaderBg />
        </div>
      )}

      {/* мягкие ауры */}
      <div
        className="absolute -top-28 -left-24 h-[42rem] w-[42rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, var(--decor-glow), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-24 -right-24 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 70% 70%, var(--decor-glow), transparent 70%)",
        }}
      />

      {/* искорки-эмодзи */}
      <div className="absolute right-10 top-28 opacity-60 animate-[sparkle_2.4s_ease-in-out_infinite]">
        💖
      </div>
      <div className="absolute left-8 bottom-16 opacity-50 animate-[sparkle_2.4s_ease-in-out_infinite] [animation-delay:800ms]">
        ✨
      </div>
    </div>
  );
}
