import { useEffect, useMemo, useState } from "react";
import { DATA, type Project } from "../data";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const projects = DATA.projects;

  const { tags, counts } = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    const tags = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));
    return { tags, counts };
  }, [projects]);

  const shown = useMemo(
    () => (!filter ? projects : projects.filter((p) => p.stack.includes(filter))),
    [projects, filter]
  );

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [active]);

  return (
    <section id="projects" className="scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Проекты</h2>
        <p className="mt-2 text-sm opacity-80">Чисто, мило и современно — с лёгкими пастельными акцентами.</p>
      </div>

      {/* фильтры */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-full text-sm transition border
            ${!filter
              ? "bg-rose-500 text-white border-transparent shadow-sm"
              : "bg-white text-slate-700 border-black/10 hover:bg-slate-50 dark:bg-transparent dark:text-slate-200 dark:border-white/15 dark:hover:bg-white/5"}
          `}
        >
          Все <span className="ml-1 opacity-80">({projects.length})</span>
        </button>

        {tags.map((t) => {
          const isActive = t === filter;
          return (
            <button
              key={t}
              onClick={() => setFilter(isActive ? null : t)}
              aria-pressed={isActive}
              className={`px-3 py-1.5 rounded-full text-sm transition border
                ${isActive
                  ? "bg-rose-500 text-white border-transparent shadow-sm"
                  : "bg-white text-slate-700 border-black/10 hover:bg-slate-50 dark:bg-transparent dark:text-slate-200 dark:border-white/15 dark:hover:bg-white/5"}
              `}
            >
              {t}
              <span
                className={`ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px]
                  ${isActive ? "bg-white/25 text-white" : "bg-black/5 text-slate-600 dark:bg-white/10 dark:text-slate-200"}`}
              >
                {counts.get(t)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProjectCard key={p.title} project={p} onOpen={setActive} />
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
