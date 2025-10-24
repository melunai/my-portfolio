import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
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
    try { a.currentTime = 0; } catch {}
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

  return (
    <Section id="skills" title="✨ Навыки и инструменты ✨">
      {/* убран фон — прозрачная область */}
      <div className="p-0">
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
            const meta = skillMeta[s.name] ?? { emoji: "✨", tone: "var(--accent)" };

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
                {/* стеклянный чип-навык с подсветкой */}
                <Chip
                  style={{ ["--tone" as any]: meta.tone || "var(--accent)" }}
                  className="
                    px-5 py-3 rounded-2xl transition-all skill-chip-glow
                    text-[color:var(--fg)]
                    bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md
                    ring-1 ring-black/5 dark:ring-white/10
                    hover:border-[color:var(--tone)]
                    hover:shadow-[0_0_0_3px_var(--tone)]
                    shadow-sm hover:shadow-md
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
      </div>

      {confetti && (
        <Confetti
          key={confetti.key}
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={60}
          confettiSource={{ x: confetti.x, y: confetti.y, w: 10, h: 10 }}
        />
      )}
    </Section>
  );
}
