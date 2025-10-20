import Section from "./Section";
import GlassCard from "./GlassCard";
import { Mail, Github, Linkedin } from "lucide-react";
import { DATA } from "../data";

export default function About() {
  return (
    <Section id="about" title="Обо мне">
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="p-5 md:col-span-2 leading-relaxed">
          <p className="opacity-90 mb-3">
            Меня зовут <strong>{DATA.name}</strong>, в сети — <strong>{DATA.nick}</strong>.
            Я <strong>{DATA.role}</strong>, создаю современные и масштабируемые интерфейсы.
          </p>
          <p className="opacity-90 mb-3">{DATA.about}</p>
          <p className="opacity-90">
            Базируюсь в {DATA.location}. Открыт к партнёрствам и новым проектам.
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-medium mb-3">Контакты</h3>
          <div className="space-y-2 text-sm">
            <a className="flex items-center gap-2 opacity-90 hover:opacity-100" href={`mailto:${DATA.email}`}>
              <Mail className="size-4" /> {DATA.email}
            </a>
            {DATA.github && (
              <a className="flex items-center gap-2 opacity-90 hover:opacity-100" href={DATA.github} target="_blank" rel="noreferrer">
                <Github className="size-4" /> GitHub
              </a>
            )}
            {DATA.linkedin && (
              <a className="flex items-center gap-2 opacity-90 hover:opacity-100" href={DATA.linkedin} target="_blank" rel="noreferrer">
                <Linkedin className="size-4" /> LinkedIn
              </a>
            )}
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}
