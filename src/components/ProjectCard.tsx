import { motion } from "framer-motion";
import { useRef } from "react";
import type { Project } from "../data";

type Props = { project: Project; onOpen?: (p: Project) => void };

export default function ProjectCard({ project: p, onOpen }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-py * 3).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  const open = () => onOpen?.(p);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45 }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={reset}
        onClick={open}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => ((e.key === "Enter" || e.key === " ") && (e.preventDefault(), open()))}
        aria-label={`Открыть проект ${p.title}`}
        className="
          group relative cursor-pointer overflow-hidden rounded-3xl
          card bordered
          transition hover:shadow-lg will-change-transform
        "
      >
        {/* пастельная рамка по токенам */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ boxShadow: "inset 0 0 0 1px var(--border)" }}
        />

        {/* sticker */}
        <div
          aria-hidden
          className="absolute left-3 top-3 z-10 rotate-[-6deg] rounded-xl px-2 py-1 text-[11px] font-semibold animate-kawaiiSticker"
          style={{
            background: "var(--chip-bg, rgba(255,255,255,.6))",
            color: "var(--accent-600, #db2777)",
            border: "1px solid var(--chip-border, rgba(244,114,182,.22))"
          }}
        >
          ✿ project
        </div>

        <div className="w-full overflow-hidden">
          <div className="aspect-[16/10] w-full">
            <img
              src={p.image}
              alt={p.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0"
                 style={{ background: "linear-gradient(to top, rgba(0,0,0,.15), transparent 45%)" }} />
          </div>
        </div>

        <div className="p-5 theme-colors">
          <h3 className="text-base sm:text-lg font-semibold tracking-tight">{p.title}</h3>
          <p className="mt-2 text-sm leading-relaxed">{p.description}</p>

          {!!p.stack?.length && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
