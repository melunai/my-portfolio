import Section from "./Section";
import GlassCard from "./GlassCard";
import SectionLead from "./SectionLead";
import { EXPERIENCE } from "../data";

export default function Experience() {
  return (
    <Section id="experience" title="Опыт">
      <SectionLead>
        Где я приносил пользу и за что отвечал. Сфокусирован на продуктовых командах и скорости поставки.
      </SectionLead>
      <div className="space-y-4">
        {EXPERIENCE.map((e) => (
          <GlassCard key={e.company} className="p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-semibold">{e.role}</div>
                <div className="opacity-70 text-sm">{e.company}</div>
              </div>
              <div className="text-sm opacity-70">{e.period}</div>
            </div>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm">
              {e.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
