import { useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";
import GlassCard from "./GlassCard";
import Chip from "./Chip";
import { DATA } from "../data";
import Confetti from "react-confetti";

// === Эмодзи и цвета по категориям ===
const skillMeta: Record<string, { emoji: string; colors: [string, string, string] }> = {
  TypeScript: { emoji: "🟦", colors: ["from-blue-200", "to-blue-300", "text-blue-900"] },
  React: { emoji: "⚛️", colors: ["from-cyan-200", "to-cyan-300", "text-cyan-900"] },
  Vite: { emoji: "⚡", colors: ["from-yellow-200", "to-yellow-300", "text-yellow-900"] },
  Tailwind: { emoji: "🎨", colors: ["from-teal-200", "to-teal-300", "text-teal-900"] },
  UnoCSS: { emoji: "🎯", colors: ["from-indigo-200", "to-indigo-300", "text-indigo-900"] },
  JavaScript: { emoji: "🟨", colors: ["from-yellow-200", "to-yellow-300", "text-yellow-900"] },
  HTML: { emoji: "🧱", colors: ["from-orange-200", "to-orange-300", "text-orange-900"] },
  CSS: { emoji: "🎨", colors: ["from-sky-200", "to-sky-300", "text-sky-900"] },
  Python: { emoji: "🐍", colors: ["from-green-200", "to-green-300", "text-green-900"] },
  SQL: { emoji: "🗃️", colors: ["from-gray-200", "to-gray-300", "text-gray-900"] },
  "MapLibre GL": { emoji: "🗺️", colors: ["from-lime-200", "to-lime-300", "text-lime-900"] },
  "Mapbox GL": { emoji: "🌍", colors: ["from-blue-200", "to-blue-300", "text-blue-900"] },
  "Redux Toolkit": { emoji: "🧠", colors: ["from-purple-200", "to-purple-300", "text-purple-900"] },
  Zustand: { emoji: "🐻", colors: ["from-amber-200", "to-amber-300", "text-amber-900"] },
  IndexedDB: { emoji: "🗄️", colors: ["from-slate-200", "to-slate-300", "text-slate-900"] },
  "Service Worker": { emoji: "🔧", colors: ["from-zinc-200", "to-zinc-300", "text-zinc-900"] },
};

export default function Skills() {
  const [confetti, setConfetti] = useState<{
    key: number;
    x: number;
    y: number;
  } | null>(null);

  const playSound = () => {
    const audio = new Audio("/sounds/bubble.mp3");
    audio.volume = 0.3;
    audio.play();
  };

  const handleClick = (url: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setConfetti({
      key: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 300);
  };

  return (
    <Section id="skills" title="✨ Навыки и инструменты ✨">
      <GlassCard className="p-6">
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {DATA.skills.map((s, i) => {
            const meta = skillMeta[s.name];
            const [from, to, textColor] = meta.colors;
            const emoji = meta.emoji;
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
                onHoverStart={playSound}
                onClick={(e) => handleClick(s.url, e)}
                className="cursor-pointer"
              >
                <Chip
                  className={`px-5 py-3 rounded-2xl bg-gradient-to-br ${from} ${to} ${textColor} shadow-md hover:shadow-xl transition-all`}
                >
                  <span className="drop-shadow-sm">{s.name}</span>
                  <span className="ml-2 opacity-70">{emoji}</span>
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
    </Section>
  );
}