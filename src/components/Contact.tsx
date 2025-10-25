import Section from "./Section";
import SectionLead from "./SectionLead";
import GlassCard from "./GlassCard";
import ContactForm from "./ContactForm";
import { Mail, Send } from "lucide-react";
import { DATA } from "../data";
import type{ JSX } from "react";

export default function Contact(): JSX.Element {
  return (
    <Section id="contact" title="Связаться со мной">
      <div className="relative">

        <GlassCard
          className="relative overflow-hidden p-6 md:p-10"
          style={{
            background:
              "linear-gradient(145deg, color-mix(in oklab, var(--accent) 10%, transparent), color-mix(in oklab, var(--card) 92%, var(--accent) 6%))",
            boxShadow:
              "0 20px 60px -30px color-mix(in oklab, var(--glow), transparent 45%), inset 0 0 0 1px color-mix(in oklab, var(--chip-border), transparent 50%)",
            border:
              "1px solid color-mix(in oklab, var(--glass-border), var(--accent) 12%)",
          }}
        >
          {/* мягкое свечение по бокам */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-[2px] rounded-[1rem] opacity-60 blur-2xl"
            style={{
              background:
                "radial-gradient(circle at 12% 18%, color-mix(in oklab, var(--accent), transparent 55%) 0%, transparent 60%), radial-gradient(circle at 88% 82%, color-mix(in oklab, var(--accent), transparent 55%) 0%, transparent 60%)",
            }}
          />

          <div className="relative grid gap-10 md:grid-cols-2">
            <div className="self-center">
              <SectionLead>
                Есть идея или задача? Напишите — вернусь с предложениями, сроками и аккуратной сметой.
              </SectionLead>

              <div className="mt-4 grid gap-3">
                <a
                  href={`mailto:${DATA.email}`}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bordered hover:shadow-md transition"
                >
                  <Mail className="size-4 opacity-80" />
                  <span>{DATA.email}</span>
                </a>

                {DATA.telegram && (
                  <a
                    href={`https://t.me/${DATA.telegram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bordered hover:shadow-md transition"
                  >
                    <Send className="size-4 opacity-80" />
                    <span>{DATA.telegram}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="max-w-xl md:ml-auto">
              <ContactForm
                targetEmail={DATA.email}
                defaultTelegram={DATA.telegram}
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}
