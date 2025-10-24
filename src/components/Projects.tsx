import {  useMemo, useState } from "react";
import { motion } from "framer-motion";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { DATA, type Project } from "../data";
import ProjectModal from "./ProjectModal";

const SIDE_SCALE = 0.96;
const SIDE_FADE = 1;

export default function Projects() {
  const projects = DATA.projects;
  const LAST = Math.max(0, projects.length - 1);

  // старт со второго проекта (если есть)
  const INIT = Math.min(1, LAST);
  const [activeIdx, setActiveIdx] = useState(INIT);

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const { tags, counts } = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) =>
      p.stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
    );
    const tags = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));
    return { tags, counts };
  }, [projects]);

  // навигация С ЦИКЛИРОВАНИЕМ
  const prev = () => setActiveIdx((i) => (i - 1 + projects.length) % projects.length);
  const next = () => setActiveIdx((i) => (i + 1) % projects.length);

  // ⛔ УБРАНО: никакой смены по колесу (не подписываемся на wheel)

  const filtered = useMemo(
    () => (!filter ? projects : projects.filter((p) => p.stack.includes(filter))),
    [projects, filter]
  );

  const project = projects[activeIdx];

  return (
    <section id="projects" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Проекты</h2>
        </div>

        {/* ===== Герой ===== */}
        {project && (
          <motion.article
            key={project.title}
            layout
            initial={{ scale: SIDE_SCALE, opacity: SIDE_FADE }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
            className="mx-auto w-full max-w-4xl"
            aria-live="polite"
          >
            <div
              className="relative overflow-hidden rounded-2xl border"
              style={{
                borderColor: "color-mix(in oklab, var(--border), transparent 0%)",
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--card), white 6%) 0%, color-mix(in oklab, var(--card), black 4%) 100%)",
                boxShadow: "0 10px 30px color-mix(in oklab, var(--shadow, #000), transparent 82%)",
              }}
            >
              <div className="p-3 sm:p-4 md:p-5">
                <CoverImageAdaptive project={project} />
              </div>

              <div className="px-4 pb-5 sm:px-6 md:px-7">
                <h3 className="font-semibold text-[color:var(--fg)] text-lg sm:text-xl line-clamp-2">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm opacity-80">{project.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 8).map((s) => (
                    <span key={s} className="chip pastel-chip text-xs">{s}</span>
                  ))}
                  {project.stack.length > 8 && (
                    <span className="chip pastel-chip text-xs">+{project.stack.length - 8}</span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-primary"
                    >
                      Демо
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn"
                    >
                      Код
                    </a>
                  )}
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setActiveProject(project)}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* Навигация (стрелки + точки) */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={prev}
            className="btn px-3 py-1.5"
            aria-label="Предыдущий проект"
          >
            ←
          </button>

          <RadioGroup.Root
            className="inline-flex items-center gap-2"
            value={String(activeIdx)}
            onValueChange={(v) => setActiveIdx(Number(v))} // точки переключают напрямую
            aria-label="Навигация по проектам"
          >
            {projects.map((_, idx) => (
              <RadioGroup.Item
                key={idx}
                value={String(idx)}
                className="relative h-3 w-3 rounded-full border border-[var(--border)] data-[state=checked]:border-transparent"
                style={{
                  background:
                    activeIdx === idx
                      ? "linear-gradient(90deg, var(--ribbon-sheen-start), var(--accent))"
                      : "color-mix(in oklab, var(--card), var(--accent) 10%)",
                  opacity: activeIdx === idx ? 1 : 0.7,
                  transition: "all .25s ease",
                }}
                aria-label={`К проекту ${idx + 1}`}
              >
                <RadioGroup.Indicator
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%)" }}
                />
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>

          <button
            type="button"
            onClick={next}
            className="btn px-3 py-1.5"
            aria-label="Следующий проект"
          >
            →
          </button>
        </div>

        {/* Модалка */}
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />

        {/* ===== Минималистичный список снизу ===== */}
        <div className="mt-10">
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilter(null)}
              className={`btn-filter ${!filter ? "is-active" : ""}`}
            >
              Все <span className="filter-badge">{projects.length}</span>
            </button>
            {tags.map((t) => {
              const active = filter === t;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(active ? null : t)}
                  className={`btn-filter ${active ? "is-active" : ""}`}
                >
                  {t} <span className="filter-badge">{counts.get(t)}</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <button
                key={p.title}
                onClick={() => setActiveProject(p)}
                className="card text-left p-3 hover:shadow-md transition-shadow"
              >
                <div
                  className="grid place-items-center bg-[var(--card)] rounded-lg overflow-hidden"
                  style={{ height: "clamp(160px, 26vw, 240px)" }}
                >
                  <CoverImageThumb project={p} />
                </div>
                <div className="mt-3">
                  <div className="font-medium text-[color:var(--fg)] line-clamp-1">{p.title}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 4).map((s) => (
                      <span key={s} className="chip pastel-chip text-[11px]">{s}</span>
                    ))}
                    {p.stack.length > 4 && (
                      <span className="chip pastel-chip text-[11px]">+{p.stack.length - 4}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== Адаптивная обложка для героя ===== */
function CoverImageAdaptive({ project }: { project: Project }) {
  const url =
    ((project as any).images?.[0] as string | undefined) ??
    (project as any).image;

  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null); // w/h

  if (!url || failed) {
    return (
      <div
        className="grid place-items-center rounded-xl"
        style={{
          aspectRatio: "16/9",
          background:
            "repeating-conic-gradient(from 0deg, color-mix(in oklab, var(--card), black 5%) 0% 25%, color-mix(in oklab, var(--card), white 6%) 0% 50%)",
          opacity: 0.6,
        }}
      >
        <span className="text-xs">Нет изображения</span>
      </div>
    );
  }

  const maxH = "clamp(220px, 56vh, 720px)";
  const AR = ratio ? `${ratio}/1` : "16/9";

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        aspectRatio: AR,
        maxHeight: maxH,
        marginInline: "auto",
        background:
          "radial-gradient(1200px 500px at 50% 0%, color-mix(in oklab, var(--accent), transparent 92%), transparent), linear-gradient(180deg, color-mix(in oklab, var(--card), white 8%) 0%, color-mix(in oklab, var(--card), black 6%) 100%)",
        boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--fg), transparent 92%)",
      }}
    >
      {!loaded && (
        <div className="absolute inset-0 skeleton-soft" aria-hidden />
      )}

      <img
        src={url}
        alt="Обложка проекта"
        className="block w-full h-full object-contain select-none"
        draggable={false}
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          const img = e.currentTarget;
          setLoaded(true);
          if (img.naturalWidth && img.naturalHeight) {
            setRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
        onError={() => setFailed(true)}
        style={{
          padding: "clamp(8px, 2vw, 16px)",
          filter: "drop-shadow(0 4px 24px color-mix(in oklab, var(--shadow, #000), transparent 85%))",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklab, var(--border), transparent 0%), inset 0 20px 40px -20px color-mix(in oklab, var(--fg), transparent 92%)",
        }}
      />
    </div>
  );
}

/* ===== Компактный превью для нижнего списка ===== */
function CoverImageThumb({ project }: { project: Project }) {
  const cover =
    ((project as any).images?.[0] as string | undefined) ??
    (project as any).image;

  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!cover || failed) {
    return (
      <div className="w-full h-full grid place-items-center text-xs opacity-60">
        Нет изображения
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!loaded && <div className="absolute inset-0 skeleton-soft rounded-lg" aria-hidden />}
      <img
        src={cover}
        alt="Превью проекта"
        className="max-w-full max-h-full w-auto h-auto object-contain block mx-auto"
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
