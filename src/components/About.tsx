import Section from "./Section";
import GlassCard from "./GlassCard";
import { Mail, Github, Linkedin } from "lucide-react";
import { DATA } from "../data";

export default function About() {
  return (
    <Section id="about" title="Обо мне">
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="p-5 md:col-span-2">
          <p className="opacity-90 leading-relaxed">
            Опишите опыт, чем вы занимаетесь и что любите строить. Можете добавить мини-историю: откуда пришли в IT, какие задачи драйвят, ценности в работе.
          </p>
          <p className="opacity-90 leading-relaxed mt-4">
            Небольшой список достижений: • ускорил сборку на 40% • внедрил дизайн-систему • снизил TTFB на 120мс и т.д.
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-medium mb-3">Контакты</h3>
          <div className="space-y-2 text-sm">
            <a className="flex items-center gap-2 opacity-90 hover:opacity-100" href={`mailto:${DATA.email}`}>
              <Mail className="size-4" /> {DATA.email}
            </a>
            <a className="flex items-center gap-2 opacity-90 hover:opacity-100" href={DATA.github} target="_blank" rel="noreferrer">
              <Github className="size-4" /> GitHub
            </a>
            <a className="flex items-center gap-2 opacity-90 hover:opacity-100" href={DATA.linkedin} target="_blank" rel="noreferrer">
              <Linkedin className="size-4" /> LinkedIn
            </a>
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}
