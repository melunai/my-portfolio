export default function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* большая тёплая аура */}
      <div className="absolute -top-28 -left-24 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-rose-300/40 via-pink-300/35 to-fuchsia-300/30 blur-3xl animate-floaty" />
      {/* вторая аура */}
      <div className="absolute -bottom-24 -right-24 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-fuchsia-300/30 via-rose-300/30 to-pink-300/30 blur-3xl" />
      {/* мягкие сердечки :) */}
      <div className="absolute right-10 top-28 opacity-60 animate-sparkle">💖</div>
      <div className="absolute left-8 bottom-16 opacity-50 animate-sparkle [animation-delay:800ms]">✨</div>
    </div>
  );
}
