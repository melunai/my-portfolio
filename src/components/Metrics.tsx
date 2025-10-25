import Section from "./Section";
import GlassCard from "./GlassCard";
import SectionLead from "./SectionLead";
import { METRICS } from "../data";
import { motion } from "framer-motion";
import { useIOInView } from "./useIOInView";

export default function Metrics() {
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
    <Section id="metrics" title="Сильные цифры">
      <SectionLead>
        Ключевые показатели, которые я улучшал в проектах. Без воды — только то,
        что влияет на продукт.
      </SectionLead>
      <div ref={ref} className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            custom={i}
            initial="hide"
            animate={inView ? "show" : "hide"}
            variants={variants}
          >
            <GlassCard
              key={m.label}
              className="p-5 text-center hover:shadow-glow-pink"
            >
              <div className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                {m.value}
              </div>
              <div className="mt-2 text-sm opacity-80">{m.label}</div>
              {m.hint && (
                <div className="mt-1 text-xs opacity-60">{m.hint}</div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
