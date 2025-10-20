import Section from "./Section";
import GlassCard from "./GlassCard";
import ContactForm from "./ContactForm";
import { Mail } from "lucide-react";
import { DATA } from "../data";

export default function Contact() {
  return (
    <Section id="contact" title="Свяжитесь со мной">
      <GlassCard className="p-8 text-center">
        <p className="opacity-90 mb-6">
          Есть идея или задача — расскажите о ней. Я свяжусь с вами и предложу варианты решения.
        </p>

        <ContactForm targetEmail={DATA.email} defaultTelegram={DATA.telegram} />

        <div className="mt-6 opacity-80 text-sm">
          <p>или напишите напрямую:</p>
          <a
            href={`mailto:${DATA.email}`}
            className="inline-flex items-center justify-center gap-2 mt-2 text-blue-400 hover:underline"
          >
            <Mail className="size-4" /> {DATA.email}
          </a>
        </div>
      </GlassCard>
    </Section>
  );
}
