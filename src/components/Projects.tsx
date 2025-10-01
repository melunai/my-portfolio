import Section from "./Section";
import ProjectCard from "./ProjectCard";
import Chip from "./Chip";
import { useMemo, useState } from "react";
import { DATA } from "../data";
import ProjectModal from "./ProjectModal";

export default function Projects() {
  const [active, setActive] = useState<string>("Все");
  const [open, setOpen] = useState<typeof DATA.projects[number] | null>(null);

  const allStacks = useMemo(() => {
    const set = new Set<string>(["Все"]);
    DATA.projects.forEach((p) => p.stack.forEach((s) => set.add(s)));
    return Array.from(set);
  }, []);

  const list = useMemo(() => {
    if (active === "Все") return DATA.projects;
    return DATA.projects.filter((p) => p.stack.includes(active));
  }, [active]);

  return (
    <Section id="projects" title="Избранные проекты">
      <p className="text-slate-600 dark:text-slate-300 max-w-2xl mb-6">
        Коммерческие и pet-проекты. Можно отфильтровать по стеку.
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {allStacks.map((s) => (
          <Chip key={s} active={active === s} onClick={() => setActive(s)}>
            {s}
          </Chip>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {list.map((p) => (
          <ProjectCard key={p.title} project={p} onOpen={setOpen} />
        ))}
      </div>
      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </Section>
  );
}
