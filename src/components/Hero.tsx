import { useEffect, useRef } from "react";
import { Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import Chip from "./Chip";
import { DATA, skillMeta } from "../data";

export default function Hero() {
  // контейнер, на котором держим css-переменные --px/--py
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
    };

    const onLeave = () => {
      el.style.removeProperty("--px");
      el.style.removeProperty("--py");
    };

    // слушаем глобально — эффект не ломается из-за перекрытий
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <section id="home" className="pt-20 md:pt-28 pb-12">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* ==== Левая часть с описанием (параллакс) ==== */}
        <motion.div
          ref={parallaxRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 relative"
        >
          <h1
            className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight will-change-transform"
            style={{
              transform:
                "translate3d(calc(var(--px,0)*6px), calc(var(--py,0)*-4px), 0)",
              color: "var(--fg)",
            }}
          >
            Привет, я {DATA.name} —<br />
            <span style={{ color: "var(--muted)" }}>{DATA.role}</span>
          </h1>

          <p
            className="mt-5 text-[15px] leading-relaxed max-w-2xl"
            style={{ color: "color-mix(in oklab, var(--fg), var(--muted) 38%)" }}
          >
            {DATA.about}
          </p>

          {/* ==== Кнопки ==== */}
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white
                         bg-[var(--accent)] hover:bg-[var(--accent-600)]
                         shadow-md transition-colors"
            >
              Смотреть проекты
            </a>

            {DATA.cvUrl && (
              <a
                href={DATA.cvUrl}
                download
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm
                           bg-[var(--card)] text-[color:var(--fg)]
                           border border-[var(--border)]
                           hover:border-[var(--accent)]
                           hover:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent),transparent_70%)]
                           transition-all"
              >
                Резюме (PDF)
              </a>
            )}
          </div>
        </motion.div>

        {/* ==== Правая карточка ==== */}
        <GlassCard className="p-6 flex flex-col justify-between md:h-full">
          <div>
            <h3 className="font-medium text-[color:var(--fg)] mb-3">Быстрые факты</h3>
            <div className="text-sm opacity-80 flex items-center gap-2">
              <MapPin className="size-4 opacity-70" /> {DATA.location}
            </div>
          </div>

          {/* ==== Скиллы (первые 6), читаемы в дарке ==== */}
          <div className="mt-5 flex flex-wrap gap-2">
            {DATA.skills.slice(0, 6).map((s) => {
              const meta =
                skillMeta[s.name] ?? {
                  emoji: "✨",
                  gradFrom: "from-rose-200",
                  gradTo: "to-pink-300",
                  tone: "var(--accent)",
                };

              return (
                <Chip
                  key={s.name}
                  style={{ ["--tone" as any]: meta.tone || "var(--accent)" }}
                  className={[
                    "px-3 py-1 rounded-full text-sm font-medium transition-all",
                    // Светлая — мягкий градиент
                    "bg-gradient-to-br", meta.gradFrom, meta.gradTo, "text-[color:var(--fg)]",
                    // Тёмная — стекло и контрастный текст, градиент выключаем
                    "dark:bg-[var(--card)] dark:text-[color:var(--fg)] dark:border dark:border-[var(--chip-border)]",
                    "dark:from-transparent dark:to-transparent",
                    // Контур и hover glow
                    "ring-1 ring-black/5 dark:ring-white/10 shadow-sm",
                    "hover:shadow-[0_0_0_3px_var(--tone)] hover:border-[color:var(--tone)]",
                  ].join(" ")}
                >
                  <span className="mr-1">{meta.emoji}</span>
                  {s.name}
                </Chip>
              );
            })}
          </div>

          <a
            href={`mailto:${DATA.email}`}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl w-full
                       bg-[var(--accent)] text-white hover:bg-[var(--accent-600)]
                       dark:text-white dark:hover:bg-[var(--accent-600)]
                       px-5 py-3 text-sm font-medium transition-colors"
          >
            <Mail className="size-4" /> Написать мне
          </a>
        </GlassCard>
      </div>
    </section>
  );
}
