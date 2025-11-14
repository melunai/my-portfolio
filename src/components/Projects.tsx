// src/components/Projects.tsx
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { motion } from "framer-motion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { PROJECTS, type Project } from "../data";
import ProjectModal from "./ProjectModal";
import SectionLead from "./SectionLead";
import Section from "./Section";
import { useI18n } from "../i18n/i18n";

const GAP_PX = 28;
const SIDE_SCALE = 0.95;
const SIDE_FADE = 0.75;

export default function Projects() {
  const { t, lang } = useI18n();
  const projects = PROJECTS;
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  // ширина активной карточки в слайдере (уменьшили, было 70)
  const slideWidthPct = 62;

  const { tags, counts } = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) =>
      p.stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
    );
    const tags = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));
    return { tags, counts };
  }, [projects]);

  const prev = () =>
    setActiveIdx((i) => (i - 1 + projects.length) % projects.length);
  const next = () => setActiveIdx((i) => (i + 1) % projects.length);

  // вычисляем px ширину карточки в вьюпорте слайдера
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [cardPx, setCardPx] = useState(0);

  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const update = () =>
      setCardPx(Math.round((vp.clientWidth * slideWidthPct) / 100));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [slideWidthPct]);

  // центрируем активную
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !cardPx) return;
    const offsetX = activeIdx * (cardPx + GAP_PX);
    const targetScrollLeft = offsetX - (vp.clientWidth - cardPx) / 2;
    vp.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
  }, [activeIdx, cardPx]);

  // свайп на мобильных / планшете
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !cardPx) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let isHorizontalGesture = false;
    let hasDirection = false;

    const slideFull = cardPx + GAP_PX;

    function onTouchStart(e: TouchEvent) {
      const vp = viewportRef.current;
      if (!vp) return;
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      isDragging = true;
      hasDirection = false;
      isHorizontalGesture = false;
      startX = touch.clientX;
      startY = touch.clientY;
      startScrollLeft = vp.scrollLeft;
    }

    function onTouchMove(e: TouchEvent) {
      const vp = viewportRef.current;
      if (!vp) return;
      if (!isDragging) return;

      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (!hasDirection) {
        hasDirection = true;
        isHorizontalGesture = Math.abs(dx) > Math.abs(dy);
      }

      // если жест вертикальный — даём странице скроллиться
      if (!isHorizontalGesture) return;

      e.preventDefault();
      vp.scrollLeft = startScrollLeft - dx;
    }

    function onTouchEnd() {
      const vp = viewportRef.current;
      if (!vp) return;
      if (!isDragging) return;

      isDragging = false;

      if (!isHorizontalGesture) return;

      const rawIndex = vp.scrollLeft / slideFull;
      const nearestIndex = Math.min(
        projects.length - 1,
        Math.max(0, Math.round(rawIndex))
      );
      setActiveIdx(nearestIndex);
    }

    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("touchend", onTouchEnd);
    viewport.addEventListener("touchcancel", onTouchEnd);

    return () => {
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [cardPx, projects.length]);

  const filtered = useMemo(
    () =>
      !filter
        ? projects
        : projects.filter((p) => p.stack.includes(filter)),
    [projects, filter]
  );

  // ====== анимационные задержки ======
  const LEAD_DELAY = 0.35;
  const BODY_DELAY = 0.7;

  return (
    <Section id="projects" title={t("sections.projects.title")}>
      {/* Подзаголовок */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          duration: 0.5,
          delay: LEAD_DELAY,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mb-6"
      >
        <SectionLead>{t("sections.projects.lead")}</SectionLead>
      </motion.div>

      {/* Основная часть */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          duration: 0.55,
          delay: BODY_DELAY,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* ===== Горизонтальная полка (Responsive News Card Slider) ===== */}
        <ScrollArea.Root type="always" className="relative">
          <ScrollArea.Viewport
            ref={viewportRef}
            className="w-full overflow-x-hidden"
            style={{ paddingBottom: 8 }}
            aria-label={t("sections.projects.sliderAria") || "Полка с проектами"}
          >
            <div
              className="flex flex-nowrap items-stretch justify-center"
              style={{ gap: GAP_PX, padding: "2px 6px" }}
            >
              {projects.map((p, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <SlideCard
                    key={`${p.title[lang]}-${idx}`}
                    project={p}
                    isActive={isActive}
                    cardPx={cardPx}
                    onOpen={() => setActiveProject(p)}
                    onClick={() => setActiveIdx(idx)}
                    lang={lang}
                    t={t}
                  />
                );
              })}
            </div>
          </ScrollArea.Viewport>
        </ScrollArea.Root>

        {/* Точки + стрелки */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={prev}
            className="btn px-3 py-1.5"
            aria-label={t("sections.projects.prev") || "Предыдущий проект"}
          >
            ←
          </button>
          <RadioGroup.Root
            className="inline-flex items-center gap-2"
            value={String(activeIdx)}
            onValueChange={(v) => setActiveIdx(Number(v))}
            aria-label={t("sections.projects.dotsAria") || "Навигация по проектам"}
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
                aria-label={`${t("sections.projects.toProject") || "К проекту"} ${
                  idx + 1
                }`}
              />
            ))}
          </RadioGroup.Root>
          <button
            type="button"
            onClick={next}
            className="btn px-3 py-1.5"
            aria-label={t("sections.projects.next") || "Следующий проект"}
          >
            →
          </button>
        </div>

        {/* Модалка */}
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />

        {/* ===== Мини-карточки снизу ===== */}
        <div className="mt-10">
          {/* Фильтры */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`btn-filter ${!filter ? "is-active" : ""}`}
              aria-pressed={!filter}
            >
              {t("sections.projects.filters.all") || "Все"}{" "}
              <span className="filter-badge">
                {projects.length}
              </span>
            </button>
            {tags.map((tag) => {
              const isActive = filter === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setFilter(isActive ? null : tag)}
                  className={`btn-filter ${isActive ? "is-active" : ""}`}
                  aria-pressed={isActive}
                >
                  {tag}{" "}
                  <span className="filter-badge">
                    {counts.get(tag)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Сетка мини-карточек */}
          <div
            className="
              grid gap-4 sm:grid-cols-2 lg:grid-cols-3
              [--mini-minh:260px] md:[--mini-minh:280px]
            "
          >
            {filtered.map((p, idx) => (
              <button
                key={`mini-${idx}-${p.title.ru}`}
                onClick={() => setActiveProject(p)}
                className="
                  card text-left overflow-hidden transition-shadow hover:shadow-md
                  rounded-2xl
                "
                style={{ minHeight: "var(--mini-minh)" }}
                aria-label={`${t("sections.projects.openProject") || "Открыть проект"} ${
                  p.title[lang]
                }`}
              >
                <div className="h-full flex flex-col">
                  {/* Обложка */}
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="relative aspect-[16/10] w-full bg-[var(--card)] overflow-hidden">
                      <CoverImage
                        project={p as ProjectWithFocus}
                        mode="auto"
                      />
                    </div>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
                      style={{
                        background:
                          "linear-gradient(0deg, color-mix(in oklab, var(--accent), black 12%) 0%, transparent 100%)",
                        opacity: 0.12,
                      }}
                    />
                  </div>

                  {/* Текстовый блок */}
                  <div className="flex flex-col grow p-4 md:p-5">
                    <div className="font-medium text-[color:var(--fg)] line-clamp-1 text-base">
                      {p.title[lang]}
                    </div>
                    <p className="mt-1 text-sm opacity-80 line-clamp-2">
                      {p.description[lang]}
                    </p>

                    <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
                      {p.stack.slice(0, 6).map((s) => (
                        <span
                          key={s}
                          className="chip pastel-chip text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                      {p.stack.length > 6 && (
                        <span className="chip pastel-chip text-[11px]">
                          +{p.stack.length - 6}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

/* ===== Тип с необязательной фокус-точкой ===== */
type ProjectWithFocus = Project & { coverFocus?: [number, number] };

/* ===== CoverImage ===== */
function CoverImage({
  project,
  className = "",
  mode = "auto", // "auto" | "contain" | "cover"
}: {
  project: ProjectWithFocus;
  className?: string;
  mode?: "auto" | "contain" | "cover";
}) {
  const cover =
    ((project as any).images?.[0] as string | undefined) ??
    (project as any).image;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(
    null
  );

  const [fx, fy] = project.coverFocus ?? [50, 50];

  if (!cover || failed) {
    return (
      <div className="absolute inset-0 grid place-items-center text-xs opacity-60">
        Нет изображения
      </div>
    );
  }

  const isPortrait = natural
    ? natural.h >= natural.w * 1.05
    : false;
  const effectiveFit =
    mode === "auto"
      ? isPortrait
        ? "contain"
        : "cover"
      : mode;

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!loaded && (
        <div
          className="absolute inset-0 skeleton-soft rounded-lg"
          aria-hidden
        />
      )}
      <img
        src={cover}
        alt="Обложка проекта"
        className="absolute inset-0 w-full h-full block"
        style={{
          objectFit: effectiveFit as any,
          objectPosition: `${fx}% ${fy}%`,
        }}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={(e) => {
          const img = e.currentTarget;
          setNatural({
            w: img.naturalWidth,
            h: img.naturalHeight,
          });
          setLoaded(true);
        }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/* ===== SlideCard (верхний слайдер в стиле news card slider) ===== */
function SlideCard({
  project,
  isActive,
  cardPx,
  onOpen,
  onClick,
  lang,
  t,
}: {
  project: Project;
  isActive: boolean;
  cardPx: number;
  onOpen: () => void;
  onClick: () => void;
  lang: "ru" | "en";
  t: (key: string) => string;
}) {
  const primaryTag = project.stack[0];

  return (
    <motion.article
      layout
      onClick={onClick}
      className="relative cursor-pointer select-none"
      style={{
        flex: "0 0 auto",
        width: cardPx ? `${cardPx}px` : undefined,
        borderRadius: 24,
        scrollSnapAlign: "center",
      }}
      initial={false}
      animate={{
        scale: isActive ? 1 : SIDE_SCALE,
        opacity: isActive ? 1 : SIDE_FADE,
        filter: isActive ? "none" : "saturate(.95)",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      whileHover={{
        // без подъёма, чтобы не вылезать вверх
        y: 0,
        // максимум тот же масштаб, что и в "animate"
        scale: isActive ? 1 : SIDE_SCALE,
        transition: { duration: 0.18 },
      }}
    >
      <div
        className="
          group relative h-full overflow-hidden rounded-[24px]
          bg-[var(--card)] border border-[var(--glass-border)]
          shadow-[0_18px_38px_-24px_var(--decor-glow)]
          transition-all duration-300
        "
        onDoubleClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {/* Картинка + лейбл (как в news card) */}
        <div className="relative overflow-hidden">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <CoverImage
              project={project as ProjectWithFocus}
              mode="auto"
              className="transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>

          {primaryTag && (
            <div
              className="
                absolute left-3 top-3 z-10 inline-flex items-center gap-1
                rounded-full px-3 py-1 text-xs font-medium
                bg-black/55 text-white backdrop-blur-sm
              "
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span>{primaryTag}</span>
            </div>
          )}

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.05) 52%, transparent 80%)",
              opacity: 0.8,
            }}
          />
        </div>

        <div
          className="
            relative z-[2] px-4 pt-4 pb-4 md:px-5 md:pt-5 md:pb-5
            flex flex-col h-full
          "
        >
          <div className="space-y-1.5">
            <h3
              className="
                text-base md:text-[1.05rem] font-semibold leading-snug
                text-[color:var(--fg)]
                line-clamp-2
                transition-colors duration-200
                group-hover:text-[var(--accent)]
              "
            >
              {project.title[lang]}
            </h3>
            <p
              className="
                text-sm text-[color:var(--text-muted)]
                leading-relaxed line-clamp-3
                transition-all duration-300
                group-hover:line-clamp-4
              "
            >
              {project.description[lang]}
            </p>
          </div>

          {!!project.stack.length && (
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              {project.stack.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="
                    chip pastel-chip
                    text-[11px] px-2 py-1
                    bg-[color-mix(in_oklab,var(--chip-bg),white_6%)]
                  "
                >
                  {s}
                </span>
              ))}
              {project.stack.length > 4 && (
                <span className="chip pastel-chip text-[11px] px-2 py-1">
                  +{project.stack.length - 4}
                </span>
              )}
            </div>
          )}

          <div
            className="
              mt-4 flex flex-wrap gap-2
              transition-transform duration-300
              group-hover:translate-y-[-2px]
            "
          >
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary text-xs md:text-sm px-3 py-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                {t("common.btn.demo")}
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn text-xs md:text-sm px-3 py-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                {t("common.btn.code")}
              </a>
            )}
            <button
              type="button"
              className="btn text-xs md:text-sm px-3 py-1.5"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            >
              {t("common.btn.more")}
            </button>
          </div>
        </div>

        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-0 rounded-[24px]
            opacity-0 group-hover:opacity-100
            transition-opacity duration-400
          "
          style={{
            boxShadow:
              "0 0 0 1px color-mix(in oklab, var(--accent) 35%, transparent), 0 24px 48px -28px var(--decor-glow)",
          }}
        />
      </div>
    </motion.article>
  );
}
