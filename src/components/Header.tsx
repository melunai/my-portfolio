import { useEffect, useMemo, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { DATA } from "../data";

type NavItem = { id: string; label: string };

const NAV: NavItem[] = [
  { id: "home",         label: "Главная" },
  { id: "projects",     label: "Проекты" },
  { id: "skills",       label: "Навыки" },
  { id: "experience",   label: "Опыт" },
  { id: "testimonials", label: "Отзывы" },
  { id: "about",        label: "Обо мне" },
  { id: "contact",      label: "Контакты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [atTop, setAtTop] = useState(true);
  const [scrollPct, setScrollPct] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);

  // прогресс и липкий стиль
  useEffect(() => {
    const onScroll = () => {
      setAtTop(window.scrollY < 8);
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // активная секция (плавно, центр-биас)
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) {
          const id = vis[0].target.id;
          setActive((prev) => (prev === id ? prev : id));
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // «магнитный» ховер ссылок
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({ });
  const handleMagnet = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
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
      setOpen(false);
    }
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
            className="inline-flex items-center gap-2 rounded-2xl px-2 py-1 select-none"
            aria-label="Наверх"
            title={nick}
            onMouseMove={(e) => {
              const t = e.currentTarget as HTMLAnchorElement;
              const r = t.getBoundingClientRect();
              const x = (e.clientX - r.left) / r.width - 0.5;
              t.style.setProperty("--tilt", (x * 3).toFixed(2) + "deg");
            }}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.removeProperty("--tilt")}
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
                  ref={(el) => { linkRefs.current[item.id] = el; }}
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
                    transform: "translate(var(--x, 0px), var(--y, 0px)) translateZ(0)",
                    transition: "transform 200ms ease, color 220ms ease, background 220ms ease",
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
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Кнопки справа */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* burger (mobile) */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 border border-[var(--chip-border)] bg-[var(--chip-bg)] transition-all duration-200"
              aria-label="Открыть меню"
              onClick={() => setOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
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
                  style={{
                    transition: "transform 200ms ease, color 220ms ease, background 220ms ease",
                  }}
                >
                  {item.label}
                </a>
              ))}
              <div className="px-3 pt-3">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
