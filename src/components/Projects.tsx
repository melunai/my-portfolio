import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { DATA, type Project } from "../data";
import ProjectModal from "./ProjectModal";

/**
 * Верх: горизонтальная «герой»-полка (по центру крупный, края видны)
 * Низ: минималистичный список всех проектов с фильтром по стеку
 * Обложки показываются аккуратно (object-contain) + скелетон, портреты и альбомные выглядят красиво.
 */

const GAP_PX = 20;
const SIDE_SCALE = 0.86;
const SIDE_FADE = 0.55;

export default function Projects() {
  const projects = DATA.projects;
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // фильтр для общего списка
  const [filter, setFilter] = useState<string | null>(null);

  const slideWidthPct = useResponsiveSlideWidth();

  const { tags, counts } = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    const tags = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));
    return { tags, counts };
  }, [projects]);

  // управление полкой
  const prev = () => setActiveIdx((i) => (i - 1 + projects.length) % projects.length);
  const next = () => setActiveIdx((i) => (i + 1) % projects.length);

  // центрирование активной карточки
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;

    const vpWidth = vp.clientWidth;
    const cardWidth = Math.round((vpWidth * slideWidthPct) / 100);
    const offsetX = activeIdx * (cardWidth + GAP_PX);

    const targetScrollLeft = offsetX - (vpWidth - cardWidth) / 2;
    vp.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
  }, [activeIdx, slideWidthPct]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.deltaY > 10) next();
      else if (e.deltaY < -10) prev();
    };
    vp.addEventListener("wheel", onWheel, { passive: true });
    return () => vp.removeEventListener("wheel", onWheel);
  }, []);

  // отфильтрованная лента для нижнего списка
  const filtered = useMemo(
    () => (!filter ? projects : projects.filter((p) => p.stack.includes(filter))),
    [projects, filter]
  );

  return (
    <section id="projects" className="scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Проекты</h2>
        <p className="mt-2 text-sm opacity-80">
          Наверху — «герой»-слайдер с крупной карточкой по центру. Внизу — минималистичный список со стек-фильтром.
        </p>
      </div>

      {/* ===== Горизонтальная полка ===== */}
      <ScrollArea.Root type="always" className="relative">
        <ScrollArea.Viewport
          ref={viewportRef}
          className="w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ paddingBottom: 8 }}
        >
          <div ref={trackRef} className="flex items-stretch" style={{ gap: GAP_PX, padding: "2px 6px" }}>
            {projects.map((p, idx) => {
              const isActive = idx === activeIdx;
              return (
                <SlideCard
                  key={p.title}
                  project={p}
                  isActive={isActive}
                  widthPct={slideWidthPct}
                  onOpen={() => setActiveProject(p)}
                  onClick={() => setActiveIdx(idx)}
                />
              );
            })}
          </div>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="horizontal" className="h-2 mt-2">
          <ScrollArea.Thumb
            className="h-full rounded-[4px]"
            style={{
              background: "linear-gradient(90deg, var(--ribbon-sheen-start), var(--accent), var(--ribbon-sheen-end))",
              opacity: 0.45,
            }}
          />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>

      {/* Точки + стрелки */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button type="button" onClick={prev} className="btn px-3 py-1.5" aria-label="Предыдущий проект">←</button>
        <RadioGroup.Root
          className="inline-flex items-center gap-2"
          value={String(activeIdx)}
          onValueChange={(v) => setActiveIdx(Number(v))}
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
        <button type="button" onClick={next} className="btn px-3 py-1.5" aria-label="Следующий проект">→</button>
      </div>

      {/* Модалка */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />

      {/* ===== Минималистичный список снизу ===== */}
      <div className="mt-10">
        {/* Фильтр */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter(null)}
            className={`btn-filter ${!filter ? "is-active" : ""}`}
            aria-pressed={!filter}
          >
            Все <span className="filter-badge">{projects.length}</span>
          </button>
          {tags.map((t) => {
            const isActive = filter === t;
            return (
              <button
                key={t}
                onClick={() => setFilter(isActive ? null : t)}
                className={`btn-filter ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
              >
                {t} <span className="filter-badge">{counts.get(t)}</span>
              </button>
            );
          })}
        </div>

        {/* Список (минимал) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <button
              key={`mini-${p.title}`}
              onClick={() => setActiveProject(p)}
              className="card text-left p-3 hover:shadow-md transition-shadow"
            >
              {/* Адаптивная высота превью: 160–240px в зависимости от ширины экрана */}
              <div
                className="grid place-items-center bg-[var(--card)] rounded-lg overflow-hidden"
                style={{ height: "clamp(160px, 26vw, 240px)" }}
              >
                <CoverImage project={p} className="max-h-[240px]" />
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
    </section>
  );
}

/* ===== Обложка с мягким скелетоном и аккуратным fit ===== */
function CoverImage({ project, className = "" }: { project: Project; className?: string }) {
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
        alt="Обложка проекта"
        className={`max-w-full max-h-full w-auto h-auto object-contain block mx-auto ${className}`}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/* ===== Карточка-слайд для верхней полки ===== */
function SlideCard({
  project,
  isActive,
  widthPct,
  onOpen,
  onClick,
}: {
  project: Project;
  isActive: boolean;
  widthPct: number;
  onOpen: () => void;
  onClick: () => void;
}) {
  return (
    <motion.article
      layout
      onClick={onClick}
      className="relative cursor-pointer select-none"
      style={{ flex: `0 0 ${widthPct}%`, borderRadius: 16 }}
      initial={false}
      animate={{
        scale: isActive ? 1 : SIDE_SCALE,
        opacity: isActive ? 1 : SIDE_FADE,
        filter: isActive ? "none" : "saturate(.95)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
    >
      <div
        className="overflow-hidden card relative h-full group"
        style={{ borderRadius: 16, minHeight: 340 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {/* Обложка: центр, без обрезки; адаптивная высота 200–320px */}
        <div className="w-full bg-[var(--card)]">
          <div className="grid place-items-center overflow-hidden" style={{ height: "clamp(200px, 40vh, 320px)" }}>
            <CoverImage project={project} className="max-h-[320px]" />
          </div>
        </div>

        {/* Контент */}
        <div className="p-4 md:p-5 relative z-[2]">
          <h3 className="font-semibold text-[color:var(--fg)] line-clamp-1">{project.title}</h3>
          <p className="mt-1 text-sm opacity-80 line-clamp-2">{project.description}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((s) => (
              <span key={s} className="chip pastel-chip text-xs">{s}</span>
            ))}
            {project.stack.length > 6 && (
              <span className="chip pastel-chip text-xs">+{project.stack.length - 6}</span>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary"
                onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
              >
                Код
              </a>
            )}
            <button
              type="button"
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            >
              Подробнее
            </button>
          </div>
        </div>

        {/* Розовый silky-hover поверх */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-85"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--accent), white 25%) 0%, transparent 40%, transparent 60%, color-mix(in oklab, var(--accent), black 10%) 100%)",
          }}
        />
      </div>
    </motion.article>
  );
}

/* ===== адаптивная ширина карточки ===== */
function useResponsiveSlideWidth() {
  const [pct, setPct] = useState(72);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 420) setPct(90);
      else if (w < 640) setPct(86);
      else if (w < 920) setPct(80);
      else setPct(72);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return pct;
}
