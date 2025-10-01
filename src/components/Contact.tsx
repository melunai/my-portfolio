import Section from "./Section";
import GlassCard from "./GlassCard";
import { Mail } from "lucide-react";
import { DATA } from "../data";

export default function Contact() {
  return (
    <Section id="contact" title="Свяжитесь со мной">
      <GlassCard className="p-8 text-center">
        <p className="opacity-90">
          Есть интересная задача или хотите обсудить сотрудничество?
        </p>
        <a
          href={`mailto:${DATA.email}`}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-6 py-3 text-sm font-medium"
        >
          <Mail className="size-4" /> Почта
        </a>
      </GlassCard>
    </Section>
  );
}
