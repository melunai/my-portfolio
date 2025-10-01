import Section from "./Section";
import GlassCard from "./GlassCard";
import SectionLead from "./SectionLead";
import { METRICS } from "../data";

export default function Metrics() {
  return (
    <Section id="metrics" title="Сильные цифры">
      <SectionLead>
        Ключевые показатели, которые я улучшал в проектах. Без воды — только то,
        что влияет на продукт.
      </SectionLead>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <GlassCard
            key={m.label}
            className="p-5 text-center hover:shadow-glow-pink"
          >
            <div className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              {m.value}
            </div>
            <div className="mt-2 text-sm opacity-80">{m.label}</div>
            {m.hint && <div className="mt-1 text-xs opacity-60">{m.hint}</div>}
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
