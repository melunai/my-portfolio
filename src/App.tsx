import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Metrics from "./components/Metrics";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackgroundDecor from "./components/BackgroundDecor";
import ScrollProgress from "./components/ScrollProgress";
import FloatingBubbles from "./components/FloatingBubbles";
import { GridTexture } from "./components/GridTexture";
import KawaiiFrame from "./components/KawaiiFrame";
import ConfettiRain from "./components/ConfettiRain";
import WorkflowStages from "./components/WorkflowStages";
import HeroFront from "./components/HeroFront";
import { DATA } from "./data";
import { LiveModeProvider, LiveModeToggle, useLiveMode } from "./components/LiveMode";

/* ------------------------- APP INNER ------------------------- */
function AppInner() {
  const { live } = useLiveMode();
  const [stage, setStage] = useState<"intro" | "flash" | "hero" | "main">("intro");

  useEffect(() => {
    document.title = `${DATA.nick} — Портфолио`;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

const handleHeroFrontDone = () => {
  // Вспышка света перед Hero
  setStage("flash");

  // 🔒 Полная блокировка скролла (сохранение позиции)
  const scrollY = window.scrollY;
  const body = document.body;
  const html = document.documentElement;

  body.dataset.scrollY = String(scrollY); // сохраняем позицию явно
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";
  body.style.touchAction = "none";
  html.style.overflow = "hidden";

  // --- Анимация стадий ---
  setTimeout(() => {
    setStage("hero");

    setTimeout(() => {
      setStage("main");

      // 🔓 Снимаем блокировку и возвращаем скролл
      const savedY = parseInt(body.dataset.scrollY || "0", 10);
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      body.style.touchAction = "";
      html.style.overflow = "";
      delete body.dataset.scrollY;

      // возвращаем на исходную позицию
      window.scrollTo({ top: savedY, behavior: "instant" as ScrollBehavior });
    }, 2500); // ⏱ длительность блокировки
  }, 600);
};


  return (
    <div
      className={[
        "min-h-dvh relative text-slate-800 dark:text-slate-100 live-container theme-colors overflow-x-clip",
        "bg-gradient-to-b from-rose-800/30 to-rose-100/90 dark:from-slate-950 dark:to-slate-950",
        live ? "is-live" : "",
      ].join(" ")}
      style={{
        background: "linear-gradient(to bottom, var(--bg-grad-from), var(--bg-grad-to))",
        color: "var(--text)",
      }}
    >
      {/* === HeroFront поверх всего === */}
      {stage === "intro" && <HeroFront onFinish={handleHeroFrontDone} />}

      {/* === Вспышка света === */}
      {stage === "flash" && (
        <div className="fixed inset-0 z-[9999] animate-flash pointer-events-none" />
      )}

      {/* === Фоновая анимация и декор === */}
      <BackgroundDecor />
      <ScrollProgress />
      <ConfettiRain density={live ? 48 : 28} />
      <KawaiiFrame />
      <GridTexture />

      {/* === Шапка === */}
      <Header />

      {/* === Основной контент === */}
      <main
        id="main"
        className="relative z-10 mx-auto w-full px-6 max-w-[1600px] sm:px-8 md:px-10 "
      >
        {stage !== "intro" && (
          <div className="animate-fade-in">
            <Hero />
          </div>
        )}

        {stage === "main" && (
          <>
            <Metrics />
            <Projects />
            <Skills />
            <WorkflowStages />
            <Experience />
            <Testimonials />
            <About />
            <Contact />
            <FloatingBubbles live={live} />
            <Footer />
            
          </>
        )}
      </main>

      <LiveModeToggle />

      <style>{`
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes flash {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
      .animate-flash {
        animation: flash 0.8s ease forwards;
        background: radial-gradient(circle at center, #ffefcf 0%, #fff 80%);
      }
      `}</style>
    </div>
  );
}

/* ------------------------- APP ROOT ------------------------- */
export default function App() {
  return (
    <LiveModeProvider>
      <AppInner />
    </LiveModeProvider>
  );
}
