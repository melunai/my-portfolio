import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles } from "lucide-react";
import type { Project } from "../data";

type Props = { project: Project | null; onClose: () => void };

export default function ProjectModal({ project, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // ===== scroll-lock + Esc =====
  useEffect(() => {
    if (!project) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    queueMicrotask(() => closeBtnRef.current?.focus());
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  // ===== focus-trap =====
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // ====== Портал в <body>, чтобы LiveMode .live-container (transform/filters) не ломал fixed-позиционирование ======
  const portalTarget = typeof window !== "undefined" ? document.body : null;

  const modal = (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-portal fixed inset-0 z-[1000] flex items-center justify-center p-4
                     bg-black/55 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-hidden
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            className="relative max-w-3xl w-full overflow-hidden rounded-3xl border shadow-2xl
                       /* светлая тема */
                       bg-white text-slate-900 border-[color:var(--border,rgba(0,0,0,.1))]
                       /* тёмная тема по токенам */
                       dark:bg-[color:var(--elevated,#0f172a)]
                       dark:text-[color:var(--fg,#e2e8f0)]
                       dark:border-[color:var(--border,rgba(255,255,255,.1))]"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            ref={dialogRef}
          >
            {/* пастельные «пятна», уважают тему */}
            <div aria-hidden className="pointer-events-none absolute -top-16 -left-16 size-64 rounded-full blur-3xl opacity-40"
                 style={{ background: "radial-gradient(closest-side, var(--bubble, rgba(236,72,153,.18)), transparent)" }} />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full blur-3xl opacity-40"
                 style={{ background: "radial-gradient(closest-side, var(--decor-glow, rgba(236,72,153,.28)), transparent)" }} />

            {/* cover */}
            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full aspect-[16/9] object-cover"
                loading="lazy"
                decoding="async"
              />
              <button
                onClick={onClose}
                ref={closeBtnRef}
                className="absolute top-3 right-3 inline-flex items-center justify-center gap-1.5
                           rounded-xl px-2.5 py-1.5 text-sm font-medium transition
                           /* светлая */
                           bg-white/95 text-slate-700 border border-[color:var(--border,rgba(0,0,0,.1))] shadow-sm hover:bg-white
                           /* тёмная */
                           dark:bg-[color:color-mix(in oklab,var(--elevated,#0f172a),white 8%)]
                           dark:text-[color:var(--fg,#e2e8f0)]
                           dark:border-[color:var(--border,rgba(255,255,255,.1))] dark:hover:bg-white/5"
                aria-label="Закрыть модальное окно"
              >
                <X className="size-4" />
                <span className="sr-only">Закрыть</span>
              </button>

              {/* cute sticker */}
              <div
                aria-hidden
                className="absolute -left-2 top-4 rotate-[-8deg] select-none inline-flex items-center gap-1
                           rounded-2xl px-2.5 py-1 text-[12px] font-semibold shadow-sm ring-1
                           bg-[color:var(--chip-bg,rgba(255,255,255,.6))]
                           text-[color:var(--accent,#ec4899)]
                           ring-[color:var(--chip-border,rgba(244,114,182,.22))]"
              >
                <Sparkles className="size-3.5" /> cute
              </div>
            </div>

            {/* content */}
            <div className="p-6">
              <h2 id="project-title" className="text-xl sm:text-2xl font-semibold tracking-tight">
                {project.title} <span aria-hidden>✨</span>
              </h2>
              <p className="mt-2 text-sm sm:text-[15px] leading-relaxed muted">
                {project.description}
              </p>

              {!!project.highlights?.length && (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {project.highlights.map((h) => (
                    <li key={h} className="rounded-xl px-3 py-2 text-sm bordered surface">• {h}</li>
                  ))}
                </ul>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Демо
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn">
                    Код
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return portalTarget ? createPortal(modal, portalTarget) : null;
}
