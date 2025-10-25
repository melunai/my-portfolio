// src/components/Testimonials.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "./Section";
import GlassCard from "./GlassCard";
import SectionLead from "./SectionLead";
import { TESTIMONIALS } from "../data";
import { useIOInView } from "./useIOInView";

const SWIPE_THRESHOLD = 60; // px

export default function Testimonials() {
  const items = TESTIMONIALS ?? [];
  if (!items.length) return null;

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const count = items.length;
  const safeIdx = (i: number) => (i + count) % count;

  const go = useCallback(
    (d: 1 | -1) => {
      setDir(d);
      setIndex((i) => safeIdx(i + d));
    },
    [count]
  );

  // клавиатура
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // свайп
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      go(dx < 0 ? 1 : -1);
    }
  };

  const current = useMemo(() => items[index], [items, index]);

  const variants = {
    enter: (direction: 1 | -1) => ({
      x: direction * 40,
      opacity: 0,
      scale: 0.98,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction: 1 | -1) => ({
      x: direction * -40,
      opacity: 0,
      scale: 0.98,
    }),
  };

  // ✨ IO-въезд всей секции отзывов
  const { ref: ioRef, inView } = useIOInView<HTMLDivElement>({
    once: true,
    rootMargin: "-25% 0% -40% 0%",
  });
  const sectionVar = {
    hide: { opacity: 0, y: 14, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <Section id="testimonials" title="Отзывы">
      <SectionLead>Что говорят коллеги и партнёры.</SectionLead>

      <motion.div
        ref={ioRef}
        initial="hide"
        animate={inView ? "show" : "hide"}
        variants={sectionVar}
        className="relative mx-auto max-w-2xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Кнопки */}
        <motion.button
          type="button"
          aria-label="Предыдущий отзыв"
          onClick={() => go(-1)}
          className="absolute left-[-6px] top-1/2 -translate-y-1/2 z-10
                     rounded-xl border px-3 py-2 text-sm
                     bg-[var(--chip-bg)] border-[var(--chip-border)]
                     hover:bg-[var(--chip-hover)]"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 6 }}
          transition={{ delay: 0.08, duration: 0.25 }}
        >
          ←
        </motion.button>
        <motion.button
          type="button"
          aria-label="Следующий отзыв"
          onClick={() => go(1)}
          className="absolute right-[-6px] top-1/2 -translate-y-1/2 z-10
                     rounded-xl border px-3 py-2 text-sm
                     bg-[var(--chip-bg)] border-[var(--chip-border)]
                     hover:bg-[var(--chip-hover)]"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 6 }}
          transition={{ delay: 0.12, duration: 0.25 }}
        >
          →
        </motion.button>

        {/* Контейнер с отзывом — плавная адаптация высоты */}
        <motion.div
          layout
          className="px-10"
          transition={{ layout: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }}
        >
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
            >
              <GlassCard className="p-6 md:p-7">
                <figure className="text-center">
                  <blockquote className="text-[15px] leading-relaxed opacity-90">
                    “{current.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm">
                    <div className="font-medium">{current.name}</div>
                    {current.title && (
                      <div className="opacity-70">{current.title}</div>
                    )}
                  </figcaption>
                </figure>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Точки-индикаторы */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {items.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                aria-label={`Перейти к отзыву ${i + 1}`}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={[
                  "h-2.5 rounded-full transition-all",
                  active
                    ? "w-6 bg-[var(--accent)]"
                    : "w-2.5 bg-[var(--chip-border)] hover:bg-[var(--accent)]/60",
                ].join(" ")}
                style={{ border: "none" }}
              />
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          Отзыв {index + 1} из {count}: {current.name}
        </p>
      </motion.div>
    </Section>
  );
}
