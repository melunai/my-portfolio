import Section from "./Section";
import SectionLead from "./SectionLead";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { useMemo, useState } from "react";
import { DATA, type Project } from "../data";

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const projects = DATA.projects;

  const allTags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach(p => p.stack.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [projects]);

  const shown = useMemo(() => {
    if (!filter) return projects;
    return projects.filter(p => p.stack.includes(filter));
  }, [projects, filter]);

  return (
    <Section id="projects" title="Проекты">
      <SectionLead>
        Подборка недавних работ и инициатив. От прототипов до интегрированных решений.
      </SectionLead>

      {/* фильтр по тегу */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1 rounded-full border text-sm ${!filter ? "bg-rose-500 text-white border-transparent" : "border-rose-100/20"}`}
        >
          Все
        </button>
        {allTags.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t === filter ? null : t)}
            className={`px-3 py-1 rounded-full border text-sm ${t === filter ? "bg-rose-500 text-white border-transparent" : "border-rose-100/20"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* сетка карточек */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map(p => (
          <ProjectCard key={p.title} project={p} onOpen={setActive} />
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </Section>
  );
}
