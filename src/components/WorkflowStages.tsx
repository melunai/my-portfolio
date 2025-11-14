import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Section from "./Section";
import SectionLead from "./SectionLead";
import { useI18n } from "../i18n/i18n";
import { useIOInView } from "./useIOInView";


export default function WorkflowStages() {
  const { t } = useI18n(); {
  const { ref, inView } = useIOInView<HTMLDivElement>({ once: true });

    const STAGES = t("sections.workflow.stages") as Array<{
    title: string;
    text: string;
  }>;
  const variants = {
    hide: { opacity: 0, y: 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.08 },
    }),
  };

  return (
    <Section id="workflow" title={t("sections.workflow.title")}>
      <SectionLead>
        {t("sections.workflow.lead")}
      </SectionLead>

      <div
        ref={ref}
        className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-8 mt-12"
      >
        {STAGES.map((stage, i) => (
          <motion.div
            key={stage.title}
            custom={i}
            initial="hide"
            animate={inView ? "show" : "hide"}
            variants={variants}
            className="relative flex flex-col items-center text-center"
          >
            <div
              className="
                relative flex flex-col justify-center items-center
                w-56 h-72 md:w-60 md:h-80
                rounded-[999px]
                border border-[var(--chip-border)]
                bg-[var(--glass-bg)] backdrop-blur-xl
                shadow-[0_10px_34px_-12px_var(--decor-glow)]
                hover:shadow-[0_0_38px_-8px_var(--accent)]
                hover:border-[var(--accent)]
                transition-all duration-300 px-6 py-5
                overflow-hidden
              "
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-10 rounded-[999px] opacity-70"
                style={{
                  background:
                    "radial-gradient(120% 160% at 20% 20%, color-mix(in oklab,var(--glow), transparent 30%) 0%, transparent 38%)," +
                    "radial-gradient(140% 200% at 85% 60%, color-mix(in oklab,var(--accent), white 14%) 0%, transparent 50%)",
                  backgroundSize: "200% 200%, 220% 220%",
                  animation: "wfGradientShift 14s ease-in-out infinite",
                  filter: "blur(2px)",
                }}
              />

              <h3 className="text-lg font-semibold text-[color:var(--fg)] mb-2">
                {stage.title}
              </h3>
              <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">
                {stage.text}
              </p>
            </div>

            {i < STAGES.length - 1 && (
              <>
                <ArrowRight
                  className="hidden md:block absolute top-1/2 -right-7 translate-y-[-50%]
                             text-pink-400/85 drop-shadow-[0_0_6px_rgba(236,72,153,0.45)]"
                  size={30}
                  strokeWidth={1.5}
                />
                <ArrowRight
                  className="md:hidden mt-6 rotate-90 text-pink-400/85 drop-shadow-[0_0_6px_rgba(236,72,153,0.45)]"
                  size={30}
                  strokeWidth={1.5}
                />
              </>
            )}
          </motion.div>
        ))}
      </div>

      <style>{`
        @keyframes wfGradientShift {
          0%   { background-position: 0% 0%, 100% 100%; transform: translateY(0) }
          50%  { background-position: 100% 50%, 0% 50%;  transform: translateY(-1px) }
          100% { background-position: 0% 0%, 100% 100%; transform: translateY(0) }
        }
      `}</style>
    </Section>
  );
}
}