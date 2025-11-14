import { useEffect, useMemo, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useI18n } from "../i18n/i18n";
import { DATA } from "../data";

type NavItem = { id: string; label: string };

const NAV: NavItem[] = [
  { id: "home", label: "common.nav.home" },
  { id: "projects", label: "common.nav.projects" },
  { id: "skills", label: "common.nav.skills" },
  { id: "workflow", label: "common.nav.workflow" },
  { id: "experience", label: "common.nav.experience" },
  { id: "testimonials", label: "common.nav.testimonials" },
  { id: "about", label: "common.nav.about" },
  { id: "contact", label: "common.nav.contact" },
];

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [atTop, setAtTop] = useState(true);
  const [scrollPct, setScrollPct] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);

  // --- вспомогательный расчёт активной секции (без IO) ---
  const computeActive = () => {
    const ids = NAV.map((n) => n.id);
    const vh = window.innerHeight;
    const center = vh / 2;

    let bestId = "home";
    let bestScore = -Infinity;

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      const mid = (r.top + r.bottom) / 2;
      const dist = Math.abs(mid - center);
      const score = visible - dist * 0.1; // «награда» за видимость, «штраф» за удаление от центра
      if (score > bestScore) {
        bestScore = score;
        bestId = id;
      }
    }
    setActive((prev) => (prev === bestId ? prev : bestId));
  };

  // прогресс и липкий стиль
  useEffect(() => {
    const onScroll = () => {
      setAtTop(window.scrollY < 8);
      const root = document.scrollingElement || document.documentElement;
      const max = (root.scrollHeight - root.clientHeight) || 0;
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0);
      if (window.scrollY < 4) setActive("home"); // страховка у самого верха
      computeActive(); // обновляем активную секцию на каждом скролле
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => computeActive();
    window.addEventListener("resize", onResize, { passive: true } as any);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize as any);
    };
  }, []);

  // активная секция (перепривязка при ререндере/смене языка)
  const bindSections = () => {
    ioRef.current?.disconnect();
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    ioRef.current = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) {
          const id = (vis[0].target as HTMLElement).id;
          setActive((prev) => (prev === id ? prev : id));
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );
    sections.forEach((s) => ioRef.current!.observe(s));
    // сразу синхронизируем активную секцию (без ожидания событий)
    computeActive();
  };

  useEffect(() => {
    bindSections();
    return () => ioRef.current?.disconnect();
  }, []);

  // при смене языка DOM перерисовывается → перепривяжем наблюдатель и пересчитаем активную
  useEffect(() => {
    requestAnimationFrame(() => {
      bindSections();
      computeActive();
    });
  }, [lang]);

  // «магнитный» ховер ссылок
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const handleMagnet =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = linkRefs.current[id];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--x", (x * 8).toFixed(2) + "px");
      el.style.setProperty("--y", (y * 5).toFixed(2) + "px");
    };

  // плавный скролл к секции
  const handleNavClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    } else if (id === "home") {
      // если #home нет в DOM — просто прокручиваем к верху
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", "#home");
    }
    setOpen(false);
    requestAnimationFrame(() => computeActive());
  };

  // закрывать меню при смене hash извне
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  const nick = useMemo(() => DATA.nick || "me", []);
  const shortNick = nick.length > 14 ? nick.slice(0, 12) + "…" : nick;

  // 👉 сообщаем остальному приложению реальную высоту хедера
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("resize", apply, { passive: true } as any);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply as any);
    };
  }, []);

  // красивый и абсолютно «бездвижный» переключатель языка
  const toggleLang = () => {
    const next = lang === "ru" ? "en" : "ru";

    // фиксируем точные координаты, чтобы НЕ было перемещения
    const x = window.scrollX;
    const y = window.scrollY;

    // отключаем влияние плавной прокрутки и автопереноса
    try { (history as any).scrollRestoration = "manual"; } catch {}
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    // мягкий визуальный эффект (не влияет на позицию)
    html.classList.add("lang-switching");

    // меняем язык
    setLang(next);

    // обновляем только query ?lang= — hash НЕ трогаем вообще
    try {
      const sp = new URLSearchParams(location.search);
      sp.set("lang", next);
      history.replaceState(null, "", `${location.pathname}?${sp.toString()}${location.hash}`);
    } catch {}

    // восстанавливаем ровно те же координаты и пересчитываем активную ссылку
    requestAnimationFrame(() => {
      window.scrollTo(x, y); // ровно туда же
      html.style.scrollBehavior = prevScrollBehavior;
      computeActive();
      // снимаем мягкий эффект
      setTimeout(() => html.classList.remove("lang-switching"), 420);
    });
  };

  return (
    <>
      {/* прогресс-бар скролла */}
      <div
        id="header-progress"
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          width: `${scrollPct}%`,
          zIndex: 60,
          background:
            "linear-gradient(90deg, var(--ribbon-sheen-start), var(--accent), var(--ribbon-sheen-end))",
          boxShadow: "0 0 12px var(--ribbon-sheen-start)",
          transition: "width 120ms linear",
        }}
      />

      <header
        ref={headerRef}
        className={[
          "sticky top-0 z-50",
          atTop ? "backdrop-blur-0" : "backdrop-blur-md",
        ].join(" ")}
        aria-label="Основная навигация"
        style={{
          transition:
            "backdrop-filter 360ms ease, background-color 360ms ease, box-shadow 360ms ease",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between gap-3 py-3 md:py-4">
          {/* Лого = ник + сердечко */}
          <a
            href="#home"
            onClick={handleNavClick("home")}
            className="inline-flex items-center gap-2 rounded-2xl px-2 py-1 select-none"
            aria-label="Наверх"
            title={nick}
            onMouseMove={(e) => {
              const t = e.currentTarget as HTMLAnchorElement;
              const r = t.getBoundingClientRect();
              const x = (e.clientX - r.left) / r.width - 0.5;
              t.style.setProperty("--tilt", (x * 3).toFixed(2) + "deg");
            }}
            onMouseLeave={(e) =>
              (e.currentTarget as HTMLElement).style.removeProperty("--tilt")
            }
            style={{
              transform: "perspective(400px) rotateY(var(--tilt, 0deg))",
              transition: "transform 320ms ease",
            }}
          >
            <span
              aria-hidden
              className="text-xl md:text-2xl animate-kawaii-bob"
              style={{ filter: "drop-shadow(0 2px 8px var(--decor-glow))" }}
            >
              💗
            </span>
            <span className="font-semibold tracking-tight kawaii-gradient-text">
              {shortNick}
            </span>
          </a>

          {/* Навигация (desktop) */}
          <nav className="hidden md:flex items-center gap-1.5">
            {NAV.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  ref={(el) => {
                    linkRefs.current[item.id] = el;
                  }}
                  onClick={handleNavClick(item.id)}
                  className={[
                    "kawaii-link px-3 py-2 rounded-xl text-sm relative",
                    isActive ? "is-active" : "",
                  ].join(" ")}
                  onMouseMove={handleMagnet(item.id)}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.removeProperty("--x");
                    el.style.removeProperty("--y");
                  }}
                  style={{
                    transform:
                      "translate(var(--x, 0px), var(--y, 0px)) translateZ(0)",
                    transition:
                      "transform 200ms ease, color 220ms ease, background 220ms ease",
                  }}
                >
                  <span
                    className="absolute inset-0 -z-10 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--ribbon-sheen-start), transparent)",
                      opacity: isActive ? 0.16 : 0,
                      transition: "opacity 280ms ease",
                    }}
                    aria-hidden
                  />
                  {t(item.label)}
                </a>
              );
            })}
          </nav>

          {/* Кнопки справа */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLang}
              className="lang-toggle border border-[var(--chip-border)] bg-[var(--chip-bg)] hover:bg-[var(--chip-hover)]"
              aria-label={t("footer.toggleLang")}
              title={t("footer.toggleLang")}
              data-state={lang}
            >
              <span className="lang-opt">RU</span>
              <span className="lang-opt">EN</span>
              <span className="lang-dot" aria-hidden />
            </button>

            <ThemeToggle />

            {/* burger (mobile) */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 border border-[var(--chip-border)] bg-[var(--chip-bg)] transition-all duration-200"
              aria-label="Открыть меню"
              onClick={() => setOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* тонкая линия под хедером */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--ribbon-sheen-start), transparent)",
            opacity: 0.6,
            transition: "opacity 300ms ease",
          }}
          aria-hidden
        />
      </header>

      {/* Мобильное меню */}
      {open && (
        <div className="fixed inset-0 z-[60] flex md:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-black/30 transition-opacity duration-200"
            onClick={() => setOpen(false)}
          />
          <div
            className="ml-auto h-full w-[82%] max-w-[360px] bg-[var(--glass-bg)] border-l border-[var(--glass-border)] shadow-xl backdrop-blur-xl animate-slide-in"
            style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}
          >
            <div className="flex items-center justify-between p-4">
              <div className="inline-flex items-center gap-2">
                <span aria-hidden className="text-xl animate-kawaii-bob">💗</span>
                <span className="font-semibold">{shortNick}</span>
              </div>
              <button
                className="rounded-xl p-2 border border-[var(--chip-border)] bg-[var(--chip-bg)] transition-all duration-200"
                onClick={() => setOpen(false)}
                aria-label="Закрыть меню"
              >
                ✕
              </button>
            </div>
            <nav className="px-4 pb-6 space-y-1">
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={handleNavClick(item.id)}
                  className={[
                    "block kawaii-link px-3 py-3 rounded-xl text-[15px]",
                    active === item.id ? "is-active" : "",
                  ].join(" ")}
                >
                  {t(item.label)}
                </a>
              ))}
              <div className="px-3 pt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLang}
                  className="lang-toggle border border-[var(--chip-border)] bg-[var(--chip-bg)] hover:bg-[var(--chip-hover)]"
                  data-state={lang}
                  aria-label={t("footer.toggleLang")}
                  title={t("footer.toggleLang")}
                >
                  <span className="lang-opt">RU</span>
                  <span className="lang-opt">EN</span>
                  <span className="lang-dot" aria-hidden />
                </button>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
