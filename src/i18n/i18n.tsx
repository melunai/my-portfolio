import React, { createContext, useContext, useMemo, useState } from "react";
import { TEXTS, type Lang } from "./texts";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (path: string, ...a: any[]) => any };
const I18nCtx = createContext<Ctx | null>(null);

function get(obj: any, path: string) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

export function I18nProvider({ children }: React.PropsWithChildren) {
  const urlLang = (new URLSearchParams(location.search).get("lang") || "").toLowerCase();
  const lsLang = (localStorage.getItem("lang") || "").toLowerCase();
  const initial: Lang = (urlLang === "en" || urlLang === "ru")
    ? (urlLang as Lang)
    : (lsLang === "en" ? "en" : "ru");

  const [lang, setLangState] = useState<Lang>(initial);
  const setLang = (l: Lang) => { setLangState(l); try { localStorage.setItem("lang", l); } catch {} };

  const t = useMemo(
    () => (path: string, ...args: any[]) => {
      const v = get(TEXTS[lang], path);
      return typeof v === "function" ? v(...args) : (v ?? path);
    },
    [lang]
  );

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
