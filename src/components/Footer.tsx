import { useEffect, useMemo, useState } from "react";
import { DATA } from "../data";
import { Github, Linkedin, Mail, ArrowUpRight, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useIOInView } from "./useIOInView";

type Lang = "ru" | "en";

const NAV: { id: string; label_ru: string; label_en: string }[] = [
  { id: "home", label_ru: "Главная", label_en: "Home" },
  { id: "projects", label_ru: "Проекты", label_en: "Projects" },
  { id: "skills", label_ru: "Навыки", label_en: "Skills" },
  { id: "experience", label_ru: "Опыт", label_en: "Experience" },
  { id: "testimonials", label_ru: "Отзывы", label_en: "Testimonials" },
  { id: "about", label_ru: "Обо мне", label_en: "About" },
  { id: "contact", label_ru: "Контакты", label_en: "Contact" },
];

export default function Footer() {
  // язык
  const [lang, setLang] = useState<Lang>(() => {
    const sp = new URLSearchParams(location.search);
    const q = (sp.get("lang") || "").toLowerCase();
    const ls = (localStorage.getItem("lang") || "").toLowerCase();
    return q === "en" || q === "ru" ? (q as Lang) : (ls === "en" ? "en" : "ru");
  });

  // локальный счётчик посещений
  const [visits, setVisits] = useState<number | null>(null);
  useEffect(() => {
    try {
      const key = "visit-count";
      const n = parseInt(localStorage.getItem(key) || "0", 10) || 0;
      const next = n + 1;
      localStorage.setItem(key, String(next));
      setVisits(next);
    } catch {
      setVisits(null);
    }
  }, []);
  const visitsFmt = useMemo(
    () =>
      typeof visits === "number"
        ? visits.toLocaleString(lang === "ru" ? "ru-RU" : "en-US")
        : "—",
    [visits, lang]
  );

  // “Наверх” после 30% прокрутки
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? (doc.scrollTop / total) * 100 : 0;
      setShowTop(pct >= 30);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);

  // плавный скролл к секции
  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  // переключение языка + правильные страницы privacy/impressum
  const toggleLang = () => {
    const next: Lang = lang === "ru" ? "en" : "ru";
    setLang(next);
    try {
      localStorage.setItem("lang", next);
    } catch {}
    const hash = location.hash;
    const sp = new URLSearchParams(location.search);
    sp.set("lang", next);

    const path = location.pathname.replace(/\/+$/, "");
    let basePath = path;
    if (path === "/privacy" || path === "/privacy.en") {
      basePath = next === "en" ? "/privacy.en" : "/privacy";
    } else if (path === "/impressum" || path === "/impressum.en") {
      basePath = next === "en" ? "/impressum.en" : "/impressum";
    }

    const url = `${basePath}?${sp.toString()}${hash}`;
    history.replaceState(null, "", url);

    if (hash && hash.length > 1) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el)
        queueMicrotask(() =>
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        );
    }
  };

  // IO-въезд для всей секции футера (мягкий подъём)
  const { ref: footerRef, inView: footerIn } = useIOInView<HTMLDivElement>({
    once: true,
    rootMargin: "-10% 0% -10% 0%",
  });
  const footerVar = {
    hide: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // IO-въезд конкретно для кнопки «Наверх»
  const { ref: topBtnRef, inView: topBtnIn } = useIOInView<HTMLButtonElement>({
    once: true,
    rootMargin: "-20% 0% -20% 0%",
  });
  const topVar = {
    hide: { opacity: 0, y: 6, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] as any },
    },
  };

  return (
    <footer
      className={`
        relative mt-16 border-t
        border-[var(--glass-border)]
        bg-[var(--glass-bg)] backdrop-blur-md
        ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]
      `}
    >
      {/* верхняя сияющая линия */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-1"
        style={{
          background:
            "linear-gradient(90deg, var(--ribbon-sheen-start), var(--accent), var(--ribbon-sheen-end))",
          boxShadow: "0 0 18px var(--decor-glow)",
          opacity: 0.85,
        }}
      />

      <motion.div
        ref={footerRef}
        initial="hide"
        animate={footerIn ? "show" : "hide"}
        variants={footerVar}
        className="mx-auto max-w-6xl px-4 py-10 relative"
      >
        {/* навигация по секциям */}
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={go(n.id)}
              className="kawaii-link px-3 py-1.5 rounded-xl text-sm hover:underline underline-offset-4"
            >
              {lang === "ru" ? n.label_ru : n.label_en}
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

        {/* легальные ссылки + переключатель языка + счётчик */}
        <div className="mt-6 flex flex-col items-center gap-2 text-sm opacity-90 text-[color:var(--text-muted)]">
          <div className="flex items-center gap-3">
            <a
              href={lang === "en" ? "public/privacy.en" : "public/privacy"}
              className="hover:underline"
            >
              {lang === "ru" ? "Политика" : "Privacy"}
            </a>
            <span aria-hidden>•</span>
            <a
              href={lang === "en" ? "public/impressum.en" : "public/impressum"}
              className="hover:underline"
            >
              {lang === "ru" ? "Импрессум" : "Impressum"}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="px-3 py-1 rounded-xl border border-[var(--chip-border)] bg-[var(--chip-bg)] hover:bg-[var(--chip-hover)] transition"
              aria-label={t("Переключить язык", "Toggle language")}
              title={t("Переключить язык", "Toggle language")}
            >
              {lang === "ru" ? "RU" : "EN"}
            </button>

            <span className="text-xs opacity-75">
              {t("Просмотры на этом устройстве", "Views on this device")}:{" "}
              <span className="tabular-nums">{visitsFmt}</span>
            </span>
          </div>

          <div className="opacity-80">
            © {new Date().getFullYear()} <strong>{DATA.nick}</strong>.{" "}
            {t("Front-end разработка.", "Front-end development.")}
          </div>
        </div>

        {/* “Наверх” — с IO-въездом */}
        <motion.button
          ref={topBtnRef}
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial="hide"
          animate={topBtnIn && showTop ? "show" : "hide"}
          variants={topVar}
          className={`
            ${showTop ? "" : "pointer-events-none"}
            transition-all duration-200
            absolute right-4 bottom-4
            inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm
            backdrop-blur-md bg-[var(--chip-bg)] border border-[var(--chip-border)]
            hover:bg-[var(--chip-hover)] shadow-glow-pink
          `}
          aria-label={t("Наверх", "Back to top")}
          title={t("Наверх", "Back to top")}
        >
          <ArrowUp className="size-4" />
          {t("Наверх", "Top")}
        </motion.button>
      </motion.div>
    </footer>
  );
}
