// src/components/About.tsx

import Section from "./Section";
import { Mail, Github, Linkedin } from "lucide-react";
import { DATA } from "../data";
import { motion } from "framer-motion";
import { useIOInView } from "./useIOInView";
import { useI18n } from "../i18n/i18n";

export default function About() {
  const { ref, inView } = useIOInView<HTMLDivElement>({
    once: true,
    rootMargin: "-25% 0% -35% 0%",
  });

  const { lang } = useI18n();

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

  const title = lang === "ru" ? "Обо мне" : "About me";

  const introLine =
    lang === "ru" ? (
      <>
        Меня зовут <strong>{DATA.name[lang]}</strong>, в сети —{" "}
        <strong>{DATA.nick}</strong>. Я{" "}
        <strong>{DATA.role[lang]}</strong>, создаю современные и
        масштабируемые интерфейсы.
      </>
    ) : (
      <>
        My name is <strong>{DATA.name[lang]}</strong>, online —{" "}
        <strong>{DATA.nick}</strong>. I’m a{" "}
        <strong>{DATA.role[lang]}</strong>, building modern and scalable
        interfaces.
      </>
    );

  const closingLine =
    lang === "ru"
      ? "Открыт к партнёрствам и новым проектам."
      : "Open to partnerships and new projects.";

  const contactsTitle = lang === "ru" ? "Контакты" : "Contacts";
  const contactsLead =
    lang === "ru"
      ? "Основные точки входа для связи и сотрудничества."
      : "Main channels for contact and collaboration.";
  const basedIn =
    lang === "ru"
      ? "Базируюсь в "
      : "Based in ";

  const emailLabel = lang === "ru" ? "Написать на email" : "Email me";

  return (
    <Section id="about" title={title}>
      <motion.div
        ref={ref}
        initial="hide"
        animate={inView ? "show" : "hide"}
        variants={container}
        className="relative flex flex-col items-center gap-8 text-center md:flex-row md:items-stretch md:text-left"
      >
        {/* Основной текст — большая стеклянная карточка */}
        <motion.div
          variants={card}
          className="backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl p-8 max-w-3xl w-full shadow-[0_0_40px_-20px_var(--glow)]"
        >
          <p className="opacity-90 mb-3">{introLine}</p>

          <p className="opacity-90 mb-3">{DATA.about[lang]}</p>

          <p className="opacity-90">{closingLine}</p>
        </motion.div>

        {/* Контакты — компактная боковая карточка */}
        <motion.div
          variants={card}
          className="backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl p-6 w-full max-w-sm md:max-w-xs flex flex-col justify-between gap-4"
        >
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{contactsTitle}</h3>
            <p className="text-sm opacity-80">{contactsLead}</p>
            <p className="text-sm opacity-80">
              {basedIn}
              <span className="font-medium">{DATA.location[lang]}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            {DATA.email && (
              <a
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--btn-border)] bg-[var(--btn-bg)] px-4 py-2 font-medium hover:bg-[var(--btn-hover)] transition-colors"
                href={`mailto:${DATA.email}`}
              >
                <Mail className="size-4" />
                {emailLabel}
              </a>
            )}

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
