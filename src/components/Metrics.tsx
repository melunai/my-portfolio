import Section from "./Section";
import GlassCard from "./GlassCard";
import SectionLead from "./SectionLead";
import { METRICS } from "../data";
import { motion } from "framer-motion";
import { useIOInView } from "./useIOInView";
import { useI18n } from "../i18n/i18n";

export default function Metrics() {
  const { t, lang } = useI18n();

  const { ref, inView } = useIOInView<HTMLDivElement>({
    once: true,
    rootMargin: "-25% 0% -50% 0%",
  });

  const variants = {
    hide: { opacity: 0, y: 14 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        delay: i * 0.06,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    }),
  };

  return (
    <Section id="metrics" title={t("sections.metrics.title")}>
      <SectionLead>{t("sections.metrics.lead")}</SectionLead>

      {/* все элементы растягиваются по высоте строки */}
      <div
        ref={ref}
        className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 items-stretch"
      >
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label.ru}
            custom={i}
            initial="hide"
            animate={inView ? "show" : "hide"}
            variants={variants}
            className="h-full" // контейнер тоже тянется
          >
            <GlassCard
              className="
                h-full
                flex flex-col items-center justify-center
                p-5 text-center hover:shadow-glow-pink
              "
            >
              {/* значение */}
              <div className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                {m.value}
              </div>

              {/* локализованный label */}
              <div className="mt-2 text-sm opacity-80">
                {m.label[lang]}
              </div>

              {/* локализованный hint */}
              {m.hint && (
                <div className="mt-1 text-xs opacity-60">
                  {m.hint[lang]}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
