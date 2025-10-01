import Section from "./Section";
import GlassCard from "./GlassCard";
import SectionLead from "./SectionLead";
import { TESTIMONIALS } from "../data";

export default function Testimonials() {
  return (
    <Section id="testimonials" title="Отзывы">
      <SectionLead>Коротко, что отмечают коллеги и заказчики про мою работу.</SectionLead>
      <div className="grid md:grid-cols-2 gap-4">
        {TESTIMONIALS.map((t) => (
          <GlassCard key={t.name} className="p-5">
            <div className="flex items-center gap-3">
              {t.avatar && (
                <img src={t.avatar} alt={t.name} className="size-10 rounded-full object-cover" loading="lazy" />
              )}
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="opacity-70 text-sm">{t.title}</div>
              </div>
            </div>
            <p className="mt-3 opacity-90 leading-relaxed text-sm">“{t.quote}”</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
