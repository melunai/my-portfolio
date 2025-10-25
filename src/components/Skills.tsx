import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import SectionLead from "./SectionLead";
import GlassCard from "./GlassCard";
import Chip from "./Chip";
import { DATA, skillMeta } from "../data";
import Confetti from "react-confetti";

export default function Skills() {
  const [confetti, setConfetti] = useState<{ key: number; x: number; y: number } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayRef = useRef(0);
  const playBubble = () => {
    const now = performance.now();
    if (now - lastPlayRef.current < 120) return;
    lastPlayRef.current = now;
    if (!audioRef.current) {
      const a = new Audio("/sounds/bubble.mp3");
      a.volume = 0.35;
      audioRef.current = a;
    }
    const a = audioRef.current;
    try {
      a.currentTime = 0;
    } catch {}
    a.play().catch(() => {});
  };

  const handleClick = (url: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setConfetti({
      key: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    playBubble();
    setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 300);
  };

  const LEAD_DELAY = 0.35;
  const BODY_DELAY = 0.70;

  return (
    <Section id="skills" title="Навыки и инструменты">
      {/* 2) Подзаголовок */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: LEAD_DELAY, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionLead>Инструменты и стек, которыми я реально пользуюсь в работе.</SectionLead>
      </motion.div>

      {/* 3) Основной блок со скиллами */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55, delay: BODY_DELAY, ease: [0.22, 1, 0.36, 1] }}
      >
        <GlassCard className="p-6">
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
          >
            {DATA.skills.map((s, i) => {
              const meta = skillMeta[s.name] ?? {
                emoji: "✨",
                tone: "var(--accent)",
              };

              return (
                <motion.div
                  key={`${s.name}-${i}`}
                  variants={{
                    hidden: { scale: 0, opacity: 0 },
                    visible: { scale: 1, opacity: 1 },
                  }}
                  whileHover={{
                    scale: 1.15,
                    y: [-2, -6, -2],
                    rotate: [0, -3, 3, 0],
                    transition: {
                      y: { repeat: Infinity, duration: 0.6 },
                      rotate: { duration: 0.4 },
                    },
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onHoverStart={playBubble}
                  onClick={(e) => handleClick(s.url, e)}
                  className="cursor-pointer"
                >
                  <Chip
                    style={{
                      ["--tone" as any]: meta.tone || "var(--accent)",
                    }}
                    className="
                      px-5 py-3 rounded-2xl transition-all
                      text-[color:var(--fg)]
                      bg-[var(--card)] dark:bg-[color-mix(in oklab,var(--card),black_8%)]
                      border border-[var(--border)]
                      ring-1 ring-black/5 dark:ring-white/10
                      hover:border-[color:var(--tone)]
                      hover:shadow-[0_0_0_3px_var(--tone)]
                      shadow-sm hover:shadow-md backdrop-blur-sm
                    "
                  >
                    <span
                      aria-hidden
                      className="mr-2 inline-block size-2.5 rounded-full"
                      style={{ background: "var(--tone)" }}
                    />
                    <span>{s.name}</span>
                    <span className="ml-2 opacity-85">{meta.emoji}</span>
                  </Chip>
                </motion.div>
              );
            })}
          </motion.div>
        </GlassCard>

        {confetti && (
          <Confetti
            key={confetti.key}
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={60}
            confettiSource={{
              x: confetti.x,
              y: confetti.y,
              w: 10,
              h: 10,
            }}
          />
        )}
      </motion.div>
    </Section>
  );
}
