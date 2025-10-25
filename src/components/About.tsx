import Section from "./Section";
import { Mail, Github, Linkedin } from "lucide-react";
import { DATA } from "../data";
import { motion } from "framer-motion";
import { useIOInView } from "./useIOInView";

export default function About() {
  // IO для контейнера секции — задаём stagger появления двух карточек
  const { ref, inView } = useIOInView<HTMLDivElement>({
    once: true,
    rootMargin: "-25% 0% -35% 0%",
  });

  const container = {
    hide: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };
  const card = {
    hide: { opacity: 0, y: 14, scale: 0.98, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <Section id="about" title="Обо мне">
      <motion.div
        ref={ref}
        initial="hide"
        animate={inView ? "show" : "hide"}
        variants={container}
        className="relative flex flex-col items-center gap-8 text-center"
      >
        {/* Основной текст — овальная стеклянная форма */}
        <motion.div
          variants={card}
          className="backdrop-blur-xl bg-transparent border border-[var(--glass-border)] rounded-[3rem] p-8 max-w-4xl w-full shadow-[0_0_40px_-20px_var(--glow)]"
        >
          <p className="opacity-90 mb-3">
            Меня зовут <strong>{DATA.name}</strong>, в сети —{" "}
            <strong>{DATA.nick}</strong>. Я <strong>{DATA.role}</strong>, создаю
            современные и масштабируемые интерфейсы.
          </p>
          <p className="opacity-90 mb-3">{DATA.about}</p>
          <p className="opacity-90">Открыт к партнёрствам и новым проектам.</p>
          <p className="opacity-90">Базируюсь в {DATA.location}.</p>
        </motion.div>

        {/* Контакты — отдельная овальная карточка */}
        <motion.div
          variants={card}
          className="backdrop-blur-xl bg-transparent border border-[var(--glass-border)] rounded-[3rem] p-8 max-w-md w-full shadow-[0_0_40px_-20px_var(--glow)]"
        >
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
        </motion.div>
      </motion.div>
    </Section>
  );
}
