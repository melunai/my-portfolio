import Section from "./Section";
import GlassCard from "./GlassCard";
import Chip from "./Chip";
import { DATA } from "../data";

export default function Skills() {
  return (
    <Section id="skills" title="Навыки и инструменты">
      <GlassCard className="p-5">
        <div className="flex flex-wrap gap-2">
          {DATA.skills.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </GlassCard>
    </Section>
  );
}
