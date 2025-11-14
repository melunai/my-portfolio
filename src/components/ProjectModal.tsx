// src/components/ProjectModal.tsx
import
  React,
  {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ImgHTMLAttributes,
  }
from "react";
import type { Project } from "../data";
import { useI18n } from "../i18n/i18n";

type Props = {
  project: Project | null;
  onClose: () => void;
};

type FillMode = "contain" | "cover";

/* ---------- EXIF ORIENTATION ---------- */
async function getExifOrientation(url: string): Promise<1 | 3 | 6 | 8 | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    const head = await blob.slice(0, 128 * 1024).arrayBuffer();
    const view = new DataView(head);

    if (view.getUint16(0, false) !== 0xffd8) return null;

    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      const marker = view.getUint16(offset, false);
      offset += 2;
      if ((marker & 0xff00) !== 0xff00) break;
      const size = view.getUint16(offset, false);
      if (size < 2) break;
      if (marker === 0xffe1) {
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
          if (tag === 0x0112) {
            const val = get16(entry + 8);
            if (val === 1 || val === 3 || val === 6 || val === 8) {
              return val as 1 | 3 | 6 | 8;
            }
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
function LazyImg(
  props: ImgHTMLAttributes<HTMLImageElement> & { realSrc: string }
) {
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

  if (!src) {
    return (
      <img
        ref={holderRef}
        {...rest}
        src={undefined}
        alt=""
        aria-hidden
      />
    );
  }

  return <img ref={holderRef} src={src} {...rest} />;
}

/* ---------- Утилита для локализованных строк ---------- */
function pickText(value: any, lang: "ru" | "en"): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const v = value as { ru?: string; en?: string };
    return (lang === "en" ? v.en : v.ru) ?? v.ru ?? v.en ?? "";
  }
  return String(value);
}

