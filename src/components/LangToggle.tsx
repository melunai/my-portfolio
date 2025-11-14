import { useI18n } from "../i18n/i18n";
import { useMemo } from "react";

export default function LangToggle() {
  const { t, lang, setLang } = useI18n();

  const nextLang = useMemo<"ru" | "en">(
    () => (lang === "ru" ? "en" : "ru"),
    [lang]
  );

  const onToggle = () => {
    // 1) переключаем язык в провайдере (+localStorage внутри провайдера)
    setLang(nextLang);

    // 2) поддерживаем старый паттерн query ?lang= и сохраняем #hash
    try {
      const hash = location.hash;
      const sp = new URLSearchParams(location.search);
      sp.set("lang", nextLang);

      // если открыта страница privacy / impressum — заменим путь на локализованный
      const path = location.pathname.replace(/\/+$/, "");
      let basePath = path;
      if (path === "/privacy" || path === "/privacy.en") {
        basePath = nextLang === "en" ? "/privacy.en" : "/privacy";
      } else if (path === "/impressum" || path === "/impressum.en") {
        basePath = nextLang === "en" ? "/impressum.en" : "/impressum";
      }

      const url = `${basePath}?${sp.toString()}${hash}`;
      history.replaceState(null, "", url);

      if (hash && hash.length > 1) {
        const id = hash.slice(1);
        const el = document.getElementById(id);
        if (el) queueMicrotask(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className="px-3 py-1.5 rounded-xl border border-[var(--chip-border)] bg-[var(--chip-bg)] hover:bg-[var(--chip-hover)] transition text-sm"
      aria-label={t("footer.toggleLang")}
      title={t("footer.toggleLang")}
    >
      {lang === "ru" ? "RU" : "EN"}
    </button>
  );
}
