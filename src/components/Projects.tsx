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
    projects.forEach((p) =>
      p.stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
    );
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
        <p className="mt-2 text-sm opacity-80">
          Чисто, мило и современно — с лёгкими пастельными акцентами.
        </p>
      </div>

      {/* ===== Фильтры ===== */}
      <div className="mb-5 flex flex-wrap gap-2">
        {/* Все */}
        <button
          onClick={() => setFilter(null)}
          className={`btn-filter ${!filter ? "is-active" : ""}`}
          aria-pressed={!filter}
        >
          Все
          <span className="filter-badge">{projects.length}</span>
        </button>

        {/* Остальные теги */}
        {tags.map((t) => {
          const isActive = t === filter;
          return (
            <button
              key={t}
              onClick={() => setFilter(isActive ? null : t)}
              aria-pressed={isActive}
              className={`btn-filter ${isActive ? "is-active" : ""}`}
            >
              {t}
              <span className="filter-badge">{counts.get(t)}</span>
            </button>
          );
        })}
      </div>

      {/* ===== Сетка проектов ===== */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProjectCard key={p.title} project={p} onOpen={setActive} />
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
