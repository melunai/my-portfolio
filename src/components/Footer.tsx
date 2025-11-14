import { useEffect, useMemo, useState } from "react";
import { DATA } from "../data";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useIOInView } from "./useIOInView";
import { useI18n } from "../i18n/i18n";

export default function Footer() {
  const { t } = useI18n();

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
    () => (typeof visits === "number" ? visits.toLocaleString() : "—"),
    [visits]
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

  // плавный скролл к секции
  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  // IO-анимации
  const { ref: footerRef, inView: footerIn } = useIOInView<HTMLDivElement>({
    once: true,
    rootMargin: "-10% 0% -10% 0%",
  });

  const footerVar = {
    hide: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

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

  const nav = [
    { id: "home", label: t("common.nav.home") },
    { id: "projects", label: t("common.nav.projects") },
    { id: "skills", label: t("common.nav.skills") },
    { id: "experience", label: t("common.nav.experience") },
    { id: "workflow", label: t("common.nav.workflow") },
    { id: "testimonials", label: t("common.nav.testimonials") },
    { id: "about", label: t("common.nav.about") },
    { id: "contact", label: t("common.nav.contact") },
  ];

  return (
    <footer
      className="
        relative mt-16 border-t
        border-[var(--glass-border)]
        bg-[var(--glass-bg)] backdrop-blur-md
        ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]
      "
    >
      {/* верхняя линия */}
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
        {/* навигация */}
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={go(n.id)}
              className="kawaii-link px-3 py-1.5 rounded-xl text-sm hover:underline underline-offset-4"
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* контакты */}
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
            </a>
          )}
          {DATA.email && (
            <a
              href={`mailto:${DATA.email}`}
              className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
              aria-label="Email"
            >
              <Mail className="size-4" />
            </a>
          )}
        </div>

        {/* легальные ссылки + счётчик */}
        <div className="mt-6 flex flex-col items-center gap-2 text-sm opacity-90 text-[color:var(--text-muted)]">
          <div className="flex items-center gap-3">
            <a href="/privacy" className="hover:underline">
              {t("footer.privacy")}
            </a>
            <span aria-hidden>•</span>
            <a href="/impressum" className="hover:underline">
              {t("footer.impressum")}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs opacity-75">
              {t("footer.views")}: <span className="tabular-nums">{visitsFmt}</span>
            </span>
          </div>

          <div className="opacity-80">
            © {new Date().getFullYear()} <strong>{DATA.nick}</strong>.{" "}
            {t("footer.role")}
          </div>
        </div>

        {/* Кнопка наверх */}
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
          aria-label={t("footer.backToTop")}
          title={t("footer.backToTop")}
        >
          <ArrowUp className="size-4" />
        </motion.button>
      </motion.div>
    </footer>
  );
}
