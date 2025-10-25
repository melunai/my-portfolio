import { useEffect, useMemo, useState } from "react";
import { DATA } from "../data";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

/** те же секции, что и в Header */
const NAV: { id: string; label: string }[] = [
  { id: "home",         label: "Главная" },
  { id: "projects",     label: "Проекты" },
  { id: "skills",       label: "Навыки" },
  { id: "experience",   label: "Опыт" },
  { id: "testimonials", label: "Отзывы" },
  { id: "about",        label: "Обо мне" },
  { id: "contact",      label: "Контакты" },
];

export default function Footer() {
  // ===== локальный счётчик посещений (по устройству/браузеру) =====
  const [visits, setVisits] = useState<number | null>(null);
  useEffect(() => {
    try {
      const key = "visit-count";
      const n = parseInt(localStorage.getItem(key) || "0", 10) || 0;
      const next = n + 1;
      localStorage.setItem(key, String(next));
      setVisits(next);
    } catch {
      setVisits(null); // приватный режим/запрет LS — просто не показываем число
    }
  }, []);

  // красивое форматирование числа
  const visitsFmt = useMemo(
    () => (typeof visits === "number" ? visits.toLocaleString("ru-RU") : "—"),
    [visits]
  );

  // плавный скролл по якорям из футера
  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <footer
      className={`
        relative mt-16 border-t
        border-[var(--glass-border)]
        bg-[var(--glass-bg)] backdrop-blur-md
        /* делаем "bleed" на всю ширину, даже внутри max-w контейнера */
        ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]
      `}
    >
      {/* мягкое свечение-лента по низу */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-1"
        style={{
          background:
            "linear-gradient(90deg, var(--ribbon-sheen-start), var(--accent), var(--ribbon-sheen-end))",
          boxShadow: "0 0 18px var(--decor-glow)",
          opacity: .85,
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* навигация */}
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={go(n.id)}
              className="
                kawaii-link px-3 py-1.5 rounded-xl text-sm
                hover:underline underline-offset-4
              "
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* контакты/соцсети */}
        <div className="mt-5 flex items-center justify-center gap-4 text-[color:var(--text-muted)]">
          {DATA.github && (
            <a
              href={DATA.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
              aria-label="GitHub"
            >
              <Github className="size-4" />
              <span className="hidden sm:inline">GitHub</span>
              <ArrowUpRight className="size-3 hidden sm:inline" />
            </a>
          )}
          {DATA.linkedin && (
            <a
              href={DATA.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-4" />
              <span className="hidden sm:inline">LinkedIn</span>
              <ArrowUpRight className="size-3 hidden sm:inline" />
            </a>
          )}
          {DATA.email && (
            <a
              href={`mailto:${DATA.email}`}
              className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
              aria-label="Email"
            >
              <Mail className="size-4" />
              <span className="hidden sm:inline">{DATA.email}</span>
            </a>
          )}
        </div>

        {/* низ: копирайт + счётчик */}
        <div className="mt-6 flex flex-col items-center gap-1 text-sm opacity-80 text-[color:var(--text-muted)]">
          <div>
            © {new Date().getFullYear()} <strong>{DATA.nick}</strong>. Front-end разработка.
          </div>
          <div className="text-xs opacity-70">
            Просмотры на этом устройстве: <span className="tabular-nums">{visitsFmt}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
