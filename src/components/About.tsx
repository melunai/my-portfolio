import Section from "./Section";
import { Mail, Github, Linkedin } from "lucide-react";
import { DATA } from "../data";

export default function About() {
  return (
    <Section id="about" title="Обо мне">
      <div className="relative flex flex-col items-center gap-8 text-center">
        {/* Основной текст — овальная стеклянная форма */}
        <div className="backdrop-blur-xl bg-transparent border border-[var(--glass-border)] rounded-[3rem] p-8 max-w-4xl w-full shadow-[0_0_40px_-20px_var(--glow)]">
          <p className="opacity-90 mb-3">
            Меня зовут <strong>{DATA.name}</strong>, в сети —{" "}
            <strong>{DATA.nick}</strong>. Я <strong>{DATA.role}</strong>, создаю
            современные и масштабируемые интерфейсы.
          </p>
          <p className="opacity-90 mb-3">{DATA.about}</p>
          <p className="opacity-90">
            Открыт к партнёрствам и новым проектам.
          </p>
                    <p className="opacity-90">
            Базируюсь в {DATA.location}.
          </p>
        </div>

        {/* Контакты — отдельная овальная карточка */}
        <div className="backdrop-blur-xl bg-transparent border border-[var(--glass-border)] rounded-[3rem] p-8 max-w-md w-full shadow-[0_0_40px_-20px_var(--glow)]">
          <h3 className="font-medium mb-4">Контакты</h3>
          <div className="flex flex-col items-center gap-3 text-sm">
            <a
              className="flex items-center justify-center gap-2 opacity-90 hover:opacity-100"
              href={`mailto:${DATA.email}`}
            >
              <Mail className="size-4" /> {DATA.email}
            </a>

            {DATA.github && (
              <a
                className="flex items-center justify-center gap-2 opacity-90 hover:opacity-100"
                href={DATA.github}
                target="_blank"
                rel="noreferrer"
              >
                <Github className="size-4" /> GitHub
              </a>
            )}

            {DATA.linkedin && (
              <a
                className="flex items-center justify-center gap-2 opacity-90 hover:opacity-100"
                href={DATA.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="size-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
