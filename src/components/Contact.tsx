import Section from "./Section";
import ContactForm from "./ContactForm";
import { Mail } from "lucide-react";
import { DATA } from "../data";

export default function Contact() {
  return (
    <Section id="contact" title="Свяжитесь со мной">
      <div className="relative flex flex-col items-center justify-center">
        {/* мягкий овальный фон-свечение */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[42rem] h-[42rem] rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--decor-glow), transparent 70%)",
          }}
        />

        {/* форма в овальной стеклянной оболочке */}
        <div className="relative z-20 backdrop-blur-2xl bg-transparent border border-[var(--glass-border)] rounded-[4rem] p-10 max-w-3xl w-full shadow-[0_0_40px_-20px_var(--glow)] text-[15px] leading-relaxed text-left">
          <p className="opacity-90 mb-6">
            Есть идея или задача — расскажите о ней. Я свяжусь с вами и предложу
            оптимальные варианты реализации под ваш проект.
          </p>

          <div className="mx-auto max-w-2xl">
            <ContactForm
              targetEmail={DATA.email}
              defaultTelegram={DATA.telegram}
            />
          </div>

          <div className="mt-8 opacity-85 text-sm">
            <p>Или напишите напрямую:</p>
            <a
              href={`mailto:${DATA.email}`}
              className="inline-flex items-center gap-2 mt-2 text-blue-400 hover:underline"
            >
              <Mail className="size-4" /> {DATA.email}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
