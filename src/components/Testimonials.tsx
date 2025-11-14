// src/components/Testimonials.tsx
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "./Section";
import GlassCard from "./GlassCard";
import SectionLead from "./SectionLead";
import { useI18n } from "../i18n/i18n";
import { TESTIMONIALS } from "../data";
import { useIOInView } from "./useIOInView";

const SWIPE_THRESHOLD = 60; // px
const AUTO_DELAY = 6500;   // ms

export default function Testimonials() {
  const { t, lang } = useI18n();

  const items = TESTIMONIALS ?? [];
  if (!items.length) return null;

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

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

  // авто-прокрутка слайдов (Product Auto Animated Slider / Carousel)
  useEffect(() => {
    if (!count || paused) return;

    let timer: number | null = null;

    const start = () => {
      timer = window.setInterval(() => {
        go(1);
      }, AUTO_DELAY);
    };

    start();

    const onVisibility = () => {
      if (document.hidden) {
        if (timer != null) window.clearInterval(timer);
      } else {
        if (timer != null) window.clearInterval(timer);
        start();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timer != null) window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, go, paused]);

  // свайп
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) {
      setPaused(false);
      return;
    }
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      go(dx < 0 ? 1 : -1);
    }
    setPaused(false);
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
    <Section id="testimonials" title={t("sections.testimonials.title")}>
      <SectionLead>{t("sections.testimonials.lead")}</SectionLead>

      <motion.div
        ref={ioRef}
        initial="hide"
        animate={inView ? "show" : "hide"}
        variants={sectionVar}
        className="relative mx-auto max-w-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Кнопки (в стиле product slider) */}
        <motion.button
          type="button"
          aria-label={t("sections.testimonials.prev")}
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
          aria-label={t("sections.testimonials.next")}
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

        {/* Контейнер с отзывом — product-style слайдер с авто-анимацией */}
        <motion.div
          layout
          className="px-10"
          transition={{
            layout: {
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            },
          }}
        >
          {/* Полоска прогресса авто-слайда */}
          <div className="mb-3 h-1 w-full rounded-full bg-[var(--chip-bg)] overflow-hidden">
            <motion.div
              key={`${index}-${paused ? "p" : "r"}`}
              initial={{ width: "0%" }}
              animate={{ width: paused ? "0%" : "100%" }}
              transition={
                paused
                  ? { duration: 0 }
                  : { duration: AUTO_DELAY / 1000, ease: "linear" }
              }
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--ribbon-sheen-start), var(--accent), var(--ribbon-sheen-end))",
              }}
            />
          </div>

          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 30,
              }}
            >
              <GlassCard className="p-6 md:p-7">
                <figure className="text-center">
                  <blockquote className="text-[15px] leading-relaxed opacity-90">
                    “{current.quote[lang]}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm">
                    <div className="font-medium">{current.name[lang]}</div>
                    {current.title && (
                      <div className="opacity-70">{current.title[lang]}</div>
                    )}
                  </figcaption>
                </figure>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Точки-индикаторы (product carousel dots) */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {items.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                aria-label={t("sections.testimonials.dot", {
                  index: i + 1,
                })}
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
          {t("sections.testimonials.screenreader", {
            index: index + 1,
            total: count,
            name: current.name[lang],
          })}
        </p>
      </motion.div>
    </Section>
  );
}
