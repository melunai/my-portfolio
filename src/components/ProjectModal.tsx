// src/components/ProjectModal.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "../data";

type Props = {
  project: Project | null;
  onClose: () => void;
};

type FillMode = "contain" | "cover";

/* ---------- EXIF ORIENTATION (для корректного поворота JPEG) ---------- */
/** Быстрый парсер только Orientation (0x0112) из EXIF у JPEG. Возвращает 1,3,6,8 или null. */
async function getExifOrientation(url: string): Promise<1 | 3 | 6 | 8 | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    const head = await blob.slice(0, 128 * 1024).arrayBuffer();
    const view = new DataView(head);

    // JPEG SOI
    if (view.getUint16(0, false) !== 0xffd8) return null;

    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      const marker = view.getUint16(offset, false);
      offset += 2;
      if ((marker & 0xff00) !== 0xff00) break;
      const size = view.getUint16(offset, false);
      if (size < 2) break;
      if (marker === 0xffe1 /* APP1 */) {
        const exifStart = offset + 2;
        const exifHeader = new Uint8Array(head, exifStart, 6);
        const isExif =
          exifHeader[0] === 0x45 &&
          exifHeader[1] === 0x78 &&
          exifHeader[2] === 0x69 &&
          exifHeader[3] === 0x66 &&
          exifHeader[4] === 0x00 &&
          exifHeader[5] === 0x00;
        if (!isExif) break;

        const tiffOffset = exifStart + 6;
        const little = view.getUint16(tiffOffset, false) === 0x4949;
        const get16 = (off: number) => view.getUint16(off, little);
        const get32 = (off: number) => view.getUint32(off, little);

        const ifd0 = tiffOffset + get32(tiffOffset + 4);
        const entries = get16(ifd0);
        for (let i = 0; i < entries; i++) {
          const entry = ifd0 + 2 + i * 12;
          const tag = get16(entry);
          if (tag === 0x0112 /* Orientation */) {
            const val = get16(entry + 8);
            if (val === 1 || val === 3 || val === 6 || val === 8) return val as 1 | 3 | 6 | 8;
            return null;
          }
        }
        break;
      } else {
        offset += size;
      }
    }
  } catch {}
  return null;
}

/** CSS-трансформация под EXIF (минимальный набор 1/3/6/8). */
function transformForEXIF(orientation: 1 | 3 | 6 | 8 | null) {
  switch (orientation) {
    case 3:
      return "rotate(180deg)";
    case 6:
      return "rotate(90deg)";
    case 8:
      return "rotate(-90deg)";
    default:
      return "none";
  }
}

/* ---------- ЛЕНИВАЯ КАРТИНКА ---------- */
function LazyImg(props: React.ImgHTMLAttributes<HTMLImageElement> & { realSrc: string }) {
  const { realSrc, ...rest } = props;
  const [src, setSrc] = useState<string | null>(null);
  const holderRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    const el = holderRef.current;
    if (!el) return;

    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setSrc(realSrc || null);
              io?.disconnect();
            }
          });
        },
        { rootMargin: "200px" }
      );
      io.observe(el);
    } else {
      setSrc(realSrc || null);
    }

    return () => io?.disconnect();
  }, [realSrc]);

  // если src ещё нет — отрисуем только <img> без src (или skeleton)
  if (!src) {
    return <img ref={holderRef} {...rest} src={undefined} alt="" aria-hidden />;
  }

  // иначе нормальный тег с src
  return <img ref={holderRef} src={src} {...rest} />;
}


/* ======================================================= */
export default function ProjectModal({ project, onClose }: Props) {
  const open = Boolean(project);

  // Список изображений (поддержка image / images)
  const images = useMemo(() => {
    if (!project) return [] as string[];
    const list = (project as any).images as string[] | undefined;
    const single = (project as any).image as string | undefined;
    const arr = Array.isArray(list) && list.length ? list : single ? [single] : [];
    return Array.from(new Set(arr.filter(Boolean)));
  }, [project]);

  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [fillMode, setFillMode] = useState<FillMode>("contain"); // «безрамочный» режим: cover
  const [exifMap, setExifMap] = useState<Record<string, 1 | 3 | 6 | 8 | null>>({});

  // Сброс при смене проекта
  useEffect(() => {
    setIdx(0);
    setLightbox(false);
  }, [project]);

  // Клавиатура: Esc / ← / →
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

  // Свайпы
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

  // Предзагрузка соседних кадров
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

  // При показе текущего src — читаем EXIF (чтобы правильно повернуть JPEG)
  useEffect(() => {
    const src = images[idx];
    if (!src) return;
    if (exifMap[src] !== undefined) return;
    let alive = true;
    getExifOrientation(src).then((o) => {
      if (!alive) return;
      setExifMap((m) => ({ ...m, [src]: o }));
    });
    return () => {
      alive = false;
    };
  }, [images, idx, exifMap]);

  if (!open || !project) return null;

  const currSrc = images[idx];
  const exif = exifMap[currSrc] ?? null;
  const rotation = transformForEXIF(exif);

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
          className="absolute left-1/2 top-1/2 w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2
                     rounded-2xl bg-[var(--elevated)] border border-[var(--border)] shadow-xl overflow-hidden"
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
              {/* Переключатель режима заполнения */}
              <button
                onClick={() => setFillMode((m) => (m === "contain" ? "cover" : "contain"))}
                className="btn"
                title="Переключить режим кадрирования"
                aria-pressed={fillMode === "cover"}
              >
                {fillMode === "cover" ? "Безрамочный: вкл." : "Безрамочный: выкл."}
              </button>

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
            {/* Галерея с фиксированной высотой */}
            <div className="md:col-span-2 relative bg-[var(--card)]">
              <div
                className="relative grid place-items-center h-[70vh] select-none"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {images.length ? (
                  <LazyImg
                    key={currSrc}
                    realSrc={currSrc}
                    alt={`${project.title} — фото ${idx + 1}/${images.length}`}
                    className={[
                      "max-h-full max-w-full w-auto h-auto transition-transform duration-300 cursor-zoom-in",
                      fillMode === "cover" ? "w-full h-full object-cover" : "object-contain",
                    ].join(" ")}
                    style={{ transform: rotation }}
                    onClick={() => setLightbox(true)}
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

              {/* Миниатюры (ленивая загрузка) */}
              {images.length > 1 && (
                <div className="px-3 py-2 border-t border-[var(--border)]">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((src, i) => {
                      const miniExif = exifMap[src] ?? null;
                      const miniRotation = transformForEXIF(miniExif);
                      return (
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
                          <LazyImg
                            realSrc={src}
                            alt=""
                            decoding="async"
                            className="w-full h-full object-cover"
                            style={{ transform: miniRotation }}
                            onLoad={() => {
                              if (exifMap[src] === undefined) {
                                getExifOrientation(src).then((o) =>
                                  setExifMap((m) => ({ ...m, [src]: o }))
                                );
                              }
                            }}
                          />
                        </button>
                      );
                    })}
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
          <LazyImg
            realSrc={currSrc}
            alt="Полный размер"
            className={[
              "max-w-[95vw] max-h-[90vh] object-contain cursor-zoom-out transition-transform duration-300",
              fillMode === "cover" ? "object-cover" : "object-contain",
            ].join(" ")}
            style={{ transform: rotation }}
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
