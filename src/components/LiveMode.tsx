import React, { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Ctx = { live: boolean; setLive: (v: boolean) => void };
const LiveModeContext = createContext<Ctx | null>(null);

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
    document.documentElement.dataset.live = live ? "on" : "off";
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
