import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "../data";

type Props = { project: Project | null; onClose: () => void };

export default function ProjectModal({ project, onClose }: Props) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="max-w-3xl w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img src={project.image} alt={project.title} className="w-full h-64 object-cover" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 inline-flex items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-2.5 py-1.5"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="text-xl font-semibold">{project.title}</div>
              <p className="mt-2 opacity-80 text-sm">{project.description}</p>
              {project.highlights?.length ? (
                <ul className="mt-3 grid md:grid-cols-3 gap-2 text-sm">
                  {project.highlights.map((h) => (
                    <li key={h} className="rounded-lg border border-black/10 dark:border-white/10 px-3 py-2">• {h}</li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-4 flex gap-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 text-sm font-medium">Демо</a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 px-4 py-2 text-sm">Код</a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
