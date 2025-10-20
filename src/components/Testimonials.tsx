import Section from "./Section";
import SectionLead from "./SectionLead";
import GlassCard from "./GlassCard";
import { TESTIMONIALS } from "../data";

export default function Testimonials() {
  if (!TESTIMONIALS.length) return null;

  return (
    <Section id="testimonials" title="Отзывы">
      <SectionLead>Что говорят коллеги и партнёры.</SectionLead>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t) => (
          <GlassCard key={t.name} className="p-5">
            <div className="text-sm opacity-80">“{t.quote}”</div>
            <div className="mt-3 text-sm font-medium">{t.name}</div>
            <div className="text-xs opacity-60">{t.title}</div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
