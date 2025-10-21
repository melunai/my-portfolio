import React, { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Ctx = { live: boolean; setLive: (v: boolean) => void };
const LiveModeContext = createContext<Ctx | null>(null);

const PINK_PALETTE: Record<string, string> = {
  "--accent": "#ec4899",               // pink-500
  "--glow": "#f472b6",                 // rose-400
  "--decor-glow": "rgba(236,72,153,.32)",
  "--bubble": "rgba(236,72,153,.18)",
  "--confetti1": "#f472b6",
  "--confetti2": "#db2777",
  "--grid": "rgba(244,114,182,.15)",
};

function applyPalette(on: boolean) {
  const el = document.documentElement;
  if (on) {
    for (const [k, v] of Object.entries(PINK_PALETTE)) {
      el.style.setProperty(k, v);
    }
    el.setAttribute("data-live", "on");
  } else {
    // снимаем live и чистим только те ключи, которые мы устанавливали,
    // чтобы вернуться к значениям из CSS
    el.removeAttribute("data-live");
    for (const k of Object.keys(PINK_PALETTE)) {
      el.style.removeProperty(k);
    }
  }
}

export function LiveModeProvider({ children }: React.PropsWithChildren) {
  const [live, setLive] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("live-mode");
      if (saved != null) setLive(saved === "1");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("live-mode", live ? "1" : "0");
    } catch {}
    applyPalette(live);
  }, [live]);

  return (
    <LiveModeContext.Provider value={{ live, setLive }}>
      {children}
    </LiveModeContext.Provider>
  );
}

export function useLiveMode() {
  const ctx = useContext(LiveModeContext);
  if (!ctx) throw new Error("useLiveMode must be used within LiveModeProvider");
  return ctx;
}

export function LiveModeToggle() {
  const { live, setLive } = useLiveMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const btn = (
    <button
      type="button"
      onClick={() => setLive(!live)}
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-[9999]
                 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm
                 backdrop-blur-md bg-[var(--chip-bg)] border-[var(--chip-border)]
                 hover:bg-[var(--chip-hover)] shadow-glow-pink transition-all duration-300"
      aria-pressed={live}
      aria-label="Toggle Live Mode"
      title="Live Mode"
    >
      <span aria-hidden>{live ? "💫" : "🌙"}</span>
      <span className="hidden sm:inline">{live ? "Live mode ON" : "Live mode OFF"}</span>
    </button>
  );

  return createPortal(btn, document.body);
}
