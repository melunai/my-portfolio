import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "../data";

type Props = {
  project: Project | null;
  onClose: () => void;
};

type Orientation = "portrait" | "landscape" | "square";

export default function ProjectModal({ project, onClose }: Props) {
  const open = Boolean(project);

  // собираем список изображений
  const images = useMemo(() => {
    if (!project) return [] as string[];
    const list = (project as any).images as string[] | undefined;
    const single = (project as any).image as string | undefined;
    const arr = Array.isArray(list) && list.length ? list : single ? [single] : [];
    return Array.from(new Set(arr.filter(Boolean)));
  }, [project]);

  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>("landscape");

  useEffect(() => {
    setIdx(0);
    setLightbox(false);
  }, [project]);

  // клавиши: Esc/←/→ (Esc закрывает лайтбокс или модалку)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(false);
        else onClose();
      }
      if (images.length > 1) {
        if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
        if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lightbox, images.length, onClose]);

  // свайпы
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null || images.length <= 1) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setIdx((i) => (i + 1) % images.length);
      else setIdx((i) => (i - 1 + images.length) % images.length);
    }
    startX.current = null;
  };

  // определяем ориентацию текущего кадра
  const handleImgLoad = (img: HTMLImageElement | null) => {
    if (!img) return;
    const { naturalWidth: w, naturalHeight: h } = img;
    if (!w || !h) return;
    const ratio = w / h;
    if (Math.abs(ratio - 1) < 0.06) setOrientation("square");
    else if (ratio < 1) setOrientation("portrait");
    else setOrientation("landscape");
  };

  // предзагрузка соседних кадров
  useEffect(() => {
    if (images.length <= 1) return;
    const preload = (src: string) => {
      const im = new Image();
      im.decoding = "async";
      im.loading = "eager";
      im.src = src;
    };
    preload(images[(idx + 1) % images.length]!);
    preload(images[(idx - 1 + images.length) % images.length]!);
  }, [idx, images]);

  if (!open || !project) return null;

  // высота превью по ориентации кадра
  const galleryHeightClass =
    orientation === "portrait"
      ? "h-[68vh] md:h-[78vh]"
      : orientation === "square"
      ? "h-[60vh] md:h-[72vh]"
      : "h-[52vh] md:h-[70vh]";

  return (
    <>
      {/* ==== Основная модалка ==== */}
      <div className="modal-portal fixed inset-0 z-[1000]">
        <button
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
          aria-label="Закрыть"
        />
        <div
          role="dialog"
          aria-modal="true"
          className="absolute left-1/2 top-1/2 w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--elevated)] border border-[var(--border)] shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--border)]">
            <div>
              <h3 className="text-lg font-semibold text-[color:var(--fg)]">{project.title}</h3>
              {project.description && (
                <p className="text-sm opacity-80 mt-0.5">{project.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
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
              <button onClick={onClose} className="btn" aria-label="Закрыть">
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-3 gap-0">
            {/* Галерея */}
            <div className="md:col-span-2 relative bg-[var(--card)]">
              {/* Центрируем, вписываем; высота зависит от ориентации */}
              <div
                className={`relative grid place-items-center ${galleryHeightClass} select-none`}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {images.length ? (
                  <img
                    src={images[idx]}
                    alt={`${project.title} — фото ${idx + 1}/${images.length}`}
                    className="max-h-full max-w-full w-auto h-auto object-contain cursor-zoom-in transition-transform duration-300"
                    onClick={() => setLightbox(true)}
                    onLoad={(e) => handleImgLoad(e.currentTarget)}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-sm opacity-70">
                    Нет изображений
                  </div>
                )}

                {/* Навигация по фото */}
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 btn px-3 py-1.5"
                      onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                      aria-label="Предыдущее фото"
                    >
                      ←
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 btn px-3 py-1.5"
                      onClick={() => setIdx((i) => (i + 1) % images.length)}
                      aria-label="Следующее фото"
                    >
                      →
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-full bg-black/40 text-white">
                      {idx + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Миниатюры */}
              {images.length > 1 && (
                <div className="px-3 py-2 border-t border-[var(--border)]">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        className="relative rounded-md overflow-hidden"
                        style={{
                          width: 80,
                          height: 52,
                          outline:
                            i === idx
                              ? "2px solid color-mix(in oklab, var(--accent), white 25%)"
                              : "1px solid var(--border)",
                        }}
                        onClick={() => setIdx(i)}
                        aria-label={`Показать фото ${i + 1}`}
                      >
                        <img
                          src={src}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Детали */}
            <div className="p-5 space-y-4">
              {project.stack?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Стек</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <span key={s} className="chip pastel-chip text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.highlights?.length ? (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Особенности</h4>
                  <ul className="list-disc pl-5 text-sm opacity-90 space-y-1">
                    {project.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {project.roles?.length ? (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Роль</h4>
                  <ul className="list-disc pl-5 text-sm opacity-90 space-y-1">
                    {project.roles.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {project.period && (
                <div className="text-sm opacity-80">
                  <span className="font-medium">Период:</span> {project.period}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==== Lightbox (полноразмер) ==== */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={() => setLightbox(false)}
        >
          <img
            src={images[idx]}
            alt="Полный размер"
            className="max-w-[95vw] max-h-[90vh] object-contain cursor-zoom-out transition-transform duration-300"
            loading="eager"
            decoding="async"
          />
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        .animate-fade-in { animation: fade-in .25s ease-out; }
      `}</style>
    </>
  );
}
