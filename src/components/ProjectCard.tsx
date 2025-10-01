import { motion } from "framer-motion";
import { useRef } from "react";
import GlassCard from "./GlassCard";
import Chip from "./Chip";
import type { Project } from "../data";

type Props = { project: Project; onOpen?: (p: Project) => void };

export default function ProjectCard({ project: p, onOpen }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45 }}
    >
      <GlassCard
        className="overflow-hidden group will-change-transform transition-transform cursor-pointer"
        onMouseMove={onMouseMove}
        onMouseLeave={reset}
        onClick={() => onOpen?.(p)}
        ref={ref}
      >
        <div className="h-48 w-full overflow-hidden">
          <img
            src={p.image}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <div className="flex items-center gap-2 text-sm flex-wrap justify-end">
              {p.stack.map((s) => <Chip key={s}>{s}</Chip>)}
            </div>
          </div>
          <p className="mt-3 text-sm opacity-80">{p.description}</p>
          {!!p.highlights?.length && (
            <ul className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              {p.highlights!.map((h) => (
                <li key={h} className="rounded-lg border border-black/10 dark:border-white/10 px-3 py-2">• {h}</li>
              ))}
            </ul>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
