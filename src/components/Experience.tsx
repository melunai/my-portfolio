// src/components/Experience.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Section from "./Section";
import SectionLead from "./SectionLead";
import { EXPERIENCE } from "../data";
import { useI18n } from "../i18n/i18n";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type ItemState = { open: boolean };

/** Универсальный пикер текста: строка или { ru, en } */
function pickText(value: any, lang: string): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const v = value as { ru?: string; en?: string };
    return (
      (lang === "en" ? v.en : v.ru) ??
      v.ru ??
      v.en ??
      String(value)
    );
  }
  return String(value);
}

export default function Experience() {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const [openMap, setOpenMap] = useState<Record<number, ItemState>>({});
  const listRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 80%", "end 20%"],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0.05, 1]);

  // по умолчанию открываем первый элемент
  useEffect(() => {
    if (EXPERIENCE.length) {
      setOpenMap((m) => ({ ...m, 0: { open: true } }));
    }
  }, []);

  const toggle = (idx: number) =>
    setOpenMap((m) => ({ ...m, [idx]: { open: !m[idx]?.open } }));

  const lineAnim = useMemo(
    () => ({
      initial: { scaleY: 0.4, opacity: 0 },
      whileInView: { scaleY: 1, opacity: 1 },
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
      viewport: { once: true, amount: 0.25 },
    }),
    []
  );

  const LEAD_DELAY = 0.35;
  const BODY_DELAY = 0.7;

  return (
    <Section id="experience" title={t("sections.experience.title")}>
      <div className="relative">
        {/* Подзаголовок */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.5,
            delay: LEAD_DELAY,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-start justify-between gap-4"
        >
          <SectionLead>{t("sections.experience.lead")}</SectionLead>
        </motion.div>

        {/* Основная лента */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.55,
            delay: BODY_DELAY,
            ease: [0.22, 1, 0.36, 1],
          }}
          ref={listRef}
          className="relative mt-8 grid grid-cols-[16px,1fr] gap-4 justify-center"
        >
          {/* Радужная линия */}
          <motion.div
            className="relative ml-[6px] rounded-full origin-top"
            style={{
              width: 4,
              background:
                "linear-gradient(180deg,#f472b6 0%,#a78bfa 40%,#60a5fa 100%)",
              boxShadow: "0 0 18px -6px var(--glow)",
            }}
            {...lineAnim}
          >
            {!reduce && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-full opacity-50"
                style={{
                  background:
                    "linear-gradient(180deg,transparent,var(--decor-glow),transparent)",
                  filter: "blur(3px)",
                  animation: "breath 3.2s ease-in-out infinite",
                }}
              />
            )}

            <motion.span
              aria-hidden
              className="absolute left-0 right-0 origin-top rounded-full"
              style={{
                top: 0,
                height: "100%",
                background:
                  "linear-gradient(180deg,var(--accent),transparent 90%)",
                opacity: 0.6,
                scaleY: fillScale,
              }}
            />
          </motion.div>

          {/* Карточки */}
          <div className="space-y-5 max-w-9xl mx-auto w-full">
            <AnimatePresence initial={false}>
              {EXPERIENCE.map((e: any, i: number) => {
                const isOpen = openMap[i]?.open ?? false;

                const role = pickText(e.role, lang);
                const company = pickText(e.company, lang);
                const period = pickText(e.period, lang);
                const points: any[] = e.points ?? [];

                return (
                  <motion.article
                    key={`${i}-${company}`}
                    initial={{ opacity: 0, y: 16, scale: 0.995 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    className="group relative overflow-visible"
                  >
                    {/* Точка на линии */}
                    <motion.div
                      aria-hidden
                      className="absolute -left-[26px] top-2 size-5 rounded-full grid place-items-center z-0"
                      style={{ boxShadow: "0 6px 18px -8px var(--decor-glow)" }}
                      animate={
                        isOpen && !reduce
                          ? {
                              scale: [1, 1.15, 1],
                              filter: [
                                "brightness(1)",
                                "brightness(1.2)",
                                "brightness(1)",
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.9,
                        repeat: isOpen && !reduce ? Infinity : 0,
                      }}
                    >
                      <div
                        className="size-2.5 rounded-full"
                        style={{
                          background:
                            i === 0
                              ? "var(--accent)"
                              : "color-mix(in oklab, var(--accent), white 30%)",
                        }}
                      />
                    </motion.div>

                    {/* Карточка */}
                    <motion.div
                      whileHover={
                        reduce
                          ? {}
                          : {
                              y: -2,
                              scale: 1.015,
                              transition: { duration: 0.18 },
                            }
                      }
                      className="
                        relative z-10 rounded-3xl p-6 md:p-7
                        bg-[var(--glass-bg)] border border-[var(--glass-border)]
                        backdrop-blur-2xl
                        shadow-[0_8px_30px_-10px_var(--glow)]
                        hover:shadow-[0_10px_35px_-8px_var(--glow)]
                        transition-all duration-300
                        transform-gpu
                      "
                      style={{
                        backgroundImage:
                          "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06)), var(--glass-bg)",
                      }}
                    >
                      <header className="relative z-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <h3 className="text-lg md:text-xl font-extrabold tracking-tight">
                            {role}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]">
                            <span
                              className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1
                                         bg-[var(--chip-bg)] border border-[var(--chip-border)]"
                            >
                              <Building2 className="size-3.5 opacity-80" />
                              {company}
                            </span>
                            <span
                              className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1
                                         bg-[var(--chip-bg)] border border-[var(--chip-border)]"
                            >
                              <CalendarDays className="size-3.5 opacity-80" />
                              {period}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggle(i)}
                          aria-expanded={isOpen}
                          className="mt-2 md:mt-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium
                                     bg-[var(--btn-bg)] text-[color:var(--fg)] border border-[var(--btn-border)]
                                     hover:border-[var(--accent)]
                                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                        >
                          {isOpen ? (
                            <>
                              {lang === "ru" ? "Свернуть" : "Collapse"}
                              <ChevronUp className="size-4" />
                            </>
                          ) : (
                            <>
                              {lang === "ru" ? "Показать детали" : "Show details"}
                              <ChevronDown className="size-4" />
                            </>
                          )}
                        </button>
                      </header>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.ul
                            key="points"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.22,
                              ease: [0.2, 0.8, 0.2, 1],
                            }}
                            className="relative z-10 mt-3 overflow-hidden space-y-2"
                          >
                            {points.map((p, j) => (
                              <motion.li
                                key={`${i}-${j}`}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.6 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 360,
                                  damping: 20,
                                  delay: reduce ? 0 : j * 0.03,
                                }}
                                className="flex items-start gap-3 text-[15px] text-[color:var(--fg)]/90"
                              >
                                <span
                                  aria-hidden
                                  className="mt-2 inline-block size-2 rounded-full"
                                  style={{
                                    background:
                                      j % 3 === 0
                                        ? "var(--confetti1)"
                                        : j % 3 === 1
                                        ? "var(--accent)"
                                        : "var(--confetti2)",
                                  }}
                                />
                                <span>{pickText(p, lang)}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        <style>{`
          @keyframes breath {
            0%,100% { opacity: .35; transform: translateY(0) }
            50%     { opacity: .6;  transform: translateY(-6px) }
          }
        `}</style>
      </div>
    </Section>
  );
}