/* ======================================================= */
export default function ProjectModal({ project, onClose }: Props) {
  const { t, lang } = useI18n();
  const open = Boolean(project);

  const images = useMemo(() => {
    if (!project) return [] as string[];
    const list = (project as any).images as string[] | undefined;
    const single = (project as any).image as string | undefined;
    const arr =
      Array.isArray(list) && list.length
        ? list
        : single
        ? [single]
        : [];
    return Array.from(new Set(arr.filter(Boolean)));
  }, [project]);

  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [fillMode, setFillMode] = useState<FillMode>("contain");
  const [exifMap, setExifMap] = useState<
    Record<string, 1 | 3 | 6 | 8 | null>
  >({});

  // сброс при смене проекта
  useEffect(() => {
    setIdx(0);
    setLightbox(false);
  }, [project]);

  // клавиатура
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(false);
        else onClose();
      }
      if (images.length > 1) {
        if (e.key === "ArrowRight") {
          setIdx((i) => (i + 1) % images.length);
        }
        if (e.key === "ArrowLeft") {
          setIdx((i) => (i - 1 + images.length) % images.length);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lightbox, images.length, onClose]);

  // свайпы
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) =>
    (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null || images.length <= 1) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setIdx((i) => (i + 1) % images.length);
      else setIdx((i) => (i - 1 + images.length) % images.length);
    }
    startX.current = null;
  };

  // предзагрузка соседних
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

  // EXIF
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

  const title = pickText(project.title as any, lang);
  const description = pickText(project.description as any, lang);
  const highlights = (project.highlights ?? []).map((h) =>
    pickText(h as any, lang)
  );
  const roles = (project.roles ?? []).map((r) =>
    pickText(r as any, lang)
  );

  const prevPhotoLabel =
    lang === "ru" ? "Предыдущее фото" : "Previous photo";
  const nextPhotoLabel =
    lang === "ru" ? "Следующее фото" : "Next photo";
  const noImagesText =
    lang === "ru" ? "Нет изображений" : "No images";
  const stackTitle = lang === "ru" ? "Стек" : "Tech stack";
  const highlightsTitle =
    lang === "ru" ? "Особенности" : "Highlights";
  const rolesTitle = lang === "ru" ? "Роль" : "Role";
  const periodTitle = lang === "ru" ? "Период" : "Period";
  const cropOn =
    lang === "ru" ? "Безрамочный: вкл." : "Edge-to-edge: on";
  const cropOff =
    lang === "ru" ? "Безрамочный: выкл." : "Edge-to-edge: off";
  const closeLabel = lang === "ru" ? "Закрыть" : "Close";

  return (
    <>
      {/* Весь слой: фон + скролл модалки поверх Header */}
      <div className="fixed inset-0 z-[9999]">
        {/* фон-кнопка */}
        <button
          className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          onClick={onClose}
          aria-label={closeLabel}
        />

        {/* контейнер для модалки: скроллится целиком, прижат к верху на мобиле */}
        <div className="relative z-[1] h-full overflow-y-auto">
          <div
            className="
              min-h-full flex justify-center
              items-start md:items-center
              px-2 sm:px-4
              pt-[72px] md:pt-8 pb-6
            "
          >
            <div
              role="dialog"
              aria-modal="true"
              className="
                w-full max-w-5xl
                rounded-2xl bg-[var(--elevated)] border border-[var(--border)]
                shadow-xl overflow-hidden flex flex-col
                max-h-[calc(100vh-96px)]
              "
            >
              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3 border-b border-[var(--border)]">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-[color:var(--fg)] line-clamp-2">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-xs sm:text-sm opacity-80 mt-0.5 line-clamp-3">
                      {description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-end">
                  {images.length > 0 && (
                    <button
                      onClick={() =>
                        setFillMode((m) =>
                          m === "contain" ? "cover" : "contain"
                        )
                      }
                      className="btn px-2 py-1 text-xs sm:text-sm"
                      title={
                        lang === "ru"
                          ? "Переключить режим кадрирования"
                          : "Toggle cropping mode"
                      }
                      aria-pressed={fillMode === "cover"}
                    >
                      {fillMode === "cover" ? cropOn : cropOff}
                    </button>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-primary px-2 sm:px-3 py-1 text-xs sm:text-sm"
                    >
                      {t("common.btn.demo")}
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn px-2 sm:px-3 py-1 text-xs sm:text-sm"
                    >
                      {t("common.btn.code")}
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="btn px-2 sm:px-3 py-1 text-xs sm:text-sm"
                    aria-label={closeLabel}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Контент со внутренним скроллом только при необходимости */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Галерея */}
                  <div className="md:col-span-2 relative bg-[var(--card)]">
                    <div
                      className="
                        relative w-full select-none
                      "
                      style={{
                        aspectRatio: "16 / 9",
                        maxHeight: "min(70vh, 480px)",
                      }}
                      onTouchStart={onTouchStart}
                      onTouchEnd={onTouchEnd}
                    >
                      {images.length ? (
                        <LazyImg
                          key={currSrc}
                          realSrc={currSrc}
                          alt={
                            images.length > 1
                              ? `${title} — ${idx + 1}/${images.length}`
                              : title
                          }
                          className="absolute inset-0 w-full h-full cursor-zoom-in transition-transform duration-300"
                          style={{
                            objectFit:
                              fillMode === "cover"
                                ? "cover"
                                : "contain",
                            transform: rotation,
                          }}
                          onClick={() => setLightbox(true)}
                          decoding="async"
                          draggable={false}
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-sm opacity-70 px-4 text-center">
                          {noImagesText}
                        </div>
                      )}

                      {images.length > 1 && (
                        <>
                          <button
                            className="absolute left-2 top-1/2 -translate-y-1/2 btn px-3 py-2 text-sm"
                            onClick={() =>
                              setIdx(
                                (i) =>
                                  (i - 1 + images.length) %
                                  images.length
                              )
                            }
                            aria-label={prevPhotoLabel}
                          >
                            ←
                          </button>
                          <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 btn px-3 py-2 text-sm"
                            onClick={() =>
                              setIdx(
                                (i) =>
                                  (i + 1) % images.length
                              )
                            }
                            aria-label={nextPhotoLabel}
                          >
                            →
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-full bg-black/40 text-white">
                            {idx + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Миниатюры — СЕТКА */}
                    {images.length > 1 && (
                      <div className="px-3 py-3 border-t border-[var(--border)]">
                        <div
                          className="grid gap-2
                                     grid-cols-4
                                     sm:grid-cols-6
                                     md:grid-cols-8"
                        >
                          {images.map((src, i) => {
                            const miniExif = exifMap[src] ?? null;
                            const miniRotation =
                              transformForEXIF(miniExif);
                            const isActive = i === idx;
                            return (
                              <button
                                key={src + i}
                                type="button"
                                className="relative rounded-md overflow-hidden"
                                style={{
                                  outline: isActive
                                    ? "2px solid color-mix(in oklab, var(--accent), white 25%)"
                                    : "1px solid var(--border)",
                                  transition:
                                    "outline-color .2s ease, transform .15s ease",
                                }}
                                onClick={() => setIdx(i)}
                                aria-label={
                                  lang === "ru"
                                    ? `Показать фото ${i + 1}`
                                    : `Show photo ${i + 1}`
                                }
                              >
                                <div className="w-full aspect-[16/10]">
                                  <LazyImg
                                    realSrc={src}
                                    alt=""
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                    style={{ transform: miniRotation }}
                                    onLoad={() => {
                                      if (
                                        exifMap[src] === undefined
                                      ) {
                                        getExifOrientation(src).then(
                                          (o) =>
                                            setExifMap((m) => ({
                                              ...m,
                                              [src]: o,
                                            }))
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Детали */}
                  <div className="p-4 sm:p-5 space-y-4 text-sm">
                    {project.stack?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          {stackTitle}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.stack.map((s) => (
                            <span
                              key={s}
                              className="chip pastel-chip text-xs"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {highlights.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          {highlightsTitle}
                        </h4>
                          <ul className="list-disc pl-5 text-sm opacity-90 space-y-1">
                          {highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {roles.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          {rolesTitle}
                        </h4>
                        <ul className="list-disc pl-5 text-sm opacity-90 space-y-1">
                          {roles.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.period && (
                      <div className="text-sm opacity-80">
                        <span className="font-medium">
                          {periodTitle}:
                        </span>{" "}
                        {project.period}
                      </div>
                    )}

                    <div className="h-2 sm:h-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightbox && currSrc && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={() => setLightbox(false)}
        >
          <LazyImg
            realSrc={currSrc}
            alt={title || "Full size"}
            className="cursor-zoom-out transition-transform duration-300"
            style={{
              maxWidth: "85vw",
              maxHeight: "75vh",
              objectFit: fillMode === "cover" ? "cover" : "contain",
              transform: rotation,
            }}
            decoding="async"
          />
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        .animate-fade-in { animation: fade-in .25s ease-out; }

        :root { --lb-scale: 1; }
        @media (max-width: 640px) {
          :root { --lb-scale: 0.92; }
        }
      `}</style>
    </>
  );
}
